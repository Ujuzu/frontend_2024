import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { ICourseResponse } from '@/Interfaces/ICourseRespone';

interface ViewCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourseResponse | null;
}

const ViewCourseDialog: React.FC<ViewCourseDialogProps> = ({
  isOpen,
  onClose,
  course
}) => {
  if (!course) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{course.attributes.course_name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID</h3>
              <p>{course.id}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Document ID</h3>
              <p>{course.id}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Language</h3>
              <p>{course.attributes.language}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Level</h3>
              <p className="capitalize">{course.attributes.level}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <p>{course.attributes.duration}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rating Count</h3>
              <p>{course.attributes.rating_count}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sort Order</h3>
              <p>{course.attributes.sort_order}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Published</h3>
              <p>
                {course.attributes.publishedAt ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" /> No
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="flex space-x-2">
            <Badge variant={course.attributes.certificate ? "default" : "outline"}>Certificate</Badge>
            <Badge variant={course.attributes.quizes ? "default" : "outline"}>Quizes</Badge>
          </div>
          
          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Short Description</h3>
              <p className="mt-1 whitespace-pre-wrap">{course.attributes.short_desc}</p>
            </div>
            
            {course.attributes.short_desc_2 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Short Description 2</h3>
                <p className="mt-1 whitespace-pre-wrap">{course.attributes.short_desc_2}</p>
              </div>
            )}
            
            {course.attributes.short_desc_3 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Short Description 3</h3>
                <p className="mt-1 whitespace-pre-wrap">{course.attributes.short_desc_3}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Course Outline</h3>
              <p className="mt-1 whitespace-pre-wrap">{course.attributes.course_outline}</p>
            </div>
            
            {course.attributes.weekly_curriculum_intro && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Weekly Curriculum Intro</h3>
                <p className="mt-1 whitespace-pre-wrap">{course.attributes.weekly_curriculum_intro}</p>
              </div>
            )}
            
            {course.attributes.video_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Video URL</h3>
                <a 
                  href={course.attributes.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {course.attributes.video_url}
                </a>
              </div>
            )}
          </div>
          
          {/* Metadata */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Created:</span> {formatDate(course.attributes?.createdAt).toString()}
              </div>
              <div>
                <span className="text-gray-500">By:</span> {course.attributes.createdBy} {course.attributes.createdBy}
              </div>
              <div>
                <span className="text-gray-500">Updated:</span> {formatDate(course.attributes.updatedAt)}
              </div>
              <div>
                <span className="text-gray-500">By:</span> {course.attributes.updatedBy} {course.attributes.updatedBy}
              </div>
              {course.attributes.publishedAt && (
                <div>
                  <span className="text-gray-500">Published:</span> {formatDate(course.attributes.publishedAt)}
                </div>
              )}
              <div>
                <span className="text-gray-500">Locale:</span> {course.attributes.locale || 'en'}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseDialog;