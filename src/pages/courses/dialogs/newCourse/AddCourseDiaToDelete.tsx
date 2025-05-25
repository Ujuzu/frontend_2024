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


// ============================================
// 2. IMPROVED BasicInfoForm.tsx
// ============================================

// ============================================
// 2. IMPROVED BasicInfoForm.tsx
// ============================================

import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, Save, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ICourseCategoryResponse } from "@/Interfaces/ICourseCategory";
import { ICourseSubcategoryResponse } from "@/Interfaces/ICourseSubcategory";
import { courseService } from "@/service/courseService";
import { useAuth } from "@/context/AuthContext";
import CategorySelector from "../../components/AddCategories";
import { IStrapiUploadResponse } from "@/Interfaces/IStrapiFileUploader";
import StrapiFileUploader from "@/components/input/StrapiFileUploader";
import { extractExistingFiles } from "@/utils/strapiMediaToUploadResponseHelper";
import toast from "react-hot-toast";

interface BasicInfoFormProps extends IFormStepProps {
  isEditing: boolean;
  onSave: () => Promise<any>;
  refreshCourseData: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  formData, 
  setFormData, 
  courseData, 
  isEditing,
  onSave,
  refreshCourseData
}) => {
  const [categories, setCategories] = useState<ICourseCategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<ICourseSubcategoryResponse[]>([]);
  const [existingImage, setExistingImage] = useState<IStrapiUploadResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await courseService.getCourseCatergories(token) || [];
        setCategories(categoryData.data ? categoryData.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const subcategoryData = await courseService.getCourseSubCategories(token) || [];
        setSubcategories(subcategoryData.data ? subcategoryData.data : []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, [token]);

  // Update existing image when courseData changes
  useEffect(() => {
    if (courseData) {
      const files = extractExistingFiles(courseData, 'attributes.course_intro_img');
      setExistingImage(files);
    }
  }, [courseData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value ?? "",
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value) || 0,
    });
  };

  const handleThumbnailUpload = (fileData: IStrapiUploadResponse) => {
    setFormData(prev => ({
      ...prev,
      course_intro_img: fileData.id
    }));
    setExistingImage([fileData]);
  };

  const handleThumbnailDelete = () => {
    setFormData(prev => ({
      ...prev,
      course_intro_img: null
    }));
    setExistingImage([]);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    toast.error(error);
  };

  const handleSaveBasicInfo = async () => {
    setIsSaving(true);
    try {
      await onSave();
      // Refresh course data to get latest including uploaded images
      refreshCourseData();
    } catch (error) {
      console.error("Error saving basic info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full h-full">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#AC19AD]" />
          <h2 className="text-xl font-semibold">
            {courseData?.attributes?.course_name
              ? `Editing: ${courseData.attributes.course_name}`
              : "Basic Course Information"}
          </h2>
        </div>
        
        {/* Save Button for Basic Info */}
        <Button
          onClick={handleSaveBasicInfo}
          disabled={isSaving || !formData.course_name.trim()}
          className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update' : 'Save'} Basic Info
            </>
          )}
        </Button>
      </div>

      {/* Show course status */}
      {courseData && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-700">
            ✅ Course "{courseData.attributes.course_name}" is saved (ID: {courseData.id})
          </p>
        </div>
      )}

      {/* Course Name */}
      <div className="space-y-2">
        <Label htmlFor="course_name" className="text-sm font-medium">
          Course Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="course_name"
          name="course_name"
          value={formData.course_name || ""}
          onChange={handleInputChange}
          placeholder="Enter course name"
          className="w-full"
          required
        />
      </div>

      {/* Rest of your form fields remain the same... */}
      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="short_desc" className="text-sm font-medium">
          Short Description
        </Label>
        <Textarea
          id="short_desc"
          name="short_desc"
          value={formData.short_desc || ""}
          onChange={handleInputChange}
          placeholder="Brief description of the course"
          className="w-full resize-none"
          rows={3}
        />
      </div>

      {/* Course Intro Image */}
      <div className="space-y-2">
        <Label htmlFor="course_intro_img" className="text-sm font-medium">
          Course Intro Image
        </Label>
        <StrapiFileUploader
          onUploadSuccess={handleThumbnailUpload}
          onFileDelete={handleThumbnailDelete}
          onUploadError={handleUploadError}
          mediaType="image"
          multiple={false}
          maxFileSize={1}
          maximumFileCount={1}
          existingFiles={existingImage}
          placeholder="Upload course introduction image"
        />
      </div>

      {/* Category Selector */}
      <CategorySelector
        availableCategories={categories}
        availableSubcategories={subcategories}
        selectedCategories={
          Array.isArray(formData?.courses_categories)
            ? formData.courses_categories
            : []
        }
        selectedSubcategories={
          Array.isArray(formData?.courses_subcategories)
            ? formData?.courses_subcategories
            : []
        }
        setSelectedCategories={(ids) =>
          setFormData({ ...formData, courses_categories: ids })
        }
        setSelectedSubcategories={(ids) =>
          setFormData({ ...formData, courses_subcategories: ids })
        }
      />

      {/* Course Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="certificate" className="text-sm font-medium">
              Certificate
            </Label>
            <p className="text-xs text-gray-500">
              Course includes a completion certificate
            </p>
          </div>
          <Switch
            id="certificate"
            name="certificate"
            checked={!!formData.certificate}
            onCheckedChange={(checked) =>
              handleSwitchChange("certificate", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="quizes" className="text-sm font-medium">
              Quizzes
            </Label>
            <p className="text-xs text-gray-500">
              Course includes interactive quizzes
            </p>
          </div>
          <Switch
            id="quizes"
            name="quizes"
            checked={!!formData.quizes}
            onCheckedChange={(checked) => handleSwitchChange("quizes", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;