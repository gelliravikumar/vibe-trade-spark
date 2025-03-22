
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataSourceSelector } from "@/components/ui/DataSourceSelector"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Settings as SettingsIcon,
  User,
  Lock,
  CreditCard,
  Bell,
  Database,
  LineChart,
  Globe,
  PaintBucket,
  Sun,
  Moon,
  Monitor,
  Key,
  Share2,
  AlertCircle,
  Activity,
  Trash2,
  Code
} from 'lucide-react';
import { usePortfolio } from '@/hooks/use-portfolio';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { setTheme, theme } = useTheme();

  // State for active tab
  const [activeTab, setActiveTab] = useState("account");
  
  // Account settings
  const [name, setName] = useState("Paisa Raja");
  const [email, setEmail] = useState("paisa.raja@example.com");
  const [phone, setPhone] = useState("+91 9876543210");
  
  // Trade settings
  const [defaultOrder, setDefaultOrder] = useState("market");
  const [confirmOrders, setConfirmOrders] = useState(true);
  const [showAvgPrice, setShowAvgPrice] = useState(true);
  const [defaultQty, setDefaultQty] = useState("1");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(true);
  const [tradingAlerts, setTradingAlerts] = useState(true);
  
  // Data settings
  const [dataProvider, setDataProvider] = useState("alphavantage");
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [connectionType, setConnectionType] = useState("websocket");
  const [useDummyData, setUseDummyData] = useState(true);
  
  // Trading mode
  const { isPaperTrading, setIsPaperTrading, paperBalance, addFunds, resetAccount } = usePaperTrading();
  const [fundAmount, setFundAmount] = useState('10000');
  
  // Settings are persisted in localStorage
  useEffect(() => {
    try {
      // Load settings from localStorage
      const settings = {
        name: localStorage.getItem('tradingApp_name') || "Paisa Raja",
        email: localStorage.getItem('tradingApp_email') || "paisa.raja@example.com",
        phone: localStorage.getItem('tradingApp_phone') || "+91 9876543210",
        defaultOrder: localStorage.getItem('tradingApp_defaultOrder') || "market",
        confirmOrders: localStorage.getItem('tradingApp_confirmOrders') === "true",
        showAvgPrice: localStorage.getItem('tradingApp_showAvgPrice') === "true",
        defaultQty: localStorage.getItem('tradingApp_defaultQty') || "1",
        emailNotifications: localStorage.getItem('tradingApp_emailNotifications') === "true",
        priceAlerts: localStorage.getItem('tradingApp_priceAlerts') === "true",
        newsAlerts: localStorage.getItem('tradingApp_newsAlerts') === "true",
        tradingAlerts: localStorage.getItem('tradingApp_tradingAlerts') === "true",
        dataProvider: localStorage.getItem('tradingApp_dataProvider') || "alphavantage",
        refreshInterval: parseInt(localStorage.getItem('tradingApp_refreshInterval') || "5"),
        connectionType: localStorage.getItem('tradingApp_connectionType') || "websocket",
        useDummyData: localStorage.getItem('tradingApp_useDummyData') === "true",
      };
      
      // Set state with loaded settings
      setName(settings.name);
      setEmail(settings.email);
      setPhone(settings.phone);
      setDefaultOrder(settings.defaultOrder);
      setConfirmOrders(settings.confirmOrders);
      setShowAvgPrice(settings.showAvgPrice);
      setDefaultQty(settings.defaultQty);
      setEmailNotifications(settings.emailNotifications);
      setPriceAlerts(settings.priceAlerts);
      setNewsAlerts(settings.newsAlerts);
      setTradingAlerts(settings.tradingAlerts);
      setDataProvider(settings.dataProvider);
      setRefreshInterval(settings.refreshInterval);
      setConnectionType(settings.connectionType);
      setUseDummyData(settings.useDummyData);
      
      // Check for URL parameters for active tab
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
      
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);
  
  // Save settings to localStorage
  const saveSettings = () => {
    try {
      // Save all settings to localStorage
      localStorage.setItem('tradingApp_name', name);
      localStorage.setItem('tradingApp_email', email);
      localStorage.setItem('tradingApp_phone', phone);
      localStorage.setItem('tradingApp_defaultOrder', defaultOrder);
      localStorage.setItem('tradingApp_confirmOrders', confirmOrders.toString());
      localStorage.setItem('tradingApp_showAvgPrice', showAvgPrice.toString());
      localStorage.setItem('tradingApp_defaultQty', defaultQty);
      localStorage.setItem('tradingApp_emailNotifications', emailNotifications.toString());
      localStorage.setItem('tradingApp_priceAlerts', priceAlerts.toString());
      localStorage.setItem('tradingApp_newsAlerts', newsAlerts.toString());
      localStorage.setItem('tradingApp_tradingAlerts', tradingAlerts.toString());
      localStorage.setItem('tradingApp_dataProvider', dataProvider);
      localStorage.setItem('tradingApp_refreshInterval', refreshInterval.toString());
      localStorage.setItem('tradingApp_connectionType', connectionType);
      localStorage.setItem('tradingApp_useDummyData', useDummyData.toString());
      
      toast.success("Settings saved successfully!");
      
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };
  
  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    addFunds(amount);
    toast.success(`₹${amount.toLocaleString()} added to your paper trading account`);
    setFundAmount('10000');
  };
  
  const handleResetAccount = () => {
    if (window.confirm("Are you sure you want to reset your paper trading account? This will reset your balance to ₹10,000 and remove all positions.")) {
      resetAccount();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <SettingsIcon className="h-5 w-5" />
                      <span>Settings</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <div className="px-2 pb-4">
                    <Tabs 
                      defaultValue={activeTab} 
                      value={activeTab} 
                      onValueChange={setActiveTab} 
                      orientation="vertical" 
                      className="w-full"
                    >
                      <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0">
                        <TabsTrigger 
                          value="account" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <User className="h-4 w-4 mr-2" />
                          <span>Account</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="security" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          <span>Security</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="payment" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>Payment Methods</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="trade" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <LineChart className="h-4 w-4 mr-2" />
                          <span>Trading Preferences</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="notification" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          <span>Notifications</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="data" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <Database className="h-4 w-4 mr-2" />
                          <span>Data Sources</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="appearance" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <PaintBucket className="h-4 w-4 mr-2" />
                          <span>Appearance</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="api" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <Key className="h-4 w-4 mr-2" />
                          <span>API Access</span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="advanced" 
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-muted"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          <span>Advanced</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </Card>
              </div>
              
              <div className="md:w-3/4">
                <Card>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsContent value="account" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Account Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage your account settings and preferences.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              placeholder="Your full name" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)} 
                              placeholder="Your email address" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)} 
                              placeholder="Your phone number" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={saveSettings}>Save Changes</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="security" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Security Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage your security settings and authentication methods.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                              Update your password to maintain account security.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirm New Password</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button>Update Password</Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>
                              Add an extra layer of security to your account.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>SMS Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive verification codes via text message.
                                </p>
                              </div>
                              <Switch checked={true} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Authenticator App</Label>
                                <p className="text-sm text-muted-foreground">
                                  Use an authenticator app for verification codes.
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="payment" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Payment Methods</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage your payment methods and funds transfer options.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Bank Accounts</CardTitle>
                            <CardDescription>
                              Manage connected bank accounts for deposits and withdrawals.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">HDFC Bank</div>
                                <Badge>Primary</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Account ending in ****6789
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline">+ Add New Bank Account</Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>UPI IDs</CardTitle>
                            <CardDescription>
                              Manage UPI IDs for instant deposits and withdrawals.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">paisa.raja@upi</div>
                                <Badge>Verified</Badge>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline">+ Add New UPI ID</Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="trade" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Trading Preferences</h2>
                        <p className="text-sm text-muted-foreground">
                          Configure how you trade and view market data.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Trading Mode</CardTitle>
                            <CardDescription>
                              Choose between paper trading and real trading.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Paper Trading Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                  Practice with virtual money, no real funds used.
                                </p>
                              </div>
                              <Switch 
                                checked={isPaperTrading} 
                                onCheckedChange={setIsPaperTrading} 
                              />
                            </div>
                            
                            {isPaperTrading && (
                              <div className="rounded-lg bg-secondary p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                  <span>Current Paper Balance:</span>
                                  <span className="font-bold">₹{paperBalance.toLocaleString('en-IN')}</span>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Input 
                                    type="number" 
                                    value={fundAmount} 
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    placeholder="Amount" 
                                  />
                                  <Button onClick={handleAddFunds}>Add Funds</Button>
                                </div>
                                
                                <Button 
                                  variant="destructive" 
                                  onClick={handleResetAccount}
                                >
                                  Reset Account
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Order Defaults</CardTitle>
                            <CardDescription>
                              Set default order settings for faster trading.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="default-order">Default Order Type</Label>
                              <Select 
                                value={defaultOrder} 
                                onValueChange={setDefaultOrder}
                              >
                                <SelectTrigger id="default-order">
                                  <SelectValue placeholder="Select default order type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="market">Market</SelectItem>
                                  <SelectItem value="limit">Limit</SelectItem>
                                  <SelectItem value="stop">Stop</SelectItem>
                                  <SelectItem value="stop-limit">Stop Limit</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="default-qty">Default Quantity</Label>
                              <Input 
                                id="default-qty" 
                                type="number" 
                                value={defaultQty} 
                                onChange={(e) => setDefaultQty(e.target.value)} 
                                min="1" 
                                step="1" 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Confirm Orders</Label>
                                <p className="text-sm text-muted-foreground">
                                  Show confirmation dialog before placing orders.
                                </p>
                              </div>
                              <Switch 
                                checked={confirmOrders} 
                                onCheckedChange={setConfirmOrders} 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Show Average Price</Label>
                                <p className="text-sm text-muted-foreground">
                                  Display average purchase price in portfolio.
                                </p>
                              </div>
                              <Switch 
                                checked={showAvgPrice} 
                                onCheckedChange={setShowAvgPrice} 
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={saveSettings}>Save Changes</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notification" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Notification Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage how and when you receive notifications.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Communication Channels</CardTitle>
                            <CardDescription>
                              Choose how you want to receive notifications.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive notifications via email.
                                </p>
                              </div>
                              <Switch 
                                checked={emailNotifications} 
                                onCheckedChange={setEmailNotifications} 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>SMS Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive notifications via SMS.
                                </p>
                              </div>
                              <Switch />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive notifications on your devices.
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Notification Types</CardTitle>
                            <CardDescription>
                              Choose what types of notifications you want to receive.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Price Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                  Alert when price reaches your targets.
                                </p>
                              </div>
                              <Switch 
                                checked={priceAlerts} 
                                onCheckedChange={setPriceAlerts} 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>News Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                  Alert for news related to your watchlist.
                                </p>
                              </div>
                              <Switch 
                                checked={newsAlerts} 
                                onCheckedChange={setNewsAlerts} 
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Trading Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                  Alert for order executions and cancellations.
                                </p>
                              </div>
                              <Switch 
                                checked={tradingAlerts} 
                                onCheckedChange={setTradingAlerts} 
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={saveSettings}>Save Changes</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="data" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Data Source Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Configure your market data sources and connection preferences.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Market Data</CardTitle>
                            <CardDescription>
                              Select your preferred market data provider.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <DataSourceSelector 
                              value={dataProvider} 
                              onChange={setDataProvider} 
                            />
                            
                            <div className="space-y-2">
                              <Label>Data Refresh Interval (seconds)</Label>
                              <div className="flex items-center space-x-2">
                                <Slider
                                  value={[refreshInterval]}
                                  min={1}
                                  max={60}
                                  step={1}
                                  onValueChange={(values) => setRefreshInterval(values[0])}
                                  className="flex-1"
                                />
                                <span className="w-12 text-center">{refreshInterval}s</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="connection-type">Connection Method</Label>
                              <Select 
                                value={connectionType} 
                                onValueChange={setConnectionType}
                              >
                                <SelectTrigger id="connection-type">
                                  <SelectValue placeholder="Select connection method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="websocket">WebSocket (Real-time)</SelectItem>
                                  <SelectItem value="rest">REST API (Polling)</SelectItem>
                                  <SelectItem value="combination">Combined (WebSocket + REST)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Use Dummy Data</Label>
                                <p className="text-sm text-muted-foreground">
                                  Use sample data instead of real market data.
                                </p>
                              </div>
                              <Switch 
                                checked={useDummyData} 
                                onCheckedChange={setUseDummyData} 
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={saveSettings}>Save Changes</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Appearance Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Customize the look and feel of the application.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Theme</CardTitle>
                            <CardDescription>
                              Choose your preferred color theme.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <Button 
                                variant="outline" 
                                className={`flex flex-col items-center justify-center h-24 ${theme === 'light' ? 'border-primary' : ''}`} 
                                onClick={() => setTheme('light')}
                              >
                                <Sun className="h-10 w-10 mb-2" />
                                <span>Light</span>
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                className={`flex flex-col items-center justify-center h-24 ${theme === 'dark' ? 'border-primary' : ''}`} 
                                onClick={() => setTheme('dark')}
                              >
                                <Moon className="h-10 w-10 mb-2" />
                                <span>Dark</span>
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                className={`flex flex-col items-center justify-center h-24 ${theme === 'system' ? 'border-primary' : ''}`} 
                                onClick={() => setTheme('system')}
                              >
                                <Monitor className="h-10 w-10 mb-2" />
                                <span>System</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Region & Language</CardTitle>
                            <CardDescription>
                              Set your regional and language preferences.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency Display</Label>
                              <Select defaultValue="INR">
                                <SelectTrigger id="currency">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                                  <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                                  <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                                  <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select defaultValue="en-IN">
                                <SelectTrigger id="language">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en-IN">English (India)</SelectItem>
                                  <SelectItem value="hi-IN">Hindi</SelectItem>
                                  <SelectItem value="ta-IN">Tamil</SelectItem>
                                  <SelectItem value="te-IN">Telugu</SelectItem>
                                  <SelectItem value="bn-IN">Bengali</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="api" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">API Access</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage API access for third-party applications and services.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>
                              Generate and manage API keys for external applications.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">Primary API Key</div>
                                <Badge variant="secondary">Active</Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  value="••••••••••••••••••••••••••••••" 
                                  readOnly 
                                  className="font-mono text-sm"
                                />
                                <Button size="sm" variant="outline">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Created on: Aug 15, 2023 • Last used: 2 days ago
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button>Generate New API Key</Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Connected Applications</CardTitle>
                            <CardDescription>
                              Manage third-party applications with access to your account.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center py-6">
                              <p className="text-muted-foreground">No applications connected yet.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-6 p-6">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Advanced Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Configure advanced application settings and options.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Performance</CardTitle>
                            <CardDescription>
                              Configure application performance settings.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Enable Data Caching</Label>
                                <p className="text-sm text-muted-foreground">
                                  Cache market data to improve performance.
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>High Performance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                  Use more resources for better performance.
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="text-destructive">
                            <CardTitle className="flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2" />
                              Danger Zone
                            </CardTitle>
                            <CardDescription>
                              Irreversible actions that you should be careful with.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h3 className="font-medium">Clear All Data</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                This will clear all local data including saved watchlists and settings.
                              </p>
                              <Button variant="outline" size="sm">
                                <Activity className="h-4 w-4 mr-2" />
                                Clear Cached Data
                              </Button>
                            </div>
                            
                            <div>
                              <h3 className="font-medium">Delete Account</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Permanently delete your account and all associated data.
                              </p>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: string }) => {
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-full";
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-primary text-foreground"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]}`}>
      {children}
    </span>
  );
};

export default Settings;
