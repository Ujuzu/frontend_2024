import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

// API URL from environment variable
const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// Define a more comprehensive Course interface
interface Course {
  id: number;
  documentId: string;
  course_name: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: boolean | number;
  level?: string;
  short_desc?: string;
  short_desc_2?: string;
  short_desc_3?: string;
  sort_order?: number;
  curriculum_overview?: string;
  duration?: string;
  intro_video_url?: string;
  course_categories?: number[];
}

// Comprehensive form data interface
interface CourseFormData {
  course_name?: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: boolean | number;
  level?: string;
  short_desc?: string;
  short_desc_2?: string;
  short_desc_3?: string;
  sort_order?: number;
  curriculum_overview?: string;
  duration?: string;
  intro_video_url?: string;
  course_categories?: number[];
}

// Category interface
interface Category {
  id: number;
  name: string;
}

interface EditCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  onSave?: () => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  onSave,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    course_name: '',
    course_outline: '',
    rating_count: 0,
    language: '',
    certificate: false,
    quizes: false,
    level: '',
    short_desc: '',
    short_desc_2: '',
    short_desc_3: '',
    sort_order: 0,
    curriculum_overview: '',
    duration: '',
    intro_video_url: '',
    course_categories: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  // Fetch categories
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/course-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.data) {
        const formattedCategories = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.attributes?.name || `Category ${item.id}`,
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };
  
  // Update form data when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        course_name: selectedCourse.course_name || '',
        course_outline: selectedCourse.course_outline || '',
        rating_count: selectedCourse.rating_count || 0,
        language: selectedCourse.language || '',
        certificate: selectedCourse.certificate || false,
        quizes: typeof selectedCourse.quizes === 'boolean' ? selectedCourse.quizes : Boolean(selectedCourse.quizes),
        level: selectedCourse.level || '',
        short_desc: selectedCourse.short_desc || '',
        short_desc_2: selectedCourse.short_desc_2 || '',
        short_desc_3: selectedCourse.short_desc_3 || '',
        sort_order: selectedCourse.sort_order || 0,
        curriculum_overview: selectedCourse.curriculum_overview || '',
        duration: selectedCourse.duration || '',
        intro_video_url: selectedCourse.intro_video_url || '',
        course_categories: selectedCourse.course_categories || [],
      });
    }
    
    fetchCategories();
  }, [selectedCourse]);
  
  // Handle text input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle number input change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value, 10);
    
    setFormData(prev => {
      const currentCategories = prev.course_categories || [];
      
      // Only add if not already selected
      if (!currentCategories.includes(categoryId)) {
        return {
          ...prev,
          course_categories: [...currentCategories, categoryId]
        };
      }
      
      return prev;
    });
  };
  
  // Handle category removal
  const handleRemoveCategory = (id: number) => {
    setFormData(prev => ({
      ...prev,
      course_categories: (prev.course_categories || []).filter(catId => catId !== id)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!selectedCourse?.documentId) {
        toast.error('Course document ID is missing');
        return;
      }
      
      // Prepare the data structure required by the API
      const apiData = {
        data: {
          ...formData
        }
      };
      
      // Log the request for debugging
      console.log('Sending request to:', `${API_URL}/api/courses/${selectedCourse.documentId}`);
      console.log('Request data:', JSON.stringify(apiData));
      
      const response = await axios.put(
        `${API_URL}/api/courses/${selectedCourse.documentId}`,
        apiData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Response:', response.data);
      toast.success('Course updated successfully!');
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Define level options
  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  
  // Define language options
  const languageOptions = ['English', 'French', 'Spanish', 'German', 'Swahili', 'Arabic', 'Chinese', 'Other'];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Name */}
              <div className="space-y-2">
                <Label htmlFor="course_name">Course Name <span className="text-red-500">*</span></Label>
                <Input
                  id="course_name"
                  name="course_name"
                  placeholder="Enter course name"
                  value={formData.course_name || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => handleSelectChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="e.g., 8 weeks, 3 months"
                  value={formData.duration || ''}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            {/* Short Descriptions */}
            <div className="space-y-2">
              <Label htmlFor="short_desc">Short Description</Label>
              <Textarea
                id="short_desc"
                name="short_desc"
                placeholder="Brief description of the course"
                value={formData.short_desc || ''}
                onChange={handleFormChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="short_desc_2">Short Description 2</Label>
                <Textarea
                  id="short_desc_2"
                  name="short_desc_2"
                  placeholder="Additional description"
                  value={formData.short_desc_2 || ''}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short_desc_3">Short Description 3</Label>
                <Textarea
                  id="short_desc_3"
                  name="short_desc_3"
                  placeholder="Additional description"
                  value={formData.short_desc_3 || ''}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Course Content Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Course Content</h3>
            
            <div className="space-y-2">
              <Label htmlFor="course_outline">Course Outline</Label>
              <Textarea
                id="course_outline"
                name="course_outline"
                placeholder="Detailed course outline"
                value={formData.course_outline || ''}
                onChange={handleFormChange}
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="curriculum_overview">Curriculum Overview</Label>
              <Textarea
                id="curriculum_overview"
                name="curriculum_overview"
                placeholder="Overview of the curriculum"
                value={formData.curriculum_overview || ''}
                onChange={handleFormChange}
                rows={4}
              />
            </div>
          </div>
          
          {/* Categories Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Categories</h3>
            
            <div className="space-y-2">
              <Label htmlFor="course_categories">Course Categories</Label>
              
              {/* Display selected categories */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.course_categories?.map((categoryId) => {
                  const category = categories.find(cat => cat.id === categoryId);
                  return (
                    <div key={categoryId} className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{category?.name || `Category ${categoryId}`}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(categoryId)}
                        className="text-slate-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* Category selection dropdown */}
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {isLoadingCategories && <p className="text-sm text-slate-500">Loading categories...</p>}
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating_count">Rating Count</Label>
                <Input
                  id="rating_count"
                  name="rating_count"
                  type="number"
                  placeholder="0"
                  value={formData.rating_count || 0}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  placeholder="0"
                  value={formData.sort_order || 0}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intro_video_url">Intro Video URL</Label>
                <Input
                  id="intro_video_url"
                  name="intro_video_url"
                  placeholder="https://example.com/video"
                  value={formData.intro_video_url || ''}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certificate"
                  checked={formData.certificate || false}
                  onCheckedChange={(checked) => handleCheckboxChange('certificate', checked === true)}
                />
                <Label htmlFor="certificate">Certificate Available</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="quizes"
                  checked={formData.quizes === true}
                  onCheckedChange={(checked) => handleCheckboxChange('quizes', checked === true)}
                />
                <Label htmlFor="quizes">Includes Quizzes</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#AC19AD] hover:bg-[#8A1489] text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
