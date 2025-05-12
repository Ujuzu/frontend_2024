import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, MessageSquare, ChevronDown, ChevronUp, Search, LogOut, User, Settings, X } from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';
// import { useFetch } from '@/hooks/useFetch';
import { IUserWithPic } from '@/Interfaces/IUserLoginInterfaces';
import { API_URL } from '@/helper/hooks/endPoints';
import { getGreeting, getInitials, getUserDisplayName } from '@/utils/getUserDisplayName';
import axios from 'axios';

export default function TopBar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  // const [user, setUser] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null!);
  const navigate = useNavigate();

  const { user,token  } = useAuth();
console.log('user', user);
  console.log('token', token);  

  //   const userProfileUrl = useCallback(() => {
  //   return user ? `${API_URL}/api/users/${user.id}?populate=profilePic` : '';
  // }, [user]);
   

 // Fetch user profile picture
  const processUserAvatar = useCallback((userData: IUserWithPic) => {
    if (!userData?.profilePic) return;

    const profilePic = userData.profilePic;
    const baseUrl = API_URL;

    // Prefer medium format if available
    if (profilePic.formats?.medium?.url) {
      const imageUrl = profilePic.formats.medium.url.startsWith('/')
        ? `${baseUrl}${profilePic.formats.medium.url}`
        : profilePic.formats.medium.url;
      setAvatarUrl(imageUrl);
    } else if (profilePic.url) {
      const imageUrl = profilePic.url.startsWith('/')
        ? `${baseUrl}${profilePic.url}`
        : profilePic.url;
      setAvatarUrl(imageUrl);
    }
  }, []);


    useEffect(() => {
    if (!user || !token) return;

    const fetchUserProfile = async () => {
      try {
        const url = `${API_URL}/api/users/${user.id}?populate=profilePic`;
        const response = await axios.get<IUserWithPic>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        processUserAvatar(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user?.id, token, processUserAvatar]);
 

  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);



  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleLogout = () => {
    navigate('/u/logout');
  };
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <nav className="h-16 md:h-18 px-4 md:px-8 max-w-screen-2xl mx-auto md:ml-16">
        <div className="flex justify-between items-center h-full">
          <div className="hidden md:block">
            <p className="text-gray-500 text-sm font-light">{getGreeting()}, {user ? getUserDisplayName(user!) : 'Guest'}</p>
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
                size="icon"
                className="md:hidden rounded-full bg-white"
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
              
              <DropdownMenu onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 md:h-9 md:w-9">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={user ? getUserDisplayName(user!) : 'Guest'} />
                        ) : null}
                        <AvatarFallback className="bg-purple-600 text-white">
                          {user ? getInitials(user!) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      {dropdownOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-600 transition-transform duration-200 hidden md:block" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-200 hidden md:block" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium text-gray-800">{user ? getUserDisplayName(user!) : 'Guest'}</p>
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
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
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
