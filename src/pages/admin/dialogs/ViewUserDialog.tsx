// src/pages/admin/dialogs/ViewUserDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Calendar, Mail, Shield, ExternalLink } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface ViewUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  isLoading?: boolean;
  error?: string | null;
}

const ViewUserDialog: React.FC<ViewUserDialogProps> = ({
  isOpen,
  onOpenChange,
  user,
  isLoading = false,
  error = null,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };
  
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-red-800">Error</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => onOpenChange(false)} 
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              size="sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-lg shadow-md max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            User Details
          </DialogTitle>
        </DialogHeader>
        {isLoading || !user ? (
          <div className="py-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="py-4 transition-opacity duration-300">
            <div className="mb-6 flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-purple-100 ring-2 ring-purple-200">
                <AvatarFallback className="text-purple-600 font-medium text-lg">
                  {getUserInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={cn(
                    "px-2 text-xs font-medium",
                    user.confirmed ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}>
                    {user.confirmed ? 'Confirmed' : 'Not Confirmed'}
                  </Badge>
                  <Badge className={cn(
                    "px-2 text-xs font-medium",
                    user.blocked ? "bg-red-100 text-red-800 hover:bg-red-200" : "bg-green-100 text-green-800 hover:bg-green-200"
                  )}>
                    {user.blocked ? 'Blocked' : 'Active'}
                  </Badge>
                  {user.role && (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-2 text-xs font-medium">
                      {user.role.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-5 divide-y divide-gray-100">
              <div className="space-y-3 pb-2">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-purple-500" />
                  Account Information
                </h4>
                
                {[
                  { label: 'ID', value: user.id.toString(), field: 'id', icon: <Shield className="h-4 w-4 text-gray-500" /> },
                  { label: 'Email', value: user.email, field: 'email', icon: <Mail className="h-4 w-4 text-gray-500" /> },
                  { label: 'Provider', value: user.provider, field: 'provider', icon: <ExternalLink className="h-4 w-4 text-gray-500" /> },
                ].map((item) => (
                  <div key={item.field} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                    </div>
                    <p className="text-gray-900 text-sm mt-1 break-all">{item.value}</p>
                  </div>
                ))}
              </div>
              
              {user.role && (
                <div className="pt-4 pb-2">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-purple-500" />
                    Role Details
                  </h4>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 shadow-sm">
                    <h5 className="text-sm font-medium text-purple-800">{user.role.name}</h5>
                    <p className="text-sm text-gray-700 mt-1">{user.role.description}</p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Badge variant="outline" className="bg-white text-purple-700 border-purple-200">
                        {user.role.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                  Timestamps
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Created</span>
                    </div>
                    <span className="text-sm text-gray-900">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    </div>
                    <span className="text-sm text-gray-900">{formatDate(user.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="pt-4 border-t mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full transition-all duration-200"
            size="sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
