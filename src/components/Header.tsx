import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  User, LogOut, Settings, User as UserIcon, LogIn, Menu, Home, Users, Briefcase, MessageSquare, Bell, BookOpen, Target,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLogoFilter, setCurrentLogoFilter] = useState('brightness(0) invert(1)');
  const { scrollY } = useScroll();
  const [showSearch, setShowSearch] = useState(false);
  const isSignedIn = !!user;

  // Transform values for dynamic styling
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(15, 2, 45, 0.95)', 'rgba(245, 245, 245, 0.95)'],
  );

  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.2)', 'rgba(229, 229, 229, 0.5)'],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const newFilter = scrollPosition <= 50 ? 'brightness(0) invert(1)' : 'none';
        setCurrentLogoFilter(newFilter);
      }, 10);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name: string) => name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleProfileClick = () => {
    if (user?.role === 'FREELANCER') {
      navigate('/social/profile');
    } else if (user?.role === 'COMPANY') {
      navigate('/company-profile');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  // Navigation items for signed-in users
  const signedInNavItems = [
    { path: '/social/feed', label: 'Home', icon: Home },
    { path: '/social/mynetwork', label: 'My Network', icon: Users },
    { path: '/social/freelancing', label: 'Freelancers', icon: Briefcase },
    { path: '/social/message', label: 'Messages', icon: MessageSquare },
    { path: '/social/notification', label: 'Notifications', icon: Bell },
  ];

  // Navigation items for signed-out users
  const signedOutNavItems = [
    { path: '/', label: 'Home', icon: Home, external: false },
    { path: '/opportunities', label: 'Opportunities', icon: Target, external: false },
    { path: 'https://openmindsai.learnworlds.com/courses', label: 'Courses', icon: BookOpen, external: true },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
          !isScrolled ? 'shadow-lg' : ''
        }`}
        style={{
          backgroundColor: navBackground as any,
          borderBottom: `1px solid ${navBorder}`,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            {/* LEFT SIDE - Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <motion.div
                className="w-48 h-48"
                animate={{ filter: currentLogoFilter }}
                transition={{ duration: 0.3 }}
              >
                <img src={LogoV1} alt="OMAH Logo" className="w-full h-full" />
              </motion.div>
            </Link>

            {/* SEARCH ICON for signed-in users */}
            {isSignedIn && !showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-full hover:bg-white/10 transition"
                aria-label="Search"
              >
                <Search className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* SEARCH INPUT for signed-in users */}
          {isSignedIn && showSearch && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search jobs, companies..."
                className="w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none"
                onBlur={() => setShowSearch(false)} // closes when losing focus
              />
              {/* Optional toggle: click icon again to close */}
              <button
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </motion.div>
          )}
          </div>

          {/* Right side - Navigation and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation - SIGNED IN */}
            {user ? (
              <nav className="hidden md:flex items-center space-x-6">
                {signedInNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition-colors ${
                      isScrolled
                        ? 'text-text hover:text-primary'
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              /* Desktop Navigation - SIGNED OUT */
              <nav className="hidden md:flex items-center space-x-6">
                {signedOutNavItems.map((item) => 
                  item.external ? (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors ${
                        isScrolled
                          ? 'text-text hover:text-primary'
                          : 'text-white hover:text-white/80'
                      }`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`transition-colors ${
                        isScrolled
                          ? 'text-text hover:text-primary'
                          : 'text-white hover:text-white/80'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            )}

            {/* Desktop User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`hidden md:flex p-2 rounded-full transition-colors ${
                      isScrolled
                        ? 'text-text hover:text-primary hover:bg-neutral-100'
                        : 'text-white hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                          src={
                            user?.avatar
                              ? `http://localhost:3001${user.avatar}?t=${Date.now()}`
                              : undefined
                          }
                          alt={user?.name || 'User'}
                        />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-sm font-medium">
                        {getInitials(user.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                  <div className="flex items-center justify-start gap-2 p-2 bg-gray-50 rounded-t-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                          src={
                            user?.avatar
                              ? `http://localhost:3001${user.avatar}?t=${Date.now()}`
                              : undefined
                          }
                          alt={user?.name || 'User'}
                        />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-sm font-medium">
                        {getInitials(user.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-gray-100 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-100 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Search Bar for signed-out users */}
            {!isSignedIn && showSearch && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '300px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-4"
              >
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none"
                />
              </motion.div>
            )}

            {/* Desktop Sign In Button */}
            {!user && (
              <Button
                onClick={handleSignIn}
                className={`hidden md:flex px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  isScrolled
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`md:hidden p-2 rounded-full transition-colors ${
                    isScrolled
                      ? 'text-text hover:text-primary hover:bg-neutral-100'
                      : 'text-white hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg z-50 md:hidden">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary to-accent rounded-t-lg">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
                        <AvatarFallback className="bg-white text-primary text-sm font-bold">
                          {getInitials(user.name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/80 truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Navigation Items */}
                    {signedInNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`cursor-pointer ${
                            isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                    
                    <DropdownMenuSeparator />
                    
                    {/* Profile & Settings */}
                    <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-gray-100 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-100 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {/* Guest User Header */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary to-accent rounded-t-lg">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white">Guest User</span>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Navigation Items */}
                    {signedOutNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      if (item.external) {
                        return (
                          <DropdownMenuItem key={item.path} className="p-0">
                            <a
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center w-full px-2 py-1.5 hover:bg-gray-100"
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              <span>{item.label}</span>
                            </a>
                          </DropdownMenuItem>
                        );
                      }
                      
                      return (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`cursor-pointer ${
                            isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                    
                    <DropdownMenuSeparator />
                    
                    {/* Sign In Button */}
                    <div className="p-2">
                      <Button
                        onClick={handleSignIn}
                        className="w-full px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.nav>

      {/* Spacer to prevent body content from being hidden behind fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}