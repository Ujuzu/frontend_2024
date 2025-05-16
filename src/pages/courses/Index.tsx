import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/hooks/useCourse";
import { RefreshCw, Search } from "lucide-react";
import { Toaster } from "react-hot-toast";
import CourseTable from "./components/CourseTable";
import CoursePagination from "./components/CoursePagination";
import { CourseDialogs } from "./components/CourseDialogs";

const CoursesIndex = () => {
      const {
    courses,
    isLoading,
    meta,
    currentPage,
    filterText,
    isRefreshing,
    dialogState,
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
  } = useCourse();
  return (
 <div className="container mx-auto p-6">
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
                onChange={(e) => handleFilterChange(e.target.value)}
              />
            </div>
            <Button 
              onClick={refreshData} 
              variant="outline"
              size="icon"
              className={isRefreshing ? 'animate-spin' : ''}
              title="Refresh data"
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Course Table */}
        <CourseTable 
          courses={courses}
          isLoading={isLoading}
          onView={handleViewCourse}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
        
        {/* Pagination */}
        <CoursePagination 
          meta={meta}
          currentPage={currentPage}
          goToPage={goToPage}
        />
      </div>
      
      {/* All dialogs in one component */}
      <CourseDialogs 
        dialogState={dialogState}
        onClose={closeAllDialogs}
        onSuccess={handleCourseCreationSuccess}
        onEditSuccess={handleEditSuccess}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}
export default CoursesIndex;