
import os
import cv2
import numpy as np
import face_recognition
from datetime import datetime, date
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from django.db.models import Count
from .models import Student, Course, Attendance
from .forms import StudentForm, AttendanceFilterForm

def dashboard(request):
    # Get counts for dashboard stats
    total_students = Student.objects.count()
    present_today = Attendance.objects.filter(date=date.today(), status='present').count()
    total_courses = Course.objects.count()
    
    # Calculate attendance rate
    if total_students > 0:
        attendance_rate = round((present_today / total_students) * 100)
    else:
        attendance_rate = 0
    
    # Get recent registrations
    recent_registrations = Student.objects.order_by('-registration_date')[:5]
    
    context = {
        'total_students': total_students,
        'present_today': present_today,
        'total_courses': total_courses,
        'attendance_rate': attendance_rate,
        'recent_registrations': recent_registrations,
    }
    
    return render(request, 'face_recognition_app/dashboard.html', context)

def register_student(request):
    if request.method == 'POST':
        form = StudentForm(request.POST, request.FILES)
        if form.is_valid():
            student = form.save(commit=False)
            
            # Process the uploaded image to extract face encoding
            try:
                # Get the photo path
                photo_path = os.path.join(settings.MEDIA_ROOT, student.photo.name)
                
                # Load the image
                image = face_recognition.load_image_file(student.photo)
                
                # Find faces in the image
                face_locations = face_recognition.face_locations(image)
                
                if face_locations:
                    # Get the encoding of the first face found
                    face_encoding = face_recognition.face_encodings(image, [face_locations[0]])[0]
                    # Store the encoding as binary data
                    student.face_encoding = face_encoding.tobytes()
                    student.save()
                    messages.success(request, f"Student {student.name} registered successfully with face data.")
                    return redirect('student_list')
                else:
                    messages.error(request, "No face detected in the uploaded image. Please upload a clear face photo.")
            except Exception as e:
                messages.error(request, f"Error processing face: {str(e)}")
        else:
            messages.error(request, "Form is invalid. Please check the data and try again.")
    else:
        form = StudentForm()
    
    return render(request, 'face_recognition_app/register_student.html', {'form': form})

def capture_attendance(request):
    courses = Course.objects.all()
    selected_course = None
    
    if request.method == 'POST':
        course_id = request.POST.get('course')
        selected_course = get_object_or_404(Course, id=course_id)
    
    context = {
        'courses': courses,
        'selected_course': selected_course,
    }
    
    return render(request, 'face_recognition_app/capture_attendance.html', context)

def process_attendance(request):
    """API endpoint to process attendance from webcam image"""
    if request.method == 'POST' and request.FILES.get('image'):
        course_id = request.POST.get('course_id')
        course = get_object_or_404(Course, id=course_id)
        
        # Save the uploaded image temporarily
        uploaded_image = request.FILES['image']
        temp_image_path = os.path.join(settings.MEDIA_ROOT, 'temp_attendance.jpg')
        
        with open(temp_image_path, 'wb+') as destination:
            for chunk in uploaded_image.chunks():
                destination.write(chunk)
        
        # Process the image for face recognition
        try:
            # Load the image
            image = face_recognition.load_image_file(temp_image_path)
            
            # Find faces in the image
            face_locations = face_recognition.face_locations(image)
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            # Get all students for the selected course
            students = Student.objects.filter(course=course)
            known_face_encodings = []
            known_face_names = []
            known_face_ids = []
            
            for student in students:
                if student.face_encoding:
                    face_encoding = np.frombuffer(student.face_encoding, dtype=np.float64)
                    known_face_encodings.append(face_encoding)
                    known_face_names.append(student.name)
                    known_face_ids.append(student.id)
            
            # Match detected faces with stored faces
            detected_students = []
            
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                
                if True in matches:
                    best_match_index = np.argmin(face_distances)
                    confidence = 1 - face_distances[best_match_index]
                    
                    if confidence > 0.6:  # 60% confidence threshold
                        student_id = known_face_ids[best_match_index]
                        student = students.get(id=student_id)
                        
                        # Mark attendance
                        attendance, created = Attendance.objects.update_or_create(
                            student=student,
                            course=course,
                            date=date.today(),
                            defaults={
                                'status': 'present',
                                'time': datetime.now().time(),
                                'confidence': round(confidence * 100, 2)
                            }
                        )
                        
                        detected_students.append({
                            'name': student.name,
                            'student_id': student.student_id,
                            'confidence': round(confidence * 100, 2)
                        })
            
            # Clean up the temporary file
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
                
            return JsonResponse({
                'success': True,
                'detected_students': detected_students,
                'total_detected': len(detected_students)
            })
            
        except Exception as e:
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method or no image provided'})

def attendance_records(request):
    form = AttendanceFilterForm(request.GET or None)
    queryset = Attendance.objects.all().order_by('-date', '-time')
    
    if form.is_valid():
        course = form.cleaned_data.get('course')
        start_date = form.cleaned_data.get('start_date')
        end_date = form.cleaned_data.get('end_date')
        student_id = form.cleaned_data.get('student_id')
        student_name = form.cleaned_data.get('student_name')
        
        if course:
            queryset = queryset.filter(course=course)
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
            
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
            
        if student_id:
            queryset = queryset.filter(student__student_id__icontains=student_id)
            
        if student_name:
            queryset = queryset.filter(student__name__icontains=student_name)
    
    # Get summary stats
    total_records = queryset.count()
    present_count = queryset.filter(status='present').count()
    absent_count = queryset.filter(status='absent').count()
    late_count = queryset.filter(status='late').count()
    
    context = {
        'form': form,
        'attendance_records': queryset,
        'total_records': total_records,
        'present_count': present_count,
        'absent_count': absent_count,
        'late_count': late_count,
    }
    
    return render(request, 'face_recognition_app/attendance_records.html', context)

def student_list(request):
    students = Student.objects.all()
    return render(request, 'face_recognition_app/student_list.html', {'students': students})

def student_detail(request, pk):
    student = get_object_or_404(Student, pk=pk)
    attendance_records = Attendance.objects.filter(student=student).order_by('-date')
    
    context = {
        'student': student,
        'attendance_records': attendance_records,
    }
    
    return render(request, 'face_recognition_app/student_detail.html', context)

def edit_student(request, pk):
    student = get_object_or_404(Student, pk=pk)
    
    if request.method == 'POST':
        form = StudentForm(request.POST, request.FILES, instance=student)
        if form.is_valid():
            student = form.save(commit=False)
            
            # If a new photo was uploaded, process it for face encoding
            if 'photo' in request.FILES:
                try:
                    # Load the image
                    image = face_recognition.load_image_file(request.FILES['photo'])
                    
                    # Find faces in the image
                    face_locations = face_recognition.face_locations(image)
                    
                    if face_locations:
                        # Get the encoding of the first face found
                        face_encoding = face_recognition.face_encodings(image, [face_locations[0]])[0]
                        # Store the encoding as binary data
                        student.face_encoding = face_encoding.tobytes()
                    else:
                        messages.error(request, "No face detected in the uploaded image. Previous face data has been retained.")
                        # Keep the previous face encoding
                except Exception as e:
                    messages.error(request, f"Error processing face: {str(e)}")
                    # Keep the previous face encoding
            
            student.save()
            messages.success(request, f"Student {student.name} updated successfully.")
            return redirect('student_detail', pk=student.pk)
    else:
        form = StudentForm(instance=student)
    
    context = {
        'form': form,
        'student': student,
    }
    
    return render(request, 'face_recognition_app/edit_student.html', context)

def delete_student(request, pk):
    student = get_object_or_404(Student, pk=pk)
    
    if request.method == 'POST':
        student_name = student.name
        student.delete()
        messages.success(request, f"Student {student_name} deleted successfully.")
        return redirect('student_list')
    
    return render(request, 'face_recognition_app/delete_student.html', {'student': student})
