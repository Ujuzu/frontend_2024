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
import { unwrapRelation } from "@/service/relationUnwrapper";
import CourseInstructorsForm from "./CourseInstructorsForm";
import CourseQualificationsForm from "./courseQualificationsForm";


const AddCourseDialog: React.FC<ICourseDialogProps> = ({
   isOpen,
   onClose,
   onSuccess,
   initialData,
   isEdit = false,
   course_Id,
}) => {

  const [activeStep, setActiveStep] = useState('basic-info');
  const [isSubmitting, setIsSubmitting] = useState(false);
const [formData, setFormData] = useState<ICourseAttributesDataPayload>(() => {
  const attrbs = initialData?.attributes;
  return attrbs && isEdit 
    ? {
    // 🔹 Non-array fields first
    course_name: attrbs.course_name,
    short_desc: attrbs.short_desc,
    short_desc_2: attrbs.short_desc_2,
    short_desc_3: attrbs.short_desc_3,
    course_outline: attrbs.course_outline,
    rating_count: attrbs.rating_count,
    language: attrbs.language,
    certificate: attrbs.certificate,
    level: attrbs.level,
    sort_order: attrbs.sort_order,
    weekly_curriculum_intro: attrbs.weekly_curriculum_intro,
    duration: attrbs.duration,
    video_url: attrbs.video_url,
    locale: attrbs.locale || "en",

    // boolean fields
    
     quizes: !!attrbs.quizes,
    // 🔹 Relational array fields last (processed using `unwrapRelation`)
    courses_instructors: unwrapRelation(attrbs.courses_instructors),
    course_target_groups: unwrapRelation(attrbs.course_target_groups),
    course_learn_lists: unwrapRelation(attrbs.course_learn_lists),
    course_qualification_equirements: unwrapRelation(attrbs.course_qualification_equirements),
    courses_features: unwrapRelation(attrbs.courses_features),
    courses_weekly_curricula: unwrapRelation(attrbs.courses_weekly_curricula),
    courses_categories: unwrapRelation(attrbs.courses_categories),
    courses_subcategories: unwrapRelation(attrbs.courses_subcategories),
    subscription_packages: unwrapRelation(attrbs.subscription_packages),
    }

    : { 
        locale: "en",
        course_name: "",
        certificate: false,
        quizes: false,
        sort_order: 0,
        rating_count: 0,
        courses_instructors: [],
        course_target_groups: [],
        course_learn_lists: [],
        course_qualification_equirements: [],
        courses_features: [],
        courses_weekly_curricula: [],
        courses_categories: [],
        courses_subcategories: [],
        subscription_packages: [],
      };
});
  const [courseId, setCourseId] = useState<number>(course_Id || 0);
const {token} = useAuth();

useEffect(() => {
  if (isOpen) {
    setActiveStep("basic-info");
  }
}, [isOpen, initialData, isEdit, courseId, token, formData]);

 const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!formData.course_name) {
        toast.error("Course name is required");
        setActiveStep("basic-info");
        setIsSubmitting(false);
        return;
      }

      // const payload = { data: { ...formData } };
      let response;

      if (isEdit && courseId) {
        response = await courseService.updateCourse(token, courseId, { ...formData });
      } else {
        response = await courseService.createCourse(token, { ...formData });
      }

      if (!response) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} course`);
      }

      const result = await response.data;
      toast.success(`Course ${isEdit ? "updated" : "created"} successfully!`);
      setCourseId(result.data.id);
      setFormData(result.data.attributes); // Update form data
      onSuccess(result.data);

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
      toast.success(`Course ${isEdit ? "updated" : "created"} successfully!`);
      // Update courseId and formData with the response

      setCourseId(result.data.id);
       const attrbs = result.data.attributes;
      setFormData({
        // 🔹 Non-array fields first
        ... attrbs,

    // boolean fields
    quizes: !!attrbs.quizes,

    // 🔹 Relational array fields last (processed using `unwrapRelation`)
    courses_instructors: unwrapRelation(attrbs.courses_instructors),
    course_target_groups: unwrapRelation(attrbs.course_target_groups),
    course_learn_lists: unwrapRelation(attrbs.course_learn_lists),
    course_qualification_equirements: unwrapRelation(attrbs.course_qualification_equirements),
    courses_features: unwrapRelation(attrbs.courses_features),
    courses_weekly_curricula: unwrapRelation(attrbs.courses_weekly_curricula),
    courses_categories: unwrapRelation(attrbs.courses_categories),
    courses_subcategories: unwrapRelation(attrbs.courses_subcategories),
    subscription_packages: unwrapRelation(attrbs.subscription_packages),
      }
        
      );

    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} course. Please try again.`);
      return; // Prevent moving to the next step if save fails
    } finally {
      setIsSubmitting(false);
    }
  }

  // 🔥 Proceed to the next step only after successful save
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full h-full sm:w-screen sm:h-screen max-w-none max-h-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Course' : 'Create New Course'}
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
            <BasicInfoForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent>
{/*           
          <TabsContent value="categories">
            <CategoriesForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
          
          <TabsContent value="instructors" >
            <CourseInstructorsForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent>
          
          {/* <TabsContent value="media">
            <MediaForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
          
          <TabsContent value="target-groups">
            <TargetGroupsForm courseId={courseId} formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          {/* <TabsContent value="learn-list">
            <LearnListForm formData={formData} setFormData={setFormData} courseId={courseId}  />
          </TabsContent> */}
          
          <TabsContent value="qualifications">
            <CourseQualificationsForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent>
          
          {/* <TabsContent value="features">
            <FeaturesForm formData={formData} setFormData={setFormData} courseId={courseId} />
          </TabsContent> */}
          
          <TabsContent value="weekly-curricula">
            <WeeklyCurriculaForm formData={formData} setFormData={setFormData} courseId={courseId} />
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