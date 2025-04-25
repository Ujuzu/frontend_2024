import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, FileText, Tag, AlertCircle } from "lucide-react";

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
  isDeleting?: boolean;
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  onConfirmDelete,
  isDeleting = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={24} />
            <DialogTitle className="text-xl">
              Confirm Deletion
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 pt-2">
            This action cannot be undone. This will permanently delete the course and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {selectedCourse && (
            <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                  Course details
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course Name</p>
                    <p className="font-medium">{selectedCourse.course_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Tag size={18} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Document ID</p>
                    <p className="font-mono text-sm">{selectedCourse.documentId}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Tag size={18} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p className="font-mono text-sm">{selectedCourse.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex items-start p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5 mr-2" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Warning</p>
              <p>Deleting this course will remove all associated data including enrollment records, student progress, and reviews. Students will no longer be able to access this course.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="mr-4 border-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={onConfirmDelete} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                Delete Course
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
