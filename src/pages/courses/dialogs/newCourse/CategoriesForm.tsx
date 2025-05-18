import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Folder, FolderTree } from 'lucide-react';
import { IFormStepProps } from '@/Interfaces/ICourseRespone';


interface Category {
  id: number;
  attributes: {
    name: string;
    description?: string;
    subcategories?: {
      data: Subcategory[];
    };
  };
}

interface Subcategory {
  id: number;
  attributes: {
    name: string;
    description?: string;
  };
}

const CategoriesForm: React.FC<IFormStepProps> = ({ formData, setFormData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);

  useEffect(() => {
    // Extract selected categories and subcategories from formData
    if (formData.courses_categories) {
      setSelectedCategoryIds(formData.courses_categories.map((cat: any) => cat.id));
    }
    
    if (formData.courses_subcategories) {
      setSelectedSubcategoryIds(formData.courses_subcategories.map((subcat: any) => subcat.id));
    }
    
    // Fetch categories from API
    fetchCategories();
  }, [formData.courses_categories, formData.courses_subcategories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories?populate=subcategories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    let updated: number[];
    
    if (selectedCategoryIds.includes(categoryId)) {
      // Remove category
      updated = selectedCategoryIds.filter(id => id !== categoryId);
      
      // Also remove any subcategories of this category
      const categoryToRemove = categories.find(cat => cat.id === categoryId);
      if (categoryToRemove?.attributes.subcategories?.data) {
        const subcategoryIdsToRemove = categoryToRemove.attributes.subcategories.data.map(sub => sub.id);
        setSelectedSubcategoryIds(prev => 
          prev.filter(id => !subcategoryIdsToRemove.includes(id))
        );
      }
    } else {
      // Add category
      updated = [...selectedCategoryIds, categoryId];
    }
    
    setSelectedCategoryIds(updated);
    
    // Update the parent formData
    setFormData({
      ...formData,
      courses_categories: {
        data: updated.map(id => ({ id }))
      }
    });
  };

  const toggleSubcategory = (subcategoryId: number, parentCategoryId: number) => {
    let updatedSubcats: number[];
    
    if (selectedSubcategoryIds.includes(subcategoryId)) {
      // Remove subcategory
      updatedSubcats = selectedSubcategoryIds.filter(id => id !== subcategoryId);
    } else {
      // Add subcategory and ensure its parent category is selected too
      updatedSubcats = [...selectedSubcategoryIds, subcategoryId];
      
      if (!selectedCategoryIds.includes(parentCategoryId)) {
        // Add parent category if not already selected
        const updatedCats = [...selectedCategoryIds, parentCategoryId];
        setSelectedCategoryIds(updatedCats);
        
        // Update parent formData for categories
        setFormData(prev => ({
          ...prev,
          courses_categories: {
            data: updatedCats.map(id => ({ id }))
          }
        }));
      }
    }
    
    setSelectedSubcategoryIds(updatedSubcats);
    
    // Update the parent formData
    setFormData(prev => ({
      ...prev,
      courses_subcategories: {
        data: updatedSubcats.map(id => ({ id }))
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <FolderTree size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Course Categories</h2>
      </div>
      
      <p className="text-sm text-gray-700">
        Select the categories and subcategories that best describe your course. 
        Students will be able to find your course through these categories.
      </p>
      
      {isLoading ? (
        <div className="py-4 text-center text-gray-500">Loading categories...</div>
      ) : categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg overflow-hidden">
              <Button
                type="button"
                variant={selectedCategoryIds.includes(category.id) ? "default" : "outline"}
                className={`w-full justify-start rounded-none ${
                  selectedCategoryIds.includes(category.id) 
                    ? 'bg-[#AC19AD] hover:bg-[#8A1489] text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <Folder size={18} className="mr-2" />
                {category.attributes.name}
              </Button>
              
              {category.attributes.subcategories?.data && category.attributes.subcategories.data.length > 0 && (
                <div className={`pl-8 py-2 ${selectedCategoryIds.includes(category.id) ? 'bg-purple-50' : 'bg-gray-50'}`}>
                  <div className="text-sm font-medium mb-2">Subcategories:</div>
                  <div className="space-y-1">
                    {category.attributes.subcategories.data.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`subcat-${subcategory.id}`}
                          checked={selectedSubcategoryIds.includes(subcategory.id)}
                          onChange={() => toggleSubcategory(subcategory.id, category.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#AC19AD] focus:ring-[#AC19AD]"
                        />
                        <label
                          htmlFor={`subcat-${subcategory.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {subcategory.attributes.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-gray-500">No categories found.</div>
      )}
    </div>
  );
};

export default CategoriesForm;