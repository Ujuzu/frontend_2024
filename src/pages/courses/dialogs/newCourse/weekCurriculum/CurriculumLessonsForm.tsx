// CurriculumLessonsForm.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import LessonHeadersForm from "./LessonHeadersForm";
import { curriculumLessonService } from "@/service/curriculumLessonService";
import { CurriculumLessonsFormProps, ICurriculumLessonAttributes, ICurriculumLessonResponse } from "@/Interfaces/ICurriculumLessons";



const CurriculumLessonsForm: React.FC<CurriculumLessonsFormProps> = ({ isOpen, onClose, curriculum, token }) => {
  const [lessons, setLessons] = useState<ICurriculumLessonResponse[]>([]);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [lessonFormData, setLessonFormData] = useState<ICurriculumLessonAttributes>(
    { curriculum_lesson_title: "", 
    curriculum_lesson_desc: "" }
  );
  // For the nested Lesson Headers modal:
  const [openHeadersModal, setOpenHeadersModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ICurriculumLessonResponse>({} as ICurriculumLessonResponse);

  console.log("Curriculum Lessons Form Props", { curriculum });
  useEffect(() => {
    const fetchLessons = async () => {
      if (!token || !curriculum?.id) return;
      try {
        const response = await curriculumLessonService.getCurriculumLessons(token, curriculum.id);
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        toast.error("Error fetching lessons.");
      }
    };
    if (isOpen) {
      fetchLessons();
    }
  }, [token, curriculum, isOpen]);

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
      toast.error("Enter lesson name.");
      return;
    }
    try {
      const payload = { ...lessonFormData, curriculum: curriculum.id };
      let savedLesson;
      if (editingLessonIndex !== null) {
        const updated = await curriculumLessonService.updateCurriculumLesson(token, lessons[editingLessonIndex].id, payload);
        savedLesson = updated.data;
        const updatedLessons = [...lessons];
        updatedLessons[editingLessonIndex] = savedLesson;
        setLessons(updatedLessons);
      } else {
        const created = await curriculumLessonService.createCurriculumLesson(token, payload);
        savedLesson = created;
        setLessons([...lessons, savedLesson]);
      }
      toast.success("Lesson saved!");
      setIsLessonModalOpen(false);
      setCurrentLesson(savedLesson);
      setOpenHeadersModal(true); // open nested Lesson Headers modal
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Error saving lesson.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Curriculum Lessons for "{curriculum?.attributes?.curriculum_title ? curriculum?.attributes?.curriculum_title : `No Curriculum created`}"</DialogTitle>
        </DialogHeader>

        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="border p-3 rounded flex justify-between items-center mb-2">
            <span className="text-lg font-medium">{lesson.attributes.curriculum_lesson_title}</span>
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