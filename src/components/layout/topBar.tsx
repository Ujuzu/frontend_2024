import { useState, useRef, useEffect } from 'react';
import { BellIcon, ChatIcon, FillCaretIcon } from '@/assets/icons';
import SearchInput from '../input/searchInput';
import Badge from '../badge';
import { useAuth } from '@/context/AuthContext';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null!);
  const { logout } = useAuth();

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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const handleLogout = () => {
    logout();
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

  const renderAvatar = () => {
    if (user?.avatar) {
      return (
        <img
          className="w-8 h-8 md:w-9 md:h-9 object-cover rounded-full border-2 border-gray-100"
          src={user.avatar}
          alt="User avatar" 
        />
      );
    }
    
    return (
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-gray-100 bg-[#AC19AD] text-white flex items-center justify-center font-medium">
        {getInitials()}
      </div>
    );
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
            <div className="shadow-sm border border-gray-100 rounded-lg bg-white">
              <SearchInput sz="sm" placeholder="Search Dashboard" />
            </div>
          </div>
          
          {showMobileSearch ? (
            <div className="md:hidden flex-1 ml-12 pr-2 animate-fade-in">
              <div className="shadow-sm border border-gray-100 rounded-lg bg-white flex items-center">
                <SearchInput sz="sm" placeholder="Search" ref={searchInputRef} />
                <button 
                  onClick={toggleMobileSearch}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={toggleMobileSearch}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FFEEE8] hover:bg-[#FFE0D6] transition-colors">
                <ChatIcon className="w-5 h-5 text-orange-500" />
              </button>
              
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F5F7FA] hover:bg-gray-200 transition-colors">
                <span className="relative inline-block">
                  <Badge className="absolute -top-0.5 -right-0.5 !w-2 !h-2" />
                  <BellIcon className="w-5 h-5 text-gray-700" />
                </span>
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {renderAvatar()}
                  <FillCaretIcon className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''} hidden md:block`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <hr className="my-1 border-gray-100" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
