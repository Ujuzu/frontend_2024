// CurriculumLessonsForm.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Pencil, 
  BookOpen, 
  GraduationCap, 
  PlayCircle, 
  Loader2, 
  AlertCircle,
  PlusCircle,
  FileText
} from "lucide-react";
import { toast } from "react-hot-toast";
import LessonHeadersForm from "./LessonHeadersForm";
import { curriculumLessonService } from "@/service/curriculumLessonService";
import { CurriculumLessonsFormProps, ICurriculumLessonAttributes, ICurriculumLessonResponse } from "@/Interfaces/ICurriculumLessons";
import useFetchCurriculumLessons from "@/hooks/useFetchCurriculumLessons";

const CurriculumLessonsForm: React.FC<CurriculumLessonsFormProps> = ({ 
  isOpen, 
  onClose, 
  curriculum, 
  token 
}) => {
  const { lessons, loading, error, refreshLessons } = useFetchCurriculumLessons(
    token, 
    curriculum?.id, 
    isOpen
  );
  
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lessonFormData, setLessonFormData] = useState<ICurriculumLessonAttributes>(
    { 
      curriculum_lesson_title: "", 
      curriculum_lesson_desc: "" 
    }
  );
  
  // For the nested Lesson Headers modal:
  const [openHeadersModal, setOpenHeadersModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ICurriculumLessonResponse>({} as ICurriculumLessonResponse);
  
  // Loading state for individual lesson items
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);

  const handleOpenLessonModal = (index?: number) => {
    if (index !== undefined) {
      setEditingLessonIndex(index);
      setLessonFormData(lessons[index].attributes);
    } else {
      setEditingLessonIndex(null);
      setLessonFormData({ curriculum_lesson_title: "", curriculum_lesson_desc: "" });
    }
    setIsLessonModalOpen(true);
  };

  const handleSubmitLesson = async () => {
    if (!lessonFormData.curriculum_lesson_title.trim()) {
      toast.error("Please enter a lesson name.");
      return;
    }
    
    try {
      setSubmitting(true);
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
      
      toast.success("Lesson saved successfully!");
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
      toast.error("Failed to save lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenLessonsModal = async (lesson: ICurriculumLessonResponse) => {
    setLoadingLessonId(lesson.id);
    
    // Simulate a small delay to show loading state (you can remove this if not needed)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentLesson(lesson);
    setOpenHeadersModal(true);
    setLoadingLessonId(null);
  };

  // Loading state
  if (loading && lessons.length === 0 && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto border-purple-200">
          <DialogHeader className="border-b border-purple-200 pb-4">
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-900">Curriculum Lessons</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-gray-600 font-medium">Loading lessons...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (error && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto border-purple-200">
          <DialogHeader className="border-b border-purple-200 pb-4">
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-900">Curriculum Lessons</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Error loading lessons</p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
              </div>
              <Button
                onClick={refreshLessons}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
              >
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto border-purple-200">
          <DialogHeader className="border-b border-purple-200 pb-4">
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-900">
                Curriculum Lessons for "{curriculum?.attributes?.curriculum_title || "Untitled Curriculum"}"
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Lessons List */}
            <div className="space-y-3">
              {Array.isArray(lessons) && lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className="border border-purple-200 p-4 rounded-lg bg-white hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <PlayCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 
                                className={`text-lg font-medium cursor-pointer hover:text-purple-700 transition-colors truncate ${
                                  loadingLessonId === lesson.id ? 'text-purple-600' : 'text-gray-900'
                                }`}
                                onClick={() => handleOpenLessonsModal(lesson)}
                                title="Click to view lesson headers"
                              >
                                {lesson.attributes.curriculum_lesson_title}
                              </h3>
                              {loadingLessonId === lesson.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                              ) : (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                    Click to view headers
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {lesson.attributes.curriculum_lesson_desc && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {lesson.attributes.curriculum_lesson_desc}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleOpenLessonModal(index)}
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 flex-shrink-0"
                          disabled={loadingLessonId === lesson.id}
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
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-gray-700 font-medium">No lessons found</p>
                  <p className="text-gray-600 text-sm mt-1">Create your first lesson to get started</p>
                </div>
              )}
            </div>

            {/* Add Lesson Button */}
            <Button 
              onClick={() => handleOpenLessonModal()} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Lesson
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Creation/Edit Modal */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="sm:max-w-2xl border-purple-200">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-900">
                {editingLessonIndex !== null ? "Edit Lesson" : "Add New Lesson"}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Lesson Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Lesson Title *</span>
              </label>
              <Input
                name="curriculum_lesson_title"
                placeholder="Enter lesson title"
                value={lessonFormData.curriculum_lesson_title}
                onChange={(e) => setLessonFormData({ ...lessonFormData, curriculum_lesson_title: e.target.value })}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-1"
                required
              />
            </div>

            {/* Lesson Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Lesson Description</span>
              </label>
              <Textarea
                name="curriculum_lesson_desc"
                placeholder="Enter lesson description (optional)"
                value={lessonFormData.curriculum_lesson_desc}
                onChange={(e) => setLessonFormData({ ...lessonFormData, curriculum_lesson_desc: e.target.value })}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 min-h-[100px]"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Provide a brief description of what students will learn in this lesson
              </p>
            </div>

            <Button 
              onClick={handleSubmitLesson} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={submitting || !lessonFormData.curriculum_lesson_title.trim()}
            >
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  {editingLessonIndex !== null ? (
                    <>
                      <Pencil className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Lesson
                    </>
                  )}
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
    </>
  );
};

export default CurriculumLessonsForm;
