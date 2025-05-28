// LessonHeadersForm.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Pencil, 
  BookOpen, 
  Video, 
  FileText, 
  Loader2, 
  AlertCircle,
  Hash,
  Link,
  PlusCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { lessonHeaderService } from "@/service/curriculumLessonHeaderService";
import { LessonHeadersFormProps } from "@/Interfaces/ILessonHeaders";
import useFetchLessonHeaders from "@/hooks/useFetchLessonHeaders";

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
  const [submitting, setSubmitting] = useState(false);
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
      toast.error("Please enter a header title.");
      return;
    }
    
    try {
      setSubmitting(true);
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
      
      toast.success("Lesson header saved successfully!");
      setIsHeaderModalOpen(false);
      
      // Refresh the headers list to get the latest data from the server
      await refreshHeaders();
      
    } catch (error) {
      console.error("Error saving header:", error);
      toast.error("Failed to save lesson header.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading && headers.length === 0 && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Lesson Headers</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-gray-600 font-medium">Loading lesson headers...</p>
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Lesson Headers</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Error loading lesson headers</p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
              </div>
              <Button
                onClick={refreshHeaders}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>
                Lesson Headers for "{lesson?.attributes?.curriculum_lesson_title || "Untitled Lesson"}"
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Headers List */}
            <div className="space-y-3">
              {Array.isArray(headers) && headers.length > 0 ? (
                <div className="space-y-3">
                  {headers
                    .sort((a, b) => (a.attributes.sort_order || 0) - (b.attributes.sort_order || 0))
                    .map((header, index) => (
                    <div 
                      key={header.id} 
                      className="border border-gray-200 p-4 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {header?.attributes?.curriculum_lesson_header_title}
                              </h3>
                              {header?.attributes?.sort_order && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <Hash className="w-3 h-3 mr-1" />
                                  {header.attributes.sort_order}
                                </span>
                              )}
                            </div>
                            
                            {header?.attributes?.course_curriculum_lesson_header_content && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {header.attributes.course_curriculum_lesson_header_content}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {header?.attributes?.video_url && (
                                <div className="flex items-center space-x-1">
                                  <Video className="w-3 h-3" />
                                  <span>Video attached</span>
                                </div>
                              )}
                              {header?.attributes?.content_2 && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-3 h-3" />
                                  <span>Additional content</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleOpenHeaderModal(index)}
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex-shrink-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No lesson headers found</p>
                  <p className="text-gray-500 text-sm mt-1">Create your first header to get started</p>
                </div>
              )}
            </div>

            {/* Add Header Button */}
            <Button 
              onClick={() => handleOpenHeaderModal()} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Header
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Creation/Edit Modal */}
      <Dialog open={isHeaderModalOpen} onOpenChange={setIsHeaderModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>{editingHeaderIndex !== null ? "Edit Header" : "Add New Header"}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Header Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Header Title *</span>
              </label>
              <Input
                name="curriculum_lesson_header_title"
                placeholder="Enter header title"
                value={headerFormData.curriculum_lesson_header_title}
                onChange={(e) =>
                  setHeaderFormData({ ...headerFormData, curriculum_lesson_header_title: e.target.value })
                }
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Header Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Header Content</span>
              </label>
              <Textarea
                name="course_curriculum_lesson_header_content"
                placeholder="Enter header content"
                value={headerFormData.course_curriculum_lesson_header_content}
                onChange={(e) =>
                  setHeaderFormData({ ...headerFormData, course_curriculum_lesson_header_content: e.target.value })
                }
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Video className="w-4 h-4" />
                <span>Video URL</span>
              </label>
              <Input
                name="video_url"
                placeholder="https://example.com/video.mp4"
                value={headerFormData.video_url}
                onChange={(e) => setHeaderFormData({ ...headerFormData, video_url: e.target.value })}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Hash className="w-4 h-4" />
                <span>Sort Order</span>
              </label>
              <Input
                type="number"
                name="sort_order"
                placeholder="1"
                min="1"
                value={headerFormData.sort_order}
                onChange={(e) =>
                  setHeaderFormData({ ...headerFormData, sort_order: Number(e.target.value) })
                }
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500">Headers will be displayed in ascending order</p>
            </div>

            {/* Additional Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>Additional Content</span>
              </label>
              <Textarea
                name="content_2"
                placeholder="Enter additional content (optional)"
                value={headerFormData.content_2}
                onChange={(e) => setHeaderFormData({ ...headerFormData, content_2: e.target.value })}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSubmitHeader} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={submitting || !headerFormData.curriculum_lesson_header_title.trim()}
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  {editingHeaderIndex !== null ? (
                    <>
                      <Pencil className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Header
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LessonHeadersForm;
