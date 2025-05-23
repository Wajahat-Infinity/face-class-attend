
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Camera, ClipboardList, UserPlus } from 'lucide-react';
import AttendanceCapture from '@/components/AttendanceCapture';
import StudentRegistration from '@/components/StudentRegistration';
import AttendanceRecords from '@/components/AttendanceRecords';
import StudentManagement from '@/components/StudentManagement';

const Index = () => {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Smart Attendance System
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Face Recognition for Classroom Attendance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Camera className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <ClipboardList className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 p-1 rounded-lg">
                <TabsTrigger 
                  value="attendance" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Camera className="h-4 w-4" />
                  Take Attendance
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Register Student
                </TabsTrigger>
                <TabsTrigger 
                  value="records" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <ClipboardList className="h-4 w-4" />
                  Records
                </TabsTrigger>
                <TabsTrigger 
                  value="students" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users className="h-4 w-4" />
                  Manage Students
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="attendance" className="mt-0">
                  <AttendanceCapture />
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <StudentRegistration />
                </TabsContent>

                <TabsContent value="records" className="mt-0">
                  <AttendanceRecords />
                </TabsContent>

                <TabsContent value="students" className="mt-0">
                  <StudentManagement />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
