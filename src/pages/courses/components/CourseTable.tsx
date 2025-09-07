import React from 'react';
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICourseResponse } from '@/Interfaces/ICourseRespone';

interface CourseTableProps {
  courses: ICourseResponse[];
  isLoading: boolean;
  onView: (course: ICourseResponse) => void;
  onEdit: (course: ICourseResponse) => void;
  onDelete: (course: ICourseResponse) => void;
  onFullEdit: (course: ICourseResponse) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onFullEdit
}) => {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#AC19AD]"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Course Name</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.length > 0 ? (
          courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.id}</TableCell>
              <TableCell className="font-medium">
                <button 
                  className="text-blue-600 hover:text-blue-900 hover:underline text-left cursor-pointer"
                  onClick={() => onFullEdit(course)}
                >
                  {course.course_name}
                </button>
              </TableCell>
              <TableCell>{course.language}</TableCell>
              <TableCell>{course.level}</TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  course.publishedAt ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.publishedAt ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(course)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 cursor-pointer"
                    title="View Course"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onEdit(course)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:text-amber-900 hover:bg-amber-50 cursor-pointer"
                    title="Edit Course"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(course)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-900 hover:bg-red-50 cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-6">
              No courses found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CourseTable;
