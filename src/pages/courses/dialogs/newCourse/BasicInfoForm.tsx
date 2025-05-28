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
import { BookOpen, Loader2, Save, CheckCircle, Clock, Globe, BarChart3, Star, Video, Award, HelpCircle, Image } from "lucide-react";
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

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData, 
  setFormData, 
  courseData, 
  isEditing,
  onSave,
  refreshCourseData 
}) => {
  const [categories, setCategories] = useState<ICourseCategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<ICourseSubcategoryResponse[]>([]);
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
      refreshCourseData();
    } catch (error) {
      console.error("Error saving basic info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {courseData?.attributes?.course_name
                  ? `Editing: ${courseData.attributes.course_name}`
                  : "Basic Course Information"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Set up the fundamental details of your course
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleSaveBasicInfo}
            disabled={isSaving || !formData.course_name.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
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
        {/* Course Status */}
        {courseData && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                Course "{courseData.attributes.course_name}" is saved (ID: {courseData.id})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Basic Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-purple-600" />
          Course Details
        </h3>
        
        <div className="space-y-6">
          {/* Course Name */}
          <div className="w-full space-y-2">
            <Label htmlFor="course_name" className="text-sm font-medium text-gray-700">
              Course Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="course_name"
              name="course_name"
              value={formData.course_name || ""}
              onChange={handleInputChange}
              placeholder="Enter an engaging course title"
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          {/* Short Description */}
          <div className="w-full space-y-2">
            <Label htmlFor="short_desc" className="text-sm font-medium text-gray-700">
              Short Description
            </Label>
            <Textarea
              id="short_desc"
              name="short_desc"
              value={formData.short_desc || ""}
              onChange={handleInputChange}
              placeholder="Write a compelling brief description that highlights the main value of your course"
              className="w-full resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={3}
            />
          </div>

          {/* Additional Description */}
          <div className="w-full space-y-4">
            <Label htmlFor="short_desc_2" className="text-sm font-medium text-gray-700">
              Additional Description
            </Label>
            <Textarea
              id="short_desc_2"
              name="short_desc_2"
              value={formData.short_desc_2 || ""}
              onChange={handleInputChange}
              placeholder="Add more details about course benefits and outcomes"
              className="w-full resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={3}
            />
          </div>
          
          {/* Extra Description */}
          <div className="w-full space-y-2">
            <Label htmlFor="short_desc_3" className="text-sm font-medium text-gray-700">
              Extra Description
            </Label>
            <Textarea
              id="short_desc_3"
              name="short_desc_3"
              value={formData.short_desc_3 || ""}
              onChange={handleInputChange}
              placeholder="Include target audience and prerequisites information"
              className="w-full resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={3}
            />
          </div>

          {/* Course Outline */}
          <div className="w-full space-y-2">
            <Label htmlFor="course_outline" className="text-sm font-medium text-gray-700">
              Course Outline
            </Label>
            <Textarea
              id="course_outline"
              name="course_outline"
              value={formData.course_outline || ""}
              onChange={handleInputChange}
              placeholder="Provide a detailed structure of what students will learn throughout the course"
              className="w-full resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={4}
            />
          </div>

          {/* Weekly Curriculum Intro */}
          <div className="w-full space-y-2">
            <Label htmlFor="weekly_curriculum_intro" className="text-sm font-medium text-gray-700">
              Weekly Curriculum Introduction
            </Label>
            <Textarea
              id="weekly_curriculum_intro"
              name="weekly_curriculum_intro"
              value={formData.weekly_curriculum_intro || ""}
              onChange={handleInputChange}
              placeholder="Introduce how the weekly curriculum is structured and what students can expect"
              className="w-full resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Course Properties Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-600" />
          Course Properties
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              Duration
            </Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration || ""}
              onChange={handleInputChange}
              placeholder="e.g. 8 weeks, 3 months"
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe size={14} className="text-gray-500" />
              Language
            </Label>
            <Select
              value={formData.language || ""}
              onValueChange={(value) => handleSelectChange("language", value)}
            >
              <SelectTrigger className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="fr">🇫🇷 French</SelectItem>
                <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                <SelectItem value="de">🇩🇪 German</SelectItem>
                <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BarChart3 size={14} className="text-gray-500" />
              Difficulty Level
            </Label>
            <Select
              value={formData.level || ""}
              onValueChange={(value) => handleSelectChange("level", value)}
            >
              <SelectTrigger className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🌱 Beginner</SelectItem>
                <SelectItem value="intermediate">🚀 Intermediate</SelectItem>
                <SelectItem value="advanced">⭐ Advanced</SelectItem>
                <SelectItem value="all-levels">📚 All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort_order" className="text-sm font-medium text-gray-700">
              Sort Order
            </Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order || 0}
              onChange={handleNumericChange}
              placeholder="0"
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              min={0}
            />
          </div>

          {/* Rating Count */}
          <div className="space-y-2">
            <Label htmlFor="rating_count" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Star size={14} className="text-gray-500" />
              Rating Count
            </Label>
            <Input
              id="rating_count"
              name="rating_count"
              type="number"
              value={formData.rating_count || 0}
              onChange={handleNumericChange}
              placeholder="0"
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              min={0}
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video_url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Video size={14} className="text-gray-500" />
              Video URL
            </Label>
            <Input
              id="video_url"
              name="video_url"
              value={formData.video_url || ""}
              onChange={handleInputChange}
              placeholder="https://youtube.com/..."
              className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
      </div>

      {/* Course Image Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image size={18} className="text-purple-600" />
          Course Image
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="course_intro_img" className="text-sm font-medium text-gray-700">
            Course Introduction Image
          </Label>
          <p className="text-xs text-gray-500 mb-3">
            Upload an engaging image that represents your course. Recommended size: 1200x630px
          </p>
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
      </div>

      {/* Course Features Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Award size={18} className="text-purple-600" />
          Course Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Award size={16} className="text-purple-600" />
              </div>
              <div>
                <Label htmlFor="certificate" className="text-sm font-medium text-gray-900">
                  Certificate
                </Label>
                <p className="text-xs text-gray-600">
                  Students receive a completion certificate
                </p>
              </div>
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

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <HelpCircle size={16} className="text-purple-600" />
              </div>
              <div>
                <Label htmlFor="quizes" className="text-sm font-medium text-gray-900">
                  Quizzes
                </Label>
                <p className="text-xs text-gray-600">
                  Course includes interactive quizzes
                </p>
              </div>
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
    </div>
  );
};

export default BasicInfoForm;
