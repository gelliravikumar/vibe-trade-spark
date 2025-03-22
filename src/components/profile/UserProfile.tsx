
import React, { useState } from 'react';
import { UserProfileMenu } from './UserProfileMenu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Bell, 
  CreditCard, 
  File, 
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
  const navigate = useNavigate();
  const [username] = useState('Paisa Raja');
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/public/lovable-uploads/ee875c5a-4a74-4430-aad3-f52e67ef759a.png" alt="User" />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-muted-foreground">
              paisa.raja@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/portfolio')}>
            <User className="mr-2 h-4 w-4" />
            <span>Portfolio</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/tax-documents')}>
            <File className="mr-2 h-4 w-4" />
            <span>Tax Documents</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/learn')}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Learn</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/notifications')}>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/payment-methods')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payment Methods</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/help-and-support')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
