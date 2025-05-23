
from django.db import models
from django.utils import timezone

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Student(models.Model):
    name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='student_photos/')
    face_encoding = models.BinaryField(null=True)
    registration_date = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.student_id} - {self.name}"

class Attendance(models.Model):
    PRESENT = 'present'
    ABSENT = 'absent'
    LATE = 'late'
    
    STATUS_CHOICES = [
        (PRESENT, 'Present'),
        (ABSENT, 'Absent'),
        (LATE, 'Late'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PRESENT)
    confidence = models.FloatField(default=0.0)
    
    class Meta:
        unique_together = ['student', 'course', 'date']
        
    def __str__(self):
        return f"{self.student.name} - {self.course.name} - {self.date}"
