
from django.contrib import admin
from .models import Student, Course, Attendance

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name', 'email', 'course', 'registration_date')
    search_fields = ('student_id', 'name', 'email')
    list_filter = ('course', 'registration_date')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'date', 'status')
    list_filter = ('course', 'date', 'status')
    search_fields = ('student__name', 'student__student_id', 'course__name')
    date_hierarchy = 'date'
