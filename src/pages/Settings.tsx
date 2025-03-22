import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, Bell, CreditCard, Shield, KeyRound, MonitorSmartphone, 
  PaintBucket, FileText, Database, Terminal 
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { ApiProvider, ConnectionMethod } from '@/data/api';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tradingApp_theme') || 'system';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('tradingApp_accentColor') || 'blue';
  });
  
  const { 
    apiProvider, 
    connectionMethod, 
    useDummyData, 
    connectionStatus,
    setApiProvider, 
    setConnectionMethod, 
    setUseDummyData, 
    refreshData 
  } = useData();

  const handleSaveSettings = () => {
    localStorage.setItem('tradingApp_theme', theme);
    localStorage.setItem('tradingApp_accentColor', accentColor);
    
    document.documentElement.setAttribute('data-theme', theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      theme
    );
    
    document.documentElement.className = document.documentElement.className
      .replace(/accent-(blue|purple|green|orange|pink)/g, '')
      .trim();
    document.documentElement.classList.add(`accent-${accentColor}`);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleApiProviderChange = (value: string) => {
    setApiProvider(value as ApiProvider);
    localStorage.setItem('tradingApp_apiProvider', value);
  };

  const handleConnectionMethodChange = (value: string) => {
    setConnectionMethod(value as ConnectionMethod);
    localStorage.setItem('tradingApp_connectionMethod', value);
  };

  const handleUseDummyDataChange = (checked: boolean) => {
    setUseDummyData(checked);
    localStorage.setItem('tradingApp_useDummyData', String(checked));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64">
            <Card>
              <CardContent className="p-4">
                <Tabs 
                  value={activeTab} 
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto items-stretch gap-1">
                    <TabsTrigger value="profile" className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="api" className="justify-start">
                      <KeyRound className="w-4 h-4 mr-2" />
                      API Keys
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start">
                      <PaintBucket className="w-4 h-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="devices" className="justify-start">
                      <MonitorSmartphone className="w-4 h-4 mr-2" />
                      Devices
                    </TabsTrigger>
                    <TabsTrigger value="data" className="justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Data Settings
                    </TabsTrigger>
                    <TabsTrigger value="dev" className="justify-start">
                      <Terminal className="w-4 h-4 mr-2" />
                      Developer
                    </TabsTrigger>
                  </TabsList>
                
                  <div className="flex-1 space-y-6 mt-8 hidden md:block">
                    <TabsContent value="profile">
                      <Card>
                        <CardHeader>
                          <CardTitle>Profile</CardTitle>
                          <CardDescription>
                            Manage your personal information and profile settings.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" defaultValue="Aarav Sharma" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" defaultValue="aarav.sharma@example.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dob">Date of Birth</Label>
                              <Input id="dob" type="date" defaultValue="1990-01-01" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" defaultValue="123 Main St, Mumbai, Maharashtra" />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button>Save Profile</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="notifications">
                      <Card>
                        <CardHeader>
                          <CardTitle>Notifications</CardTitle>
                          <CardDescription>
                            Manage how you receive notifications and alerts.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="price-alerts">Price Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive alerts when stocks hit your price targets
                                </p>
                              </div>
                              <Switch id="price-alerts" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="market-updates">Market Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                  Daily market opening and closing updates
                                </p>
                              </div>
                              <Switch id="market-updates" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="trade-notifications">Trade Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                  Get notified when your trades are executed
                                </p>
                              </div>
                              <Switch id="trade-notifications" defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="news-alerts">News Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                  Breaking news about companies in your portfolio
                                </p>
                              </div>
                              <Switch id="news-alerts" defaultChecked />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Notification Method</Label>
                            <RadioGroup defaultValue="all">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="all" />
                                <Label htmlFor="all">All methods (Email, SMS, Push)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="email" />
                                <Label htmlFor="email">Email only</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="push" id="push" />
                                <Label htmlFor="push">Push notifications only</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button>Save Preferences</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="data">
                      <Card>
                        <CardHeader>
                          <CardTitle>Data Settings</CardTitle>
                          <CardDescription>
                            Configure your data sources and connection preferences.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center p-4 rounded-md border">
                              <div>
                                <Label htmlFor="use-dummy-data" className="text-base font-medium">Use Demo Data</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Use demo data for testing and exploration purposes. 
                                  Turn this off to connect to real market data sources.
                                </p>
                              </div>
                              <Switch
                                id="use-dummy-data"
                                checked={useDummyData}
                                onCheckedChange={handleUseDummyDataChange}
                              />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="api-provider">Data Provider</Label>
                                <Select
                                  disabled={useDummyData}
                                  value={apiProvider}
                                  onValueChange={handleApiProviderChange}
                                >
                                  <SelectTrigger id="api-provider" className="w-full">
                                    <SelectValue placeholder="Select Data Provider" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="NSE">NSE India</SelectItem>
                                    <SelectItem value="BSE">BSE India</SelectItem>
                                    <SelectItem value="BINANCE">Binance (Crypto)</SelectItem>
                                    <SelectItem value="COINGECKO">CoinGecko (Crypto)</SelectItem>
                                    <SelectItem value="COINBASE">Coinbase (Crypto)</SelectItem>
                                    <SelectItem value="DUMMY">Demo Data</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Select your preferred market data provider
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="connection-method">Connection Method</Label>
                                <Select
                                  disabled={useDummyData}
                                  value={connectionMethod}
                                  onValueChange={handleConnectionMethodChange}
                                >
                                  <SelectTrigger id="connection-method" className="w-full">
                                    <SelectValue placeholder="Select Connection Method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="REST">REST API (Polling)</SelectItem>
                                    <SelectItem value="WEBSOCKET">WebSocket (Real-time)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  WebSockets provide real-time data but may require better network conditions
                                </p>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-md border">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-base font-medium">Connection Status</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Current status of your data connection
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`inline-block w-3 h-3 rounded-full ${
                                    connectionStatus.status === 'connected' ? 'bg-success' : 
                                    connectionStatus.status === 'connecting' ? 'bg-warning' : 'bg-destructive'
                                  }`}></span>
                                  <span className="text-sm capitalize">{connectionStatus.status}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button variant="outline" className="mr-2" onClick={() => refreshData()}>
                                Refresh Data
                              </Button>
                              <Button onClick={() => toast({ title: "Settings saved", description: "Data settings have been updated" })}>
                                Save Settings
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="appearance">
                      <Card>
                        <CardHeader>
                          <CardTitle>Appearance</CardTitle>
                          <CardDescription>
                            Customize the look and feel of your trading interface.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <Label>Theme</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div 
                                className={`cursor-pointer rounded-md border p-4 transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                                onClick={() => setTheme('light')}
                              >
                                <div className="w-full h-24 rounded bg-white border mb-2"></div>
                                <p className="text-center font-medium">Light</p>
                              </div>
                              <div 
                                className={`cursor-pointer rounded-md border p-4 transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                                onClick={() => setTheme('dark')}
                              >
                                <div className="w-full h-24 rounded bg-slate-900 border mb-2"></div>
                                <p className="text-center font-medium">Dark</p>
                              </div>
                              <div 
                                className={`cursor-pointer rounded-md border p-4 transition-all ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
                                onClick={() => setTheme('system')}
                              >
                                <div className="w-full h-24 rounded bg-gradient-to-r from-white to-slate-900 border mb-2"></div>
                                <p className="text-center font-medium">System Default</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <Label>Accent Color</Label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              {[
                                { id: 'blue', color: '#3b82f6', name: 'Blue' },
                                { id: 'purple', color: '#8b5cf6', name: 'Purple' },
                                { id: 'green', color: '#10b981', name: 'Green' },
                                { id: 'orange', color: '#f97316', name: 'Orange' },
                                { id: 'pink', color: '#ec4899', name: 'Pink' },
                              ].map((color) => (
                                <div 
                                  key={color.id}
                                  className={`cursor-pointer rounded-md border p-4 transition-all ${accentColor === color.id ? 'ring-2 ring-primary' : ''}`}
                                  onClick={() => setAccentColor(color.id)}
                                >
                                  <div 
                                    className="w-full h-12 rounded mb-2" 
                                    style={{ backgroundColor: color.color }}
                                  ></div>
                                  <p className="text-center font-medium">{color.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <Label>Layout Density</Label>
                            <RadioGroup defaultValue="comfortable">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="compact" id="compact" />
                                <Label htmlFor="compact">Compact</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="comfortable" id="comfortable" />
                                <Label htmlFor="comfortable">Comfortable</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="spacious" id="spacious" />
                                <Label htmlFor="spacious">Spacious</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-4">
                            <Label>Chart Default Style</Label>
                            <RadioGroup defaultValue="candles">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="candles" id="candles" />
                                <Label htmlFor="candles">Candlestick</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="line" id="line" />
                                <Label htmlFor="line">Line Chart</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="area" id="area" />
                                <Label htmlFor="area">Area Chart</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button onClick={handleSaveSettings}>Save Appearance</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Other tab contents can be added here */}
                    <TabsContent value="payment">
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Methods</CardTitle>
                          <CardDescription>Manage your payment methods and billing</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p>Payment content goes here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="security">
                      <Card>
                        <CardHeader>
                          <CardTitle>Security Settings</CardTitle>
                          <CardDescription>Manage your account security</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p>Security content goes here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="api">
                      <Card>
                        <CardHeader>
                          <CardTitle>API Keys</CardTitle>
                          <CardDescription>Manage your API access</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p>API keys content goes here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="devices">
                      <Card>
                        <CardHeader>
                          <CardTitle>Connected Devices</CardTitle>
                          <CardDescription>Manage your devices</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p>Devices content goes here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="dev">
                      <Card>
                        <CardHeader>
                          <CardTitle>Developer Settings</CardTitle>
                          <CardDescription>Advanced configuration options</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p>Developer settings content goes here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </aside>
          
          <div className="flex-1 space-y-6 md:hidden">
            <Tabs value={activeTab}>
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Manage your personal information and profile settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mobile profile content - same as desktop */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobile-name">Name</Label>
                        <Input id="mobile-name" defaultValue="Aarav Sharma" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile-email">Email</Label>
                        <Input id="mobile-email" type="email" defaultValue="aarav.sharma@example.com" />
                      </div>
                      {/* Other profile fields */}
                    </div>
                    <div className="flex justify-end">
                      <Button>Save Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Add mobile versions of other tab contents */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mobile notification content */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Settings</CardTitle>
                    <CardDescription>Configure data sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mobile data settings content */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your interface</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mobile appearance content */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Other mobile tab contents */}
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
