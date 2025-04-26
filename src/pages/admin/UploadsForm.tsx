// UploadsForm.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Upload, Video, Check, FileText } from 'lucide-react';
import { FormStepProps } from './types';

const UploadsForm: React.FC<FormStepProps> = ({ 
  formData, 
  setFormData, 
  courseImage, 
  setCourseImage, 
  courseMaterials, 
  setCourseMaterials 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCourseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setCourseImage || !e.target.files) return;
    setCourseImage(e.target.files[0]);
  };
  
  const handleCourseMaterialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setCourseMaterials || !e.target.files) return;
    setCourseMaterials(Array.from(e.target.files));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <Upload size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Uploads & Media</h2>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Video size={16} className="text-[#AC19AD]" />
          <label htmlFor="video_url" className="block text-sm font-medium text-gray-700">
            Course Trailer URL
          </label>
        </div>
        <Input
          id="video_url"
          name="video_url"
          value={formData.intro_video_url || ''}
          onChange={handleInputChange}
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
        />
      </div>
      
      <div className="p-5 border rounded-lg border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-1.5 mb-3">
          <Upload size={16} className="text-[#AC19AD]" />
          <label htmlFor="course-image" className="block text-sm font-medium text-gray-700">
            Course Cover Image
          </label>
        </div>
        <div className="flex items-center">
          <Input
            id="course-image"
            type="file"
            accept="image/*"
            onChange={handleCourseImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#AC19AD] file:text-white hover:file:bg-[#AC19AD]/80"
          />
        </div>
        {courseImage && (
          <div className="mt-3 flex items-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
            <Check size={16} className="text-green-500 mr-2" />
            Selected: {courseImage.name}
          </div>
        )}
      </div>
      
      <div className="p-5 border rounded-lg border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-1.5 mb-3">
          <FileText size={16} className="text-[#AC19AD]" />
          <label htmlFor="course-materials" className="block text-sm font-medium text-gray-700">
            Course Materials
          </label>
        </div>
        <div className="flex items-center">
          <Input
            id="course-materials"
            type="file"
            multiple
            onChange={handleCourseMaterialsChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#AC19AD] file:text-white hover:file:bg-[#AC19AD]/80"
          />
        </div>
        {courseMaterials && courseMaterials.length > 0 && (
          <div className="mt-3 text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span>Selected files: {courseMaterials.length}</span>
            </div>
            {courseMaterials.length <= 3 && (
              <ul className="mt-2 space-y-1 pl-6">
                {courseMaterials.map((file, index) => (
                  <li key={index} className="flex items-center">
                    <FileText size={14} className="text-gray-500 mr-2" />
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
            {courseMaterials.length > 3 && (
              <div className="mt-1 text-xs text-[#AC19AD] font-medium cursor-pointer">
                View all {courseMaterials.length} files
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadsForm;
