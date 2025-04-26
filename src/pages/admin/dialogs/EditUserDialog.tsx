// src/pages/admin/dialogs/EditUserDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFormData {
  username?: string;
  email?: string;
  password?: string;
}

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void> | void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      // If onSave completes successfully, dialog will be closed by the parent component
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing dialog while saving
      if (isSaving && !open) return;
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-username" className="text-right text-sm font-medium">
              Username
            </label>
            <Input
              id="edit-username"
              name="username"
              value={formData.username || ''}
              onChange={onFormChange}
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={onFormChange}
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-password" className="text-right text-sm font-medium">
              Password
            </label>
            <Input
              id="edit-password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={formData.password || ''}
              onChange={onFormChange}
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
