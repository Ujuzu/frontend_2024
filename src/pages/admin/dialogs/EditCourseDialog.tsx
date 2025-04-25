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
import { X, Plus } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

// API URL from environment variable
const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// Category interface
interface Category {
  id: number;
  documentId: string;
  title: string;
  description?: string;
}

// Subcategory interface
interface Subcategory {
  id: number;
  documentId: string;
  name: string;
  description?: string;
}

// Learn List item interface
interface LearnListItem {
  id: number;
  documentId: string;
  text: string;
}

// Review interface
interface Review {
  id: number;
  documentId: string;
  reviewer_name: string;
  review_text: string;
  rating: number;
  date?: string;
}

// Instructor interface
interface Instructor {
  id: number;
  documentId: string;
  name: string;
  bio?: string;
  avatar_url?: string;
}

// Requirement interface
interface Requirement {
  id: number;
  documentId: string;
  text: string;
}

// Feature interface
interface Feature {
  id: number;
  documentId: string;
  title: string;
  description?: string;
}

// Target Group interface
interface TargetGroup {
  id: number;
  documentId: string;
  description: string;
}

// Define a comprehensive Course interface
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
  course_categories?: Category[];
  course_subcategories?: Subcategory[];
  course_learn_lists?: LearnListItem[];
  course_reviews?: Review[];
  courses_instructors?: Instructor[];
  course_requirements?: Requirement[];
  courses_features?: Feature[];
  course_target_groups?: TargetGroup[];
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
  course_subcategories?: number[];
  course_learn_lists?: number[];
  course_reviews?: number[];
  courses_instructors?: number[];
  course_requirements?: number[];
  courses_features?: number[];
  course_target_groups?: number[];
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
    course_subcategories: [],
    course_learn_lists: [],
    course_reviews: [],
    courses_instructors: [],
    course_requirements: [],
    courses_features: [],
    course_target_groups: [],
  });
  
  // Local state for managing new text entries
  const [newLearnItem, setNewLearnItem] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newTargetGroup, setNewTargetGroup] = useState('');
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  
  // States for storing related data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [learnLists, setLearnLists] = useState<LearnListItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [targetGroups, setTargetGroups] = useState<TargetGroup[]>([]);
  
  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(false);
  
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
          documentId: item.documentId,
          title: item.attributes?.name || item.title || `Category ${item.id}`,
          description: item.attributes?.description || item.description,
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

  // Fetch subcategories
  const fetchSubcategories = async () => {
    setIsLoadingSubcategories(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/course-subcategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.data) {
        const formattedSubcategories = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.attributes?.name || item.name || `Subcategory ${item.id}`,
          description: item.attributes?.description || item.description,
        }));
        setSubcategories(formattedSubcategories);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    } finally {
      setIsLoadingSubcategories(false);
    }
  };

  // Fetch instructors
  const fetchInstructors = async () => {
    setIsLoadingInstructors(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/courses-instructors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.data) {
        const formattedInstructors = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.attributes?.name || item.name || `Instructor ${item.id}`,
          bio: item.attributes?.bio || item.bio,
          avatar_url: item.attributes?.avatar_url || item.avatar_url,
        }));
        setInstructors(formattedInstructors);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setIsLoadingInstructors(false);
    }
  };
  
  // Process local data from selected course
  const processLocalDataFromCourse = (course: Course) => {
    if (course.course_learn_lists && course.course_learn_lists.length > 0) {
      setLearnLists(course.course_learn_lists);
    }
    
    if (course.course_reviews && course.course_reviews.length > 0) {
      setReviews(course.course_reviews);
    }
    
    if (course.course_requirements && course.course_requirements.length > 0) {
      setRequirements(course.course_requirements);
    }
    
    if (course.courses_features && course.courses_features.length > 0) {
      setFeatures(course.courses_features);
    }
    
    if (course.course_target_groups && course.course_target_groups.length > 0) {
      setTargetGroups(course.course_target_groups);
    }
  };
  
  // Update form data when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      const categoryIds = selectedCourse.course_categories?.map(category => category.id) || [];
      const subcategoryIds = selectedCourse.course_subcategories?.map(subcat => subcat.id) || [];
      const learnListIds = selectedCourse.course_learn_lists?.map(item => item.id) || [];
      const reviewIds = selectedCourse.course_reviews?.map(review => review.id) || [];
      const instructorIds = selectedCourse.courses_instructors?.map(instructor => instructor.id) || [];
      const requirementIds = selectedCourse.course_requirements?.map(req => req.id) || [];
      const featureIds = selectedCourse.courses_features?.map(feature => feature.id) || [];
      const targetGroupIds = selectedCourse.course_target_groups?.map(target => target.id) || [];
      
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
        course_categories: categoryIds,
        course_subcategories: subcategoryIds,
        course_learn_lists: learnListIds,
        course_reviews: reviewIds,
        courses_instructors: instructorIds,
        course_requirements: requirementIds,
        courses_features: featureIds,
        course_target_groups: targetGroupIds,
      });
      
      // Process local data
      processLocalDataFromCourse(selectedCourse);
    }
    
    // Fetch data for dropdowns
    fetchCategories();
    fetchSubcategories();
    fetchInstructors();
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
  
  // Add new learn list item
  const handleAddLearnItem = () => {
    if (!newLearnItem.trim()) return;
    
    // Create a temporary ID for UI purposes
    const tempId = Date.now();
    const newItem = {
      id: tempId * -1, // Use negative ID to indicate it's new and not from DB
      documentId: `temp-${tempId}`,
      text: newLearnItem.trim()
    };
    
    setLearnLists(prev => [...prev, newItem]);
    setFormData(prev => ({
      ...prev,
      course_learn_lists: [...(prev.course_learn_lists || []), newItem.id]
    }));
    
    setNewLearnItem('');
  };
  
  // Add new requirement
  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    
    const tempId = Date.now();
    const newItem = {
      id: tempId * -1,
      documentId: `temp-${tempId}`,
      text: newRequirement.trim()
    };
    
    setRequirements(prev => [...prev, newItem]);
    setFormData(prev => ({
      ...prev,
      course_requirements: [...(prev.course_requirements || []), newItem.id]
    }));
    
    setNewRequirement('');
  };
  
  // Add new target group
  const handleAddTargetGroup = () => {
    if (!newTargetGroup.trim()) return;
    
    const tempId = Date.now();
    const newItem = {
      id: tempId * -1,
      documentId: `temp-${tempId}`,
      description:newTargetGroup.trim()
    };
    
    setTargetGroups(prev => [...prev, newItem]);
    setFormData(prev => ({
      ...prev,
      course_target_groups: [...(prev.course_target_groups || []), newItem.id]
    }));
    
    setNewTargetGroup('');
  };
  
  // Add new feature
  const handleAddFeature = () => {
    if (!newFeatureTitle.trim()) return;
    
    const tempId = Date.now();
    const newItem = {
      id: tempId * -1,
      documentId: `temp-${tempId}`,
      title: newFeatureTitle.trim(),
      description: newFeatureDesc
    };
    
    setFeatures(prev => [...prev, newItem]);
    setFormData(prev => ({
      ...prev,
      courses_features: [...(prev.courses_features || []), newItem.id]
    }));
    
    setNewFeatureTitle('');
    setNewFeatureDesc('');
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
  
  // Handle subcategory selection
  const handleSubcategoryChange = (value: string) => {
    const subcategoryId = parseInt(value, 10);
    
    setFormData(prev => {
      const currentSubcategories = prev.course_subcategories || [];
      
      // Only add if not already selected
      if (!currentSubcategories.includes(subcategoryId)) {
        return {
          ...prev,
          course_subcategories: [...currentSubcategories, subcategoryId]
        };
      }
      
      return prev;
    });
  };
  
  // Handle instructor selection
  const handleInstructorChange = (value: string) => {
    const instructorId = parseInt(value, 10);
    
    setFormData(prev => {
      const currentInstructors = prev.courses_instructors || [];
      
      // Only add if not already selected
      if (!currentInstructors.includes(instructorId)) {
        return {
          ...prev,
          courses_instructors: [...currentInstructors, instructorId]
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
  
  // Handle subcategory removal
  const handleRemoveSubcategory = (id: number) => {
    setFormData(prev => ({
      ...prev,
      course_subcategories: (prev.course_subcategories || []).filter(subId => subId !== id)
    }));
  };
  
  // Handle learn item removal
  const handleRemoveLearnItem = (id: number) => {
    setLearnLists(prev => prev.filter(item => item.id !== id));
    setFormData(prev => ({
      ...prev,
      course_learn_lists: (prev.course_learn_lists || []).filter(itemId => itemId !== id)
    }));
  };
  
  // Handle requirement removal
  const handleRemoveRequirement = (id: number) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
    setFormData(prev => ({
      ...prev,
      course_requirements: (prev.course_requirements || []).filter(reqId => reqId !== id)
    }));
  };
  
  // Handle target group removal
  const handleRemoveTargetGroup = (id: number) => {
    setTargetGroups(prev => prev.filter(target => target.id !== id));
    setFormData(prev => ({
      ...prev,
      course_target_groups: (prev.course_target_groups || []).filter(targetId => targetId !== id)
    }));
  };
  
  // Handle feature removal
  const handleRemoveFeature = (id: number) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
    setFormData(prev => ({
      ...prev,
      courses_features: (prev.courses_features || []).filter(featureId => featureId !== id)
    }));
  };
  
  // Handle instructor removal
  const handleRemoveInstructor = (id: number) => {
    setFormData(prev => ({
      ...prev,
      courses_instructors: (prev.courses_instructors || []).filter(instId => instId !== id)
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
  
  // Helper functions to get names by ID
  const getCategoryName = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    return category?.title || `Category ${id}`;
  };
  
  const getSubcategoryName = (id: number) => {
    const subcategory = subcategories.find(subcat => subcat.id === id);
    return subcategory?.name || `Subcategory ${id}`;
  };
  
  const getInstructorName = (id: number) => {
    const instructor = instructors.find(inst => inst.id === id);
    return instructor?.name || `Instructor ${id}`;
  };
  
  const getLearnItemText = (id: number) => {
    const item = learnLists.find(item => item.id === id);
    return item?.text || '';
  };
  
  const getRequirementText = (id: number) => {
    const item = requirements.find(req => req.id === id);
    return item?.text || '';
  };
  
  const getTargetGroupText = (id: number) => {
    const item = targetGroups.find(target => target.id === id);
    return item?.description || '';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
                {formData.course_categories?.map((categoryId) => (
                  <div 
                    key={categoryId} 
                    className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{getCategoryName(categoryId)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(categoryId)}
                      className="text-slate-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {(!formData.course_categories || formData.course_categories.length === 0) && (
                  <p className="text-sm text-slate-500">No categories selected</p>
                )}
              </div>
              
              {/* Category selection dropdown */}
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(category => 
                      !(formData.course_categories || []).includes(category.id)
                    )
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.title}
                      </SelectItem>
                    ))}
                  
                  {categories.length === 0 && (
                    <SelectItem value="none" disabled>No categories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              {isLoadingCategories && <p className="text-sm text-slate-500">Loading categories...</p>}
            </div>
          </div>
          
          {/* Subcategories Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Subcategories</h3>
            
            <div className="space-y-2">
              <Label htmlFor="course_subcategories">Course Subcategories</Label>
              
              {/* Display selected subcategories */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.course_subcategories?.map((subcategoryId) => (
                  <div 
                    key={subcategoryId} 
                    className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{getSubcategoryName(subcategoryId)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(subcategoryId)}
                      className="text-slate-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {(!formData.course_subcategories || formData.course_subcategories.length === 0) && (
                  <p className="text-sm text-slate-500">No subcategories selected</p>
                )}
              </div>
              
              {/* Subcategory selection dropdown */}
              <Select onValueChange={handleSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories
                    .filter(subcategory => 
                      !(formData.course_subcategories || []).includes(subcategory.id)
                    )
                    .map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  
                  {subcategories.length === 0 && (
                    <SelectItem value="none" disabled>No subcategories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              {isLoadingSubcategories && <p className="text-sm text-slate-500">Loading subcategories...</p>}
            </div>
          </div>
          
          {/* What You'll Learn Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">What You'll Learn</h3>
            
            <div className="space-y-2">
              <Label>Learning Outcomes</Label>
              
              {/* Display learning items */}
              <div className="space-y-2 mb-4">
                {learnLists.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-2 bg-slate-50 p-3 rounded-md"
                  >
                    <div className="flex-1">{item.text}</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLearnItem(item.id)}
                      className="text-slate-500 hover:text-red-500 mt-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {learnLists.length === 0 && (
                  <p className="text-sm text-slate-500">No learning outcomes added</p>
                )}
              </div>
              
              {/* Add new learn item form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add what students will learn"
                  value={newLearnItem}
                  onChange={(e) => setNewLearnItem(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddLearnItem}
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Requirements Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Requirements</h3>
            
            <div className="space-y-2">
              <Label>Course Prerequisites</Label>
              
              {/* Display requirements */}
              <div className="space-y-2 mb-4">
                {requirements.map((req) => (
                  <div 
                    key={req.id} 
                    className="flex items-start gap-2 bg-slate-50 p-3 rounded-md"
                  >
                    <div className="flex-1">{req.text}</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(req.id)}
                      className="text-slate-500 hover:text-red-500 mt-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {requirements.length === 0 && (
                  <p className="text-sm text-slate-500">No requirements added</p>
                )}
              </div>
              
              {/* Add new requirement form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a prerequisite"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddRequirement}
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Target Audience Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Target Audience</h3>
            
            <div className="space-y-2">
              <Label>Who is this course for?</Label>
              
              {/* Display target groups */}
              <div className="space-y-2 mb-4">
                {targetGroups.map((target) => (
                  <div 
                    key={target.id} 
                    className="flex items-start gap-2 bg-slate-50 p-3 rounded-md"
                  >
                    <div className="flex-1">{target.description}</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTargetGroup(target.id)}
                      className="text-slate-500 hover:text-red-500 mt-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {targetGroups.length === 0 && (
                  <p className="text-sm text-slate-500">No target groups added</p>
                )}
              </div>
              
              {/* Add new target group form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a target audience group"
                  value={newTargetGroup}
                  onChange={(e) => setNewTargetGroup(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTargetGroup}
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Course Features</h3>
            
            <div className="space-y-2">
              <Label>Special Features</Label>
              
              {/* Display features */}
              <div className="space-y-3 mb-4">
                {features.map((feature) => (
                  <div 
                    key={feature.id} 
                    className="bg-slate-50 p-3 rounded-md"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{feature.title}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature.id)}
                        className="text-slate-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {feature.description && (
                      <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                    )}
                  </div>
                ))}
                
                {features.length === 0 && (
                  <p className="text-sm text-slate-500">No features added</p>
                )}
              </div>
              
              {/* Add new feature form */}
              <div className="space-y-2">
                <Input
                  placeholder="Feature title"
                  value={newFeatureTitle}
                  onChange={(e) => setNewFeatureTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Feature description (optional)"
                  value={newFeatureDesc}
                  onChange={(e) => setNewFeatureDesc(e.target.value)}
                  rows={2}
                />
                <Button 
                  type="button" 
                  onClick={handleAddFeature}
                  variant="outline"
                  className="w-full"
                >
                  <Plus size={16} className="mr-1" /> Add Feature
                </Button>
              </div>
            </div>
          </div>
          
          {/* Instructors Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Instructors</h3>
            
            <div className="space-y-2">
              <Label>Course Instructors</Label>
              
              {/* Display selected instructors */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.courses_instructors?.map((instructorId) => (
                  <div 
                    key={instructorId} 
                    className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{getInstructorName(instructorId)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstructor(instructorId)}
                      className="text-slate-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {(!formData.courses_instructors || formData.courses_instructors.length === 0) && (
                  <p className="text-sm text-slate-500">No instructors selected</p>
                )}
              </div>
              
              {/* Instructor selection dropdown */}
              <Select onValueChange={handleInstructorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Add an instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors
                    .filter(instructor => 
                      !(formData.courses_instructors || []).includes(instructor.id)
                    )
                    .map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id.toString()}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  
                  {instructors.length === 0 && (
                    <SelectItem value="none" disabled>No instructors available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              {isLoadingInstructors && <p className="text-sm text-slate-500">Loading instructors...</p>}
            </div>
          </div>
          
          {/* Additional Settings Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Additional Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating Count */}
              <div className="space-y-2">
                <Label htmlFor="rating_count">Rating Count</Label>
                <Input
                  id="rating_count"
                  name="rating_count"
                  type="number"
                  placeholder="0"
                  value={formData.rating_count || 0}
                  onChange={handleNumberChange}
                  min={0}
                />
              </div>
              
              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  placeholder="0"
                  value={formData.sort_order || 0}
                  onChange={handleNumberChange}
                  min={0}
                />
              </div>
              
              {/* Intro Video URL */}
              <div className="space-y-2">
                <Label htmlFor="intro_video_url">Intro Video URL</Label>
                <Input
                  id="intro_video_url"
                  name="intro_video_url"
                  placeholder="https://..."
                  value={formData.intro_video_url || ''}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              {/* Certificate Option */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="certificate" 
                  checked={formData.certificate} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('certificate', checked === true)
                  }
                />
                <Label htmlFor="certificate" className="cursor-pointer">
                  Includes Certificate
                </Label>
              </div>
              
              {/* Quizzes Option */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="quizes" 
                  checked={formData.quizes === true} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('quizes', checked === true)
                  }
                />
                <Label htmlFor="quizes" className="cursor-pointer">
                  Includes Quizzes
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
