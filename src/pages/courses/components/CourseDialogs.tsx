// src/pages/courses/components/CourseDialogs.tsx
import React from 'react';
import { DialogState } from '@/Interfaces/ICourseRespone';
import EditCourseDialog from '../dialogs/EditCourseDialog';
import DeleteCourseDialog from '../dialogs/DeleteCourseDialog';
import ViewCourseDialog from '../dialogs/ViewCourseDialog';
import AddCourseDialog from '../dialogs/newCourse/AddCourseDialog';

interface CourseDialogsProps {
  dialogState: DialogState;
  onClose: () => void;
  onSuccess: () => void;
  onEditSuccess: () => void;
  onConfirmDelete: () => void;
}

export const CourseDialogs: React.FC<CourseDialogsProps> = ({
  dialogState,
  onClose,
//   onSuccess,
  onEditSuccess,
  onConfirmDelete
}) => {
  const {
    isAddCourseOpen,
    isEditCourseOpen,
    isDeleteCourseOpen,
    isViewCourseOpen,
    selectedCourse
  } = dialogState;

  return (
    <>
      {/* Add Course Dialog - Remove the wrapping Dialog since AddCourseDialog has its own */}
      <AddCourseDialog 
        isOpen={isAddCourseOpen}
        onClose={onClose}  
        onSuccess={onEditSuccess} 
        selectedCourse={selectedCourse} 
        isEdit={!!selectedCourse}
        course_Id={selectedCourse?.id} 
      />
      
      {/* Edit Course Dialog */}
      <EditCourseDialog 
        isOpen={isEditCourseOpen}
        onClose={onClose}
        selectedCourse={selectedCourse}
        onSave={onEditSuccess}
      />
      
      {/* Delete Course Dialog */}
      <DeleteCourseDialog 
        isOpen={isDeleteCourseOpen}
        onClose={onClose}
        selectedCourse={selectedCourse}
        onConfirmDelete={onConfirmDelete}
      />
      
      {/* View Course Dialog */}
      <ViewCourseDialog 
        isOpen={isViewCourseOpen}
        onClose={onClose}
        course={selectedCourse}
      />
    </>
  );
};
