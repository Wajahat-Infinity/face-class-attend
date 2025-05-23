
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, UserPlus, Save } from 'lucide-react';
import { toast } from 'sonner';

const StudentRegistration = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    studentId: '',
    email: '',
    class: '',
    photo: null as string | null
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startPhotoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg');
    setStudentData(prev => ({ ...prev, photo: dataURL }));

    // Stop camera
    const tracks = (video.srcObject as MediaStream).getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    setIsCapturing(false);

    toast.success('Photo captured successfully!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudentData(prev => ({ ...prev, photo: e.target?.result as string }));
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData.name || !studentData.studentId || !studentData.photo) {
      toast.error('Please fill in all required fields and add a photo');
      return;
    }

    // Simulate student registration
    console.log('Registering student:', studentData);
    toast.success(`Student ${studentData.name} registered successfully!`);
    
    // Reset form
    setStudentData({
      name: '',
      studentId: '',
      email: '',
      class: '',
      photo: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo Capture Section */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Student Photo
            </CardTitle>
            <CardDescription>
              Capture or upload a clear photo of the student's face
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCapturing ? (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Photo
                  </Button>
                  <Button 
                    onClick={() => {
                      if (videoRef.current?.srcObject) {
                        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                        tracks.forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                      }
                      setIsCapturing(false);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {studentData.photo ? (
                  <div className="text-center space-y-4">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage src={studentData.photo} alt="Student photo" />
                      <AvatarFallback>Photo</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-600">Photo captured successfully</p>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">No photo captured yet</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={startPhotoCapture} className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Student Information
            </CardTitle>
            <CardDescription>
              Enter the student's details for registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={studentData.name}
                  onChange={(e) => setStudentData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  value={studentData.studentId}
                  onChange={(e) => setStudentData(prev => ({ ...prev, studentId: e.target.value }))}
                  placeholder="Enter student ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={studentData.email}
                  onChange={(e) => setStudentData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class/Grade</Label>
                <Input
                  id="class"
                  value={studentData.class}
                  onChange={(e) => setStudentData(prev => ({ ...prev, class: e.target.value }))}
                  placeholder="Enter class or grade"
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                <Save className="h-4 w-4 mr-2" />
                Register Student
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistration;
