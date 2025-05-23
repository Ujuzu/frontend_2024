// LessonHeadersForm.tsx
import {  useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { lessonHeaderService } from "@/service/curriculumLessonHeaderService";
import { LessonHeadersFormProps } from "@/Interfaces/ILessonHeaders";
import useFetchLessonHeaders from "@/hooks/useFetchLessonHeaders";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";


const LessonHeadersForm: React.FC<LessonHeadersFormProps> = ({ 
  isOpen, 
  onClose, 
  lesson, 
  token 
}) => {
  // Use the custom hook - only fetch when modal is open
  const { headers, loading, error, refreshHeaders } = useFetchLessonHeaders(
    token, 
    lesson?.id, 
    isOpen
  );
  
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [headerFormData, setHeaderFormData] = useState({
    curriculum_lesson_header_title: "",
    course_curriculum_lesson_header_content: "",
    video_url: "",
    sort_order: 0,
    content_2: ""
  });

  const handleOpenHeaderModal = (index?: number) => {
    if (index !== undefined) {
      setEditingHeaderIndex(index);
      setHeaderFormData({
        curriculum_lesson_header_title: headers[index].attributes.curriculum_lesson_header_title ?? "",
        course_curriculum_lesson_header_content: headers[index].attributes.course_curriculum_lesson_header_content ?? "",
        video_url: headers[index].attributes.video_url ?? "",
        sort_order: headers[index].attributes.sort_order ?? 0,
        content_2: headers[index].attributes.content_2 ?? ""
      });
    } else {
      setEditingHeaderIndex(null);
      setHeaderFormData({
        curriculum_lesson_header_title: "",
        course_curriculum_lesson_header_content: "",
        video_url: "",
        sort_order: 0,
        content_2: ""
      });
    }
    setIsHeaderModalOpen(true);
  };

  const handleSubmitHeader = async () => {
    if (!headerFormData.curriculum_lesson_header_title.trim()) {
      toast.error("Enter header title.");
      return;
    }
    
    try {
      const payload = { ...headerFormData, crs_cur_lessons: [lesson.id] };
      // let savedHeader;
      
      if (editingHeaderIndex !== null) {
        // Update existing header
        await lessonHeaderService.updateCurriculumLessonHeader(
          token, 
          headers[editingHeaderIndex].id, 
          payload
        );
        // savedHeader = updated.data;
      } else {
        // Create new header
        await lessonHeaderService.createCurriculumLessonHeader(token, payload);
        // savedHeader = created;
      }
      
      toast.success("Lesson header saved!");
      setIsHeaderModalOpen(false);
      
      // Refresh the headers list to get the latest data from the server
      await refreshHeaders();
      
    } catch (error) {
      console.error("Error saving header:", error);
      toast.error("Error saving header.");
    }
  };

  // Handle loading and error states
  if (loading && headers.length === 0 && isOpen) {
    return <div>Loading lesson headers...</div>;
  }

  if (error && isOpen) {
    return (
      <div>
        <p>Error loading lesson headers: {error}</p>
        <button onClick={refreshHeaders}>Retry</button>
      </div>
    );
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson Headers for "{lesson?.attributes?.curriculum_lesson_title ? lesson?.attributes?.curriculum_lesson_title : `No Lesson available` } "</DialogTitle>
        </DialogHeader>

        {headers.map((header, index) => (
          <div key={header.id} className="border p-3 rounded flex justify-between items-center mb-2">
            <span className="text-lg font-medium">{header?.attributes?.curriculum_lesson_header_title}</span>
            <Button onClick={() => handleOpenHeaderModal(index)}>
              <Pencil size={16} />
            </Button>
          </div>
        ))}

        <Button onClick={() => handleOpenHeaderModal()} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
          <Plus /> Add Header
        </Button>

        {/* Header Modal */}
        <Dialog open={isHeaderModalOpen} onOpenChange={setIsHeaderModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHeaderIndex !== null ? "Edit Header" : "Add New Header"}</DialogTitle>
            </DialogHeader>
            <Input
              name="curriculum_lesson_header_title"
              placeholder="Header Title"
              value={headerFormData.curriculum_lesson_header_title}
              onChange={(e) =>
                setHeaderFormData({ ...headerFormData, curriculum_lesson_header_title: e.target.value })
              }
              required
            />
            <Input
              name="course_curriculum_lesson_header_content"
              placeholder="Header Content"
              value={headerFormData.course_curriculum_lesson_header_content}
              onChange={(e) =>
                setHeaderFormData({ ...headerFormData, course_curriculum_lesson_header_content: e.target.value })
              }
            />
            <Input
              name="video_url"
              placeholder="Video URL"
              value={headerFormData.video_url}
              onChange={(e) => setHeaderFormData({ ...headerFormData, video_url: e.target.value })}
            />
            <Input
              type="number"
              name="sort_order"
              placeholder="Sort Order"
              value={headerFormData.sort_order}
              onChange={(e) =>
                setHeaderFormData({ ...headerFormData, sort_order: Number(e.target.value) })
              }
            />

            <label className="text-sm font-medium">Rich Text Content</label>
            {/* <ReactQuill
              theme="snow"
              value={headerFormData.course_curriculum_lesson_header_content}
              onChange={(content:string) => setHeaderFormData({ ...headerFormData, course_curriculum_lesson_header_content: content })}
            /> */}


            <Input
              name="content_2"
              placeholder="Additional Content"
              value={headerFormData.content_2}
              onChange={(e) => setHeaderFormData({ ...headerFormData, content_2: e.target.value })}
            />
            <Button onClick={handleSubmitHeader} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
              {editingHeaderIndex !== null ? "Save Changes" : "Add Header"}
            </Button>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default LessonHeadersForm;