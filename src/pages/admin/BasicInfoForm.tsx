// BasicInfoForm.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Globe, LayoutGrid, Clock, Award, ListTodo } from 'lucide-react';
import { FormStepProps } from './types';

const BasicInfoForm: React.FC<FormStepProps> = ({ formData, setFormData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
    
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <Book size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Basic Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="course_name" className="block text-sm font-medium text-gray-700">
            Course Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="course_name"
            name="course_name"
            value={formData.course_name || ''}
            onChange={handleInputChange}
            placeholder="Enter course title"
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-[#AC19AD]" />
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration <span className="text-red-500">*</span>
            </label>
          </div>
          <Input
            id="duration"
            name="duration"
            value={formData.duration || ''}
            onChange={handleInputChange}
            placeholder="e.g. 4 weeks"
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="short_desc" className="block text-sm font-medium text-gray-700">
          Short Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="short_desc"
          name="short_desc"
          value={formData.short_desc || ''}
          onChange={handleInputChange}
          placeholder="Enter a short description of your course"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="short_desc_2" className="block text-sm font-medium text-gray-700">
          Alternative Description 1 <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="short_desc_2"
          name="short_desc_2"
          value={formData.short_desc_2 || ''}
          onChange={handleInputChange}
          placeholder="Enter an alternative description for your course"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="short_desc_3" className="block text-sm font-medium text-gray-700">
          Alternative Description 2 <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="short_desc_3"
          name="short_desc_3"
          value={formData.short_desc_3 || ''}
          onChange={handleInputChange}
          placeholder="Enter another alternative description for your course"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="course_outline" className="block text-sm font-medium text-gray-700">
          Course Outline <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="course_outline"
          name="course_outline"
          value={formData.course_outline || ''}
          onChange={handleInputChange}
          placeholder="Enter course outline"
          rows={4}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="curriculum_overview" className="block text-sm font-medium text-gray-700">
          Curriculum Overview <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="curriculum_overview"
          name="curriculum_overview"
          value={formData.curriculum_overview || ''}
          onChange={handleInputChange}
          placeholder="Enter an overview of the curriculum"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Globe size={16} className="text-[#AC19AD]" />
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language <span className="text-red-500">*</span>
            </label>
          </div>
          <Select 
            value={formData.language || 'English'} 
            onValueChange={(value) => handleSelectChange('language', value)}
            required
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-[#AC19AD] focus:border-[#AC19AD]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <LayoutGrid size={16} className="text-[#AC19AD]" />
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level <span className="text-red-500">*</span>
            </label>
          </div>
          <Select 
            value={formData.level || ''} 
            onValueChange={(value) => handleSelectChange('level', value)}
            required
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-[#AC19AD] focus:border-[#AC19AD]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6 pt-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="certificate"
            name="certificate"
            checked={formData.certificate || false}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-[#AC19AD] focus:ring-[#AC19AD]"
          />
          <div className="flex items-center">
            <Award size={16} className="mr-1.5 text-[#AC19AD]" />
            <label htmlFor="certificate" className="block text-sm text-gray-700">
              Certificate Available
            </label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="quizes"
            name="quizes"
            checked={Boolean(formData.quizes)}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-[#AC19AD] focus:ring-[#AC19AD]"
          />
          <div className="flex items-center">
            <ListTodo size={16} className="mr-1.5 text-[#AC19AD]" />
            <label htmlFor="quizes" className="block text-sm text-gray-700">
              Includes Quizzes
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="intro_video_url" className="block text-sm font-medium text-gray-700">
          Intro Video URL <span className="text-red-500">*</span>
        </label>
        <Input
          id="intro_video_url"
          name="intro_video_url"
          value={formData.intro_video_url || ''}
          onChange={handleInputChange}
          placeholder="Enter intro video URL"
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
          Sort Order <span className="text-red-500">*</span>
        </label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          value={formData.sort_order || 0}
          onChange={(e) => {
            setFormData({
              ...formData,
              sort_order: parseInt(e.target.value) || 0
            });
          }}
          placeholder="Enter sort order"
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="rating_count" className="block text-sm font-medium text-gray-700">
          Rating Count <span className="text-red-500">*</span>
        </label>
        <Input
          id="rating_count"
          name="rating_count"
          type="number"
          value={formData.rating_count || 0}
          onChange={(e) => {
            setFormData({
              ...formData,
              rating_count: parseInt(e.target.value) || 0
            });
          }}
          placeholder="Enter rating count"
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
