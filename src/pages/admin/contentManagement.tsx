import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import CourseCreation from './CourseCreation'; // Import the CourseCreation component

const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// Define the Course interface based on your structure
interface Course {
  id: number;
  documentId: string;
  short_desc: string;
  course_outline: string;
  rating_count: number;
  language: string;
  certificate: boolean;
  quizes: number | boolean; // Handle both number and boolean
  level: string;
  short_desc_2: string;
  sort_order: number;
  short_desc_3: string;
  course_name: string;
  weekly_curriculum_intro: string;
  duration: string;
  video_url: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
  updatedBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
  localizations: any[];
}

// Define pagination metadata interface
interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Strapi response structure
interface StrapiResponse {
  data: Course[];
  meta: Meta;
}

interface CourseFormData {
  documentId?: string;
  short_desc?: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: number | boolean;
  level?: string;
  short_desc_2?: string;
  sort_order?: number;
  short_desc_3?: string;
  course_name?: string;
  weekly_curriculum_intro?: string;
  duration?: string;
  video_url?: string;
  locale?: string;
}

const ContentManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  
  // Dialog states
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    locale: 'en' // Set default locale
  });
  
  // Function to fetch courses from Strapi
  const fetchCourses = async (page = 1, filter = '') => {
    setIsLoading(true);
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      // Build query params
      let queryParams = `pagination[page]=${page}&pagination[pageSize]=10`;
      
      // Add filter if provided
      if (filter) {
        queryParams += `&filters[$or][0][course_name][$containsi]=${filter}&filters[$or][1][documentId][$containsi]=${filter}`;
      }
      
      // Fetch courses with pagination
      const response = await axios.get<StrapiResponse>(
        `${API_URL}/api/courses?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setCourses(response.data.data);
      setMeta(response.data.meta);
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchCourses(currentPage, filterText);
  }, [currentPage]);
  
  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filtering
      fetchCourses(1, filterText);
    }, 500); // Debounce for 500ms
    
    return () => clearTimeout(timer);
  }, [filterText]);
  
  const handleAddCourse = () => {
    setFormData({
      locale: 'en' // Set default locale
    });
    setIsAddCourseOpen(true);
  };
  
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      documentId: course.documentId,
      short_desc: course.short_desc,
      course_outline: course.course_outline,
      rating_count: course.rating_count,
      language: course.language,
      certificate: course.certificate,
      quizes: typeof course.quizes === 'boolean' ? course.quizes : Boolean(course.quizes),
      level: course.level,
      short_desc_2: course.short_desc_2,
      sort_order: course.sort_order,
      short_desc_3: course.short_desc_3,
      course_name: course.course_name,
      weekly_curriculum_intro: course.weekly_curriculum_intro,
      duration: course.duration,
      video_url: course.video_url,
      locale: course.locale || 'en'
    });
    setIsEditCourseOpen(true);
  };
  
  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteCourseOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value, 10)
    });
  };
  
  const saveCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prepare the data structure required by the API
      const apiData = {
        data: {
          ...formData,
          quizes: typeof formData.quizes === 'number' ? Boolean(formData.quizes) : formData.quizes
        }
      };
      
      if (isEditCourseOpen && selectedCourse) {
        // Update existing course
        await axios.put(
          `${API_URL}/api/courses/${selectedCourse.id}`,
          apiData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        toast.success('Course updated successfully!');
        setIsEditCourseOpen(false);
      }
      
      // Refresh content list
      fetchCourses(currentPage, filterText);
      
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course. Please try again.');
    }
    
    setFormData({
      locale: 'en'
    });
    setSelectedCourse(null);
  };
  
  const confirmDelete = async () => {
    if (selectedCourse) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(
          `${API_URL}/api/courses/${selectedCourse.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        toast.success('Course deleted successfully!');
        
        // Refresh the course list
        fetchCourses(currentPage, filterText);
        
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course. Please try again.');
      }
      
      setIsDeleteCourseOpen(false);
      setSelectedCourse(null);
    }
  };
  
  const goToPage = (page: number) => {
    if (meta && page >= 1 && page <= meta.pagination.pageCount) {
      setCurrentPage(page);
    }
  };
  
  // Handle successful course creation
  const handleCourseCreationSuccess = () => {
    setIsAddCourseOpen(false);
    fetchCourses(currentPage, filterText);
    toast.success('Course created successfully!');
  };
  
  // Render form fields function
  const renderFormFields = () => {
    return (
      <>
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="documentId" className="text-right text-sm font-medium">
            Document ID
          </label>
          <Input
            id="documentId"
            name="documentId"
            value={formData.documentId || ''}
            onChange={handleFormChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="course_name" className="text-right text-sm font-medium">
            Course Name
          </label>
          <Input
            id="course_name"
            name="course_name"
            value={formData.course_name || ''}
            onChange={handleFormChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4 mb-4">
          <label htmlFor="short_desc" className="text-right text-sm font-medium pt-2">
            Short Description
          </label>
          <Textarea
            id="short_desc"
            name="short_desc"
            value={formData.short_desc || ''}
            onChange={handleFormChange}
            className="col-span-3"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4 mb-4">
          <label htmlFor="course_outline" className="text-right text-sm font-medium pt-2">
            Course Outline
          </label>
          <Textarea
            id="course_outline"
            name="course_outline"
            value={formData.course_outline || ''}
            onChange={handleFormChange}
            className="col-span-3"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="rating_count" className="text-right text-sm font-medium">
            Rating Count
          </label>
          <Input
            id="rating_count"
            name="rating_count"
            type="number"
            value={formData.rating_count || ''}
            onChange={handleNumberChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="language" className="text-right text-sm font-medium">
            Language
          </label>
          <div className="col-span-3">
            <Select 
              value={formData.language || ''} 
              onValueChange={(value) => handleSelectChange('language', value)}
            >
              <SelectTrigger>
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
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label className="text-right text-sm font-medium">
            Certificate
          </label>
          <div className="col-span-3 flex items-center">
            <input
              type="checkbox"
              id="certificate"
              name="certificate"
              checked={formData.certificate || false}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="certificate" className="ml-2 block text-sm text-gray-900">
              Course provides certificate
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label className="text-right text-sm font-medium">
            Quizzes
          </label>
          <div className="col-span-3 flex items-center">
            <input
              type="checkbox"
              id="quizes"
              name="quizes"
              checked={Boolean(formData.quizes)}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="quizes" className="ml-2 block text-sm text-gray-900">
              Course includes quizzes
            </label>
            </div>
            </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="level" className="text-right text-sm font-medium">
            Level
          </label>
          <div className="col-span-3">
            <Select 
              value={formData.level || ''} 
              onValueChange={(value) => handleSelectChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4 mb-4">
          <label htmlFor="short_desc_2" className="text-right text-sm font-medium pt-2">
            Short Description 2
          </label>
          <Textarea
            id="short_desc_2"
            name="short_desc_2"
            value={formData.short_desc_2 || ''}
            onChange={handleFormChange}
            className="col-span-3"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="sort_order" className="text-right text-sm font-medium">
            Sort Order
          </label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            value={formData.sort_order || ''}
            onChange={handleNumberChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4 mb-4">
          <label htmlFor="short_desc_3" className="text-right text-sm font-medium pt-2">
            Short Description 3
          </label>
          <Textarea
            id="short_desc_3"
            name="short_desc_3"
            value={formData.short_desc_3 || ''}
            onChange={handleFormChange}
            className="col-span-3"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4 mb-4">
          <label htmlFor="weekly_curriculum_intro" className="text-right text-sm font-medium pt-2">
            Weekly Curriculum Intro
          </label>
          <Textarea
            id="weekly_curriculum_intro"
            name="weekly_curriculum_intro"
            value={formData.weekly_curriculum_intro || ''}
            onChange={handleFormChange}
            className="col-span-3"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="duration" className="text-right text-sm font-medium">
            Duration
          </label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration || ''}
            onChange={handleFormChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="video_url" className="text-right text-sm font-medium">
            Video URL
          </label>
          <Input
            id="video_url"
            name="video_url"
            value={formData.video_url || ''}
            onChange={handleFormChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label htmlFor="locale" className="text-right text-sm font-medium">
            Locale
          </label>
          <div className="col-span-3">
            <Select 
              value={formData.locale || 'en'} 
              onValueChange={(value) => handleSelectChange('locale', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
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
        </div>
        </>
    );
  };
  
  return (
    <div className="container mx-auto p-6">
      {/* Add Toaster component for notifications */}
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Course Management</h1>
          <Button 
            onClick={handleAddCourse}
            className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
          >
            Add Course
            <span className="ml-2">+</span>
          </Button>
        </div>
        
        {/* Filter bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-48">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <Input
              className="pl-10 py-2 pr-4 border rounded-md"
              placeholder="Filter By"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        
        {/* Course Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC19AD]"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.course_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.language}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.level}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.publishedAt ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.publishedAt ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Server-side Pagination */}
        {meta && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === meta.pagination.pageCount || meta.pagination.pageCount === 0}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-7b:g-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{meta.pagination.total > 0 ? (currentPage - 1) * meta.pagination.pageSize + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * meta.pagination.pageSize, meta.pagination.total)}</span> of{' '}
                  <span className="font-medium">{meta.pagination.total}</span> results
                </p>
              </div>
              <div>
                {meta.pagination.pageCount > 0 && (
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      &lt;
                    </button>
                    
                    {Array.from({ length: Math.min(5, meta.pagination.pageCount) }, (_, idx) => {
                      let pageNumber;
                      
                      if (meta.pagination.pageCount <= 5) {
                        // If we have 5 or fewer pages, show all pages
                        pageNumber = idx + 1;
                      } else if (currentPage <= 3) {
                        // If we're near the start, show pages 1-5
                        pageNumber = idx + 1;
                      } else if (currentPage >= meta.pagination.pageCount - 2) {
                        // If we're near the end, show the last 5 pages
                        pageNumber = meta.pagination.pageCount - 4 + idx;
                      } else {
                        // Otherwise show 2 before and 2 after current page
                        pageNumber = currentPage - 2 + idx;
                      }
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => goToPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? 'bg-[#AC19AD] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AC19AD]'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === meta.pagination.pageCount || meta.pagination.pageCount === 0}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      &gt;
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
        {/* Add Course Dialog - Now using CourseCreation component */}
        <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
  <DialogContent className="sm:max-w-[80vw] w-full max-h-[95vh] p-0">
    <CourseCreation 
      onClose={() => setIsAddCourseOpen(false)} 
      onSuccess={handleCourseCreationSuccess} 
    />
  </DialogContent>
</Dialog>

      {/* Edit Course Dialog - Using the original form for editing */}
      <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {renderFormFields()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCourseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCourse} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
              Save Changes
            </Button>
          </DialogFooter></DialogContent>
      </Dialog>

      {/* Delete Course Dialog */}
      <Dialog open={isDeleteCourseOpen} onOpenChange={setIsDeleteCourseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this course?
              This action cannot be undone.
            </p>
            {selectedCourse && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p><strong>Course Name:</strong> {selectedCourse.course_name}</p>
                <p><strong>Document ID:</strong> {selectedCourse.documentId}</p>
                <p><strong>ID:</strong> {selectedCourse.id}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCourseOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ContentManagement
