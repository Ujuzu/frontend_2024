// CurriculumForm.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, X, PlusCircle } from 'lucide-react';
import { FormStepProps } from './types';

const CurriculumForm: React.FC<FormStepProps> = ({ 
  formData, 
  setFormData, 
  curriculumItems = [], 
  setCurriculumItems 
}) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCurriculumChange = (index: number, field: string, value: string) => {
    if (!setCurriculumItems) return;
    
    const updatedItems = [...curriculumItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setCurriculumItems(updatedItems);
  };
  
  const addCurriculumItem = () => {
    if (!setCurriculumItems) return;
    
    setCurriculumItems([
      ...curriculumItems,
      { title: '', description: '', order: curriculumItems.length + 1 }
    ]);
  };
  
  const removeCurriculumItem = (index: number) => {
    if (!setCurriculumItems || curriculumItems.length <= 1) return;
    
    const updatedItems = curriculumItems.filter((_, i) => i !== index);
    // Update the order of remaining items
    const reorderedItems = updatedItems.map((item, i) => ({
      ...item,
      order: i + 1
    }));
    setCurriculumItems(reorderedItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <BookOpen size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Curriculum</h2>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="weekly_curriculum_intro" className="block text-sm font-medium text-gray-700">
          Curriculum Introduction
        </label>
        <Textarea
          id="weekly_curriculum_intro"
          name="weekly_curriculum_intro"
          value={formData.weekly_curriculum_intro || ''}
          onChange={handleInputChange}
          placeholder="Introduce your curriculum"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
        />
      </div>
      
      <div className="space-y-6">
        {curriculumItems.map((item, index) => (
          <div key={index} className="p-5 border rounded-lg border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-[#AC19AD]/20 text-[#AC19AD] rounded-full w-8 h-8 flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <h3 className="text-md font-medium">Module {index + 1}</h3>
              </div>
              <button
                type="button"
                onClick={() => removeCurriculumItem(index)}
                className="text-gray-500 hover:text-red-600 transition-colors"
                disabled={curriculumItems.length === 1}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={`module-title-${index}`} className="block text-sm font-medium text-gray-700">
                  Module Title
                </label>
                <Input
                  id={`module-title-${index}`}
                  value={item.title}
                  onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                  placeholder="Enter module title"
                  className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor={`module-desc-${index}`} className="block text-sm font-medium text-gray-700">
                  Module Description
                </label>
                <Textarea
                  id={`module-desc-${index}`}
                  value={item.description}
                  onChange={(e) => handleCurriculumChange(index, 'description', e.target.value)}
                  placeholder="Describe this module"
                  rows={3}
                  className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button
        type="button"
        onClick={addCurriculumItem}
        variant="outline" 
        className="flex items-center gap-2 mt-4 border-[#AC19AD]/30 text-[#AC19AD] hover:bg-[#AC19AD]/10"
      >
        <PlusCircle size={16} />
        Add Module
      </Button>
    </div>
  );
};

export default CurriculumForm;
