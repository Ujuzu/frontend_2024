import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Loader2, Users, UserCheck } from "lucide-react";
import { courseInstructorService } from "@/service/courseInstructorsService";
import { ICoursesInstructorAttributes, ICoursesInstructorResponse } from "@/Interfaces/ICourseInstructor";
import InstructorFormModal from "../../components/InstructorFormModal";

const CourseInstructorsForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [instructors, setInstructors] = useState<ICoursesInstructorResponse[]>([]);
  const [courseInstructors, setCourseInstructors] = useState<ICoursesInstructorResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingInstructor, setAddingInstructor] = useState<number | null>(null);
  const [removingInstructor, setRemovingInstructor] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch global instructors and course-specific instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      if (!token || !courseId) return;
      
      try {
        setInitialLoading(true);
        const [allInstructorsResponse, courseInstructorsResponse] = await Promise.all([
          courseInstructorService.getInstructors(token),
          courseInstructorService.getCourseInstructors(token, courseId)
        ]);
        
        setInstructors(allInstructorsResponse.data);
        setCourseInstructors(courseInstructorsResponse.data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        toast.error("Failed to load instructors.");
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchInstructors();
  }, [token, courseId]);

  const filteredInstructors = instructors
    .filter(instructor =>
      instructor.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !courseInstructors.some(courseInstructor => courseInstructor.id === instructor.id)
    )
    .slice(0, 5); 

  // Simulate search loading when typing
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchLoading(true);
      const timer = setTimeout(() => setSearchLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  // Handle selection of instructors for the course
  const handleSelectInstructor = async (id: number, instructorDocId: string) => {
    if (courseInstructors.some((instructor) => instructor.id === id)) return;
    
    try {
      setAddingInstructor(id);
      const selectedInstructor = instructors.find((instructor) => instructor.id === id)!;
      setCourseInstructors([...courseInstructors, selectedInstructor]);
      
      await courseInstructorService.linkInstructorToCourse(token, courseId, instructorDocId);
      toast.success("Instructor added successfully!");
    } catch (error) {
      console.error("Error linking instructor:", error);
      setCourseInstructors(courseInstructors.filter(instructor => instructor.id !== id));
      toast.error("Failed to link instructor to course.");
    } finally {
      setAddingInstructor(null);
    }
  };

  // Handle creating a new instructor and linking them to the course
  const handleAddNewInstructor = async (newInstructorData: ICoursesInstructorAttributes) => {
    if (!newInstructorData.instructor_name.trim() || !token || !courseId) {
      toast.error("Instructor name, Course ID and token are required to add an instructor.");
      return;
    }
    
    try {
      setLoading(true);
      const payload = { ...newInstructorData, courses: [courseId] };
      const response = await courseInstructorService.createInstructor(token, payload);
      
      setInstructors([...instructors, response]);
      setCourseInstructors([...courseInstructors, response]);
      toast.success("Instructor added successfully!");
    } catch (error) {
      console.error("Error creating instructor:", error);
      toast.error("Failed to add instructor.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing an instructor from the course
  const handleRemoveInstructor = async (id: number, instructorDocId: string) => {
    try {
      setRemovingInstructor(id);
      await courseInstructorService.unlinkInstructorFromCourse(token, courseId, instructorDocId);
      setCourseInstructors(courseInstructors.filter((instructor) => instructor.id !== id));
      toast.success("Instructor removed successfully!");
    } catch (error) {
      console.error("Error unlinking instructor:", error);
      toast.error("Failed to unlink instructor.");
    } finally {
      setRemovingInstructor(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Course Instructors</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-gray-600 font-medium">Loading instructors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Course Instructors</h2>
      </div>

      {/* Current Instructors */}
      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Instructors Linked to This Course:</Label>
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3 max-h-60 overflow-y-auto">
          {courseInstructors.length > 0 ? (
            courseInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="flex justify-between items-start gap-4 border border-gray-200 p-4 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm break-words max-w-[70%] text-gray-900 font-medium">
                    {instructor.instructor_name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveInstructor(instructor.id, instructor.documentId)}
                  className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  disabled={removingInstructor === instructor.id}
                >
                  {removingInstructor === instructor.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No instructors linked yet.</p>
              <p className="text-xs text-gray-500 mt-1">Search and add instructors below</p>
            </div>
          )}
        </div>
      </div>

      {/* Search and Select */}
      <div className="space-y-3">
        <Label htmlFor="instructor-search" className="text-gray-700 font-medium">
          Available Instructors
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="instructor-search"
            type="text"
            placeholder="Search instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg bg-white">
          {searchLoading ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <p className="text-sm text-gray-600">Loading instructors...</p>
              </div>
            </div>
          ) : filteredInstructors.length > 0 ? (
            <div className="p-2 space-y-2">
              {filteredInstructors.map((instructor) => (
                <Button
                  key={instructor.id}
                  onClick={() => handleSelectInstructor(instructor.id, instructor.documentId)}
                  variant="ghost"
                  className="w-full text-left justify-start p-3 hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 border border-transparent hover:border-purple-200 rounded-md"
                  title={instructor.instructor_name}
                  disabled={addingInstructor === instructor.id}
                >
                  {addingInstructor === instructor.id ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-purple-600">Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="truncate text-gray-700">{instructor.instructor_name}</span>
                    </div>
                  )}
                </Button>
              ))}
              {instructors.filter(instructor => 
                instructor.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !courseInstructors.some(courseInstructor => courseInstructor.id === instructor.id)
              ).length > 5 && (
                <div className="p-2 text-center text-xs text-gray-500 border-t">
                  Showing first 5 results. Use search to find more specific instructors.
                </div>
              )}
            </div>
          ) : instructors.length === 0 ? (
            <div className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No instructors available</p>
              <p className="text-xs text-gray-500 mt-1">Create a new instructor using the button below</p>
            </div>
          ) : courseInstructors.length === instructors.length ? (
            <div className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">All instructors are already linked</p>
              <p className="text-xs text-gray-500 mt-1">Create a new instructor using the button below</p>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No instructors match your search
            </div>
          )}
        </div>
      </div>

      {/* Add New Instructor */}
      <div className="border-t border-gray-200 pt-6">
        <InstructorFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleAddNewInstructor} 
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add New Instructor</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseInstructorsForm;
