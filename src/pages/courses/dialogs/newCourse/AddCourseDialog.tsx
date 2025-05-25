
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { steps } from "@/staticData/addCourseSteps";
import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { ICourseAttributesDataPayload, ICourseDialogProps, ICourseResponse } from "@/Interfaces/ICourseRespone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { courseService } from "@/service/courseService";
import TargetGroupsForm from "./TargetGroupsForm";
import WeeklyCurriculaForm from "./weekCurriculum/WeeklyCurriculaForm";
import BasicInfoForm from "./BasicInfoForm";
import CourseInstructorsForm from "./CourseInstructorsForm";
import CourseQualificationsForm from "./courseQualificationsForm";
import { mapCourseAttributesToFormData } from "@/utils/mapCourseAttributesToFormData ";

const AddCourseDialog: React.FC<ICourseDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedCourse,
  isEdit,
  course_Id,
}) => {
  const [activeStep, setActiveStep] = useState('basic-info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseId, setCourseId] = useState<number>(course_Id || 0);
  const [courseData, setCourseData] = useState<ICourseResponse | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<ICourseAttributesDataPayload>(() => (
  mapCourseAttributesToFormData()
  ));
console.log("is in edit mode? :" , isEdit, "Selected course :", selectedCourse)
  const { token } = useAuth();

  // Function to fetch and update course data
  const fetchAndUpdateCourseData = useCallback(async (id: number) => {
    try {
      const response = await courseService.getCourseById(token, id);
    const freshCourseData = response;
      
      setCourseData(freshCourseData);
      
      // Update form data with fresh data
      // const attrs = freshCourseData.attributes;
      setFormData(
       mapCourseAttributesToFormData(freshCourseData)
      );
      
      return freshCourseData;
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Failed to fetch latest course data");
      return null;
    }
  }, [token]);

  // Initialize data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep("basic-info");
      
      if (isEdit && selectedCourse) {
        console.log('we have data')
        // Editing existing course
        setCourseId(selectedCourse.id);
        setIsEditing(true);
        fetchAndUpdateCourseData(selectedCourse.id);
      } else if (course_Id) {
        // Editing with course ID
        console.log('we have fresh data')
        setCourseId(course_Id);
        setIsEditing(true);
        fetchAndUpdateCourseData(course_Id);
      } else {
        // Creating new course
        setCourseId(0);
        setIsEditing(false);
        setCourseData(null);
      }
    }
  }, [isOpen, selectedCourse, course_Id, fetchAndUpdateCourseData, isEdit]);

  // Save basic info and create/update course
  const saveBasicInfo = async (): Promise<ICourseResponse | null> => {
    if (!formData.course_name.trim()) {
      toast.error("Course name is required");
      return null;
    }

    try {
      setIsSubmitting(true);
      
      let response;
      if (isEditing && courseId) {
        response = await courseService.updateCourse(token, courseId, formData);
        toast.success("Course updated successfully!");
      } else {
        response = await courseService.createCourse(token, formData);
        toast.success("Course created successfully!");
      }

      const result = response.data;
      
      // Update local state
      setCourseId(result.data.id);
      setIsEditing(true);
      
      // Fetch fresh data to ensure we have the latest
      const freshData = await fetchAndUpdateCourseData(result.data.id);
      
      return freshData;
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} course`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Always save basic info when moving from basic-info step
    if (activeStep === "basic-info") {
      const savedCourse = await saveBasicInfo();
      if (!savedCourse) {
        return; // Don't proceed if save failed
      }
    }

    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (!courseId && activeStep !== "basic-info") {
      toast.error("Please create a course before proceeding.");
      setActiveStep("basic-info");
      return;
    }
    
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!isEditing || !courseId) {
        toast.error("Please save basic information first");
        setActiveStep("basic-info");
        return;
      }

      // Final update with all form data
      await courseService.updateCourse(token, courseId, formData);
      toast.success("Course completed successfully!");
      
      onSuccess(courseData!);
      onClose();
    } catch (error) {
      console.error("Error completing course:", error);
      toast.error("Failed to complete course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to refresh course data (can be called from child components)
  const refreshCourseData = useCallback(() => {
    if (courseId) {
      fetchAndUpdateCourseData(courseId);
    }
  }, [courseId, fetchAndUpdateCourseData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full h-full sm:w-screen sm:h-screen max-w-none max-h-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-800">
            {courseData?.attributes?.course_name || (isEditing ? 'Edit Course' : 'Create New Course')}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full h-full">
          <TabsList className="grid grid-cols-5 mb-6 overflow-x-auto">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id} 
                value={step.id}
                className="py-2 px-4 text-sm"
                disabled={step.id !== "basic-info" && !courseId}
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="basic-info" className="w-full h-full">
            <BasicInfoForm 
              formData={formData} 
              setFormData={setFormData} 
              courseId={courseId} 
              courseData={courseData}
              isEditing={isEditing}
              onSave={saveBasicInfo}
              refreshCourseData={refreshCourseData}
            />
          </TabsContent>
          
          <TabsContent value="instructors">
            <CourseInstructorsForm 
              formData={formData} 
              setFormData={setFormData} 
              courseId={courseId} 
                            courseData={courseData}
            />
          </TabsContent>
          
          <TabsContent value="target-groups">
            <TargetGroupsForm 
              courseId={courseId} 
              formData={formData} 
              setFormData={setFormData} 
              courseData={courseData}
            />
          </TabsContent>
          
          <TabsContent value="qualifications">
            <CourseQualificationsForm 
              formData={formData} 
              setFormData={setFormData} 
              courseId={courseId} 
              courseData={courseData}
            />
          </TabsContent>
          
          <TabsContent value="weekly-curricula">
            <WeeklyCurriculaForm 
              formData={formData} 
              setFormData={setFormData} 
              courseId={courseId} 
              courseData={courseData}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 'basic-info'}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            
            {activeStep === steps[steps.length - 1].id ? (
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !courseId}
                className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Complete Course
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={isSubmitting}
                className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;