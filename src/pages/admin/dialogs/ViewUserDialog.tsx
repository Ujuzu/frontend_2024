// src/pages/admin/dialogs/ViewUserDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-800">Error</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-red-600 text-sm">{error}</div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline" size="sm">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-lg shadow-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">User Details</DialogTitle>
        </DialogHeader>
        {isLoading || !user ? (
          <div className="py-4 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="py-4 transition-opacity duration-300">
            <TooltipProvider>
              <div className="space-y-3">
                {[
                  { label: 'ID', value: user.id.toString(), field: 'id' },
                  { label: 'Username', value: user.username, field: 'username' },
                  { label: 'Email', value: user.email, field: 'email' },
                  { label: 'Provider', value: user.provider, field: 'provider' },
                ].map((item) => (
                  <div key={item.field} className="grid grid-cols-3 gap-2 items-center group">
                    <div className="font-medium text-gray-600 text-sm">{item.label}</div>
                    <div className="col-span-2 flex items-center space-x-1">
                      <span className="text-gray-900 text-sm truncate">{item.value}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.value, item.field)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
                          >
                            {copiedField === item.field ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedField === item.field ? 'Copied!' : `Copy ${item.label}`}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium text-gray-600 text-sm">Status</div>
                  <div className="col-span-2 flex space-x-1">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full transition-transform duration-200 ${
                        user.confirmed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.confirmed ? 'Confirmed' : 'Not Confirmed'}
                    </span>
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full transition-transform duration-200 ${
                        user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>

                {user.role && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium text-gray-600 text-sm">Role</div>
                    <div className="col-span-2">
                      <div className="text-gray-900 text-sm font-medium">{user.role.name}</div>
                      <div className="text-xs text-gray-500">{user.role.description}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium text-gray-600 text-sm">Created</div>
                  <div className="col-span-2 text-gray-900 text-sm">{formatDate(user.createdAt)}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium text-gray-600 text-sm">Last Updated</div>
                  <div className="col-span-2 text-gray-900 text-sm">{formatDate(user.updatedAt)}</div>
                </div>
              </div>
            </TooltipProvider>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 transition-all duration-200"
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
