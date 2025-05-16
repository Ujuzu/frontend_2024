import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { ICourseResponse } from '@/Interfaces/ICourseRespone';
import { courseService } from '@/service/courseService';

interface EditCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: ICourseResponse | null;
  onSave: () => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  onSave
}) => {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Reset form when course changes
  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        documentId: selectedCourse.id,
        course_name: selectedCourse.attributes.course_name,
        short_desc: selectedCourse.attributes.short_desc,
        short_desc_2: selectedCourse.attributes.short_desc_2,
        short_desc_3: selectedCourse.attributes.short_desc_3,
        course_outline: selectedCourse.attributes.course_outline,
        weekly_curriculum_intro: selectedCourse.attributes.weekly_curriculum_intro,
        language: selectedCourse.attributes.language,
        level: selectedCourse.attributes.level,
        duration: selectedCourse.attributes.duration,
        video_url: selectedCourse.attributes.video_url,
        rating_count: selectedCourse.attributes.rating_count,
        certificate: selectedCourse.attributes.certificate,
        quizes: selectedCourse.attributes.quizes,
        sort_order: selectedCourse.attributes.sort_order,
        locale: selectedCourse.attributes.locale || 'en'
      });
    }
  }, [selectedCourse]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !token) return;
    
    setIsSubmitting(true);
    try {
      await courseService.updateCourse(token, selectedCourse.id, formData);
      onSave();
    } catch (error) {
      console.error('Error updating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!selectedCourse) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[80vw] w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course: {selectedCourse.attributes.course_name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="course_name">Course Name</Label>
              <Input
                id="course_name"
                name="course_name"
                value={formData.course_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Document ID */}
            <div className="space-y-2">
              <Label htmlFor="documentId">Document ID</Label>
              <Input
                id="documentId"
                name="documentId"
                value={formData.documentId || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
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
                </SelectContent>
              </Select>
            </div>
            
            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
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
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
              />
            </div>
            
            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                name="video_url"
                value={formData.video_url || ''}
                onChange={handleChange}
              />
            </div>
            
            {/* Rating Count */}
            <div className="space-y-2">
              <Label htmlFor="rating_count">Rating Count</Label>
              <Input
                id="rating_count"
                name="rating_count"
                type="number"
                value={formData.rating_count || 0}
                onChange={handleChange}
              />
            </div>
            
            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                value={formData.sort_order || 0}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="short_desc">Short Description</Label>
            <Textarea
              id="short_desc"
              name="short_desc"
              value={formData.short_desc || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          {/* Short Description 2 */}
          <div className="space-y-2">
            <Label htmlFor="short_desc_2">Short Description 2</Label>
            <Textarea
              id="short_desc_2"
              name="short_desc_2"
              value={formData.short_desc_2 || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          {/* Short Description 3 */}
          <div className="space-y-2">
            <Label htmlFor="short_desc_3">Short Description 3</Label>
            <Textarea
              id="short_desc_3"
              name="short_desc_3"
              value={formData.short_desc_3 || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          {/* Course Outline */}
          <div className="space-y-2">
            <Label htmlFor="course_outline">Course Outline</Label>
            <Textarea
              id="course_outline"
              name="course_outline"
              value={formData.course_outline || ''}
              onChange={handleChange}
              rows={5}
            />
          </div>
          
          {/* Weekly Curriculum Intro */}
          <div className="space-y-2">
            <Label htmlFor="weekly_curriculum_intro">Weekly Curriculum Intro</Label>
            <Textarea
              id="weekly_curriculum_intro"
              name="weekly_curriculum_intro"
              value={formData.weekly_curriculum_intro || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          {/* Checkboxes */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="certificate"
                checked={!!formData.certificate}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('certificate', checked === true)
                }
              />
              <Label htmlFor="certificate">Certificate</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quizes"
                checked={!!formData.quizes}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('quizes', checked === true)
                }
              />
              <Label htmlFor="quizes">Quizes</Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;