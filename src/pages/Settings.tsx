
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Zap, Lock, Palette, MonitorSmartphone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('system');
  const [savedTheme, setSavedTheme] = useState<string>('system');
  const [accent, setAccent] = useState<string>('blue');
  
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
  };
  
  const saveThemeSettings = () => {
    setSavedTheme(selectedTheme);
    localStorage.setItem('tradingApp_theme', selectedTheme);
    localStorage.setItem('tradingApp_accent', accent);
    // Apply theme - in a real app we would use a theme context
    document.documentElement.setAttribute('data-theme', selectedTheme);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="data-sources">
            <div className="flex mb-6 overflow-x-auto pb-2">
              <TabsList>
                <TabsTrigger value="data-sources" className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Data Sources
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="data-sources" className="mt-0">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Market Data Configuration</h2>
                
                <div className="max-w-lg mx-auto">
                  <DataSourceSelector />
                  
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-medium">Supported API Providers</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-border">
                        <h4 className="font-medium">Indian Stock Market APIs</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>NSE India REST API - Stock quotes</li>
                          <li>BSE India REST API - OHLC data</li>
                          <li>Alpha Vantage API - Limited Free</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-border">
                        <h4 className="font-medium">Cryptocurrency Market APIs</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>Binance REST API & WebSocket API</li>
                          <li>CoinGecko REST API</li>
                          <li>Coinbase REST API & WebSocket API</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg mt-4">
                      <p className="text-sm text-muted-foreground">
                        Note: For demonstration purposes, you can toggle between dummy data and simulated real-time data. 
                        In a production environment, you would need to provide API keys for these services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
                
                <div className="max-w-lg mx-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Theme</h3>
                      
                      <RadioGroup value={selectedTheme} onValueChange={handleThemeChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <RadioGroupItem value="light" id="light" className="peer sr-only" />
                          <Label
                            htmlFor="light"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <MonitorSmartphone className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Light</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                          <Label
                            htmlFor="dark"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 text-white p-4 hover:bg-slate-800 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <MonitorSmartphone className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Dark</span>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem value="system" id="system" className="peer sr-only" />
                          <Label
                            htmlFor="system"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-slate-900 p-4 hover:bg-gray-100 hover:border-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <MonitorSmartphone className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">System</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Color Accents</h3>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {['blue', 'purple', 'green', 'orange', 'pink'].map((color) => (
                          <button 
                            key={color}
                            onClick={() => setAccent(color)}
                            className={`w-10 h-10 rounded-full ${getColorClass(color)} ${accent === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Chart Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="default-chart-type">Default to TradingView charts</Label>
                          <Switch id="default-chart-type" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-indicators">Show technical indicators by default</Label>
                          <Switch id="show-indicators" defaultChecked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="persistent-drawings">Remember chart drawings</Label>
                          <Switch id="persistent-drawings" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary" onClick={saveThemeSettings}>
                        Save Appearance Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-0">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                
                <div className="max-w-lg mx-auto">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <button className="text-sm text-primary">
                      Change Profile Picture
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue="Demo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue="User"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        defaultValue="demo@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        defaultValue="+91 98765 43210"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="max-w-lg mx-auto">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Price Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when assets hit your target price
                        </p>
                      </div>
                      <Switch id="price-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Market News</h3>
                        <p className="text-sm text-muted-foreground">
                          Daily digest of market news and updates
                        </p>
                      </div>
                      <Switch id="market-news" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Trade Confirmations</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for completed trades
                        </p>
                      </div>
                      <Switch id="trade-confirmations" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Communications</h3>
                        <p className="text-sm text-muted-foreground">
                          Promotions, features, and updates
                        </p>
                      </div>
                      <Switch id="marketing" defaultChecked={false} />
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                
                <div className="max-w-lg mx-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        
                        <div>
                          <button className="btn-primary">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="btn-secondary">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium mb-4">API Keys</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Manage API keys for external services
                          </p>
                        </div>
                        <button className="btn-secondary">
                          Manage Keys
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper function to get color class for accent buttons
function getColorClass(color: string): string {
  switch (color) {
    case 'blue': return 'bg-blue-500';
    case 'purple': return 'bg-purple-500';
    case 'green': return 'bg-green-500';
    case 'orange': return 'bg-orange-500';
    case 'pink': return 'bg-pink-500';
    default: return 'bg-blue-500';
  }
}

export default Settings;
