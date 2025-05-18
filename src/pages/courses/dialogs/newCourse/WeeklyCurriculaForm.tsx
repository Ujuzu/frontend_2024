// WeeklyCurriculaForm.tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IFormStepProps } from '@/Interfaces/ICourseRespone';
import { ICoursesWklyCurriculumAttrib, IWeeklyCurriculumResponse } from '@/Interfaces/IWeeklyCurriculum';
import {  Calendar, ClipboardList } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-day-picker';

const WeeklyCurriculaForm: React.FC<IFormStepProps> = ({ formData, setFormData }) => {
  const [weeklyCurricula, setWeeklyCurricula] = useState<IWeeklyCurriculumResponse[]>([]);
  const [currentWeek, setCurrentWeek] = useState<ICoursesWklyCurriculumAttrib>({
    curriculum_title: "",
    curriculum_reg: '',
    intro_pic: null,
  });


  useEffect(() => {
    // Extract weekly curricula from formData when component mounts
    if (formData.courses_weekly_curricula) {
      setWeeklyCurricula(formData.courses_weekly_curricula);
    }
  }, [formData.courses_weekly_curricula]);

  const handleWeekInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentWeek({
      ...currentWeek,
      [e.target.name]: e.target.name 
    });
  };
  
    const handleAddWeek = () => {
        if (!formData) return;
    
        setFormData({
        ...formData,
        });
        
        // Reset current week state
        setCurrentWeek({
        curriculum_title: "",
        curriculum_reg: '',
        intro_pic: null,
        });
    };  


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <Calendar size={20} className="text-[#AC19AD]" />
        <h2 className="text-xl font-semibold">Weekly Curriculum</h2>
      </div>
      
      {/* Introduction text for weekly curriculum */}
      <div className="space-y-2">
        <label htmlFor="weekly_curriculum_intro" className="block text-sm font-medium text-gray-700">
          Curriculum Introduction
        </label>
        <Textarea
          id="weekly_curriculum_intro"
          name="weekly_curriculum_intro"
          value={formData.weekly_curriculum_intro || ''}
          onChange={(e) => {
            setFormData({
              ...formData,
              weekly_curriculum_intro: e.target.value
            });
          }}
          placeholder="Provide an introduction to your curriculum"
          rows={3}
          className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
        />
      </div>
      
      {/* List of added weeks */}
      {weeklyCurricula.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium">Curriculum Weeks</h3>
          <div className="divide-y divide-gray-100">
            {weeklyCurricula.map((week, weekIndex) => (
              <div key={weekIndex} className="py-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium flex items-center">
                    
                      {week.attributes.curriculum_title}
                    </h4>
                    {week.attributes.curriculum_desc && (
                      <p className="text-sm text-gray-600 mt-1">{week.attributes.curriculum_desc}</p>
                    )}
                  </div>
                </div>
                
                {/* Week items */}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add/Edit Week Form */}
      <div className="space-y-4 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-md font-medium">
         Add New Weekly Curriculum
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label htmlFor="curriculum_title" className="block text-sm font-medium text-gray-700">
              Curruculum Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="curriculum_title"
              name="curriculum_title"
              type="string"
              value={currentWeek.curriculum_title}
              onChange={handleWeekInputChange}
             
              className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
            />
          </div>
          
        </div>
        
        <div className="space-y-2">
          <label htmlFor="curriculum_desc" className="block text-sm font-medium text-gray-700">
            Week Description
          </label>
          <Textarea
            id="curriculum_desc"
            name="curriculum_desc"
            value={currentWeek.curriculum_desc}
            onChange={handleWeekInputChange}
            placeholder="Brief description of this week's content"
            rows={2}
            className="w-full focus:ring-[#AC19AD] focus:border-[#AC19AD]"
          />
        </div>
        
        {/* Week items section */}
        <div className="space-y-4 border rounded-md p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-[#AC19AD]" />
            <h4 className="text-sm font-medium">Week Content Items</h4>
          </div>
        </div>
         <div className="flex space-x-2 mt-4">

          
          <Button
            onClick={handleAddWeek}
            className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
          >
            Add curriculum
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCurriculaForm;