import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Info,
  ListTodo,
  ImagePlus,
  Save
} from 'lucide-react';
import { CourseFormData, CurriculumItem } from './types';
import BasicInfoForm from './BasicInfoForm';
import CurriculumForm from './CurriculumForm';
import UploadsForm from './UploadsForm';
import ReviewForm from './ReviewForm';

// Define CourseCreationProps interface
interface CourseCreationProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CourseCreation: React.FC<CourseCreationProps> = ({ onClose, onSuccess }) => {
  // Step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Form Data
  const [formData, setFormData] = useState<CourseFormData>({
    locale: 'en',
    certificate: false,
    quizes: false,
    level: 'beginner'
  });
  
  // Curriculum items
  const [curriculumItems, setCurriculumItems] = useState<CurriculumItem[]>([
    { title: '', description: '', order: 1 }
  ]);
  
  // File Upload
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [courseMaterials, setCourseMaterials] = useState<File[]>([]);
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Calculate progress percentage based on current step
  const progressPercentage = ((currentStep - 1) / 3) * 100;
  
  // Validate current step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Basic info validation
        if (!formData.course_name || !formData.documentId) {
          return false;
        }
        return true;
      case 2:
        // Curriculum validation
        if (curriculumItems.length === 0 || !curriculumItems.some(item => item.title.trim() !== '')) {
          return false;
        }
        return true;
      case 3:
        // Uploads validation - optional but we could require image
        if (!courseImage) {
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  
  // Navigation between steps
  const nextStep = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Submit the course
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Submission logic would go here
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error creating course:', error);
      setIsSubmitting(false);
    }
  };
  
  // Define step icons
  const stepIcons = [
    <Info key="info" className="h-4 w-4" />,
    <ListTodo key="curriculum" className="h-4 w-4" />,
    <ImagePlus key="uploads" className="h-4 w-4" />,
    <Save key="publish" className="h-4 w-4" />
  ];
  
  const stepTitles = ['Basic Info', 'Curriculum', 'Uploads', 'Publish'];
  
  // Check if a step is completed
  const isStepCompleted = (stepNumber: number): boolean => {
    return stepNumber < currentStep;
  };
  
  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoForm formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <CurriculumForm 
            formData={formData} 
            setFormData={setFormData} 
            curriculumItems={curriculumItems} 
            setCurriculumItems={setCurriculumItems} 
          />
        );
      case 3:
        return (
          <UploadsForm 
            formData={formData} 
            setFormData={setFormData} 
            courseImage={courseImage} 
            setCourseImage={setCourseImage} 
            courseMaterials={courseMaterials} 
            setCourseMaterials={setCourseMaterials} 
          />
        );
      case 4:
        return (
          <ReviewForm 
            formData={formData}
            setFormData={setFormData}
            curriculumItems={curriculumItems} 
            courseImage={courseImage} 
            courseMaterials={courseMaterials} 
          />
        );
      default:
        return <BasicInfoForm formData={formData} setFormData={setFormData} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full h-[90vh] flex flex-col">
      {/* Header */}
      <div className="border-b px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to create a new course</p>
      </div>
      
      {/* Steps Indicator with Progress bar */}
      <div className="px-8 py-5 border-b bg-gray-50">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center relative">
            {/* Progress bar container - positioned behind the steps */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            
            {/* Active progress overlay */}
            <div 
              className="absolute top-5 left-0 h-1 bg-[#AC19AD] z-0 transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            
            {/* Step indicators */}
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = isStepCompleted(stepNumber);
              
              return (
                <div key={step} className="flex flex-col items-center z-10">
                  <div 
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full 
                      transition-all duration-300 ease-in-out
                      ${isCompleted 
                        ? 'bg-[#AC19AD] text-white shadow-md' 
                        : isActive 
                          ? 'bg-white text-[#AC19AD] border-2 border-[#AC19AD] shadow-md' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : stepIcons[index]}
                  </div>
                  
                  <span 
                    className={`
                      mt-2 text-sm font-medium
                      ${isActive 
                        ? 'text-[#AC19AD]' 
                        : isCompleted 
                          ? 'text-gray-700' 
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto w-full">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="border-t px-8 py-5 bg-white shadow-inner">
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="flex items-center gap-1 px-5 py-2 transition-all"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-300 px-5 py-2 hover:bg-gray-50 transition-all"
            >
              Cancel
            </Button>
            
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-[#AC19AD] hover:bg-[#AC19AD]/90 focus:ring-2 focus:ring-[#AC19AD]/40 text-white flex items-center gap-1 px-6 py-2 transition-all shadow-sm"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#AC19AD] hover:bg-[#AC19AD]/90 focus:ring-2 focus:ring-[#AC19AD]/40 text-white flex items-center gap-2 px-6 py-2 transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Publish Course
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;
