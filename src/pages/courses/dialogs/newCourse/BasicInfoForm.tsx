import { BasicInfoFormProps } from "@/Interfaces/ICourseRespone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, Save } from "lucide-react";

import React, { useEffect, useState } from "react";
import { ICourseCategoryResponse } from "@/Interfaces/ICourseCategory";
import { ICourseSubcategoryResponse } from "@/Interfaces/ICourseSubcategory";
import { courseService } from "@/service/courseService";
import { useAuth } from "@/context/AuthContext";
import CategorySelector from "../../components/AddCategories";
import { IStrapiUploadResponse } from "@/Interfaces/IStrapiFileUploader";
import StrapiFileUploader from "@/components/input/StrapiFileUploader";
import { extractExistingFiles } from "@/utils/strapiMediaToUploadResponseHelper";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";


const BasicInfoForm: React.FC<BasicInfoFormProps> = ({  formData, 
  setFormData, 
  courseData, 
  isEditing,
  onSave,
  refreshCourseData }) => {
  // Ensure formData is initialized
  const [categories, setCategories] = useState<ICourseCategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<
    ICourseSubcategoryResponse[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuth();
        
    const [existingImage, setExistingImage] = useState<IStrapiUploadResponse[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await courseService.getCourseCatergories(token) || [];
        setCategories(categoryData.data ? categoryData.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const subcategoryData = await courseService.getCourseSubCategories(token) || [];
        setSubcategories(subcategoryData.data ? subcategoryData.data : []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, [token]);

  // Update existing image when courseData changes
  useEffect(() => {
    if (courseData) {
      const files = extractExistingFiles(courseData, 'attributes.course_intro_img');
      setExistingImage(files);
    }
  }, [courseData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value ?? "",
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value) || 0,
    });
  };

  const handleThumbnailUpload = (fileData: IStrapiUploadResponse) => {
    setFormData(prev => ({
      ...prev,
      course_intro_img: fileData.id
    }));
    setExistingImage([fileData]);
  };

  const handleThumbnailDelete = () => {
    setFormData(prev => ({
      ...prev,
      course_intro_img: null
    }));
    setExistingImage([]);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    toast.error(error);
  };

  const handleSaveBasicInfo = async () => {
    setIsSaving(true);
    try {
      await onSave();
      // Refresh course data to get latest including uploaded images
      refreshCourseData();
    } catch (error) {
      console.error("Error saving basic info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full h-full">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#AC19AD]" />
          <h2 className="text-xl font-semibold">
            {courseData?.attributes?.course_name
              ? `Editing: ${courseData.attributes.course_name}`
              : "Basic Course Information"}
          </h2>
        </div>
        
        {/* Save Button for Basic Info */}
        <Button
          onClick={handleSaveBasicInfo}
          disabled={isSaving || !formData.course_name.trim()}
          className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update' : 'Save'} Basic Info
            </>
          )}
        </Button>
      </div>

      {/* Show course status */}
      {courseData && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-700">
            ✅ Course "{courseData.attributes.course_name}" is saved (ID: {courseData.id})
          </p>
        </div>
      )}

      {/* Course Name */}
      <div className="space-y-2">
        <Label htmlFor="course_name" className="text-sm font-medium">
          Course Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="course_name"
          name="course_name"
          value={formData.course_name || ""}
          onChange={handleInputChange}
          placeholder="Enter course name"
          className="w-full"
          required
        />
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="short_desc" className="text-sm font-medium">
          Short Description
        </Label>
        <Textarea
          id="short_desc"
          name="short_desc"
          value={formData.short_desc || ""}
          onChange={handleInputChange}
          placeholder="Brief description of the course"
          className="w-full resize-none"
          rows={3}
        />
      </div>

      {/* Additional Short Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="short_desc_2" className="text-sm font-medium">
            Additional Description
          </Label>
          <Textarea
            id="short_desc_2"
            name="short_desc_2"
            value={formData.short_desc_2 || ""}
            onChange={handleInputChange}
            placeholder="Additional course description"
            className="w-full resize-none"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="short_desc_3" className="text-sm font-medium">
            Extra Description
          </Label>
          <Textarea
            id="short_desc_3"
            name="short_desc_3"
            value={formData.short_desc_3 || ""}
            onChange={handleInputChange}
            placeholder="Extra course description"
            className="w-full resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Course Outline */}
      <div className="space-y-2">
        <Label htmlFor="course_outline" className="text-sm font-medium">
          Course Outline
        </Label>
        <Textarea
          id="course_outline"
          name="course_outline"
          value={formData.course_outline || ""}
          onChange={handleInputChange}
          placeholder="Detailed outline of the course"
          className="w-full resize-none"
          rows={4}
        />
      </div>

      {/* Weekly Curriculum Intro */}
      <div className="space-y-2">
        <Label
          htmlFor="weekly_curriculum_intro"
          className="text-sm font-medium"
        >
          Weekly Curriculum Introduction
        </Label>
        <Textarea
          id="weekly_curriculum_intro"
          name="weekly_curriculum_intro"
          value={formData.weekly_curriculum_intro || ""}
          onChange={handleInputChange}
          placeholder="Introduction to the weekly curriculum"
          className="w-full resize-none"
          rows={3}
        />
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            Duration
          </Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration || ""}
            onChange={handleInputChange}
            placeholder="e.g. 8 weeks, 3 months"
            className="w-full"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">
            Language
          </Label>
          <Select
            value={formData.language || ""}
            onValueChange={(value) => handleSelectChange("language", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <Label htmlFor="level" className="text-sm font-medium">
            Difficulty Level
          </Label>
          <Select
            value={formData.level || ""}
            onValueChange={(value) => handleSelectChange("level", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="all-levels">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sort_order" className="text-sm font-medium">
            Sort Order
          </Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            value={formData.sort_order || 0}
            onChange={handleNumericChange}
            placeholder="Enter a number for sorting"
            className="w-full"
            min={0}
          />
        </div>

        {/* Rating Count */}
        <div className="space-y-2">
          <Label htmlFor="rating_count" className="text-sm font-medium">
            Rating Count
          </Label>
          <Input
            id="rating_count"
            name="rating_count"
            type="number"
            value={formData.rating_count || 0}
            onChange={handleNumericChange}
            placeholder="Enter number of ratings"
            className="w-full"
            min={0}
          />
        </div>

        {/* Video URL */}
        <div className="space-y-2">
          <Label htmlFor="video_url" className="text-sm font-medium">
            Video URL
          </Label>
          <Input
            id="video_url"
            name="video_url"
            value={formData.video_url || ""}
            onChange={handleInputChange}
            placeholder="https://..."
            className="w-full"
          />
        </div>
      </div>
      <CategorySelector
        availableCategories={categories}
        availableSubcategories={subcategories}
        selectedCategories={
          Array.isArray(formData?.courses_categories)
            ? formData.courses_categories
            : []
        }
        selectedSubcategories={
          Array.isArray(formData?.courses_subcategories)
            ? formData?.courses_subcategories
            : []
        }
        setSelectedCategories={(ids) =>
          setFormData({ ...formData, courses_categories: ids })
        }
        setSelectedSubcategories={(ids) =>
          setFormData({ ...formData, courses_subcategories: ids })
        }
      />

{/* Course course intro image*/}

      <div className="space-y-2">
        
        <Label htmlFor="course_intro_img" className="text-sm font-medium">
          Course Intro Image
        </Label>
 {/* <StrapiFileUploader
          onUploadSuccess={handleThumbnailUpload}
          mediaType="image"
          multiple={false}
          maxFileSize={1}
        /> */}
        <StrapiFileUploader
          onUploadSuccess={handleThumbnailUpload}
          onFileDelete={handleThumbnailDelete}
          onUploadError={handleUploadError}
          mediaType="image"
          multiple={false}
          maxFileSize={1}
          maximumFileCount={1}
          existingFiles={existingImage}
          placeholder="Upload course introduction image"
        />
      </div>

      {/* Course Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="certificate" className="text-sm font-medium">
              Certificate
            </Label>
            <p className="text-xs text-gray-500">
              Course includes a completion certificate
            </p>
          </div>
          <Switch
            id="certificate"
            name="certificate"
            checked={!!formData.certificate}
            onCheckedChange={(checked) =>
              handleSwitchChange("certificate", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="quizes" className="text-sm font-medium">
              Quizzes
            </Label>
            <p className="text-xs text-gray-500">
              Course includes interactive quizzes
            </p>
          </div>
          <Switch
            id="quizes"
            name="quizes"
            checked={!!formData.quizes}
            onCheckedChange={(checked) => handleSwitchChange("quizes", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
