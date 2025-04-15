import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { LogOut, Loader } from 'lucide-react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Add a delay before actually logging out
    setTimeout(() => {
      // Call logout only after the spinner has been visible
      logout();
      // Note: We don't hide the spinner or dialog
      // The AuthContext logout function should handle navigation
    }, 2000); // 2 second delay
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000b17]">
      <AlertDialog open={true}>
        <AlertDialogContent className="bg-[#0f1724] border-[#1a2333] text-white">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#AC19AD]/10 p-3 rounded-full">
                {isLoggingOut ? (
                  <Loader className="w-6 h-6 text-[#AC19AD] animate-spin" />
                ) : (
                  <LogOut className="w-6 h-6 text-[#AC19AD]" />
                )}
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl text-white">
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-400">
              {isLoggingOut 
                ? "Please wait while we securely sign you out." 
                : "Are you sure you want to sign out of your account?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!isLoggingOut && (
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel 
                onClick={handleCancel}
                className="bg-transparent border-[#1a2333] text-white hover:bg-[#1a2333] hover:text-white"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogout}
                className="bg-[#AC19AD] text-white hover:bg-[#8e16a1]"
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
