// CurriculumLessonsForm.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Edit3, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import LessonHeadersForm from "./LessonHeadersForm";
import { curriculumLessonService } from "@/service/curriculumLessonService";
import { CurriculumLessonsFormProps, ICurriculumLessonAttributes, ICurriculumLessonResponse } from "@/Interfaces/ICurriculumLessons";
import useFetchCurriculumLessons from "@/hooks/useFetchCurriculumLessons";

const CurriculumLessonsForm: React.FC<CurriculumLessonsFormProps> = ({ isOpen, onClose, curriculum, token }) => {
  const { lessons, loading, error, refreshLessons } = useFetchCurriculumLessons(
    token, 
    curriculum?.id, 
    isOpen
  );
  
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [lessonFormData, setLessonFormData] = useState<ICurriculumLessonAttributes>(
    { curriculum_lesson_title: "", 
      curriculum_lesson_desc: "" }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For the nested Lesson Headers modal:
  const [openHeadersModal, setOpenHeadersModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ICurriculumLessonResponse>({} as ICurriculumLessonResponse);

  const handleOpenLessonModal = (index?: number) => {
    if (index !== undefined) {
      setEditingLessonIndex(index);
      const attributest = lessons[index].attributes;
      setLessonFormData({
        ...attributest,
        intro_pic: attributest.intro_pic?.data?.id ? attributest.intro_pic?.data?.id : null,
      });
    } else {
      setEditingLessonIndex(null);
      setLessonFormData({ curriculum_lesson_title: "", curriculum_lesson_desc: "" });
    }
    setIsLessonModalOpen(true);
  };

  const handleSubmitLesson = async () => {
    if (!lessonFormData.curriculum_lesson_title.trim()) {
      toast.error("Enter lesson name.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = { ...lessonFormData, courses_weekly_curricula: [curriculum.id] };
      let savedLesson;
      
      if (editingLessonIndex !== null) {
        // Update existing lesson
        const updated = await curriculumLessonService.updateCurriculumLesson(
          token, 
          lessons[editingLessonIndex].id, 
          payload
        );
        savedLesson = updated.data;
      } else {
        // Create new lesson
        const created = await curriculumLessonService.createCurriculumLesson(token, payload);
        savedLesson = created;
      }
      
      toast.success("Lesson saved!");
      setIsLessonModalOpen(false);
      
      // Refresh the lessons list to get the latest data from the server
      await refreshLessons();
      
      // Find the saved lesson in the refreshed list for the next modal
      const refreshedLesson = lessons.find(lesson => 
        lesson.id === (savedLesson.id || savedLesson.data?.id)
      );
      
      if (refreshedLesson) {
        setCurrentLesson(refreshedLesson);
      } else {
        // Fallback: use the saved lesson data directly
        setCurrentLesson(savedLesson.data || savedLesson);
      }
      
      setOpenHeadersModal(true); // open nested Lesson Headers modal
      
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Error saving lesson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLessonsModal = (lesson: ICurriculumLessonResponse) => {
    setCurrentLesson(lesson);
    setOpenHeadersModal(true);
  };

  // Handle loading and error states
  if (loading && lessons.length === 0 && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading lessons...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-semibold">Error loading lessons</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <Button 
              onClick={refreshLessons} 
              className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            >
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-purple-100">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2>Curriculum Lessons</h2>
              <p className="text-sm font-normal text-gray-600 mt-1">
                {curriculum?.attributes?.curriculum_title || "No Curriculum created"}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No lessons yet</h3>
              <p className="text-gray-600 mb-6">Create your first lesson to get started</p>
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className="group bg-gradient-to-r from-white to-purple-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-100 transition-all duration-200 hover:border-purple-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-purple-600 transition-colors duration-200 flex items-center gap-3 group-hover:text-purple-700" 
                      onClick={() => handleOpenLessonsModal(lesson)}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      {lesson.attributes.curriculum_lesson_title}
                    </h3>
                    {lesson.attributes.curriculum_lesson_desc && (
                      <p className="text-gray-600 mt-2 ml-11 text-sm">
                        {lesson.attributes.curriculum_lesson_desc}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleOpenLessonModal(index)}
                    variant="outline"
                    size="sm"
                    className="ml-4 border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 cursor-pointer transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-6 border-t border-purple-100">
          <Button 
            onClick={() => handleOpenLessonModal()} 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Lesson
          </Button>
        </div>

        {/* Lesson Modal */}
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="pb-4 border-b border-purple-100">
              <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  {editingLessonIndex !== null ? (
                    <Edit3 className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                {editingLessonIndex !== null ? "Edit Lesson" : "Add New Lesson"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Name *
                </label>
                <Input
                  name="curriculum_lesson_title"
                  placeholder="Enter lesson name"
                  value={lessonFormData.curriculum_lesson_title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, curriculum_lesson_title: e.target.value })}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  name="curriculum_lesson_desc"
                  placeholder="Enter lesson description"
                  value={lessonFormData.curriculum_lesson_desc}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, curriculum_lesson_desc: e.target.value })}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100">
              <Button 
                onClick={handleSubmitLesson} 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingLessonIndex !== null ? "Save Changes" : "Add Lesson"}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Nested Lesson Headers Modal */}
        {currentLesson && (
          <LessonHeadersForm
            isOpen={openHeadersModal}
            onClose={() => setOpenHeadersModal(false)}
            lesson={currentLesson}
            token={token}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CurriculumLessonsForm;
