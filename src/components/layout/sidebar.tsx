import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, LogOut, Monitor, Users, FileText, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";

interface NavItemProps {
  path: string;
  title: string;
  icon: React.ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}

// Navigation links with consistent structure
const links = [
  {
    title: "Platform Monitoring",
    icon: <Monitor className="w-5 h-5" />,
    path: "/u/platform-monitoring",
  },
  {
    title: "User Management",
    icon: <Users className="w-5 h-5" />,
    path: "/u/user-management",
  },
    {
    title: "Course Management",
    icon: <FileText className="w-5 h-5" />,
    path: "/u/courses",
  },
  {
    title: "Subscription Management",
    icon: <CreditCard className="w-5 h-5" />,
    path: "/u/subscription-management",
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [_isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const handleLogout = () => {
    //logout();
    navigate('/u/logout');
  };
  
  // Close sheet when navigating on mobile
  const handleMobileNavClick = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const NavItem = ({ path, title, icon, collapsed, onClick }: NavItemProps) => {
    const questionMarkIndex = path.indexOf("?");
    const linkWithoutQuery =
      questionMarkIndex !== -1 ? path.substring(0, questionMarkIndex) : path;
    const isActive = pathname.toLowerCase().includes(linkWithoutQuery);
    
    if (collapsed) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={path}
                onClick={onClick}
                className={`flex justify-center items-center py-3 px-3 rounded-md transition-colors duration-200 ${
                  isActive ? "bg-[#AC19AD] text-white" : "text-gray-400 hover:bg-[#1a2333] hover:text-gray-200"
                }`}
              >
                <span className="flex-shrink-0">{icon}</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-none">
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <NavLink
        to={path}
        onClick={onClick}
        className={`flex items-center justify-start py-3 px-3 rounded-md transition-colors duration-200 ${
          isActive ? "bg-[#AC19AD] text-white" : "text-gray-400 hover:bg-[#1a2333] hover:text-gray-200"
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="ml-3 whitespace-nowrap">{title}</span>
      </NavLink>
    );
  };
  
  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className=" text-black hover:bg-black border-none shadow-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-72 bg-[#000b17] border-r-[#1a2333] max-h-screen overflow-y-auto"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for the application
            </SheetDescription>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center py-6 px-4 border-b border-[#1a2333]">
                <img src={logo} className="w-32 h-auto" alt="Logo" />
              </div>
              
              <nav className="flex-grow">
                <ul className="flex flex-col gap-y-1.5 px-3 mt-4">
                  {links.map((link) => (
                    <li key={link.title}>
                      <NavItem {...link} collapsed={false} onClick={handleMobileNavClick} />
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="px-3 py-6 mt-auto border-t border-[#1a2333]">
                <Button
                  variant="ghost"
                  className="w-full flex justify-start items-center py-3 px-3 text-white hover:bg-gray-800 rounded-md"
                  onClick={() => {
                    handleLogout();
                    handleMobileNavClick();
                  }}
                >
                  <LogOut className="w-5 h-5 text-[#AC19AD]" />
                  <span className="ml-3">Sign Out</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-[#000b17] h-screen min-h-screen max-h-screen sticky top-0 left-0 overflow-hidden transition-all duration-300 border-r border-[#1a2333] ${
          collapsed ? "w-16" : "w-72"
        }`}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} py-6 px-4 border-b border-[#1a2333]`}>
          {!collapsed && <img src={logo} className="w-32 h-auto" alt="Logo" />}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer bg-[#AC19AD] text-white hover:bg-[#8e16a1] border-none transition-colors duration-200"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        
        <nav className="flex-grow overflow-hidden py-4">
          <ul className={`flex flex-col gap-y-1.5 px-3 ${collapsed ? 'min-w-[64px]' : 'min-w-[268px]'}`}>
            {links.map((link) => (
              <li key={link.title}>
                <NavItem {...link} collapsed={collapsed} />
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={`px-3 py-6 mt-auto border-t border-[#1a2333]`}>
          {collapsed ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-center items-center py-3 px-3 hover:bg-gray-800 rounded-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 text-[#AC19AD]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-none">
                  Sign Out
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full flex justify-start items-center py-3 px-3 text-white hover:bg-gray-800 rounded-md"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-[#AC19AD]" />
              <span className="ml-3">Sign Out</span>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
