// CurriculumLessonsForm.tsx
import {  useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
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
  
  // For the nested Lesson Headers modal:
  const [openHeadersModal, setOpenHeadersModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ICurriculumLessonResponse>({} as ICurriculumLessonResponse);

  const handleOpenLessonModal = (index?: number) => {
    if (index !== undefined) {
      setEditingLessonIndex(index);
      const attributest = lessons[index].attributes;
      setLessonFormData({
        ...attributest,
        intro_pic: attributest.intro_pic?.data?.id  ? attributest.intro_pic?.data?.id :  null,
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
    }
  };

    const handleOpenLessonsModal = (lesseon:ICurriculumLessonResponse) => {
      setCurrentLesson(lesseon);
      setOpenHeadersModal(true);
    };

  // Handle loading and error states
  if (loading && lessons.length === 0 && isOpen) {
    return <div>Loading lessons...</div>;
  }

  if (error && isOpen) {
    return (
      <div>
        <p>Error loading lessons: {error}</p>
        <button onClick={refreshLessons}>Retry</button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Curriculum Lessons for "{curriculum?.attributes?.curriculum_title ? curriculum?.attributes?.curriculum_title : `No Curriculum created`}"</DialogTitle>
        </DialogHeader>

        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="border p-3 rounded flex justify-between items-center mb-2">
                    <span 
  className="text-lg font-medium cursor-pointer hover:text-[#AC19AD] transition-colors" 
  onClick={() => handleOpenLessonsModal(lesson)}
>{lesson.attributes.curriculum_lesson_title}
           </span>
            <Button onClick={() => handleOpenLessonModal(index)}>
              <Pencil size={16} />
            </Button>
          </div>
        ))}

        <Button onClick={() => handleOpenLessonModal()} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
          <Plus /> Add Lesson
        </Button>

        {/* Lesson Modal */}
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLessonIndex !== null ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
            </DialogHeader>
            <Input
              name="curriculum_lesson_title"
              placeholder="Lesson Name"
              value={lessonFormData.curriculum_lesson_title}
              onChange={(e) => setLessonFormData({ ...lessonFormData, curriculum_lesson_title: e.target.value })}
              required
            />
            <Input
              name="curriculum_lesson_desc"
              placeholder="Description"
              value={lessonFormData.curriculum_lesson_desc}
              onChange={(e) => setLessonFormData({ ...lessonFormData, curriculum_lesson_desc: e.target.value })}
            />
            <Button onClick={handleSubmitLesson} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
              {editingLessonIndex !== null ? "Save Changes" : "Add Lesson"}
            </Button>
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