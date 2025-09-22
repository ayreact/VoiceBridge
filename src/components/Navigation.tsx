import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Mic, 
  BookOpen, 
  History, 
  User, 
  Phone, 
  MessageCircle, 
  Menu,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navigationItems = [
  { 
    href: '/', 
    label: 'Voice Assistant', 
    icon: Mic,
    description: 'Talk to your AI assistant'
  },
  { 
    href: '/lessons', 
    label: 'Lessons', 
    icon: BookOpen,
    description: 'Educational content'
  },
  { 
    href: '/history', 
    label: 'History', 
    icon: History,
    description: 'Your query history'
  },
  { 
    href: '/profile', 
    label: 'Profile', 
    icon: User,
    description: 'Your account settings'
  },
];

const infoItems = [
  { 
    href: '/ivr-info', 
    label: 'Phone Access', 
    icon: Phone,
    description: 'Call our toll-free number'
  },
  { 
    href: '/whatsapp-info', 
    label: 'WhatsApp', 
    icon: MessageCircle,
    description: 'Use WhatsApp for voice messages'
  },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const NavItems = ({ mobile = false, compact = false }: { mobile?: boolean; compact?: boolean }) => {
    const itemClass = mobile 
      ? "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      : compact
      ? "flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-muted transition-colors text-xs"
      : "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm";
    
    const activeClass = mobile
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "bg-primary text-primary-foreground hover:bg-primary/90";

    return (
      <>
        {/* Main Navigation */}
        {isAuthenticated && (
          <>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' 
                ? (location.pathname === '/' || location.pathname.startsWith('/assistant'))
                : location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(itemClass, isActive && activeClass)}
                  onClick={() => mobile && setIsOpen(false)}
                >
                  <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
                  <div className="flex flex-col">
                    <span className={`font-medium ${compact ? "text-xs" : ""}`}>
                      {compact ? item.label.split(' ')[0] : item.label}
                    </span>
                    {mobile && (
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
            
            {mobile && <hr className="my-4 border-border" />}
          </>
        )}

        {/* Info Items */}
        {infoItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(itemClass, isActive && activeClass)}
              onClick={() => mobile && setIsOpen(false)}
            >
            <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
            <div className="flex flex-col">
              <span className={`font-medium ${compact ? "text-xs" : ""}`}>
                {compact ? item.label.split(' ')[0] : item.label}
              </span>
              {mobile && (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </div>
            </Link>
          );
        })}

        {/* Auth Actions */}
        {mobile && (
          <>
            <hr className="my-4 border-border" />
            {isAuthenticated ? (
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="justify-start gap-3"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="font-merriweather font-bold text-xl text-gradient">
              VoiceBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <NavItems />
          </div>

          {/* Medium Screen Navigation */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            <NavItems compact />
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xs md:text-sm text-muted-foreground hidden lg:block">
                  Welcome, {user?.username}
                </span>
                <span className="text-xs text-muted-foreground lg:hidden">
                  {user?.username}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 md:gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm" className="text-xs md:text-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-merriweather font-bold text-xl text-gradient">
                    VoiceBridge
                  </span>
                </div>
                
                {isAuthenticated && user && (
                  <div className="p-4 bg-muted rounded-lg mb-4">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                )}
                
                <NavItems mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};