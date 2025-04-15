import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, ChevronDown, Search, LogOut, User, Settings, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';


interface UserData {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
}

export default function TopBar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null!);
  const navigate = useNavigate();
 
  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const getInitials = () => {
    if (!user) return '?';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    
    if (user.fullName) {
      const nameParts = user.fullName.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
      }
      return nameParts[0].charAt(0);
    }
    
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    
    navigate('/u/logout');
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.fullName) {
      return user.fullName;
    }
    
    return user.username || user.email.split('@')[0];
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <nav className="h-16 md:h-18 px-4 md:px-8 max-w-screen-2xl mx-auto md:ml-16">
        <div className="flex justify-between items-center h-full">
          <div className="hidden md:block">
            <p className="text-gray-500 text-sm font-light">{getGreeting()}, {getUserDisplayName()}</p>
            <h1 className="font-medium text-gray-800">Dashboard</h1>
          </div>
          
          {!showMobileSearch && (
            <div className="md:hidden ml-12">
              <h1 className="font-medium text-gray-800">Dashboard</h1>
            </div>
          )}
          
          <div className="hidden md:block max-w-md w-full mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search Dashboard" 
                id="desktop-search"
                name="desktop-search"
                className="pl-10 h-9 bg-white border border-gray-100"
              />
            </div>
          </div>
          
          {showMobileSearch ? (
            <div className="md:hidden flex-1 ml-12 pr-2 animate-fade-in">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  ref={searchInputRef}
                  type="search" 
                  placeholder="Search" 
                  id="mobile-search"
                  name="mobile-search"
                  className="pl-10 pr-10 h-9 bg-white border border-gray-100"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0"
                  onClick={toggleMobileSearch}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden rounded-full"
                onClick={toggleMobileSearch}
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-orange-50 hover:bg-orange-100"
              >
                <MessageSquare className="h-5 w-5 text-orange-500" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-gray-50 hover:bg-gray-100"
              >
                <div className="relative">
                  <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
                  <Bell className="h-5 w-5 text-gray-700" />
                </div>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 md:h-9 md:w-9">
                        {user?.avatar ? (
                          <AvatarImage src={user.avatar} alt={getUserDisplayName()} />
                        ) : null}
                        <AvatarFallback className="bg-purple-600 text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-200 hidden md:block" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium text-gray-800">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Your Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500"
                    disabled={isSigningOut}
                    onClick={handleLogout}
                  >
                    {isSigningOut ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-red-500 border-t-transparent rounded-full" />
                        <span>Signing out...</span>
                      </div>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
