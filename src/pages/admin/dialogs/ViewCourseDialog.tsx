import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  documentId: string;
  short_desc: string;
  course_outline: string;
  rating_count: number;
  language: string;
  certificate: boolean;
  quizes: number | boolean;
  level: string;
  short_desc_2: string;
  sort_order: number;
  short_desc_3: string;
  course_name: string;
  weekly_curriculum_intro: string;
  duration: string;
  video_url: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
  updatedBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
  localizations: any[];
}

interface ViewCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const ViewCourseDialog: React.FC<ViewCourseDialogProps> = ({
  isOpen,
  onClose,
  course
}) => {
  if (!course) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">{course.course_name}</h3>
              <p className="text-sm text-gray-500">ID: {course.id} | Document ID: {course.documentId}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                course.publishedAt ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {course.publishedAt ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Basic Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Language</p>
                <p>{course.language}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Level</p>
                <p>{course.level}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p>{course.duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Certificate</p>
                <p>{course.certificate ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quizzes</p>
                <p>{course.quizes ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sort Order</p>
                <p>{course.sort_order}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Descriptions</h4>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Short Description</p>
              <p className="whitespace-pre-wrap">{course.short_desc}</p>
            </div>
            {course.short_desc_2 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Short Description 2</p>
                <p className="whitespace-pre-wrap">{course.short_desc_2}</p>
              </div>
            )}
            {course.short_desc_3 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Short Description 3</p>
                <p className="whitespace-pre-wrap">{course.short_desc_3}</p>
              </div>
            )}
            {course.course_outline && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Course Outline</p>
                <p className="whitespace-pre-wrap">{course.course_outline}</p>
              </div>
            )}
            {course.weekly_curriculum_intro && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Weekly Curriculum Intro</p>
                <p className="whitespace-pre-wrap">{course.weekly_curriculum_intro}</p>
              </div>
            )}
          </div>
          
          {course.video_url && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Media</h4>
              <div>
                <p className="text-sm font-medium text-gray-500">Video URL</p>
                <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {course.video_url}
                </a>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">System Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p>{new Date(course.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Updated At</p>
                <p>{new Date(course.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p>{course.createdBy?.firstname || ''} {course.createdBy?.lastname || ''}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Updated By</p>
                <p>{course.updatedBy?.firstname || ''} {course.updatedBy?.lastname || ''}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseDialog;
