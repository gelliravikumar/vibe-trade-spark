
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserProfile } from '@/components/profile/UserProfile';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Clock, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [time, setTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => {
    return localStorage.getItem('tradeSmart_timezone') || 'Asia/Kolkata';
  });
  const [timezoneLabel, setTimezoneLabel] = useState<string>('IST');
  
  const timezones = [
    { value: 'Asia/Kolkata', label: 'IST' },
    { value: 'America/New_York', label: 'ET' },
    { value: 'America/Los_Angeles', label: 'PT' },
    { value: 'Europe/London', label: 'GMT' },
    { value: 'Asia/Tokyo', label: 'JST' },
    { value: 'Asia/Singapore', label: 'SGT' },
  ];
  
  const handleTimezoneChange = (timezone: string, label: string) => {
    setSelectedTimezone(timezone);
    setTimezoneLabel(label);
    localStorage.setItem('tradeSmart_timezone', timezone);
  };
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: selectedTimezone
      };
      setTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };
    
    // Find the label for the selected timezone
    const timezoneObj = timezones.find(tz => tz.value === selectedTimezone);
    if (timezoneObj) {
      setTimezoneLabel(timezoneObj.label);
    }
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedTimezone]);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden md:inline-block">TradeSmart</span>
          </Link>
          
          {/* Main Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/markets">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Markets
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/portfolio">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Portfolio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/paper-trading">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Paper Trading
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/news">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    News
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/community">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Community
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/learn">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Learn
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Current timestamp (with timezone selector) */}
          <div className="hidden md:flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
            <span>{time}</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 px-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="ml-1 text-xs text-muted-foreground">{timezoneLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timezones.map((tz) => (
                  <DropdownMenuItem 
                    key={tz.value} 
                    onClick={() => handleTimezoneChange(tz.value, tz.label)}
                    className={selectedTimezone === tz.value ? "bg-accent" : ""}
                  >
                    {tz.label} ({tz.value.split('/')[1].replace('_', ' ')})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};
