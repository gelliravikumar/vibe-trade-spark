
import React, { useState } from 'react';
import { User, Settings, LogOut, CreditCard, FileText, Edit } from 'lucide-react';
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

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  balance: number;
}

// For demo purposes, we'll use this mock data
const mockUserData: UserProfileData = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  avatarUrl: "",
  balance: 250000,
};

export const UserProfile = () => {
  const [userData, setUserData] = useState<UserProfileData>(mockUserData);

  const handleLogout = () => {
    toast.success("Successfully logged out");
  };

  const handleEditProfile = () => {
    // Would open a modal in a real app
    toast.info("Edit profile functionality would open here");
  };

  const handleBankingSettings = () => {
    toast.info("Banking settings would open here");
  };

  const handleTaxForms = () => {
    toast.info("Tax forms would open here");
  };

  const handleSettings = () => {
    // Navigate to settings page in a real app
    toast.info("Navigating to settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-9 w-9 border-2 border-border">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
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
        
        <DropdownMenuItem onClick={handleEditProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleBankingSettings}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Banking Details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTaxForms}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Tax Forms</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
