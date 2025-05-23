
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Square, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DetectedStudent {
  id: string;
  name: string;
  confidence: number;
  timestamp: Date;
}

const AttendanceCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState<DetectedStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        toast.success('Camera started successfully!');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      toast.info('Camera stopped');
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Simulate face recognition processing
    setIsProcessing(true);
    
    setTimeout(() => {
      // Mock face recognition results
      const mockStudents: DetectedStudent[] = [
        { id: '1', name: 'John Doe', confidence: 0.95, timestamp: new Date() },
        { id: '2', name: 'Jane Smith', confidence: 0.87, timestamp: new Date() },
        { id: '3', name: 'Mike Johnson', confidence: 0.92, timestamp: new Date() }
      ];

      setDetectedStudents(prev => {
        const newStudents = mockStudents.filter(
          student => !prev.some(existing => existing.id === student.id)
        );
        return [...prev, ...newStudents];
      });

      setIsProcessing(false);
      
      if (mockStudents.length > 0) {
        toast.success(`Detected ${mockStudents.length} student(s)!`);
      }
    }, 2000);
  };

  const markAttendance = () => {
    if (detectedStudents.length === 0) {
      toast.error('No students detected. Please capture faces first.');
      return;
    }

    // Simulate marking attendance
    toast.success(`Attendance marked for ${detectedStudents.length} student(s)!`);
    setDetectedStudents([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Live Camera Feed
            </CardTitle>
            <CardDescription>
              Position students in front of the camera for face recognition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Camera not active</p>
                  </div>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Processing faces...</p>
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2">
              {!isStreaming ? (
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={captureFrame} disabled={isProcessing} className="flex-1">
                    <Square className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Capture Faces'}
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detection Results */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detected Students
            </CardTitle>
            <CardDescription>
              Students identified in the current session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No students detected yet</p>
                <p className="text-sm">Capture faces to see detected students</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {detectedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {student.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.round(student.confidence * 100)}% match
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {detectedStudents.length > 0 && (
              <Button onClick={markAttendance} className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Attendance ({detectedStudents.length} students)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceCapture;
