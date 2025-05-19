// File: src/hooks/useCourse.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { DialogState, ICourseAttributes, ICourseResponse, IStrapiResponse } from '@/Interfaces/ICourseRespone';
import { IMeta } from '@/Interfaces/IMeta';
import { courseService } from '@/service/courseService';

export const useCourse = () => {
  const [courses, setCourses] = useState<ICourseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { token } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<ICourseAttributes>({
    locale: 'en', // Set default locale
    course_name:''
  });
  
  // All dialog states in one object
  const [dialogState, setDialogState] = useState<DialogState>({
    isAddCourseOpen: false,
    isEditCourseOpen: false,
    isDeleteCourseOpen: false,
    isViewCourseOpen: false,
    selectedCourse: null
  });

  // Function to fetch courses from API
  const fetchCourses = useCallback(async (page = 1, filter = '') => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await courseService.getCourses<IStrapiResponse>(token, page, filter);
      setCourses(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  // Initial fetch
  useEffect(() => {
    fetchCourses(currentPage, filterText);
  }, [currentPage, fetchCourses, filterText]);
  
  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filtering
      fetchCourses(1, filterText);
    }, 500); // Debounce for 500ms
    
    return () => clearTimeout(timer);
  }, [filterText, fetchCourses]);
  
  // Function to refresh the data
  const refreshData = () => {
    setIsRefreshing(true);
    fetchCourses(currentPage, filterText);
  };

  // Handle filter text change
  const handleFilterChange = (value: string) => {
    setFilterText(value);
  };
  
  // Page navigation
  const goToPage = (page: number) => {
    if (meta && page >= 1 && page <= meta.pagination.pageCount) {
      setCurrentPage(page);
    }
  };

  // Dialog handlers
const handleAddCourse = (course?: ICourseResponse) => {
  if (course) {
    setFormData(course.attributes); // Load existing course data
    setDialogState(prev => ({
      ...prev,
      isAddCourseOpen: true,
      selectedCourse: course, // Store the selected course for editing
    }));
  } else {
    setFormData({ locale: "en", course_name: "" }); // Default empty values
    setDialogState(prev => ({
      ...prev,
      isAddCourseOpen: true,
      selectedCourse: null, // No course, so we're adding a new one
    }));
  }
};
  
  const handleViewCourse = (course: ICourseResponse) => {
    setDialogState(prev => ({ 
      ...prev, 
      isViewCourseOpen: true,
      selectedCourse: course,
      id: course.id
    }));
  };
  
  const handleEditCourse = (course: ICourseResponse) => {
    setDialogState(prev => ({ 
      ...prev, 
      isEditCourseOpen: true,
      selectedCourse: course,
    }));
    setFormData({
      short_desc: course.attributes.short_desc,
      course_outline: course.attributes.course_outline,
      rating_count: course.attributes.rating_count,
      language: course.attributes.language,
      certificate: course.attributes.certificate,
      quizes: typeof course.attributes.quizes === 'boolean' ? course.attributes.quizes : Boolean(course.attributes.quizes),
      level: course.attributes.level,
      short_desc_2: course.attributes.short_desc_2,
      sort_order: course.attributes.sort_order,
      short_desc_3: course.attributes.short_desc_3,
      course_name: course.attributes.course_name,
      weekly_curriculum_intro: course.attributes.weekly_curriculum_intro,
      duration: course.attributes.duration,
      video_url: course.attributes.video_url,
      locale: course.attributes.locale || 'en'
    });
  };
  
  const handleDeleteCourse = (course: ICourseResponse) => {
    setDialogState(prev => ({ 
      ...prev, 
      isDeleteCourseOpen: true,
      selectedCourse: course
    }));
  };

  const closeAllDialogs = () => {
    setDialogState({
      isAddCourseOpen: false,
      isEditCourseOpen: false,
      isDeleteCourseOpen: false,
      isViewCourseOpen: false,
      selectedCourse: null
    });
  };
  
  // Success handlers
  const handleCourseCreationSuccess = () => {
    setDialogState(prev => ({ ...prev, isAddCourseOpen: false }));
    fetchCourses(currentPage, filterText);
    toast.success('Course created successfully!');
  };
  
  const handleEditSuccess = () => {
    setDialogState(prev => ({ ...prev, isEditCourseOpen: false }));
    fetchCourses(currentPage, filterText);
    toast.success('Course updated successfully!');
  };
  
  // Delete confirmation
  const confirmDelete = async () => {
    if (!dialogState.selectedCourse || !token) return;
    
    try {
      await courseService.deleteCourse(token, dialogState.selectedCourse.id);
      toast.success('Course deleted successfully!');
      fetchCourses(currentPage, filterText);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course. Please try again.');
    }
    
    setDialogState(prev => ({ 
      ...prev, 
      isDeleteCourseOpen: false,
      selectedCourse: null
    }));
  };

  return {
    courses,
    isLoading,
    meta,
    currentPage,
    filterText,
    isRefreshing,
    dialogState,
    formData,
    handleFilterChange,
    refreshData,
    handleAddCourse,
    handleViewCourse,
    handleEditCourse,
    handleDeleteCourse,
    goToPage,
    closeAllDialogs,
    handleCourseCreationSuccess,
    handleEditSuccess,
    confirmDelete
  };
};