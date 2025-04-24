import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  Info, 
  BookmarkCheck, 
  SortAsc, 
  FileText, 
  Video, 
  Globe, 
  Star,
  CheckSquare,
  AlertCircle,
  Tag,
  PlayCircle,
  CalendarIcon
} from "lucide-react";

interface Course {
  id: number;
  documentId?: string;
  course_name: string;
  course_outline: string | null;
  short_desc?: string;
  short_desc_2?: string;
  short_desc_3?: string;
  rating_count: number;
  language: string;
  certificate?: boolean;
  quizes: number | boolean;
  level: string;
  sort_order: number | null;
  duration: string;
  intro_video_url?: string | null;
  curriculum_overview?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
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
  
  // Helper component for showing items with icons
  const InfoItem = ({ icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex-shrink-0 mt-1">
        {React.cloneElement(icon, { size: 18, className: "text-purple-600" })}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-900">{value || "Not specified"}</p>
      </div>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-purple-600" />
            <DialogTitle className="text-xl">{course.course_name}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          {/* Header with status badge */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="flex items-center gap-3">
              <Tag size={20} className="text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Course ID</p>
                <p className="font-medium">{course.id} {course.documentId && <span className="text-gray-400">| {course.documentId}</span>}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Badge */}
              <span className={`px-3 py-1 flex items-center gap-2 text-sm font-medium rounded-full ${
                course.publishedAt ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {course.publishedAt ? (
                  <>
                    <CheckSquare size={16} className="text-purple-700" />
                    Published
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Draft
                  </>
                )}
              </span>
            </div>
          </div>
          
          {/* Course metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-purple-50 p-4 rounded-lg">
            <div className="flex flex-col items-center py-2">
              <Clock size={20} className="text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{course.duration}</p>
            </div>
            <div className="flex flex-col items-center py-2">
              <BookmarkCheck size={20} className="text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium">{course.level}</p>
            </div>
            <div className="flex flex-col items-center py-2">
              <Globe size={20} className="text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Language</p>
              <p className="font-medium">{course.language}</p>
            </div>
            <div className="flex flex-col items-center py-2">
              <Star size={20} className="text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Rating Count</p>
              <p className="font-medium">{course.rating_count}</p>
            </div>
          </div>
          
          {/* Course details */}
          <div className="bg-white rounded-lg border p-5">
            <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
              <Info size={20} className="text-purple-600 mr-2" />
              Course Details
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem 
                icon={<Award />} 
                label="Certificate" 
                value={course.certificate ? 'Available' : 'Not available'} 
              />
              <InfoItem 
                icon={<CheckSquare />} 
                label="Quizzes" 
                value={course.quizes ? (typeof course.quizes === 'number' ? `${course.quizes} quizzes` : 'Yes') : 'No'} 
              />
              {course.sort_order !== null && (
                <InfoItem 
                  icon={<SortAsc />} 
                  label="Sort Order" 
                  value={course.sort_order} 
                />
              )}
            </div>
          </div>
          
          {/* Descriptions */}
          <div className="bg-white rounded-lg border p-5">
            <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
              <FileText size={20} className="text-purple-600 mr-2" />
              Course Content
            </h4>
            
            <div className="grid gap-6">
              {course.short_desc && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-2">Short Description</p>
                  <p className="whitespace-pre-wrap">{course.short_desc}</p>
                </div>
              )}
              
              {course.short_desc_2 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-2">Short Description 2</p>
                  <p className="whitespace-pre-wrap">{course.short_desc_2}</p>
                </div>
              )}
              
              {course.short_desc_3 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-2">Short Description 3</p>
                  <p className="whitespace-pre-wrap">{course.short_desc_3}</p>
                </div>
              )}
              
              {course.course_outline && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-2">Course Outline</p>
                  <p className="whitespace-pre-wrap">{course.course_outline}</p>
                </div>
              )}
              
              {course.curriculum_overview && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-2">Curriculum Overview</p>
                  <p className="whitespace-pre-wrap">{course.curriculum_overview}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Video URLs */}
          {course.intro_video_url && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <Video size={20} className="text-purple-600 mr-2" />
                Media
              </h4>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <PlayCircle size={18} className="text-purple-600" />
                  <a href={course.intro_video_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 flex items-center gap-2 hover:underline">
                    Watch Intro Video
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* System Information */}
          <div className="bg-white rounded-lg border p-5">
            <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
              <CalendarIcon size={20} className="text-purple-600 mr-2" />
              System Information
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem 
                icon={<CalendarIcon />} 
                label="Created At" 
                value={new Date(course.createdAt).toLocaleString()} 
              />
              <InfoItem 
                icon={<CalendarIcon />} 
                label="Updated At" 
                value={new Date(course.updatedAt).toLocaleString()} 
              />
              {course.publishedAt && (
                <InfoItem 
                  icon={<CalendarIcon />} 
                  label="Published At" 
                  value={new Date(course.publishedAt).toLocaleString()} 
                />
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="border-t pt-4">
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseDialog;
