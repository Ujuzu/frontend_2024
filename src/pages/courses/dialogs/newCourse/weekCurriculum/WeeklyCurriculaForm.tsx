import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, BookOpen, Calendar, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { courseWeeklyCurriculumService } from "@/service/courseWeeklyCurriculumService";
import { ICoursesWklyCurriculumAttrib, IWeeklyCurriculumResponse } from "@/Interfaces/IWeeklyCurriculum";
import CurriculumLessonsForm from "./CurriculumLessonsForm";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import useFetchWeeklyCurricula from "@/hooks/useFetchWeeklyCurricula";

const WeeklyCurriculumForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  
  const { weeklyCurricula, loading, error, refreshWeeklyCurricula } = useFetchWeeklyCurricula(token, courseId);
  
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [curriculumFormData, setCurriculumFormData] = useState<ICoursesWklyCurriculumAttrib>({
    curriculum_title: "", 
    curriculum_desc: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [openLessonsModal, setOpenLessonsModal] = useState(false);
  const [currentCurriculum, setCurrentCurriculum] = useState<IWeeklyCurriculumResponse>({} as IWeeklyCurriculumResponse);

  const handleOpenCurriculumModal = (index?: number) => {
    if (index !== undefined) {
      setEditingCurriculumIndex(index);
      const attributes = weeklyCurricula[index].attributes;
      setCurriculumFormData({
        ...attributes,
        intro_pic: attributes.intro_pic?.data?.id ? attributes.intro_pic?.data?.id : undefined,
      });
    } else {
      setEditingCurriculumIndex(null);
      setCurriculumFormData({ curriculum_title: "", curriculum_desc: "" });
    }
    setIsCurriculumModalOpen(true);
  };

  const handleSubmitCurriculum = async () => {
    if (!curriculumFormData.curriculum_title.trim()) {
      toast.error("Please enter a curriculum name.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = { ...curriculumFormData, courses: [courseId] };
      let savedCurriculum;
      
      if (editingCurriculumIndex !== null) {
        const updated = await courseWeeklyCurriculumService.updateWeeklyCurriculum(
          token,
          weeklyCurricula[editingCurriculumIndex].id,
          payload
        );
        savedCurriculum = updated.data;
      } else {
        const created = await courseWeeklyCurriculumService.createWeeklyCurriculum(token, payload);
        savedCurriculum = created;
      }
      
      toast.success(`Curriculum ${editingCurriculumIndex !== null ? 'updated' : 'created'} successfully!`);
      setIsCurriculumModalOpen(false);
      
      await refreshWeeklyCurricula();
      
      const refreshedCurriculum = weeklyCurricula.find(curriculum => 
        curriculum.id === (savedCurriculum.id || savedCurriculum.data?.id)
      );
      
      if (refreshedCurriculum) {
        setCurrentCurriculum(refreshedCurriculum);
        setOpenLessonsModal(true);
      } else {
        setCurrentCurriculum(savedCurriculum.data || savedCurriculum);
        setOpenLessonsModal(true);
      }
      
    } catch (error) {
      console.error("Error saving curriculum:", error);
      toast.error("Failed to save curriculum.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLessonsModal = (curriculum: IWeeklyCurriculumResponse) => {
    setCurrentCurriculum(curriculum);
    setOpenLessonsModal(true);
  };

  if (loading && weeklyCurricula.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading curricula...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Curricula</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={refreshWeeklyCurricula}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-purple-600">Weekly Curriculum</h2>
      </div>

      {/* Curricula List */}
      <div className="space-y-4">
        {Array.isArray(weeklyCurricula) && weeklyCurricula.length > 0 ? (
          weeklyCurricula.map((curriculum, index) => (
            <div 
              key={curriculum.id} 
              className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleOpenLessonsModal(curriculum)}
                >
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Week {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors">
                      {curriculum?.attributes?.curriculum_title}
                    </h3>
                    {curriculum?.attributes?.curriculum_desc && (
                      <p className="text-sm text-gray-600 mt-1">
                        {curriculum.attributes.curriculum_desc}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleOpenLessonsModal(curriculum)}
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  >
                    View Lessons
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    onClick={() => handleOpenCurriculumModal(weeklyCurricula.findIndex(c => c.id === curriculum.id))}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Curricula Yet</h3>
            <p className="text-gray-500 mb-6">Start building your course by creating your first weekly curriculum.</p>
          </div>
        )}
      </div>

      {/* Add Curriculum Button */}
      <Button 
        onClick={() => handleOpenCurriculumModal()} 
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Weekly Curriculum
      </Button>

      {/* Curriculum Modal */}
      <Dialog open={isCurriculumModalOpen} onOpenChange={setIsCurriculumModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-600">
              {editingCurriculumIndex !== null ? "Edit Curriculum" : "Add New Curriculum"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Curriculum Title *</label>
              <Input
                name="name"
                placeholder="e.g., Introduction to React"
                value={curriculumFormData.curriculum_title}
                onChange={(e) => setCurriculumFormData({ ...curriculumFormData, curriculum_title: e.target.value })}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Input
                name="description"
                placeholder="Brief description of this week's content..."
                value={curriculumFormData.curriculum_desc}
                onChange={(e) => setCurriculumFormData({ ...curriculumFormData, curriculum_desc: e.target.value })}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSubmitCurriculum} 
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingCurriculumIndex !== null ? "Save Changes" : "Create Curriculum"}
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsCurriculumModalOpen(false)}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Curriculum Lessons Modal */}
      {currentCurriculum && Object.keys(currentCurriculum).length > 0 && (
        <CurriculumLessonsForm
          isOpen={openLessonsModal}
          onClose={() => setOpenLessonsModal(false)}
          curriculum={currentCurriculum}
          token={token}
        />
      )}
    </div>
  );
};

export default WeeklyCurriculumForm;
