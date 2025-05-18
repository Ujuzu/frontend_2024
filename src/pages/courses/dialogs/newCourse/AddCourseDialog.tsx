import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Loader2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { steps } from "@/staticData/addCourseSteps";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ICourseAttributes, ICourseDialogProps } from "@/Interfaces/ICourseRespone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { courseService } from "@/service/courseService";
import TargetGroupsForm from "./TargetGroupsForm";
import InstructorsForm from "./InstructorsForm";
import WeeklyCurriculaForm from "./WeeklyCurriculaForm";
import BasicInfoForm from "./BasicInfoForm";


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
  const [formData, setFormData] = useState<ICourseAttributes>({
    locale: 'en',
    course_name: '',
    certificate: false,
    quizes: false,
    sort_order: 0,
    rating_count: 0,
    //  relationships
    courses_instructors: [],
    course_target_groups: [],
    course_learn_lists: [],
    course_qualification_equirements: [],
    courses_features: [],
    courses_weekly_curricula: [],
    courses_categories: [],
    courses_subcategories: [],
    subscription_packages: [],
  });
  const [courseId, setCourseId] = useState<number>(course_Id || 0);
const {token} = useAuth();
  // Reset form or load initial data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialData && isEdit) {
        setFormData(initialData);
      } else {
        // Reset form for new course
        setFormData({
          locale: 'en',
          course_name: '',
          certificate: false,
          quizes: false,
          sort_order: 0,
          rating_count: 0,
          courses_instructors: [],
          course_target_groups:  [] ,
          course_learn_lists:  [] ,
          course_qualification_equirements: [],
          courses_features: [],
          courses_weekly_curricula: [],
          courses_categories:[],
          courses_subcategories: [],
          subscription_packages: []
        });
      }
      setActiveStep('basic-info');
    }
  }, [isOpen, initialData, isEdit]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!formData.course_name) {
        toast.error('Course name is required');
        setActiveStep('basic-info');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        data: {
          ...formData,
          // Handle specific format requirements for relationships if needed
        }
      };

      let response;

        if (isEdit && courseId) {
            // Update existing course
            response = await courseService.updateCourse(token, courseId, JSON.stringify(payload))
        } else {
           response = await courseService.createCourse(token, payload)
        }


      if (!response) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} course`);
      }

      const result = await response.data;
      toast.success(`Course ${isEdit ? 'updated' : 'created'} successfully!`);
      setCourseId(result.data.id);
      onSuccess(result.data);
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} course. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
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
          
          <TabsContent value="basic-info">
            <BasicInfoForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="instructors">
            <InstructorsForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="media">
            <MediaForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="target-groups">
            <TargetGroupsForm courseId={courseId}/>
          </TabsContent>
          
          <TabsContent value="learn-list">
            <LearnListForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="qualifications">
            <QualificationsForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="features">
            <FeaturesForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="weekly-curricula">
            <WeeklyCurriculaForm formData={formData} setFormData={setFormData} />
          </TabsContent>
          
          <TabsContent value="packages">
            <PackagesForm formData={formData} setFormData={setFormData} />
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