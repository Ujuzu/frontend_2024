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
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <Input
            id="subtitle"
            name="subtitle"
            value={formData.subtitle || ''}
            onChange={handleInputChange}
            placeholder="Enter subtitle"
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="documentId" className="block text-sm font-medium text-gray-700">
            Document ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="documentId"
              name="documentId"
              value={formData.documentId || ''}
              onChange={handleInputChange}
              placeholder="Enter document ID"
              className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="course_category" className="block text-sm font-medium text-gray-700">
            Course Category
          </label>
          <Select 
            value={formData.course_category || ''} 
            onValueChange={(value) => handleSelectChange('course_category', value)}
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-[#AC19AD] focus:border-[#AC19AD]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="it">IT & Software</SelectItem>
              <SelectItem value="personal-development">Personal Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="short_desc" className="block text-sm font-medium text-gray-700">
          Short Description
        </label>
        <Textarea
          id="short_desc"
          name="short_desc"
          value={formData.short_desc || ''}
          onChange={handleInputChange}
          placeholder="Enter a short description of your course"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="course_outline" className="block text-sm font-medium text-gray-700">
          Course Outline
        </label>
        <Textarea
          id="course_outline"
          name="course_outline"
          value={formData.course_outline || ''}
          onChange={handleInputChange}
          placeholder="Enter course outline"
          rows={4}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Globe size={16} className="text-[#AC19AD]" />
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
          </div>
          <Select 
            value={formData.language || 'en'} 
            onValueChange={(value) => handleSelectChange('language', value)}
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-[#AC19AD] focus:border-[#AC19AD]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <LayoutGrid size={16} className="text-[#AC19AD]" />
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level
            </label>
          </div>
          <Select 
            value={formData.level || 'beginner'} 
            onValueChange={(value) => handleSelectChange('level', value)}
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-[#AC19AD] focus:border-[#AC19AD]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-[#AC19AD]" />
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration
            </label>
          </div>
          <Input
            id="duration"
            name="duration"
            value={formData.duration || ''}
            onChange={handleInputChange}
            placeholder="e.g. 4 weeks"
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          />
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
    </div>
  );
};

export default BasicInfoForm;
