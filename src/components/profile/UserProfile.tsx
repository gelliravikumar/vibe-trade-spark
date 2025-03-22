
import React, { useState } from 'react';
import { User, Settings, LogOut, CreditCard, FileText, Bell, HelpCircle, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
  };

  const handleEditProfile = () => {
    navigate('/settings?tab=profile');
  };

  const handleBankingSettings = () => {
    toast.info("Banking settings would open here");
  };

  const handleTaxForms = () => {
    toast.info("Tax forms would open here");
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
  };
  
  const handlePortfolio = () => {
    navigate('/portfolio');
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
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-destructive"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userData.name}</p>
            <p className="text-xs text-muted-foreground">{userData.email}</p>
            <p className="text-xs font-semibold mt-1">
              Balance: ₹{userData.balance.toLocaleString('en-IN')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handlePortfolio} className="cursor-pointer">
          <Wallet className="mr-2 h-4 w-4" />
          <span>My Portfolio</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleBankingSettings} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Banking Details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleNotifications} className="cursor-pointer relative">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          {userData.notifications && userData.notifications > 0 && (
            <span className="ml-auto bg-destructive text-white text-xs rounded-full px-1.5 py-0.5">
              {userData.notifications}
            </span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTaxForms} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Tax Forms</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSupport} className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
