import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  documentId: string;
  course_name: string;
}

interface DeleteCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  onConfirmDelete: () => void;
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  onConfirmDelete
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Confirm Delete
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete this course?
            This action cannot be undone.
          </p>
          {selectedCourse && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p><strong>Course Name:</strong> {selectedCourse.course_name}</p>
              <p><strong>Document ID:</strong> {selectedCourse.documentId}</p>
              <p><strong>ID:</strong> {selectedCourse.id}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirmDelete} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
