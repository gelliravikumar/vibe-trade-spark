
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
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
  CreditCard,
  ChevronDown,
  Search,
  Bell
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    { to: '/news', label: 'News', icon: <Newspaper className="h-5 w-5" /> },
    { to: '/portfolio', label: 'Portfolio', icon: <Briefcase className="h-5 w-5" /> },
  ];
  
  const moreLinks = [
    { to: '/paper-trading', label: 'Paper Trading', icon: <Wallet className="h-5 w-5" /> },
    { to: '/real-trading', label: 'Real Trading', icon: <CreditCard className="h-5 w-5" /> },
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
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">TradingApp</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-1">
              <nav className="hidden md:flex space-x-1 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200
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
                
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm flex items-center gap-1">
                        <span className="ml-1">More</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-2 w-[220px]">
                          {moreLinks.map((link) => (
                            <li key={link.to}>
                              <Link
                                to={link.to}
                                className={`flex items-center p-2 rounded-md hover:bg-muted text-sm ${
                                  isActive(link.to) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                                }`}
                                onClick={closeMenu}
                              >
                                {link.icon}
                                <span className="ml-2">{link.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                
                <DataSourceSelector />
                <ThemeToggle />
                
                <div className="pl-2">
                  <Avatar className="hover:ring-2 hover:ring-primary/30 cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Actions */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-muted-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <ThemeToggle />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Search Input (conditional) */}
      {searchOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for stocks, cryptocurrencies..." 
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
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
            
            {/* Add division */}
            <div className="border-t border-border my-2"></div>
            
            {/* More links for mobile */}
            {moreLinks.map((link) => (
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
            
            {/* Data source selector in mobile */}
            <div className="px-3 py-2">
              <DataSourceSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
