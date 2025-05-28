import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, BookOpen, Calendar, Loader2, AlertCircle } from "lucide-react";
import { courseWeeklyCurriculumService } from "@/service/courseWeeklyCurriculumService";
import { ICoursesWklyCurriculumAttrib, IWeeklyCurriculumResponse } from "@/Interfaces/IWeeklyCurriculum";
import CurriculumLessonsForm from "./CurriculumLessonsForm";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import useFetchWeeklyCurricula from "@/hooks/useFetchWeeklyCurricula";

const WeeklyCurriculumForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  
  // Use the custom hook instead of manual state management
  const { weeklyCurricula, loading, error, refreshWeeklyCurricula } = useFetchWeeklyCurricula(token, courseId);
  
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [curriculumFormData, setCurriculumFormData] = useState<ICoursesWklyCurriculumAttrib>(
    { curriculum_title: "", 
      curriculum_desc: "" }
  );
  const [submitting, setSubmitting] = useState(false);
  
  // To trigger the next nested modal after saving a curriculum
  const [openLessonsModal, setOpenLessonsModal] = useState(false);
  const [currentCurriculum, setCurrentCurriculum] = useState<IWeeklyCurriculumResponse>(
    {} as IWeeklyCurriculumResponse
  );
  
  // Loading state for individual curriculum items
  const [loadingCurriculumId, setLoadingCurriculumId] = useState<string | null>(null);

  const handleOpenCurriculumModal = (index?: number) => {
    if (index !== undefined) {
      setEditingCurriculumIndex(index);
      setCurriculumFormData(weeklyCurricula[index].attributes);
    } else {
      setEditingCurriculumIndex(null);
      setCurriculumFormData({ curriculum_title : "", curriculum_desc: "" });
    }
    setIsCurriculumModalOpen(true);
  };

  const handleSubmitCurriculum = async () => {
    if (!curriculumFormData.curriculum_title.trim()) {
      toast.error("Please enter a curriculum name.");
      return;
    }
    
    try {
      setSubmitting(true);
      const payload = { ...curriculumFormData, courses: [courseId] };
      let savedCurriculum;
      
      if (editingCurriculumIndex !== null) {
        // Update existing
        const updated = await courseWeeklyCurriculumService.updateWeeklyCurriculum(
          token,
          weeklyCurricula[editingCurriculumIndex].id,
          payload
        );
        savedCurriculum = updated.data;
      } else {
        // Create new
        const created = await courseWeeklyCurriculumService.createWeeklyCurriculum(token, payload);
        savedCurriculum = created;
      }
      
      toast.success("Curriculum saved!");
      setIsCurriculumModalOpen(false);
      
      // Refresh the curricula list to get the latest data from the server
      await refreshWeeklyCurricula();
      
      // Find the saved curriculum in the refreshed list for the next modal
      // This ensures we have the most up-to-date data
      const refreshedCurriculum = weeklyCurricula.find(curriculum => 
        curriculum.id === (savedCurriculum.id || savedCurriculum.data?.id)
      );
      
      if (refreshedCurriculum) {
        setCurrentCurriculum(refreshedCurriculum);
        setOpenLessonsModal(true);
      } else {
        // Fallback: use the saved curriculum data directly
        setCurrentCurriculum(savedCurriculum.data || savedCurriculum);
        setOpenLessonsModal(true);
      }
      
    } catch (error) {
      console.error("Error saving curriculum:", error);
      toast.error("Failed to save curriculum.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle loading and error states
  if (loading && weeklyCurricula.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Weekly Curriculum</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-gray-600 font-medium">Loading curricula...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Weekly Curriculum</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Error loading curricula</p>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
            </div>
            <Button
              onClick={refreshWeeklyCurricula}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenLessonsModal = async (curriculum: IWeeklyCurriculumResponse) => {
    setLoadingCurriculumId(curriculum.id);
    
    // Simulate a small delay to show loading state (you can remove this if not needed)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentCurriculum(curriculum);
    setOpenLessonsModal(true);
    setLoadingCurriculumId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Weekly Curriculum</h2>
      </div>

      {/* Curriculum List */}
      <div className="space-y-3">
        {Array.isArray(weeklyCurricula) && weeklyCurricula.length > 0 ? (
          <div className="space-y-3">
            {weeklyCurricula.map((curriculum, index) => (
              <div 
                key={curriculum.id} 
                className="border border-purple-200 p-4 rounded-lg bg-white hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 
                          className={`text-lg font-medium cursor-pointer hover:text-purple-700 transition-colors ${
                            loadingCurriculumId === curriculum.id ? 'text-purple-600' : 'text-gray-900'
                          }`}
                          onClick={() => handleOpenLessonsModal(curriculum)}
                          title="Click to view lessons"
                        >
                          {curriculum?.attributes?.curriculum_title}
                        </h3>
                        {loadingCurriculumId === curriculum.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        )}
                      </div>
                      {curriculum?.attributes?.curriculum_desc && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {curriculum.attributes.curriculum_desc}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleOpenCurriculumModal(index)}
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                    disabled={loadingCurriculumId === curriculum.id}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-purple-200 rounded-lg bg-purple-50">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-gray-700 font-medium">No weekly curriculum found</p>
            <p className="text-gray-600 text-sm mt-1">Create your first curriculum to get started</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <Button 
        onClick={() => handleOpenCurriculumModal()} 
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Weekly Curriculum
      </Button>

      {/* Curriculum Modal */}
      <Dialog open={isCurriculumModalOpen} onOpenChange={setIsCurriculumModalOpen}>
        <DialogContent className="sm:max-w-md border-purple-200">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-900">
                {editingCurriculumIndex !== null ? "Edit Curriculum" : "Add Curriculum"}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Curriculum Name *</label>
              <Input
                name="name"
                placeholder="Enter curriculum name"
                value={curriculumFormData.curriculum_title}
                onChange={(e) => setCurriculumFormData({ ...curriculumFormData, curriculum_title: e.target.value })}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Input
                name="description"
                placeholder="Enter description (optional)"
                value={curriculumFormData.curriculum_desc}
                onChange={(e) => setCurriculumFormData({ ...curriculumFormData, curriculum_desc: e.target.value })}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-1"
              />
            </div>
            
            <Button 
              onClick={handleSubmitCurriculum} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={submitting || !curriculumFormData.curriculum_title.trim()}
            >
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                editingCurriculumIndex !== null ? "Save Changes" : "Add Curriculum"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Curriculum Lessons Modal */}
      {currentCurriculum && (
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
