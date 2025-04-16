// src/pages/admin/dialogs/EditUserDialog.tsx
import React from 'react';
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
  onSave: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
