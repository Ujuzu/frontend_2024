import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import { courseWeeklyCurriculumService } from "@/service/courseWeeklyCurriculumService";
import { ICoursesWklyCurriculumAttrib, IWeeklyCurriculumResponse } from "@/Interfaces/IWeeklyCurriculum";
import CurriculumLessonsForm from "./CurriculumLessonsForm";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";

const WeeklyCurriculumForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [weeklyCurricula, setWeeklyCurricula] = useState<IWeeklyCurriculumResponse[]>([]);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [curriculumFormData, setCurriculumFormData] = useState<ICoursesWklyCurriculumAttrib>(
    { curriculum_title: "", 
      curriculum_desc: "" }
    );
  
  // To trigger the next nested modal after saving a curriculum
  const [openLessonsModal, setOpenLessonsModal] = useState(false);
  const [currentCurriculum, setCurrentCurriculum] = useState<IWeeklyCurriculumResponse>(
    {} as IWeeklyCurriculumResponse
  );

  useEffect(() => {
    const fetchWeeklyCurricula = async () => {
      if (!token || !courseId) return;
      try {
        const response = await courseWeeklyCurriculumService.getCourseWeeklyCurricula(token, courseId);
        setWeeklyCurricula(response.data);
      } catch (error) {
        console.error("Error fetching weekly curricula:", error);
        toast.error("Failed to fetch weekly curricula.");
      }
    };
    fetchWeeklyCurricula();
  }, [token, courseId]);

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
        const updatedList = [...weeklyCurricula];
        updatedList[editingCurriculumIndex] = savedCurriculum;
        setWeeklyCurricula(updatedList);
      } else {
        // Create new
        const created = await courseWeeklyCurriculumService.createWeeklyCurriculum(token, payload);
        savedCurriculum = created;
        setWeeklyCurricula([...weeklyCurricula, savedCurriculum]);
      }
      toast.success("Curriculum saved!");
      setIsCurriculumModalOpen(false);
      // Open the next modal with the saved curriculum
      setCurrentCurriculum(savedCurriculum.data);
      setOpenLessonsModal(true);
    } catch (error) {
      console.error("Error saving curriculum:", error);
      toast.error("Failed to save curriculum.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Weekly Curricula</h2>
      {Array.isArray(weeklyCurricula) && weeklyCurricula.length > 0 ? (
        weeklyCurricula.map((curriculum) => (
          <div key={curriculum.id} className="border p-3 rounded flex justify-between items-center">
        <span className="text-lg font-medium">{curriculum?.attributes?.curriculum_title}</span>
        <Button onClick={() => handleOpenCurriculumModal(weeklyCurricula.findIndex(c => c.id === curriculum.id))}>
          <Pencil size={16} />
        </Button>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No weekly curricula found.</div>
      )}

      <Button onClick={() => handleOpenCurriculumModal()} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
        <Plus /> Add Weekly Curriculum
      </Button>

      {/* Curriculum Modal */}
      <Dialog open={isCurriculumModalOpen} onOpenChange={setIsCurriculumModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurriculumIndex !== null ? "Edit Curriculum" : "Add Curriculum"}</DialogTitle>
          </DialogHeader>
          <Input
            name="name"
            placeholder="Curriculum Name"
            value={curriculumFormData.curriculum_title}
            onChange={(e) => setCurriculumFormData({ ...curriculumFormData, curriculum_title: e.target.value })}
            required
          />
          <Input
            name="description"
            placeholder="Description"
            value={curriculumFormData.curriculum_desc}
            onChange={(e) => setCurriculumFormData({ ...curriculumFormData, curriculum_desc: e.target.value })}
          />
          <Button onClick={handleSubmitCurriculum} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
            {editingCurriculumIndex !== null ? "Save Changes" : "Add Curriculum"}
          </Button>
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