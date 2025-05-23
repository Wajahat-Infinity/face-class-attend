
from django import forms
from .models import Student, Attendance, Course

class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['name', 'student_id', 'email', 'course', 'photo']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['photo'].help_text = 'Upload a clear frontal face photo for face recognition'

class AttendanceFilterForm(forms.Form):
    course = forms.ModelChoiceField(queryset=Course.objects.all(), required=False)
    start_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    end_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    student_id = forms.CharField(max_length=50, required=False)
    student_name = forms.CharField(max_length=100, required=False)
