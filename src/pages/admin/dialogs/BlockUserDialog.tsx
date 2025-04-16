// src/pages/admin/dialogs/BlockUserDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface BlockUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onConfirm: () => void;
}

const BlockUserDialog: React.FC<BlockUserDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onConfirm
}) => {
  if (!selectedUser) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedUser.blocked ? 'Confirm Activation' : 'Confirm Block'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to {selectedUser.blocked ? 'activate' : 'block'} this user?
            {selectedUser.blocked 
              ? ' The user will regain access to the system.' 
              : ' The user will no longer be able to access the system.'}
          </p>
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>ID:</strong> {selectedUser.id}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className={selectedUser.blocked 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {selectedUser.blocked ? 'Activate' : 'Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserDialog;
