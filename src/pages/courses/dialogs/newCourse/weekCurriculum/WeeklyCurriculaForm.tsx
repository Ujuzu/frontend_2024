import { useState } from "react";
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
  
  // To trigger the next nested modal after saving a curriculum
  const [openLessonsModal, setOpenLessonsModal] = useState(false);
  const [currentCurriculum, setCurrentCurriculum] = useState<IWeeklyCurriculumResponse>(
    {} as IWeeklyCurriculumResponse
  );

  const handleOpenCurriculumModal = (index?: number) => {
    if (index !== undefined) {
      setEditingCurriculumIndex(index);
      const attributes = weeklyCurricula[index].attributes;
      setCurriculumFormData({
        ...attributes,
        intro_pic: attributes.intro_pic?.data?.id ?attributes.intro_pic?.data?.id : undefined,
      });
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
    }
  };

  // Handle loading and error states
  if (loading && weeklyCurricula.length === 0) {
    return <div>Loading curricula...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading curricula: {error}</p>
        <button onClick={refreshWeeklyCurricula}>Retry</button>
      </div>
    );
  }

  const handleOpenLessonsModal = (curriculum: IWeeklyCurriculumResponse) => {
    setCurrentCurriculum(curriculum);
    setOpenLessonsModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Weekly Curriculum</h2>
      {Array.isArray(weeklyCurricula) && weeklyCurricula.length > 0 ? (
        weeklyCurricula.map((curriculum) => (
          <div key={curriculum.id} className="border p-3 rounded flex justify-between items-center hover:bg-gray-50 transition-colors">
        <span 
  className="text-lg font-medium cursor-pointer hover:text-[#AC19AD] transition-colors" 
  onClick={() => handleOpenLessonsModal(curriculum)}
>
  {curriculum?.attributes?.curriculum_title}
</span>
        <Button onClick={() => handleOpenCurriculumModal(weeklyCurricula.findIndex(c => c.id === curriculum.id))}>
          <Pencil size={16} />
        </Button>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No weekly curriculum found.</div>
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