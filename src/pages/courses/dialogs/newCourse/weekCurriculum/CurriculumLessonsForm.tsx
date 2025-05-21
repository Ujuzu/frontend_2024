// CurriculumLessonsForm.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { curriculumLessonService } from "@/service/curriculumLessonService";
import LessonHeadersForm from "./LessonHeadersForm";

interface CurriculumLessonsFormProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: any;
  token: string;
}

const CurriculumLessonsForm: React.FC<CurriculumLessonsFormProps> = ({ isOpen, onClose, curriculum, token }) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [lessonFormData, setLessonFormData] = useState({ name: "", description: "" });
  // For the nested Lesson Headers modal:
  const [openHeadersModal, setOpenHeadersModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!token || !curriculum?.id) return;
      try {
        const response = await curriculumLessonService.getLessons(token, curriculum.id);
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
      setLessonFormData(lessons[index]);
    } else {
      setEditingLessonIndex(null);
      setLessonFormData({ name: "", description: "" });
    }
    setIsLessonModalOpen(true);
  };

  const handleSubmitLesson = async () => {
    if (!lessonFormData.name.trim()) {
      toast.error("Enter lesson name.");
      return;
    }
    try {
      const payload = { ...lessonFormData, curriculum: curriculum.id };
      let savedLesson;
      if (editingLessonIndex !== null) {
        const updated = await curriculumLessonService.updateLesson(token, lessons[editingLessonIndex].id, payload);
        savedLesson = updated.data;
        const updatedLessons = [...lessons];
        updatedLessons[editingLessonIndex] = savedLesson;
        setLessons(updatedLessons);
      } else {
        const created = await curriculumLessonService.createLesson(token, payload);
        savedLesson = created.data;
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
          <DialogTitle>Curriculum Lessons for "{curriculum.name}"</DialogTitle>
        </DialogHeader>

        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="border p-3 rounded flex justify-between items-center mb-2">
            <span className="text-lg font-medium">{lesson.name}</span>
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
              name="name"
              placeholder="Lesson Name"
              value={lessonFormData.name}
              onChange={(e) => setLessonFormData({ ...lessonFormData, name: e.target.value })}
              required
            />
            <Input
              name="description"
              placeholder="Description"
              value={lessonFormData.description}
              onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
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