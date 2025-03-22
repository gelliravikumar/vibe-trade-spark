
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TradingTerminal } from '@/components/trade/TradingTerminal';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { PageLoader } from '@/components/common/Loader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, History, Info, Book, ChevronRight, ArrowRight } from 'lucide-react';

const Trade = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { isLoading, refreshData, stocksData, cryptoData } = useData();
  const navigate = useNavigate();
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [defaultSymbol] = useState('RELIANCE'); // Default symbol if none provided
  
  useEffect(() => {
    // If no symbol is provided, redirect to default symbol
    if (!symbol) {
      navigate(`/trade/${defaultSymbol}`);
      return;
    }
    
    // Mock recent trades data
    setRecentTrades([
      { id: 1, symbol: 'RELIANCE', type: 'BUY', price: 2563.45, quantity: 10, time: '09:45 AM' },
      { id: 2, symbol: 'INFY', type: 'SELL', price: 1874.20, quantity: 5, time: 'Yesterday' },
      { id: 3, symbol: 'BTC', type: 'BUY', price: 4853123.50, quantity: 0.05, time: '2 days ago' }
    ]);
    
    // Load stored settings from localStorage
    const loadStoredSettings = () => {
      try {
        const apiProvider = localStorage.getItem('tradingApp_apiProvider');
        const connectionMethod = localStorage.getItem('tradingApp_connectionMethod');
        const useDummyData = localStorage.getItem('tradingApp_useDummyData');
        const theme = localStorage.getItem('tradingApp_theme');
        
        // Check if we have valid settings
        if (apiProvider && connectionMethod && useDummyData !== null) {
          console.log('Loaded settings from localStorage');
        } else {
          console.log('No stored settings found, using defaults');
        }

        // Apply theme if saved
        if (theme) {
          document.documentElement.setAttribute('data-theme', theme);
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    };
    
    loadStoredSettings();
    
    // Add script for TradingView widget if not already loaded
    if (!document.getElementById('tradingview-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Refresh data when the trade page loads
    refreshData().catch(error => {
      toast.error("Failed to load market data. Please try again.");
      console.error("Error loading market data:", error);
    });
  }, [refreshData, symbol, navigate, defaultSymbol]);
  
  // Find trending assets (for recommendations)
  const trendingAssets = [...stocksData, ...cryptoData]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 3);
  
  // Find current asset details with fallback for initial load
  const currentAsset = symbol 
    ? [...stocksData, ...cryptoData].find(asset => asset.symbol === symbol) 
    : null;
  
  // Fallback values for when asset isn't found yet
  const fallbackAsset = {
    symbol: symbol || defaultSymbol,
    name: "Loading...",
    price: 0,
    changePercent: 0,
    previousPrice: 0,
    volume: 0,
    type: 'STOCK' as 'STOCK' | 'CRYPTO',
  };
  
  // Use currentAsset if available, otherwise use fallback
  const displayAsset = currentAsset || fallbackAsset;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <PageLoader />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-16 w-full">
        <div className="container-fluid px-4 mx-auto max-w-[1920px]">
          {/* Page header with asset info */}
          <div className="glass-panel rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">{displayAsset.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold">{displayAsset.name}</h1>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">{displayAsset.symbol}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{displayAsset.type}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl md:text-2xl font-bold">
                  ₹{displayAsset.price ? displayAsset.price.toLocaleString() : '0.00'}
                </div>
                <div className={`flex items-center justify-end ${displayAsset.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {displayAsset.changePercent >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {displayAsset.changePercent >= 0 ? '+' : ''}
                    {displayAsset.changePercent?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
              <Card className="p-3 bg-muted/30">
                <div className="text-sm text-muted-foreground">Previous Close</div>
                <div className="font-medium">
                  ₹{(displayAsset.previousPrice || 0).toLocaleString()}
                </div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="text-sm text-muted-foreground">Day Range</div>
                <div className="font-medium">
                  ₹{((displayAsset.price || 0) * 0.98).toFixed(2)} - ₹{((displayAsset.price || 0) * 1.02).toFixed(2)}
                </div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="text-sm text-muted-foreground">52 Week Range</div>
                <div className="font-medium">
                  ₹{((displayAsset.price || 0) * 0.8).toFixed(2)} - ₹{((displayAsset.price || 0) * 1.2).toFixed(2)}
                </div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="font-medium">
                  {(displayAsset.volume || Math.random() * 1000000).toFixed(0).toLocaleString()}
                </div>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <TradingTerminal symbol={symbol || defaultSymbol} />
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {/* Recent Trades */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center">
                    <History className="h-4 w-4 mr-2 text-primary" />
                    Recent Trades
                  </h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                {recentTrades.length > 0 ? (
                  <div className="space-y-2">
                    {recentTrades.map(trade => (
                      <div key={trade.id} className="p-2 rounded-md hover:bg-muted/50">
                        <div className="flex justify-between">
                          <span className="font-medium">{trade.symbol}</span>
                          <span className={trade.type === 'BUY' ? 'text-success' : 'text-destructive'}>
                            {trade.type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>₹{trade.price.toLocaleString()} × {trade.quantity}</span>
                          <span>{trade.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No recent trades</p>
                )}
              </Card>
              
              {/* Market Insights */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Market Insights
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {displayAsset?.name || 'This asset'} has shown a {displayAsset?.changePercent >= 0 ? 'positive' : 'negative'} trend today with {Math.abs(displayAsset?.changePercent || 0).toFixed(2)}% movement.
                </p>
                
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                  <Book className="h-4 w-4 mr-2" />
                  View Analysis
                </Button>
              </Card>
              
              {/* Trending Assets */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                    Trending Assets
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {trendingAssets.map(asset => (
                    <Button 
                      key={asset.symbol}
                      variant="ghost" 
                      className="w-full justify-between p-2 h-auto"
                      onClick={() => navigate(`/trade/${asset.symbol}`)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-primary text-xs">{asset.symbol.charAt(0)}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-xs text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm ${asset.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </span>
                        <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
                      </div>
                    </Button>
                  ))}
                </div>
                
                <Button variant="link" size="sm" className="w-full mt-2" onClick={() => navigate('/markets')}>
                  View All Markets
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trade;
