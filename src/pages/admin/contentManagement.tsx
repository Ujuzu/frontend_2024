import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Search, Eye, Edit, Trash2, RefreshCw } from "lucide-react";
// Import dialog components
import CourseCreation from './CourseCreation';
import EditCourseDialog from './dialogs/EditCourseDialog';
import DeleteCourseDialog from './dialogs/DeleteCourseDialog';
import ViewCourseDialog from './dialogs/ViewCourseDialog';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/helper/hooks/endPoints';
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
  localizations: unknown[];
  // Add additional populated fields as needed
  categories?: unknown[];
  instructors?: unknown[];
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
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dialog states
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [isViewCourseOpen, setIsViewCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const {token} = useAuth();
  // Form state
  const [, setFormData] = useState<CourseFormData>({
    locale: 'en' // Set default locale
  });
  
  // Function to fetch courses from Strapi with populate
  const fetchCourses = async (page = 1, filter = '') => {
    setIsLoading(true);
    try {
      // Get auth token from localStorage
      // const token = localStorage.getItem('token');
      
      // Build query params
      let queryParams = `pagination[page]=${page}&pagination[pageSize]=10`;
      
      // Add populate parameter to fetch related data
      queryParams += '&populate=*'; // Use populate=* to include all relations
      // For specific relations, you could use:
      // queryParams += '&populate[0]=categories&populate[1]=instructors';
      
      // Add filter if provided
      if (filter) {
        queryParams += `&filters[$or][0][course_name][$containsi]=${filter}&filters[$or][1][documentId][$containsi]=${filter}`;
      }
      
      // Fetch courses with pagination and populate
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
      setIsRefreshing(false);
    }
  };
  
  // Function to refresh the data
  const refreshData = () => {
    setIsRefreshing(true);
    fetchCourses(currentPage, filterText);
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
  
  const handleEditSuccess = () => {
    setIsEditCourseOpen(false);
    // Refresh content list
    fetchCourses(currentPage, filterText);
    toast.success('Course updated successfully!');
  }; 
  
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewCourseOpen(true);
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
      
  const confirmDelete = async () => {
    if (selectedCourse) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(
          `${API_URL}/api/courses/${selectedCourse.documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        toast.success('Course deleted successfully!');
        
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
  
  // Function to render pagination items
  const renderPaginationItems = () => {
    if (!meta || meta.pagination.pageCount <= 1) return null;
    
    const items = [];
    const maxVisiblePages = 5;
    
    // Logic for which page numbers to show
    let startPage = 1;
    let endPage = meta.pagination.pageCount;
    
    if (meta.pagination.pageCount > maxVisiblePages) {
      // Calculate start and end page
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        // Near the start
        endPage = maxVisiblePages;
      } else if (currentPage >= meta.pagination.pageCount - Math.floor(maxVisiblePages / 2)) {
        // Near the end
        startPage = meta.pagination.pageCount - maxVisiblePages + 1;
      } else {
        // Middle
        startPage = currentPage - Math.floor(maxVisiblePages / 2);
        endPage = currentPage + Math.floor(maxVisiblePages / 2);
      }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page and ellipsis if needed
    if (endPage < meta.pagination.pageCount) {
      if (endPage < meta.pagination.pageCount - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => goToPage(meta.pagination.pageCount)}>
            {meta.pagination.pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
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
        
        {/* Filter and Refresh bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                className="pl-10 py-2 pr-4 border rounded-md"
                placeholder="Filter by name or ID"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <Button 
              onClick={refreshData} 
              variant="outline"
              size="icon"
              className={`${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh data"
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Course Table using shadcn Table component */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC19AD]"></div>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.id}</TableCell>
                    <TableCell className="font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 hover:underline text-left"
                        onClick={() => handleViewCourse(course)}
                      >
                        {course.course_name}
                      </button>
                    </TableCell>
                    <TableCell>{course.language}</TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.publishedAt ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.publishedAt ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewCourse(course)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                          title="View Course"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEditCourse(course)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-900 hover:bg-amber-50"
                          title="Edit Course"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourse(course)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                          title="Delete Course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-6">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        
        {/* Pagination using shadcn Pagination component */}
        {meta && meta.pagination.pageCount > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{meta.pagination.total > 0 ? (currentPage - 1) * meta.pagination.pageSize + 1 : 0}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * meta.pagination.pageSize, meta.pagination.total)}</span> of{" "}
                <span className="font-medium">{meta.pagination.total}</span> results
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => goToPage(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => goToPage(currentPage + 1)}
                      className={currentPage === meta?.pagination.pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Course Dialog - Using CourseCreation component */}
      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DialogContent className="sm:max-w-[80vw] w-full max-h-[95vh] p-0">
          <CourseCreation 
            onClose={() => setIsAddCourseOpen(false)} 
            onSuccess={handleCourseCreationSuccess} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Course Dialog - Using the EditCourseDialog component */}
      <EditCourseDialog 
        isOpen={isEditCourseOpen}
        onClose={() => setIsEditCourseOpen(false)}
        selectedCourse={selectedCourse}
        onSave={handleEditSuccess}
      />
      
      {/* Delete Course Dialog - Using the DeleteCourseDialog component */}
      <DeleteCourseDialog 
        isOpen={isDeleteCourseOpen}
        onClose={() => setIsDeleteCourseOpen(false)}
        selectedCourse={selectedCourse}
        onConfirmDelete={confirmDelete}
      />
      
      {/* View Course Dialog - Using the ViewCourseDialog component */}
      <ViewCourseDialog 
        isOpen={isViewCourseOpen}
        onClose={() => setIsViewCourseOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};
export default ContentManagement;
