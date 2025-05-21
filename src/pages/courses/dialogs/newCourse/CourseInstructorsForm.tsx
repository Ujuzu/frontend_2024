import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { courseInstructorService } from "@/service/courseInstructorsService";
import { ICoursesInstructorAttributes, ICoursesInstructorResponse } from "@/Interfaces/ICourseInstructor";
import InstructorFormModal from "../../components/InstructorFormModal";

const CourseInstructorsForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [instructors, setInstructors] = useState<ICoursesInstructorResponse[]>([]);
  const [courseInstructors, setCourseInstructors] = useState<ICoursesInstructorResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Fetch global instructors and course-specific instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      if (!token || !courseId) return;
      try {
        const allInstructorsResponse = await courseInstructorService.getInstructors(token) || [];
        const courseInstructorsResponse = await courseInstructorService.getCourseInstructors(token, courseId) || [];

        setInstructors(allInstructorsResponse.data); // All available instructors
        setCourseInstructors(courseInstructorsResponse.data); // Instructors linked to this course
      } catch (error) {
        console.error("Error fetching instructors:", error);
        toast.error("Failed to load instructors.");
      }
    };
    fetchInstructors();
  }, [token, courseId]);

const filteredInstructors = instructors
  .filter(instructor =>
    instructor.attributes.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !courseInstructors.some(courseInstructor => courseInstructor.id === instructor.id) // Exclude already linked instructors
  )
  .slice(0, 5); 

  // Handle selection of instructors for the course
  const handleSelectInstructor = (id: number) => {
    if (!courseInstructors.some((instructor) => instructor.id === id)) {
      setCourseInstructors([...courseInstructors, instructors.find((instructor) => instructor.id === id)!]);

      // Send request to add selected instructor to the course
      courseInstructorService.linkInstructorToCourse(token, courseId, id)
        .then(() => toast.success("Instructor added successfully!"))
        .catch((error: unknown) => {
          console.error("Error linking instructor:", error);
          toast.error("Failed to link instructor to course.");
        });
    }
  };

  // Handle creating a new instructor and linking them to the course
 const handleAddNewInstructor = async (newInstructorData: ICoursesInstructorAttributes) => {
  if (!newInstructorData.instructor_name.trim() || !token || !courseId) {
    toast.error("instructor name, Course ID and token are required to add an instructor.");
    return;
  }

  try {
    setLoading(true);
    const payload = { ...newInstructorData, courses: [courseId] };
    const response = await courseInstructorService.createInstructor(token, payload);
    console.log("Instructor created:", response);
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
  const handleRemoveInstructor = async (id: number) => {
    try {
      await courseInstructorService.unlinkInstructorFromCourse(token, courseId, id);
      setCourseInstructors(courseInstructors.filter((instructor) => instructor.id !== id));
      toast.success("Instructor removed successfully!");
    } catch (error) {
      console.error("Error unlinking instructor:", error);
      toast.error("Failed to unlink instructor.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Course Instructors</h2>

      {/* Show already linked instructors */}
      <div className="space-y-2">
        <Label>Instructors Linked to This Course:</Label>
        <div className="border rounded-md p-2 bg-gray-100 space-y-2 max-h-60 overflow-y-auto">
          {courseInstructors.length > 0 ? (
            courseInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="flex justify-between items-start gap-4 border p-3 rounded bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-sm break-words max-w-[70%]">
                  {instructor.attributes.instructor_name}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveInstructor(instructor.id)}
                  className="shrink-0 cursor-pointer hover:bg-red-100 transition"
                >
                  <X />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No instructors linked yet.</p>
          )}
        </div>
      </div>

      {/* Search and select */}
      <div className="space-y-2">
        <Label htmlFor="instructor-search">Search Instructors</Label>
        <Input
          id="instructor-search"
          type="text"
          placeholder="Search instructors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="max-h-40 overflow-y-auto border p-2 rounded space-y-2">
          {filteredInstructors.map((instructor) => (
            <Button
              key={instructor.id}
              onClick={() => handleSelectInstructor(instructor.id)}
              className="w-full text-left truncate hover:bg-gray-100 hover:text-black cursor-pointer transition"
              title={instructor.attributes.instructor_name}
            >
              {instructor.attributes.instructor_name}
            </Button>
          ))}
        </div>
      </div>

      {/* Add new instructor */}
      <div className="space-y-2">

        <InstructorFormModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  onSuccess={handleAddNewInstructor} 
/>

<Button
  onClick={() => setIsModalOpen(true)}
  className="bg-[#AC19AD] hover:bg-[#8A1489] text-white transition"
  disabled={loading} 
>
  {loading ? "Adding..." : "Add Instructor"}
</Button>
      </div>
    </div>
  );
};

export default CourseInstructorsForm;