import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: number;
  documentId: string;
  short_desc: string;
  course_outline: string;
  rating_count: number;
  language: string;
  certificate: boolean;
  quizes: number | boolean;
  level: string;
  short_desc_2: string;
  sort_order: number;
  short_desc_3: string;
  course_name: string;
  weekly_curriculum_intro: string;
  duration: string;
  video_url: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
  updatedBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
  localizations: any[];
}

interface CourseFormData {
  documentId?: string;
  short_desc?: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: number | boolean;
  level?: string;
  short_desc_2?: string;
  sort_order?: number;
  short_desc_3?: string;
  course_name?: string;
  weekly_curriculum_intro?: string;
  duration?: string;
  video_url?: string;
  locale?: string;
}

interface EditCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  onSave: () => void;
  formData: CourseFormData;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  handleFormChange,
  handleSelectChange,
  handleCheckboxChange,
  handleNumberChange
}) => {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="documentId" className="text-right text-sm font-medium">
              Document ID
            </label>
            <Input
              id="documentId"
              name="documentId"
              value={formData.documentId || ''}
              onChange={handleFormChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="course_name" className="text-right text-sm font-medium">
              Course Name
            </label>
            <Input
              id="course_name"
              name="course_name"
              value={formData.course_name || ''}
              onChange={handleFormChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4 mb-4">
            <label htmlFor="short_desc" className="text-right text-sm font-medium pt-2">
              Short Description
            </label>
            <Textarea
              id="short_desc"
              name="short_desc"
              value={formData.short_desc || ''}
              onChange={handleFormChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4 mb-4">
            <label htmlFor="course_outline" className="text-right text-sm font-medium pt-2">
              Course Outline
            </label>
            <Textarea
              id="course_outline"
              name="course_outline"
              value={formData.course_outline || ''}
              onChange={handleFormChange}
              className="col-span-3"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="rating_count" className="text-right text-sm font-medium">
              Rating Count
            </label>
            <Input
              id="rating_count"
              name="rating_count"
              type="number"
              value={formData.rating_count || ''}
              onChange={handleNumberChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="language" className="text-right text-sm font-medium">
              Language
            </label>
            <div className="col-span-3">
              <Select 
                value={formData.language || ''} 
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label className="text-right text-sm font-medium">
              Certificate
            </label>
            <div className="col-span-3 flex items-center">
              <input
                type="checkbox"
                id="certificate"
                name="certificate"
                checked={formData.certificate || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="certificate" className="ml-2 block text-sm text-gray-900">
                Course provides certificate
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label className="text-right text-sm font-medium">
              Quizzes
            </label>
            <div className="col-span-3 flex items-center">
              <input
                type="checkbox"
                id="quizes"
                name="quizes"
                checked={Boolean(formData.quizes)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="quizes" className="ml-2 block text-sm text-gray-900">
                Course includes quizzes
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="level" className="text-right text-sm font-medium">
              Level
            </label>
            <div className="col-span-3">
              <Select 
                value={formData.level || ''} 
                onValueChange={(value) => handleSelectChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4 mb-4">
            <label htmlFor="short_desc_2" className="text-right text-sm font-medium pt-2">
              Short Description 2
            </label>
            <Textarea
              id="short_desc_2"
              name="short_desc_2"
              value={formData.short_desc_2 || ''}
              onChange={handleFormChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="sort_order" className="text-right text-sm font-medium">
              Sort Order
            </label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order || ''}
              onChange={handleNumberChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4 mb-4">
            <label htmlFor="short_desc_3" className="text-right text-sm font-medium pt-2">
              Short Description 3
            </label>
            <Textarea
              id="short_desc_3"
              name="short_desc_3"
              value={formData.short_desc_3 || ''}
              onChange={handleFormChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4 mb-4">
            <label htmlFor="weekly_curriculum_intro" className="text-right text-sm font-medium pt-2">
              Weekly Curriculum Intro
            </label>
            <Textarea
              id="weekly_curriculum_intro"
              name="weekly_curriculum_intro"
              value={formData.weekly_curriculum_intro || ''}
              onChange={handleFormChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="duration" className="text-right text-sm font-medium">
              Duration
            </label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration || ''}
              onChange={handleFormChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="video_url" className="text-right text-sm font-medium">
              Video URL
            </label>
            <Input
              id="video_url"
              name="video_url"
              value={formData.video_url || ''}
              onChange={handleFormChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="locale" className="text-right text-sm font-medium">
              Locale
            </label>
            <div className="col-span-3">
              <Select 
                value={formData.locale || 'en'} 
                onValueChange={(value) => handleSelectChange('locale', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
