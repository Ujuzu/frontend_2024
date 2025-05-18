// steps/InstructorsForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, UserPlus } from 'lucide-react';
import { IFormStepProps } from '@/Interfaces/ICourseRespone';

interface Instructor {
  id?: number;
  name: string;
  title: string;
  bio: string;
  image_url?: string;
}

const InstructorsForm: React.FC<IFormStepProps> = ({ formData, setFormData }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [newInstructor, setNewInstructor] = useState<Instructor>({
    name: '',
    title: '',
    bio: '',
    image_url: ''
  });
  const [existingInstructors, setExistingInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract instructors from formData when component mounts
    if (formData.courses_instructors?.data) {
      setInstructors(formData.courses_instructors.data);
    }
    
    // Fetch existing instructors from API
    fetchExistingInstructors();
  }, [formData.courses_instructors]);

  const fetchExistingInstructors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/instructors');
      if (response.ok) {
        const data = await response.json();
        setExistingInstructors(data.data.map((item: any) => ({
          id: item.id,
          ...item.attributes
        })));
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewInstructor({
      ...newInstructor,
      [e.target.name]: e.target.value
    });
  };

  const addInstructor = () => {
    if (!newInstructor.name || !newInstructor.title) return;
    
    const updatedInstructors = [...instructors, newInstructor];
    setInstructors(updatedInstructors);
    
    // Update the parent formData
    setFormData({
      ...formData,
      courses_instructors: {
        data: updatedInstructors
      }
    });
    
    // Reset the form
    setNewInstructor({
      name: '',
      title: '',
      bio: '',
      image_url: ''
    });
  };

  const addExistingInstructor = (instructor: Instructor) => {
    // Check if instructor is already added
    if (instructors.some(i => i.id === instructor.id)) return;
    
    const updatedInstructors = [...instructors, instructor];
    setInstructors(updatedInstructors);
    
    // Update the parent formData
    setFormData({
      ...formData,
      courses_instructors: {
        data: updatedInstructors
      }
    });
  };

  const removeInstructor = (index: number) => {
    const updatedInstructors = instructors.filter((_, i) => i !== index);
    setInstructors(updatedInstructors);
    
    // Update the parent formData
    setFormData({
      ...formData,
      courses_instructors: {
        data: updatedInstructors
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <UserPlus size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Course Instructors</h2>
      </div>
      
      {/* List of added instructors */}
      {instructors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium">Added Instructors</h3>
          <div className="divide-y divide-gray-100">
            {instructors.map((instructor, index) => (
              <div key={index} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{instructor.name}</p>
                  <p className="text-sm text-gray-600">{instructor.title}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInstructor(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Existing instructors section */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">Select Existing Instructors</h3>
        
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading instructors...</p>
        ) : existingInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingInstructors.map((instructor) => (
              <div 
                key={instructor.id} 
                className={`p-3 border rounded-md ${
                  instructors.some(i => i.id === instructor.id) 
                    ? 'border-[#AC19AD] bg-purple-50' 
                    : 'border-gray-200 hover:border-[#AC19AD] cursor-pointer'
                }`}
                onClick={() => addExistingInstructor(instructor)}
              >
                <p className="font-medium">{instructor.name}</p>
                <p className="text-sm text-gray-600">{instructor.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No existing instructors found.</p>
        )}
      </div>
      
      {/* Add new instructor form */}
      <div className="space-y-4 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-md font-medium">Add New Instructor</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={newInstructor.name}
              onChange={handleInputChange}
              placeholder="Enter instructor name"
              className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={newInstructor.title}
              onChange={handleInputChange}
              placeholder="e.g. Professor of Computer Science"
              className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <Input
            id="bio"
            name="bio"
            value={newInstructor.bio}
            onChange={handleInputChange}
            placeholder="Brief bio about the instructor"
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <Input
            id="image_url"
            name="image_url"
            value={newInstructor.image_url}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          />
        </div>
        
        <Button
          onClick={addInstructor}
          disabled={!newInstructor.name || !newInstructor.title}
          className="bg-[#AC19AD] hover:bg-[#8A1489] text-white mt-2"
        >
          <Plus size={16} className="mr-2" />
          Add Instructor
        </Button>
      </div>
    </div>
  );
};

export default InstructorsForm;