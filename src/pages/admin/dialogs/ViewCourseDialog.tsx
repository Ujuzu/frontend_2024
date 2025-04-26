import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
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
  CalendarIcon,
  Layers,
  CheckCircle,
  Users,
  TargetIcon,
  ListChecks,
  BookmarkIcon
} from "lucide-react";

interface CourseCategory {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  description: string | null;
}

interface CourseSubcategory {
  id: number;
  documentId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  description?: string | null;
}

interface CourseLearnList {
  id: number;
  documentId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseReview {
  id: number;
  documentId?: string;
  rating: number;
  comment: string;
  user_name: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseInstructor {
  id: number;
  documentId?: string;
  instructor_name: string;
  bio?: string;
  profile_image?: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseRequirement {
  id: number;
  documentId?: string;
  requirement: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseFeature {
  id: number;
  documentId?: string;
  feature: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseTargetGroup {
  id: number;
  documentId?: string;
  target_group: string;
  createdAt: string;
  updatedAt: string;
}

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
  course_categories?: CourseCategory[];
  course_subcategories?: CourseSubcategory[];
  course_learn_lists?: CourseLearnList[];
  course_reviews?: CourseReview[];
  courses_instructors?: CourseInstructor[];
  course_requirements?: CourseRequirement[];
  courses_features?: CourseFeature[];
  course_target_groups?: CourseTargetGroup[];
}

interface ViewCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

interface IconProps {
  size?: number;
  className?: string;
}

interface InfoItemProps {
  icon: React.ReactElement<IconProps>;
  label: string;
  value: string | number | boolean | null | undefined;
  className?: string;
}

interface ListItemProps {
  icon: React.ReactElement<IconProps>;
  text: string;
}

const ViewCourseDialog: React.FC<ViewCourseDialogProps> = ({
  isOpen,
  onClose,
  course
}) => {
  if (!course) return null;
  
  const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, className = "" }) => (
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

  const ListItem: React.FC<ListItemProps> = ({ icon, text }) => (
    <li className="flex items-start gap-2 mb-2">
      <div className="flex-shrink-0 mt-1">
        {React.cloneElement(icon, { size: 16, className: "text-purple-600" })}
      </div>
      <span>{text}</span>
    </li>
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
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="flex items-center gap-3">
              <Tag size={20} className="text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Course ID</p>
                <p className="font-medium">{course.id} {course.documentId && <span className="text-gray-400">| {course.documentId}</span>}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
          
          {(course.course_categories && course.course_categories.length > 0) && (
            <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mr-4">
                <Layers size={18} className="text-purple-600" />
                <span className="font-medium">Categories:</span>
              </div>
              {course.course_categories.map((category) => (
                <span key={category.id} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {category.title}
                </span>
              ))}
              
              {(course.course_subcategories && course.course_subcategories.length > 0) && (
                <>
                  <div className="w-full mt-2"></div>
                  <div className="flex items-center gap-2 mr-4">
                    <Layers size={18} className="text-purple-600" />
                    <span className="font-medium">Subcategories:</span>
                  </div>
                  {course.course_subcategories.map((subcategory) => (
                    <span key={subcategory.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {subcategory.title}
                    </span>
                  ))}
                </>
              )}
            </div>
          )}
          
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
          
          {(course.course_requirements && course.course_requirements.length > 0) && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <ListChecks size={20} className="text-purple-600 mr-2" />
                Course Requirements
              </h4>
              <ul className="list-none pl-0">
                {course.course_requirements.map((req) => (
                  <ListItem 
                    key={req.id} 
                    icon={<CheckCircle />} 
                    text={req.requirement} 
                  />
                ))}
              </ul>
            </div>
          )}
          
          {(course.course_learn_lists && course.course_learn_lists.length > 0) && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <BookmarkIcon size={20} className="text-purple-600 mr-2" />
                What You'll Learn
              </h4>
              <ul className="list-none pl-0">
                {course.course_learn_lists.map((item) => (
                  <ListItem 
                    key={item.id} 
                    icon={<CheckCircle />} 
                    text={item.title} 
                  />
                ))}
              </ul>
            </div>
          )}
          
          {(course.courses_features && course.courses_features.length > 0) && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <Star size={20} className="text-purple-600 mr-2" />
                Course Features
              </h4>
              <ul className="list-none pl-0">
                {course.courses_features.map((feature) => (
                  <ListItem 
                    key={feature.id} 
                    icon={<CheckCircle />} 
                    text={feature.feature} 
                  />
                ))}
              </ul>
            </div>
          )}
          
          {(course.course_target_groups && course.course_target_groups.length > 0) && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <TargetIcon size={20} className="text-purple-600 mr-2" />
                Target Audience
              </h4>
              <ul className="list-none pl-0">
                {course.course_target_groups.map((group) => (
                  <ListItem 
                    key={group.id} 
                    icon={<Users />} 
                    text={group.target_group} 
                  />
                ))}
              </ul>
            </div>
          )}
          
          {(course.courses_instructors && course.courses_instructors.length > 0) && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <Users size={20} className="text-purple-600 mr-2" />
                Instructors
              </h4>
              <div className="grid gap-6">
                {course.courses_instructors.map((instructor) => (
                  <div key={instructor.id} className="flex items-start gap-3 border-b last:border-0 pb-4 last:pb-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {instructor.profile_image ? (
                        <img 
                          src={instructor.profile_image} 
                          alt={instructor.instructor_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users size={24} className="text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{instructor.instructor_name}</p>
                      {instructor.bio && <p className="text-gray-600 text-sm mt-1">{instructor.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
          
          {(course.course_reviews && course.course_reviews.length > 0) && (
            <div className="bg-white rounded-lg border p-5">
              <h4 className="flex items-center text-lg font-medium mb-4 text-purple-800">
                <Star size={20} className="text-purple-600 mr-2" />
                Student Reviews
              </h4>
              <div className="grid gap-4">
                {course.course_reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{review.user_name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
