
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Edit, Trash2, Eye, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  class: string;
  photoUrl?: string;
  registrationDate: string;
  totalClasses: number;
  attendedClasses: number;
}

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock student data
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      studentId: 'ST001',
      email: 'john.doe@school.edu',
      class: 'Grade 10A',
      registrationDate: '2024-01-10',
      totalClasses: 20,
      attendedClasses: 18
    },
    {
      id: '2',
      name: 'Jane Smith',
      studentId: 'ST002',
      email: 'jane.smith@school.edu',
      class: 'Grade 10A',
      registrationDate: '2024-01-10',
      totalClasses: 20,
      attendedClasses: 19
    },
    {
      id: '3',
      name: 'Mike Johnson',
      studentId: 'ST003',
      email: 'mike.johnson@school.edu',
      class: 'Grade 10B',
      registrationDate: '2024-01-12',
      totalClasses: 18,
      attendedClasses: 15
    },
    {
      id: '4',
      name: 'Emily Davis',
      studentId: 'ST004',
      email: 'emily.davis@school.edu',
      class: 'Grade 10A',
      registrationDate: '2024-01-15',
      totalClasses: 15,
      attendedClasses: 12
    },
    {
      id: '5',
      name: 'Chris Wilson',
      studentId: 'ST005',
      email: 'chris.wilson@school.edu',
      class: 'Grade 10B',
      registrationDate: '2024-01-08',
      totalClasses: 22,
      attendedClasses: 21
    }
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceRate = (attended: number, total: number) => {
    return Math.round((attended / total) * 100);
  };

  const getAttendanceBadge = (rate: number) => {
    if (rate >= 90) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    } else if (rate >= 75) {
      return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    } else if (rate >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
    toast.success('Student deleted successfully');
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Management
          </CardTitle>
          <CardDescription>
            Manage registered students and view their attendance statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>
            Showing {filteredStudents.length} of {students.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => {
                    const attendanceRate = getAttendanceRate(student.attendedClasses, student.totalClasses);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.photoUrl} alt={student.name} />
                              <AvatarFallback>
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {student.attendedClasses}/{student.totalClasses}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{attendanceRate}%</span>
                            {getAttendanceBadge(attendanceRate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewStudent(student)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Student Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information about {student.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={student.photoUrl} alt={student.name} />
                                      <AvatarFallback className="text-lg">
                                        {student.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{student.name}</h3>
                                      <p className="text-gray-600">{student.studentId}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm">{student.email}</p>
                                    </div>
                                    <div>
                                      <Label>Class</Label>
                                      <p className="text-sm">{student.class}</p>
                                    </div>
                                    <div>
                                      <Label>Registration Date</Label>
                                      <p className="text-sm">{new Date(student.registrationDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <Label>Attendance Rate</Label>
                                      <p className="text-sm">{attendanceRate}%</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
