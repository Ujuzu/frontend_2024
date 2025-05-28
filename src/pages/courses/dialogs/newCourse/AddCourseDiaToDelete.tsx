import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { steps } from "@/staticData/addCourseSteps";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ICourseAttributesDataPayload, ICourseDialogProps } from "@/Interfaces/ICourseRespone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { courseService } from "@/service/courseService";
import TargetGroupsForm from "./TargetGroupsForm";
import WeeklyCurriculaForm from "./weekCurriculum/WeeklyCurriculaForm";
import BasicInfoForm from "./BasicInfoForm";
import CourseInstructorsForm from "./CourseInstructorsForm";
import CourseQualificationsForm from "./courseQualificationsForm";
import {mapCourseAttributesToFormData} from "@/utils/mapCourseAttributesToFormData "


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
  const [courseData, setCourseData] = useState(() => (selectedCourse?.id && selectedCourse.attributes.course_name ? selectedCourse : null));
  const [editing, setEditing] = useState<boolean>(false)
  
  const [formData, setFormData] = useState<ICourseAttributesDataPayload>(
    mapCourseAttributesToFormData(courseData ? courseData : undefined));
const {token} = useAuth();

useEffect(() => {
  setEditing(() => !!courseId)
  if (isOpen) {
    setActiveStep("basic-info");
  }
  if (selectedCourse)
  setCourseData(selectedCourse?.id && selectedCourse.attributes ? selectedCourse : null)
}, [isOpen, selectedCourse, courseId]);

 const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!formData.course_name) {
        toast.error("Course name is required");
        setActiveStep("basic-info");
        setIsSubmitting(false);
       
        return;
      }
     const response = editing 
      ? await courseService.updateCourse(token, courseId, formData)
      : await courseService.createCourse(token, formData);

      if (!response) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} course`);
      }
const result = response.data;
       // Update state in proper sequence
    await new Promise(resolve => {
      setCourseId(result.data.id);
      setEditing(true);
      resolve(void 0);
    });
    
    // Then update form data
    setFormData(mapCourseAttributesToFormData(result.data));
    
    toast.success(`Course ${editing ? "updated" : "created"} successfully!`);
    onSuccess(result.data);
      
    //  getCourseById(result.data.id)
    //  setEditing(true)
      // handleAddCourse(result.data);
      // onSuccess(result.data);
      nextStep();

    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} course. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
  if (activeStep === "basic-info") {
    // Ensure course name exists before proceeding
    if (!formData.course_name) {
      toast.error("Course name is required before proceeding.");
      return;
    }

    try {
      setIsSubmitting(true);

     
      let response;

      if (isEdit && courseId) {
        response = await courseService.updateCourse(token, courseId, { ...formData  });
      } else {
        response = await courseService.createCourse(token, { ...formData } );
      }

      if (!response) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} course`);
      }

      const result = await response.data;

      // refreshData()
      toast.success(`Course ${isEdit ? "updated" : "created"} successfully!`);
      // Update courseId and formData with the response

      setCourseId(result.data.id);
       const attrbs = result.data;
       setCourseData(result.data)
      setFormData(mapCourseAttributesToFormData(attrbs)
        
      );

    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} course. Please try again.`);
      return; // Prevent moving to the next step if save fails
    } finally {
      setIsSubmitting(false);
    }
  }
  // Proceed to the next step only after successful save
  const currentIndex = steps.findIndex(step => step.id === activeStep);
  if (currentIndex < steps.length - 1) {
    setActiveStep(steps[currentIndex + 1].id);
  }
};
  const prevStep = () => {
     if (!courseId) {
    toast.error("Please create a course before proceeding.");
    setActiveStep("basic-info");
    return;
  }
     
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };
  console.log("courseData", courseData, "course ID : " ,courseId );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full h-full sm:w-screen sm:h-screen max-w-none max-h-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-800">
            {selectedCourse?.id && selectedCourse.attributes.course_name ? selectedCourse.attributes.course_name : 'Create New Course'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full h-full">
          <TabsList className="grid grid-cols-5 mb-6 overflow-x-auto">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id} 
                value={step.id}
                className="py-2 px-4 text-sm"
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="basic-info" className="w-full h-full">
            <BasicInfoForm formData={formData} setFormData={setFormData} courseId={courseId} courseData={courseData} />
          </TabsContent>
{/*           
          <TabsContent value="categories">
            <CategoriesForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
          
          <TabsContent value="instructors" >
            <CourseInstructorsForm formData={formData} setFormData={setFormData} courseId={courseId} courseData={courseData}/>
          </TabsContent>
          
          {/* <TabsContent value="media">
            <MediaForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
          
          <TabsContent value="target-groups">
            <TargetGroupsForm courseId={courseId} formData={formData} setFormData={setFormData} courseData={courseData}/>
          </TabsContent>
          
          {/* <TabsContent value="learn-list">
            <LearnListForm formData={formData} setFormData={setFormData} courseId={courseId}  />
          </TabsContent> */}
          
          <TabsContent value="qualifications">
            <CourseQualificationsForm formData={formData} setFormData={setFormData} courseId={courseId} courseData={courseData}/>
          </TabsContent>
          
          {/* <TabsContent value="features">
            <FeaturesForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
          
          <TabsContent value="weekly-curricula">
            <WeeklyCurriculaForm formData={formData} setFormData={setFormData} courseId={courseId} courseData={courseData}/>
          </TabsContent>
          
          {/* <TabsContent value="packages">
            <PackagesForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {isEdit ? 'Update Course' : 'Create Course'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
