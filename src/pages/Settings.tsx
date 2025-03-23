import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  Smartphone, 
  Moon, 
  Sun, 
  Globe, 
  Eye, 
  EyeOff, 
  ChevronRight,
  UserCheck,
  Key,
  Mail,
  Phone,
  Home,
  Briefcase,
  PieChart,
  Clock,
  ArrowRightLeft,
  Wallet,
  ShieldAlert,
  FileText,
  RefreshCw
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger, 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Badge } from '@/components/ui/badge';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { setIsPaperTrading, isPaperTrading } = usePaperTrading();
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  
  // User profile data
  const [userData, setUserData] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    address: "123 Koramangala, Bangalore - 560034",
    occupation: "Software Engineer",
    taxId: "ABCDE1234F",
    dob: "15/04/1992",
  });
  
  const handleReset = () => {
    toast.success("Paper trading balance and history have been reset");
  };
  
  const handleProfileUpdate = () => {
    toast.success("Profile updated successfully");
  };
  
  const handlePasswordChange = () => {
    toast.success("Password changed successfully");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs 
                  orientation="vertical" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                >
                  <TabsList>
                    <TabsTrigger 
                      value="general" 
                      className="justify-start w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start w-full"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start w-full"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="trading" 
                      className="justify-start w-full"
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Trading
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appearance" 
                      className="justify-start w-full"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="help" 
                      className="justify-start w-full"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => toast.info("You have been logged out")}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:w-3/4">
            <TabsContent value="general" forceMount hidden={activeTab !== "general"}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email} 
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={userData.phone} 
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        value={userData.dob} 
                        onChange={(e) => setUserData({...userData, dob: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={userData.address} 
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input 
                        id="occupation" 
                        value={userData.occupation} 
                        onChange={(e) => setUserData({...userData, occupation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">PAN Number</Label>
                      <Input 
                        id="taxId" 
                        value={userData.taxId} 
                        onChange={(e) => setUserData({...userData, taxId: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-email">Show Email</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to see your email
                          </p>
                        </div>
                        <Switch id="show-email" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-portfolio">Portfolio Privacy</Label>
                          <p className="text-sm text-muted-foreground">
                            Make your portfolio visible to other users
                          </p>
                        </div>
                        <Switch id="show-portfolio" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" forceMount hidden={activeTab !== "security"}>
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="current-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange}>Update Password</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch 
                        checked={twoFactorEnabled} 
                        onCheckedChange={setTwoFactorEnabled} 
                      />
                    </div>
                    {twoFactorEnabled && (
                      <div className="rounded-md border p-4 mt-4">
                        <h4 className="font-medium mb-2">Set up 2FA</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Scan the QR code with an authenticator app like Google Authenticator or Authy.
                        </p>
                        <div className="flex justify-center my-4">
                          <div className="w-48 h-48 bg-muted/50 flex items-center justify-center">
                            <p className="text-muted-foreground">QR Code Placeholder</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="verification-code">Verification Code</Label>
                          <Input 
                            id="verification-code" 
                            placeholder="Enter the 6-digit code"
                          />
                        </div>
                        <Button className="mt-4">Verify and Activate</Button>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Biometric Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Biometric Login</Label>
                        <p className="text-sm text-muted-foreground">
                          Use fingerprint or face recognition to login
                        </p>
                      </div>
                      <Switch 
                        checked={biometricEnabled} 
                        onCheckedChange={setBiometricEnabled} 
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>
                    <div className="rounded-md border divide-y">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Current Session</div>
                          <Badge>Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Device: Chrome on Windows</p>
                          <p>IP Address: 192.168.1.1</p>
                          <p>Started: Today, 10:30 AM</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Recent Session</div>
                          <Button variant="outline" size="sm">Logout</Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Device: Safari on iPhone</p>
                          <p>IP Address: 192.168.1.2</p>
                          <p>Started: Yesterday, 4:15 PM</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">Logout from All Devices</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" forceMount hidden={activeTab !== "notifications"}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications from the application
                      </p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled} 
                      onCheckedChange={setNotificationsEnabled} 
                    />
                  </div>
                  
                  {notificationsEnabled && (
                    <>
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Price Alerts</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Stock Price Changes</Label>
                              <p className="text-sm text-muted-foreground">
                                Get notified about significant price changes
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Watchlist Updates</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive updates for items in your watchlist
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Market Open/Close</Label>
                              <p className="text-sm text-muted-foreground">
                                Notifications for market open and close
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Account Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Order Executed</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify when your orders are executed
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Deposit/Withdrawal</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify about fund movements in your account
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Security Alerts</Label>
                              <p className="text-sm text-muted-foreground">
                                Get alerted about login attempts and security changes
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Delivery</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications in browser
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>SMS Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive important alerts via SMS
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="trading" forceMount hidden={activeTab !== "trading"}>
              <Card>
                <CardHeader>
                  <CardTitle>Trading Settings</CardTitle>
                  <CardDescription>
                    Configure your trading preferences and account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Trading Mode</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="paper-trading">Paper Trading</Label>
                        <p className="text-sm text-muted-foreground">
                          Practice trading with virtual money
                        </p>
                      </div>
                      <Switch 
                        id="paper-trading"
                        checked={isPaperTrading}
                        onCheckedChange={setIsPaperTrading}
                      />
                    </div>
                    
                    {isPaperTrading && (
                      <div className="mt-4">
                        <Button variant="outline" onClick={handleReset}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Paper Trading Account
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Display Settings</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hide-balance">Hide Balance</Label>
                        <p className="text-sm text-muted-foreground">
                          Hide your balance and portfolio value
                        </p>
                      </div>
                      <Switch 
                        id="hide-balance"
                        checked={hideBalance}
                        onCheckedChange={setHideBalance}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="default-view">Default Chart Timeframe</Label>
                        <p className="text-sm text-muted-foreground">
                          Select default timeframe for charts
                        </p>
                      </div>
                      <Select defaultValue="1D">
                        <SelectTrigger id="default-view" className="w-32">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1D">1 Day</SelectItem>
                          <SelectItem value="1W">1 Week</SelectItem>
                          <SelectItem value="1M">1 Month</SelectItem>
                          <SelectItem value="3M">3 Months</SelectItem>
                          <SelectItem value="1Y">1 Year</SelectItem>
                          <SelectItem value="ALL">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Order Confirmations</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Confirm Market Orders</Label>
                          <p className="text-sm text-muted-foreground">
                            Show confirmation before executing market orders
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Confirm Limit Orders</Label>
                          <p className="text-sm text-muted-foreground">
                            Show confirmation before placing limit orders
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Confirm Order Cancellation</Label>
                          <p className="text-sm text-muted-foreground">
                            Show confirmation before cancelling orders
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" forceMount hidden={activeTab !== "appearance"}>
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Theme Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose between light and dark theme
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Display Density</h3>
                    <RadioGroup defaultValue="comfortable">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="compact" />
                        <Label htmlFor="compact">Compact</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comfortable" id="comfortable" />
                        <Label htmlFor="comfortable">Comfortable</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Charts</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show After-Hours Trading</Label>
                          <p className="text-sm text-muted-foreground">
                            Display after-hours price data on charts
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Extended Hours</Label>
                          <p className="text-sm text-muted-foreground">
                            Display pre-market and after-hours trading data
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div>
                        <Label className="mb-2 block">Default Chart Type</Label>
                        <Select defaultValue="candlestick">
                          <SelectTrigger>
                            <SelectValue placeholder="Select chart type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="line">Line</SelectItem>
                            <SelectItem value="candlestick">Candlestick</SelectItem>
                            <SelectItem value="ohlc">OHLC</SelectItem>
                            <SelectItem value="area">Area</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="help" forceMount hidden={activeTab !== "help"}>
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>
                    Get help and find answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          How do I reset my password?
                        </AccordionTrigger>
                        <AccordionContent>
                          To reset your password, go to the login page and click on "Forgot Password". 
                          Follow the instructions sent to your registered email address.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          How does paper trading work?
                        </AccordionTrigger>
                        <AccordionContent>
                          Paper trading lets you practice trading with virtual money. All trades are 
                          simulated with real-time market data, but no actual transactions take place.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>
                          What are the trading hours?
                        </AccordionTrigger>
                        <AccordionContent>
                          Indian stock markets (NSE and BSE) are open from Monday to Friday, 
                          9:15 AM to 3:30 PM IST, excluding market holidays. Cryptocurrency 
                          markets are open 24/7.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>
                          How do I add funds to my account?
                        </AccordionTrigger>
                        <AccordionContent>
                          You can add funds by going to the Portfolio section and clicking on 
                          "Deposit Funds". We support various payment methods including UPI, 
                          net banking, and bank transfers.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Support</h3>
                    <div className="rounded-md border p-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Our support team is available 24/7 to assist you with any questions or issues.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="support-subject">Subject</Label>
                        <Input id="support-subject" placeholder="Enter subject" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-message">Message</Label>
                        <textarea 
                          id="support-message"
                          rows={4}
                          className="w-full min-h-[100px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          placeholder="Describe your issue or question"
                        ></textarea>
                      </div>
                      <Button>Submit Request</Button>
                    </div>
                    
                    <div className="rounded-md bg-muted p-4 mt-4">
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium">Other Ways to Reach Us:</p>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>support@tradepaisa.com</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>+91 1800-123-4567 (Toll Free)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button variant="outline" className="w-full" onClick={() => navigate('/learn')}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Documentation and Tutorials
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
