// src/pages/admin/ReviewForm.tsx
import React from 'react';
import { 
  Globe,
  LayoutGrid,
  Clock,
  Award,
  ListTodo,
  Check,
  X,
  BadgeCheck
} from 'lucide-react';
import { FormStepProps } from './types';

const ReviewForm: React.FC<FormStepProps> = ({
  formData,
  curriculumItems = [],
  courseImage,
  courseMaterials = []
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <BadgeCheck size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Review & Publish</h2>
      </div>
      
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-[#AC19AD]/10 border-b">
          <h3 className="text-md font-medium text-[#AC19AD]">Course Summary</h3>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Course Title</p>
              <p className="mt-1 text-md">{formData.course_name || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Language</p>
              <p className="mt-1 text-md flex items-center">
                <Globe size={16} className="text-[#AC19AD] mr-2" />
                {formData.language === 'en' ? 'English' : 
                  formData.language === 'fr' ? 'French' : 
                  formData.language === 'es' ? 'Spanish' :
                  formData.language === 'de' ? 'German' :
                  formData.language === 'zh' ? 'Chinese' : formData.language || 'English'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Level</p>
              <p className="mt-1 text-md flex items-center">
                <LayoutGrid size={16} className="text-[#AC19AD] mr-2" />
                {formData.level === 'beginner' ? 'Beginner' :
                  formData.level === 'intermediate' ? 'Intermediate' :
                  formData.level === 'advanced' ? 'Advanced' : formData.level || 'Beginner'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="mt-1 text-md flex items-center">
                <Clock size={16} className="text-[#AC19AD] mr-2" />
                {formData.duration || 'Not specified'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Features</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {formData.certificate && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#AC19AD]/10 text-[#AC19AD]">
                    <Award size={14} className="mr-1" />
                    Certificate
                  </span>
                )}
                {formData.quizes && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#AC19AD]/10 text-[#AC19AD]">
                    <ListTodo size={14} className="mr-1" />
                    Quizzes
                  </span>
                )}
                {!formData.certificate && !formData.quizes && (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1 text-md">{formData.short_desc || 'Not provided'}</p>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Curriculum</p>
            {curriculumItems.some(item => item.title) ? (
              <div className="space-y-2">
                {curriculumItems.map((item, index) => (
                  item.title && (
                    <div key={index} className="flex items-start py-2">
                      <div className="flex-shrink-0 bg-[#AC19AD]/20 text-[#AC19AD] rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No curriculum items added</p>
            )}
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Uploaded Files</p>
            <div className="space-y-3">
              {courseImage ? (
                <div className="flex items-center text-sm">
                  <div className="bg-[#AC19AD]/10 text-[#AC19AD] p-1.5 rounded mr-3">
                    <Check size={14} />
                  </div>
                  <span>Course cover image: <span className="font-medium">{courseImage.name}</span></span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="bg-gray-100 text-gray-400 p-1.5 rounded mr-3">
                    <X size={14} />
                  </div>
                  <span>No cover image uploaded</span>
                </div>
              )}
              
              {courseMaterials.length > 0 ? (
                <div className="flex items-center text-sm">
                  <div className="bg-[#AC19AD]/10 text-[#AC19AD] p-1.5 rounded mr-3">
                    <Check size={14} />
                  </div>
                  <span>{courseMaterials.length} course materials uploaded</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="bg-gray-100 text-gray-400 p-1.5 rounded mr-3">
                    <X size={14} />
                  </div>
                  <span>No course materials uploaded</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#AC19AD]/5 border border-[#AC19AD]/20 rounded-lg p-4 flex items-center">
        <BadgeCheck size={20} className="text-[#AC19AD] mr-3 flex-shrink-0" />
        <p className="text-sm">
          Your course is ready to be published. Click "Publish Course" to make it available to users.
        </p>
      </div>
    </div>
  );
};

export default ReviewForm;
