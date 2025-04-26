// src/pages/admin/dialogs/BlockUserDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Shield, Mail, AlertTriangle, Unlock, Lock } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  
  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };
  const isActivation = selectedUser.blocked;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-lg shadow-md scrollbar-container max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center space-x-2">
            {isActivation ? (
              <Unlock className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-red-500" />
            )}
            <DialogTitle className="text-xl font-semibold">
              {isActivation ? 'Activate User Account' : 'Block User Account'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 mt-1">
            {isActivation
              ? 'This action will restore the user\'s access to the system.'
              : 'This action will prevent the user from accessing the system.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-center mb-6">
            <div className={cn(
              "p-4 rounded-full",
              isActivation ? "bg-green-50" : "bg-red-50"
            )}>
              <AlertTriangle className={cn(
                "h-8 w-8",
                isActivation ? "text-green-500" : "text-red-500"
              )} />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-700">
              Are you sure you want to <span className="font-semibold">
                {isActivation ? 'activate' : 'block'}
              </span> the following user?
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className={cn(
                "h-12 w-12",
                isActivation ? "bg-green-100" : "bg-red-100"
              )}>
                <AvatarFallback className={cn(
                  "font-medium",
                  isActivation ? "text-green-600" : "text-red-600"
                )}>
                  {getUserInitials(selectedUser.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{selectedUser.username}</h3>
                <Badge className={cn(
                  "px-2 text-xs font-medium rounded-full mt-1",
                  selectedUser.blocked 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                )}>
                  {selectedUser.blocked ? 'Blocked' : 'Active'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600 min-w-[4rem]">Email:</span>
                <span className="text-gray-900 font-medium">{selectedUser.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600 min-w-[4rem]">ID:</span>
                <span className="text-gray-900 font-medium">{selectedUser.id}</span>
              </div>
              {selectedUser.role && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600 min-w-[4rem]">Role:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.role.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={cn(
            "mt-4 p-3 rounded-lg text-sm",
            isActivation 
              ? "bg-green-50 text-green-700 border border-green-100" 
              : "bg-red-50 text-red-700 border border-red-100"
          )}>
            <p className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {isActivation
                  ? 'User will regain full access to the platform based on their role permissions.'
                  : 'User will be logged out and any active sessions will be terminated.'}
              </span>
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className={cn(
              "text-white font-medium px-6 py-2 transition-all duration-200 rounded-full shadow-sm hover:shadow",
              isActivation
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-purple-600 hover:bg-purple-700"
            )}
          >
            {isActivation ? 'Activate User' : 'Block User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserDialog;
