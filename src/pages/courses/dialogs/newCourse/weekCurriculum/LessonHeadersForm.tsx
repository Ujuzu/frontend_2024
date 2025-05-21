// LessonHeadersForm.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { lessonHeaderService } from "@/service/lessonHeaderService";

interface LessonHeadersFormProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: any;
  token: string;
}

const LessonHeadersForm: React.FC<LessonHeadersFormProps> = ({ isOpen, onClose, lesson, token }) => {
  const [headers, setHeaders] = useState<any[]>([]);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [headerFormData, setHeaderFormData] = useState({
    curriculum_lesson_header_title: "",
    course_curriculum_lesson_header_content: "",
    video_url: "",
    sort_order: 0,
    content_2: ""
  });

  useEffect(() => {
    const fetchHeaders = async () => {
      if (!token || !lesson?.id) return;
      try {
        const response = await lessonHeaderService.getLessonHeaders(token, lesson.id);
        setHeaders(response.data);
      } catch (error) {
        console.error("Error fetching lesson headers:", error);
        toast.error("Error fetching lesson headers.");
      }
    };
    if (isOpen) {
      fetchHeaders();
    }
  }, [token, lesson, isOpen]);

  const handleOpenHeaderModal = (index?: number) => {
    if (index !== undefined) {
      setEditingHeaderIndex(index);
      setHeaderFormData(headers[index]);
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
      let savedHeader;
      if (editingHeaderIndex !== null) {
        const updated = await lessonHeaderService.updateHeader(token, headers[editingHeaderIndex].id, payload);
        savedHeader = updated.data;
        const updatedHeaders = [...headers];
        updatedHeaders[editingHeaderIndex] = savedHeader;
        setHeaders(updatedHeaders);
      } else {
        const created = await lessonHeaderService.createHeader(token, payload);
        savedHeader = created.data;
        setHeaders([...headers, savedHeader]);
      }
      toast.success("Lesson header saved!");
      setIsHeaderModalOpen(false);
    } catch (error) {
      console.error("Error saving header:", error);
      toast.error("Error saving header.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson Headers for "{lesson.name}"</DialogTitle>
        </DialogHeader>

        {headers.map((header, index) => (
          <div key={header.id} className="border p-3 rounded flex justify-between items-center mb-2">
            <span className="text-lg font-medium">{header.curriculum_lesson_header_title}</span>
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