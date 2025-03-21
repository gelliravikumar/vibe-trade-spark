
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useMobile } from '@/hooks/use-mobile';
import { 
  Menu, 
  X,
  Home, 
  BarChart2, 
  Newspaper, 
  Briefcase, 
  Users, 
  Settings as SettingsIcon,
  TrendingUp,
  Wallet,
  CreditCard
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { usePaperTrading } from '@/hooks/use-paper-trading';

export const Navbar = () => {
  const location = useLocation();
  const { isMobile } = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isPaperTrading, setIsPaperTrading } = usePaperTrading();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    { to: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { to: '/markets', label: 'Markets', icon: <BarChart2 className="h-5 w-5" /> },
    { to: '/trade', label: 'Trade', icon: <TrendingUp className="h-5 w-5" /> },
    { to: '/paper-trading', label: 'Paper Trading', icon: <Wallet className="h-5 w-5" /> },
    { to: '/real-trading', label: 'Real Trading', icon: <CreditCard className="h-5 w-5" /> },
    { to: '/news', label: 'News', icon: <Newspaper className="h-5 w-5" /> },
    { to: '/portfolio', label: 'Portfolio', icon: <Briefcase className="h-5 w-5" /> },
    { to: '/community', label: 'Community', icon: <Users className="h-5 w-5" /> },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];
  
  return (
    <header className="fixed w-full z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">TradingApp</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                    ${isActive(link.to) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  onClick={closeMenu}
                >
                  {link.icon}
                  <span className="ml-1">{link.label}</span>
                </Link>
              ))}
            </nav>
          )}
          
          <div className="flex items-center space-x-2">
            <DataSourceSelector />
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
                  ${isActive(link.to) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                onClick={closeMenu}
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
