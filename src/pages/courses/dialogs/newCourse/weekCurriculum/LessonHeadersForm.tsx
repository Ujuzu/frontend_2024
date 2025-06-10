// LessonHeadersForm.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video, Hash, Type, Edit3, Loader2, Play, ArrowUpDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { lessonHeaderService } from "@/service/curriculumLessonHeaderService";
import { LessonHeadersFormProps } from "@/Interfaces/ILessonHeaders";
import useFetchLessonHeaders from "@/hooks/useFetchLessonHeaders";
import RichTextEditor from "@/components/input/RichTextEditor";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        sort_order: headers.length + 1,
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
    
    setIsSubmitting(true);
    
    try {
      const payload = { ...headerFormData, crs_cur_lessons: [lesson.id] };
      
      if (editingHeaderIndex !== null) {
        // Update existing header
        await lessonHeaderService.updateCurriculumLessonHeader(
          token, 
          headers[editingHeaderIndex].id, 
          payload
        );
      } else {
        // Create new header
        await lessonHeaderService.createCurriculumLessonHeader(token, payload);
      }
      
      toast.success("Lesson header saved!");
      setIsHeaderModalOpen(false);
      
      // Refresh the headers list to get the latest data from the server
      await refreshHeaders();
      
    } catch (error) {
      console.error("Error saving header:", error);
      toast.error("Error saving header.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading and error states
  if (loading && headers.length === 0 && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading lesson headers...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-semibold">Error loading lesson headers</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <Button 
              onClick={refreshHeaders} 
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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[1200px] h-[90vh] max-h-[90vh] flex flex-col p-4 sm:p-8 overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-purple-100">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2>Lesson Headers</h2>
              <p className="text-sm font-normal text-gray-600 mt-1">
                {lesson?.attributes?.curriculum_lesson_title || "No Lesson available"}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {headers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No headers yet</h3>
              <p className="text-gray-600 mb-6">Create your first lesson header to organize content</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {headers
                .sort((a, b) => (a.attributes.sort_order || 0) - (b.attributes.sort_order || 0))
                .map((header, index) => (
                  <div 
                    key={header.id} 
                    className="group bg-gradient-to-r from-white to-purple-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-100 transition-all duration-200 hover:border-purple-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <span className="text-purple-600 font-bold text-sm">
                              {header.attributes.sort_order || index + 1}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                            {header?.attributes?.curriculum_lesson_header_title}
                          </h3>
                        </div>
                        
                        <div className="ml-11 space-y-2">
                          {header.attributes.course_curriculum_lesson_header_content && (
                            <div className="flex items-start gap-2">
                              <Type className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 text-sm">
                                {header.attributes.course_curriculum_lesson_header_content.length > 100 
                                  ? `${header.attributes.course_curriculum_lesson_header_content.substring(0, 100)}...`
                                  : header.attributes.course_curriculum_lesson_header_content
                                }
                              </p>
                            </div>
                          )}
                          
                          {header.attributes.video_url && (
                            <div className="flex items-center gap-2">
                              <Play className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              <a 
                                href={header.attributes.video_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 text-sm cursor-pointer transition-colors"
                              >
                                Video Content
                              </a>
                            </div>
                          )}
                          
                          {header.attributes.content_2 && (
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 text-sm">
                                {header.attributes.content_2.length > 80 
                                  ? `${header.attributes.content_2.substring(0, 80)}...`
                                  : header.attributes.content_2
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleOpenHeaderModal(index)}
                        variant="outline"
                        size="sm"
                        className="ml-4 border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 cursor-pointer transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-purple-100">
          <Button 
            onClick={() => handleOpenHeaderModal()} 
            className="w-full sm:w-[300px] mx-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-200/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-bas"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Header
          </Button>
        </div>

        {/* Header Modal */}
        <Dialog open={isHeaderModalOpen} onOpenChange={setIsHeaderModalOpen}>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-[1200px] h-[90vh] max-h-[90vh] flex flex-col p-4 sm:p-8 overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-purple-100">
              <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  {editingHeaderIndex !== null ? (
                    <Edit3 className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                {editingHeaderIndex !== null ? "Edit Header" : "Add New Header"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4 text-purple-600" />
                  Header Title *
                </label>
                <Input
                  name="curriculum_lesson_header_title"
                  placeholder="Enter header title"
                  value={headerFormData.curriculum_lesson_header_title}
                  onChange={(e) =>
                    setHeaderFormData({ ...headerFormData, curriculum_lesson_header_title: e.target.value })
                  }
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Header Content
                </label>
                                <RichTextEditor
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            value={headerFormData.course_curriculum_lesson_header_content || ""}
            onChange={(value) => setHeaderFormData({ ...headerFormData, course_curriculum_lesson_header_content: value })}
  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    Video URL
                  </label>
                  <Input
                    name="video_url"
                    placeholder="https://example.com/video"
                    value={headerFormData.video_url}
                    onChange={(e) => setHeaderFormData({ ...headerFormData, video_url: e.target.value })}
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-purple-600" />
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    name="sort_order"
                    placeholder="1"
                    min="0"
                    value={headerFormData.sort_order}
                    onChange={(e) =>
                      setHeaderFormData({ ...headerFormData, sort_order: Number(e.target.value) })
                    }
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-600" />
                  Additional Content
                </label>
                <RichTextEditor
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            value={headerFormData.content_2 || ""}
            onChange={(value) => setHeaderFormData({ ...headerFormData, content_2: value })}/>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100">
              <Button 
                onClick={handleSubmitHeader} 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-200/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingHeaderIndex !== null ? "Save Changes" : "Add Header"}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default LessonHeadersForm;
