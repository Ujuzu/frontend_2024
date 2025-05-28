import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Save, Check } from "lucide-react";
import { steps } from "@/staticData/addCourseSteps";
import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { ICourseAttributesDataPayload, ICourseDialogProps, ICourseResponse } from "@/Interfaces/ICourseRespone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isLoadingCourseData, setIsLoadingCourseData] = useState(false);
  
  const [formData, setFormData] = useState<ICourseAttributesDataPayload>(() => (
    mapCourseAttributesToFormData()
  ));
  const { token } = useAuth();

  // Function to reset form to initial state for new course
  const resetFormForNewCourse = useCallback(() => {
    const emptyFormData = mapCourseAttributesToFormData(); // This should return empty/default values
    setFormData(emptyFormData);
    setCourseId(0);
    setCourseData(null);
    setIsEditing(false);
    setActiveStep('basic-info');
    setCompletedSteps(new Set());
    setIsSubmitting(false);
  }, []);

  // Function to fetch and update course data
  const fetchAndUpdateCourseData = useCallback(async (id: number) => {
    try {
      setIsLoadingCourseData(true);
      const response = await courseService.getCourseById(token, id);
      const freshCourseData = response;
      
      setCourseData(freshCourseData);
      
      // Update form data with fresh data
      setFormData(
        mapCourseAttributesToFormData(freshCourseData)
      );
      
      return freshCourseData;
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Failed to fetch latest course data");
      return null;
    } finally {
      setIsLoadingCourseData(false);
    }
  }, [token]);

  // Initialize data when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Reset form state first
      setActiveStep("basic-info");
      setCompletedSteps(new Set());
      setIsSubmitting(false);
      
      if (isEdit && selectedCourse) {
        // Editing existing course
        setCourseId(selectedCourse.id);
        setIsEditing(true);
        fetchAndUpdateCourseData(selectedCourse.id);
      } else if (course_Id) {
        // Editing course by ID
        setCourseId(course_Id);
        setIsEditing(true);
        fetchAndUpdateCourseData(course_Id);
      } else {
        // Creating new course - clear all fields
        resetFormForNewCourse();
      }
    } else {
      // Dialog is closing - reset everything for next time
      resetFormForNewCourse();
    }
  }, [isOpen, selectedCourse, course_Id, fetchAndUpdateCourseData, isEdit, resetFormForNewCourse]);

  // Additional effect to handle dialog closing
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow dialog animation to complete before clearing
      const timer = setTimeout(() => {
        resetFormForNewCourse();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, resetFormForNewCourse]);

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
      setCompletedSteps(prev => new Set([...prev, 'basic-info']));
      
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
    } else {
      setCompletedSteps(prev => new Set([...prev, activeStep]));
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

  // Handle dialog close with cleanup
  const handleDialogClose = () => {
    resetFormForNewCourse();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800">
              {courseData?.attributes?.course_name || (isEditing ? 'Edit Course' : 'Create New Course')}
            </DialogTitle>
            {/* Status indicator - only show for editing mode */}
            {isEditing && courseId && (
              <div className="mt-2">
                {isLoadingCourseData ? (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Loading course data...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check size={14} />
                    <span>Course ID: {courseId} - Editing Mode</span>
                  </div>
                )}
              </div>
            )}
          </DialogHeader>
        </div>
        
        <div className="flex flex-col flex-1 min-h-0 px-6">
          <Tabs value={activeStep} onValueChange={setActiveStep} className="flex flex-col flex-1 min-h-0">
            {/* Fixed Tab List */}
            <div className="flex-shrink-0 mb-6 mt-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                {steps.map((step, index) => {
                  const isActive = step.id === activeStep;
                  const isCompleted = completedSteps.has(step.id);
                  const isDisabled = step.id !== "basic-info" && !courseId && !isCompleted;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => !isDisabled && setActiveStep(step.id)}
                      disabled={isDisabled}
                      className={`
                        relative flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-0 flex-shrink-0 cursor-pointer
                        ${isActive 
                          ? 'bg-white text-[#AC19AD] shadow-sm border border-[#AC19AD]/20' 
                          : isCompleted
                          ? 'bg-purple-50 text-[#AC19AD] hover:bg-purple-100'
                          : isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }
                      `}
                    >
                      {/* Step Number/Icon */}
                      <div className={`
                        flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 flex-shrink-0
                        ${isActive 
                          ? 'bg-[#AC19AD] text-white' 
                          : isCompleted
                          ? 'bg-[#AC19AD] text-white'
                          : 'bg-gray-300 text-gray-600'
                        }
                      `}>
                        {isCompleted ? (
                          <Check size={12} />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <span className="truncate">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TabsContent value="basic-info" className="mt-0 h-full">
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
              
              <TabsContent value="instructors" className="mt-0 h-full">
                <CourseInstructorsForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  courseId={courseId} 
                  courseData={courseData}
                />
              </TabsContent>
              
              <TabsContent value="target-groups" className="mt-0 h-full">
                <TargetGroupsForm 
                  courseId={courseId} 
                  formData={formData} 
                  setFormData={setFormData} 
                  courseData={courseData}
                />
              </TabsContent>
              
              <TabsContent value="qualifications" className="mt-0 h-full">
                <CourseQualificationsForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  courseId={courseId} 
                  courseData={courseData}
                />
              </TabsContent>
              
              <TabsContent value="weekly-curricula" className="mt-0 h-full">
                <WeeklyCurriculaForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  courseId={courseId} 
                  courseData={courseData}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Fixed Footer */}
        <div className="flex-shrink-0 flex justify-between mt-6 pt-4 px-6 pb-6 border-t border-gray-200 bg-white">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 'basic-info'}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="border-gray-300 text-gray-700 cursor-pointer"
            >
              Cancel
            </Button>
            
            {activeStep === steps[steps.length - 1].id ? (
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !courseId}
                className="bg-[#AC19AD] hover:bg-[#8A1489] text-white cursor-pointer"
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
                className="bg-[#AC19AD] hover:bg-[#8A1489] text-white cursor-pointer"
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
