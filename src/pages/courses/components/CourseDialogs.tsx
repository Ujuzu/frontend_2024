import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";


import { DialogState } from '@/Interfaces/ICourseRespone';
import EditCourseDialog from '../dialogs/EditCourseDialog';
import DeleteCourseDialog from '../dialogs/DeleteCourseDialog';
import ViewCourseDialog from '../dialogs/ViewCourseDialog';


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
      {/* Add Course Dialog */}
      <Dialog open={isAddCourseOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[80vw] w-full max-h-[95vh] p-0">
          {/* <CourseCreation 
            onClose={onClose} 
            onSuccess={onSuccess} 
          /> */}
        </DialogContent>
      </Dialog>
      
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