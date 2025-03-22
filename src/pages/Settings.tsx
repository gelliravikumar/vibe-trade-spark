
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useData } from '@/context/DataContext';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { usePortfolio } from '@/hooks/use-portfolio';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import {
  AlarmClock,
  AreaChart,
  Bell,
  BookOpen,
  CreditCard,
  Fingerprint,
  GanttChart,
  History,
  Lock,
  SaveAll,
  Send,
  Server,
  Settings,
  Smartphone,
  User,
  Wallet,
  PersonStanding,
  Globe,
  Eye,
  EyeOff,
  LogOut,
  BarChart3,
  Briefcase,
  Check,
  Trash2,
  Laptop,
  Moon,
  SunMedium,
  FileStack,
  Flag,
  Languages,
  Calculator,
  Cpu,
  Puzzle,
  ArrowDown,
  Clock
} from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  icon,
  children,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

interface SettingsItemProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-row justify-between items-center py-4">
      <div className="space-y-0.5">
        <Label className="text-base">{title}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

const Settings = () => {
  const { 
    apiProvider, 
    setApiProvider, 
    connectionMethod, 
    setConnectionMethod, 
    useDummyData, 
    setUseDummyData 
  } = useData();
  const { isPaperTrading, setIsPaperTrading, resetAccount } = usePaperTrading();
  const { clearPortfolio } = usePortfolio();
  
  const [notifications, setNotifications] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("en");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [deviceHistory, setDeviceHistory] = useState([
    { id: 1, device: "Windows PC", location: "Mumbai, India", lastActive: "Now" },
    { id: 2, device: "iPhone 13", location: "Delhi, India", lastActive: "2 days ago" },
    { id: 3, device: "Android Tablet", location: "Bangalore, India", lastActive: "1 week ago" },
  ]);
  
  // Personal Information
  const [name, setName] = useState("Paisa Raja");
  const [email, setEmail] = useState("paisa.raja@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState({
    street: "123 Financial Street",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India"
  });
  
  // Account preferences
  const [defaultView, setDefaultView] = useState("dashboard");
  const [chartType, setChartType] = useState("candlestick");
  const [orderConfirmation, setOrderConfirmation] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");
  
  const handleClearData = () => {
    localStorage.clear();
    resetAccount();
    clearPortfolio();
    window.location.reload();
  };
  
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setDarkMode(theme === 'dark');
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-grow py-8 px-4 md:px-8 container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3">
            <Card>
              <CardContent className="p-4">
                <Tabs defaultValue="account" className="w-full" orientation="vertical">
                  <TabsList className="flex flex-col h-auto items-stretch bg-transparent space-y-1">
                    <TabsTrigger value="account" className="justify-start text-left px-2 py-2">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start text-left px-2 py-2">
                      <Eye className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="trading" className="justify-start text-left px-2 py-2">
                      <AreaChart className="h-4 w-4 mr-2" />
                      Trading
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start text-left px-2 py-2">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start text-left px-2 py-2">
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="data" className="justify-start text-left px-2 py-2">
                      <Server className="h-4 w-4 mr-2" />
                      Data & Privacy
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="justify-start text-left px-2 py-2">
                      <Settings className="h-4 w-4 mr-2" />
                      Preferences
                    </TabsTrigger>
                    <TabsTrigger value="devices" className="justify-start text-left px-2 py-2">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Devices
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="justify-start text-left px-2 py-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </TabsTrigger>
                    <TabsTrigger value="developer" className="justify-start text-left px-2 py-2">
                      <Cpu className="h-4 w-4 mr-2" />
                      Developer
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </aside>
          
          <main className="md:col-span-9">
            <Tabs defaultValue="account">
              <TabsContent value="account" className="space-y-6">
                <SettingsSection 
                  title="Personal Information" 
                  description="Manage your personal details"
                  icon={<User className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" value="1990-01-01" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Card</Label>
                      <Input id="pan" placeholder="ABCDE1234F" />
                      <p className="text-xs text-muted-foreground mt-1">Required for trading in India</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input 
                            id="street" 
                            value={address.street}
                            onChange={(e) => setAddress({...address, street: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            value={address.state}
                            onChange={(e) => setAddress({...address, state: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip Code</Label>
                          <Input 
                            id="zip" 
                            value={address.zip}
                            onChange={(e) => setAddress({...address, zip: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        <SaveAll className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Account Information" 
                  description="View and manage your account details"
                  icon={<Briefcase className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="flex flex-col p-4 bg-muted/50">
                        <div className="text-sm text-muted-foreground">Account Type</div>
                        <div className="font-medium flex items-center mt-1">
                          <PersonStanding className="h-4 w-4 mr-2 text-primary" />
                          Regular Trading Account
                        </div>
                      </Card>
                      
                      <Card className="flex flex-col p-4 bg-muted/50">
                        <div className="text-sm text-muted-foreground">Account Status</div>
                        <div className="font-medium flex items-center mt-1 text-success">
                          <Check className="h-4 w-4 mr-2" />
                          Active
                        </div>
                      </Card>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="flex flex-col p-4 bg-muted/50">
                        <div className="text-sm text-muted-foreground">Member Since</div>
                        <div className="font-medium mt-1">
                          January 15, 2023
                        </div>
                      </Card>
                      
                      <Card className="flex flex-col p-4 bg-muted/50">
                        <div className="text-sm text-muted-foreground">Account ID</div>
                        <div className="font-medium mt-1">
                          TRAD8765309
                        </div>
                      </Card>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full md:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6">
                <SettingsSection 
                  title="Theme" 
                  description="Customize the appearance of the application"
                  icon={<Eye className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card className={`border-2 cursor-pointer ${!darkMode ? 'border-primary' : 'border-transparent'}`} onClick={() => setDarkMode(false)}>
                        <CardContent className="p-4 text-center">
                          <div className="bg-white dark:bg-background rounded-md p-2 mb-2 flex justify-center">
                            <SunMedium className="h-8 w-8 text-yellow-500" />
                          </div>
                          <p className="font-medium">Light</p>
                        </CardContent>
                      </Card>
                      
                      <Card className={`border-2 cursor-pointer ${darkMode ? 'border-primary' : 'border-transparent'}`} onClick={() => setDarkMode(true)}>
                        <CardContent className="p-4 text-center">
                          <div className="bg-gray-900 rounded-md p-2 mb-2 flex justify-center">
                            <Moon className="h-8 w-8 text-indigo-400" />
                          </div>
                          <p className="font-medium">Dark</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-transparent cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="bg-gradient-to-r from-gray-100 to-gray-800 rounded-md p-2 mb-2 flex justify-center">
                            <Laptop className="h-8 w-8 text-purple-500" />
                          </div>
                          <p className="font-medium">System</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <SettingsItem title="Use Dark Theme">
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </SettingsItem>
                    
                    <Separator />
                    
                    <SettingsItem 
                      title="Chart Color Theme" 
                      description="Choose the color scheme for charts"
                    >
                      <Select defaultValue="default">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="colorful">Colorful</SelectItem>
                          <SelectItem value="monochrome">Monochrome</SelectItem>
                          <SelectItem value="pastel">Pastel</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Font Size" 
                      description="Adjust the text size throughout the app"
                    >
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Layout Preferences" 
                  description="Customize how information is displayed"
                  icon={<GanttChart className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Default Page" 
                      description="Choose your landing page when you open the app"
                    >
                      <Select value={defaultView} onValueChange={setDefaultView}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="portfolio">Portfolio</SelectItem>
                          <SelectItem value="markets">Markets</SelectItem>
                          <SelectItem value="watchlist">Watchlist</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Compact View" 
                      description="Display more information with less spacing"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Show Asset Logos" 
                      description="Display logos for stocks and cryptocurrencies"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="trading" className="space-y-6">
                <SettingsSection 
                  title="Trading Preferences" 
                  description="Configure your trading experience"
                  icon={<BarChart3 className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Paper Trading Mode" 
                      description="Practice trading with virtual money"
                    >
                      <Switch 
                        checked={isPaperTrading} 
                        onCheckedChange={setIsPaperTrading}
                      />
                    </SettingsItem>
                    
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={resetAccount}
                        className="flex items-center justify-center"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Reset Paper Trading Account
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => toast.success("Demo funds added!")}
                        className="flex items-center justify-center"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Add Demo Funds
                      </Button>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <SettingsItem 
                      title="Default Chart Type" 
                      description="Set your preferred chart visualization"
                    >
                      <Select value={chartType} onValueChange={setChartType}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="candlestick">Candlestick</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="area">Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Order Confirmation" 
                      description="Show confirmation dialog before placing orders"
                    >
                      <Switch checked={orderConfirmation} onCheckedChange={setOrderConfirmation} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Auto-refresh Market Data" 
                      description="Automatically update market data"
                    >
                      <div className="flex items-center space-x-2">
                        <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                        {autoRefresh && (
                          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5s</SelectItem>
                              <SelectItem value="10">10s</SelectItem>
                              <SelectItem value="30">30s</SelectItem>
                              <SelectItem value="60">1m</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Data Source" 
                  description="Configure market data sources"
                  icon={<Server className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Use Dummy Data" 
                      description="Use sample data instead of live market data"
                    >
                      <Switch 
                        checked={useDummyData} 
                        onCheckedChange={setUseDummyData}
                      />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="API Provider" 
                      description="Select your preferred data provider"
                    >
                      <DataSourceSelector />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Connection Method" 
                      description="Choose how to receive market updates"
                    >
                      <RadioGroup 
                        value={connectionMethod}
                        onValueChange={(value) => setConnectionMethod(value as any)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="WEBSOCKET" id="ws" />
                          <Label htmlFor="ws">WebSocket</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="REST" id="rest" />
                          <Label htmlFor="rest">REST API</Label>
                        </div>
                      </RadioGroup>
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <SettingsSection 
                  title="Notifications" 
                  description="Manage how and when you get notified"
                  icon={<Bell className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Push Notifications" 
                      description="Receive notifications on your device"
                    >
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Email Notifications" 
                      description="Receive notifications via email"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="SMS Notifications" 
                      description="Receive notifications via SMS"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <Separator className="my-4" />
                    
                    <SettingsItem 
                      title="Price Alerts" 
                      description="Notify when stocks hit price targets"
                    >
                      <Switch checked={marketAlerts} onCheckedChange={setMarketAlerts} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="News Alerts" 
                      description="Notify about important market news"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Trading Activity" 
                      description="Notify about your trades and orders"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Account Security" 
                      description="Notify about login attempts and security issues"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <SettingsSection 
                  title="Security Settings" 
                  description="Protect your account with additional security"
                  icon={<Lock className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Two-Factor Authentication" 
                      description="Add an extra layer of security to your account"
                    >
                      <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                    </SettingsItem>
                    
                    <div className={`mt-4 ${twoFactor ? 'block' : 'hidden'}`}>
                      <Card className="p-4 bg-muted">
                        <div className="text-center mb-4">
                          <div className="bg-background mx-auto w-40 h-40 flex items-center justify-center rounded-md mb-2">
                            <img 
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAYAAAAZtYVBAAAAAklEQVR4AewaftIAAAYSSURBVO3BQY4kRxIEQdNA/f/Lym0OPBFAtVbPzDJh9gcVS45iSZKiWJKkKJYkKYolSYpiSZKiWJKkKJYkKYolSYpiSZKiWJKkKJYkKYolSYpiSZLi4kOR+ZsiM41Mr8hMI9MbkXmjyEwj86nITCPzisjcKTLTyEwjM0XmjSLzich8qliSpCiWJCmKJUmKiw+LzBuR+VRkfiIyU2T+T0RmGplJZKbITCMzRWaKzDQyU2QmkZlGZorMFJlpZKaRmUZmiswUmUlkPh+ZXyQyb4jMJ4olSYpiSZKiWJKkuPiLReZ/icwUmUlkXhGZSWSmkZlE5o7ITIEJJJLITJGZIvOKyEyRmUZm+v1Lxf9XsWQXS3axJMnFf0xkJpGZRGaKzBSZV0RmEplJZCaRmUbmjshMIjOJzCQyk8jcichfqlhyFkuSFMWSJEVx8aXITCPzRmSmkflEZKaRmUZmisw0Mq+IzDQyU2S+ITJ3RGaKzJ3ITCIzjcw0MlNkPiUyn4rMnWLJLpYkKYolSYri4kMiM4nMFJlpZKaRmUbmTmSmkbkjMpPITJGZRmYSmTsiM43MJDJ3IjOJ/wHFkiRFsSRJUfwHReYVkZkiM0VmEpk7kXkjMq+IzBSZKTKTyLwhMtPITCIzRWYamUlk7kTmU5G5E5lPFUt2sSRJUSxJUlx8KDLTyEwic0dkfiIynziZN0TmTmTuiMwkMtPITCLzExMQJzLTyEyRmURmGpkpMlNk7hRLdrEkSVEsSVJcfCgy08hMIzOJzBSZKTKvRGYSmSkyU2S+ITKTyEyRmUbmFZF5RWSmkZlG5hWRmUbmjshMIjONzCsiM43MFJlpZF5RLNnFkiRFsSRJcfGHicwrIjONzCQyk8hMkXlDZN6IzBSZaWSmyEwi80eKzBSZKTLTyLwiMtPIfKJYsoslSYpiSZLi4g8TmWlkJpGZRmYamTsi84rIvCIyj0RmGpkpMq+IzDQyd0TmFZE5icw0Mt8QmZ8oluRiSZKiWJKkKC4+FJkpMpPI3BGZKTKTyEyRmUbmjZOZRGaKzDQyU2QmkZlGZorMKyLzqchMkZkiM0VmiskEpshMkblTLNnFkiRFsSRJcfGhyEyRmUZmisw0Mp+KzDQyU2SmyEwj84rITCMzRWYSme8TmSkyU2SmkZlGZhqZaWSmyNwRmSkyU2S+oViSiyVJimJJkqL4Q41M4PtiM43MJDLTyEwi84rITCIzRWYSme8TmSky08hMkZlGZhKZaWQmkXlDZO4US3axJElRLElSFBcfiswjkZlG5hOReSQy08hMkXlFZF4RmU9EZorMHZGZRGYamWlkJpGZRuaOyEyRmSIzicwdkZki84liSS6WJCmKJUmK4g8VmWlk7ojMJDKPRGaKzDQyk8hMIzONzBSZKTKviMwkMq+IzCQyk8i8IjKTyLwhMlNkJpGZRuYVkZkicycy3yiW7GJJkqJYkqS4+FBkJpGZRmYamUlkHonMJDKTyPz+JTOJzCORmUZmGplpZB6JzCQy08hMkZlGZorMHZG5E5lpZKaReSQyd4oluViSpCiWJCmKP1RkXhGZSWSmkbkTmWlkJpG5IzJ3RGYamVdEZhqZSWQeicwrIjONzCOR+UTJBIoluViSpCiWJCmKiw9F5pvEBEpiAgLuROZOZO6IzB/pZF4RmWlkPiUyj0RmGpkpMtPITJGZRmYSmU8US3axJElRLElSFMWSJEWxJElRLElSFEuSFMWSJEWxJElRLElSFEuSFMWSJEWxJElRLElSFEuSFP8BVlXwUilM1zAAAAAASUVORK5CYII=" 
                              alt="QR Code" 
                              className="w-full h-full" 
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">Scan this QR code with your authenticator app</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="authcode">Enter Authentication Code</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="authcode" placeholder="••••••" />
                            <Button>Verify</Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <SettingsItem 
                      title="Change Password" 
                      description="Update your account password"
                    >
                      <Button variant="outline">Update</Button>
                    </SettingsItem>
                    
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="current-pw">Current Password</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="current-pw" 
                          type={passwordVisible ? "text" : "password"} 
                          placeholder="••••••••••••" 
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-pw">New Password</Label>
                      <Input 
                        id="new-pw" 
                        type="password" 
                        placeholder="••••••••••••" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pw">Confirm New Password</Label>
                      <Input 
                        id="confirm-pw" 
                        type="password" 
                        placeholder="••••••••••••" 
                      />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button>
                        Save Password
                      </Button>
                    </div>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Login History" 
                  description="Review recent account activity"
                  icon={<History className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {deviceHistory.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-4">
                              <div className="flex items-center">
                                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                  <Laptop className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.device}</p>
                                  <p className="text-sm text-muted-foreground">{item.location}</p>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.lastActive}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-end">
                      <Button variant="outline">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out All Devices
                      </Button>
                    </div>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-6">
                <SettingsSection 
                  title="Data & Privacy" 
                  description="Manage your data and privacy settings"
                  icon={<FileStack className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Usage Analytics" 
                      description="Allow us to collect anonymous usage data"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Personalization" 
                      description="Allow us to personalize your experience"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Marketing Communications" 
                      description="Receive marketing emails and promotions"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <Separator className="my-4" />
                    
                    <SettingsItem 
                      title="Do Not Track" 
                      description="Request that websites don't track your activity"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Data Export" 
                      description="Download a copy of your data"
                    >
                      <Button variant="outline">Export</Button>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Clear Local Data" 
                      description="Remove all locally stored data"
                    >
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">Clear Data</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset your account settings and clear all locally stored data.
                              Your portfolio and trading history will be preserved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearData}>
                              Clear Data
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <SettingsSection 
                  title="Regional Settings" 
                  description="Configure regional preferences"
                  icon={<Globe className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Currency" 
                      description="Set your preferred currency"
                    >
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Timezone" 
                      description="Set your local timezone"
                    >
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                          <SelectItem value="America/New_York">New York (EST)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Language" 
                      description="Set your preferred language"
                    >
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <Separator className="my-4" />
                    
                    <SettingsItem 
                      title="Date Format" 
                      description="Choose how dates are displayed"
                    >
                      <Select defaultValue="dd/mm/yyyy">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy/mm/dd">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Number Format" 
                      description="Choose how numbers are displayed"
                    >
                      <Select defaultValue="indian">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Number format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indian">Indian (1,00,000.00)</SelectItem>
                          <SelectItem value="western">Western (100,000.00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Time Settings" 
                  description="Configure time display preferences"
                  icon={<Clock className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="24-Hour Time" 
                      description="Use 24-hour format instead of AM/PM"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Auto-update Market Time" 
                      description="Automatically adjust time based on market"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Show Seconds" 
                      description="Display seconds in time displays"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Accessibility" 
                  description="Configure accessibility settings"
                  icon={<BookOpen className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="High Contrast Mode" 
                      description="Increase contrast for better visibility"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Animation Reduction" 
                      description="Reduce or disable UI animations"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Screen Reader Optimization" 
                      description="Optimize the interface for screen readers"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="devices" className="space-y-6">
                <SettingsSection 
                  title="Connected Devices" 
                  description="Manage your connected devices"
                  icon={<Smartphone className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {deviceHistory.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-4">
                              <div className="flex items-center">
                                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                  <Laptop className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.device}</p>
                                  <p className="text-sm text-muted-foreground">{item.location}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Biometric Authentication" 
                  description="Use biometrics to secure your account"
                  icon={<Fingerprint className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Touch ID / Face ID" 
                      description="Use biometrics for faster authentication"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Require Biometrics for Trades" 
                      description="Use biometrics to confirm transactions"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Push Notifications" 
                  description="Configure how you receive notifications"
                  icon={<Bell className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Allow Push Notifications" 
                      description="Receive alerts on this device"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Notification Sound" 
                      description="Play a sound when notifications arrive"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Notification Vibration" 
                      description="Vibrate when notifications arrive"
                    >
                      <Switch defaultChecked={true} />
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-6">
                <SettingsSection 
                  title="Subscription" 
                  description="Manage your subscription plans"
                  icon={<CreditCard className="h-5 w-5" />}
                >
                  <Card className="p-6 bg-muted/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">Free Plan</h3>
                        <p className="text-sm text-muted-foreground">Basic trading features</p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Basic market data</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Paper trading</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Limited watchlists</span>
                      </div>
                    </div>
                    
                    <Button className="w-full">Upgrade Plan</Button>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="p-4">
                      <div className="mb-2">
                        <h3 className="font-medium">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">Advanced features</p>
                      </div>
                      <div className="font-bold text-2xl mb-2">₹499<span className="text-sm font-normal">/month</span></div>
                      <Button variant="outline" className="w-full">Upgrade</Button>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="mb-2">
                        <h3 className="font-medium">Premium Plan</h3>
                        <p className="text-sm text-muted-foreground">Professional tools</p>
                      </div>
                      <div className="font-bold text-2xl mb-2">₹999<span className="text-sm font-normal">/month</span></div>
                      <Button variant="outline" className="w-full">Upgrade</Button>
                    </Card>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Payment Methods" 
                  description="Manage your payment methods"
                  icon={<Wallet className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <Card className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">HDFC Bank ****4321</p>
                          <p className="text-sm text-muted-foreground">Expires 09/2026</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </Card>
                    
                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Billing History" 
                  description="View your past invoices"
                  icon={<FileStack className="h-5 w-5" />}
                >
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        <div className="flex justify-between items-center p-4">
                          <div>
                            <p className="font-medium">Free Plan</p>
                            <p className="text-sm text-muted-foreground">April 15, 2023</p>
                          </div>
                          <div className="text-sm">
                            ₹0.00
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SettingsSection>
              </TabsContent>
              
              <TabsContent value="developer" className="space-y-6">
                <SettingsSection 
                  title="Developer Settings" 
                  description="Advanced settings for developers"
                  icon={<Cpu className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Developer Mode" 
                      description="Enable advanced debugging features"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Console Logging" 
                      description="Log detailed information to the console"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Performance Metrics" 
                      description="Display performance information"
                    >
                      <Switch defaultChecked={false} />
                    </SettingsItem>
                    
                    <Separator className="my-4" />
                    
                    <SettingsItem 
                      title="API Access" 
                      description="Generate API keys for programmatic access"
                    >
                      <Button variant="outline">Manage Keys</Button>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Export Schema" 
                      description="Download the API schema documentation"
                    >
                      <Button variant="outline">Export</Button>
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Integrations" 
                  description="Manage third-party integrations"
                  icon={<Puzzle className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Google Sheets" 
                      description="Sync portfolio data with Google Sheets"
                    >
                      <Button variant="outline">Connect</Button>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Excel" 
                      description="Export data to Microsoft Excel"
                    >
                      <Button variant="outline">Connect</Button>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="TradingView" 
                      description="Link with your TradingView account"
                    >
                      <Button variant="outline">Connect</Button>
                    </SettingsItem>
                  </div>
                </SettingsSection>
                
                <SettingsSection 
                  title="Advanced Settings" 
                  description="Configure advanced features"
                  icon={<Calculator className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <SettingsItem 
                      title="Custom Time Zone" 
                      description="Set custom timezone for API requests"
                    >
                      <Select defaultValue="utc">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="exchange">Exchange Time</SelectItem>
                          <SelectItem value="local">Local Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                    
                    <SettingsItem 
                      title="Cache Duration" 
                      description="Set how long data is cached"
                    >
                      <Select defaultValue="30">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No Cache</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsItem>
                  </div>
                </SettingsSection>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Settings;
