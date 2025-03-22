
import React, { useState } from 'react';
import { 
  User, Settings, LogOut, CreditCard, FileText, Bell, HelpCircle, 
  Wallet, Building, Home, ChevronRight, Database, BarChart3, Book,
  UserPlus, Shield, Briefcase, Clipboard, Heart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  balance: number;
  notifications?: number;
}

// For demo purposes, we'll use this mock data
const mockUserData: UserProfileData = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  avatarUrl: "",
  balance: 250000,
  notifications: 3
};

export const UserProfile = () => {
  const [userData, setUserData] = useState<UserProfileData>(mockUserData);
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('tradingApp_theme') || 'system';
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
  };

  const handleEditProfile = () => {
    navigate('/settings?tab=profile');
  };

  const handleBankingSettings = () => {
    navigate('/settings?tab=payment');
  };

  const handleTaxForms = () => {
    navigate('/settings?tab=documents');
    toast.info("Tax documents section");
  };

  const handleSettings = () => {
    navigate('/settings');
  };
  
  const handleNotifications = () => {
    navigate('/settings?tab=notifications');
    setUserData({...userData, notifications: 0});
  };
  
  const handleSupport = () => {
    toast.info("Opening support center");
    window.open("https://support.tradesmart.com", "_blank");
  };
  
  const handlePortfolio = () => {
    navigate('/portfolio');
  };
  
  const handleInviteFriend = () => {
    toast.info("Invite a friend feature coming soon!");
  };
  
  const handleReferrals = () => {
    toast.info("View your referrals feature coming soon!");
  };
  
  const handleChangeTheme = (theme: string) => {
    localStorage.setItem('tradingApp_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    setActiveTheme(theme);
    toast.success(`Theme changed to ${theme}`);
  };
  
  const handleDataSettings = () => {
    navigate('/settings?tab=data');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-9 w-9 border-2 border-border cursor-pointer">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {userData.notifications && userData.notifications > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
              {userData.notifications}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel className="p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium">{userData.name}</p>
            <p className="text-xs text-muted-foreground">{userData.email}</p>
            <div className="mt-2 py-1 px-3 bg-muted/50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Available Balance</span>
                <span className="text-xs text-primary">(View Details)</span>
              </div>
              <p className="text-base font-semibold mt-1">
                ₹{userData.balance.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <button 
                className="flex-1 text-xs py-1 bg-primary text-primary-foreground rounded-md"
                onClick={() => navigate('/deposit')}
              >
                Deposit
              </button>
              <button 
                className="flex-1 text-xs py-1 bg-muted text-foreground rounded-md border"
                onClick={() => navigate('/withdraw')}
              >
                Withdraw
              </button>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handlePortfolio} className="cursor-pointer">
            <Wallet className="mr-2 h-4 w-4" />
            <span>My Portfolio</span>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleBankingSettings} className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Banking Details</span>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleNotifications} className="cursor-pointer relative">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {userData.notifications && userData.notifications > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {userData.notifications}
              </Badge>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/markets')} className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Markets</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/paper-trading')} className="cursor-pointer">
            <Clipboard className="mr-2 h-4 w-4" />
            <span>Paper Trading</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/watchlist')} className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Watchlists</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/learn')} className="cursor-pointer">
            <Book className="mr-2 h-4 w-4" />
            <span>Learn & Resources</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleTaxForms} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>Tax Documents</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleSupport} className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Refer & Earn</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={handleInviteFriend}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Friends
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReferrals}>
                <Building className="mr-2 h-4 w-4" />
                My Referrals
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={activeTheme} onValueChange={handleChangeTheme}>
                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuItem onClick={handleDataSettings} className="cursor-pointer">
            <Database className="mr-2 h-4 w-4" />
            <span>Data Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>All Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
