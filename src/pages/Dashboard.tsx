
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/common/Loader';
import { MarketSummary } from '@/components/home/MarketSummary';
import { TrendingAssets } from '@/components/home/TrendingAssets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { Button } from '@/components/ui/button';
import { MiniChart } from '@/components/charts/MiniChart';
import { DetailedChart } from '@/components/charts/DetailedChart';
import { ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoading, stocksData, cryptoData } = useData();
  const [assetType, setAssetType] = useState<'stocks' | 'crypto'>('stocks');
  
  // Filter top gainers and losers
  const getTopStocks = (type: 'gainers' | 'losers', limit: number = 5) => {
    const data = assetType === 'stocks' ? stocksData : cryptoData;
    const sorted = [...data].sort((a, b) => 
      type === 'gainers' 
        ? b.changePercent - a.changePercent 
        : a.changePercent - b.changePercent
    );
    return sorted.slice(0, limit);
  };
  
  const topGainers = getTopStocks('gainers');
  const topLosers = getTopStocks('losers');
  
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
      
      <main className="flex-grow pt-6 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Main Chart Section */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle>Market Overview</CardTitle>
                    <Tabs defaultValue="stocks" onValueChange={(value) => setAssetType(value as 'stocks' | 'crypto')}>
                      <TabsList>
                        <TabsTrigger value="stocks">Stocks</TabsTrigger>
                        <TabsTrigger value="crypto">Crypto</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-0">
                  <DetailedChart 
                    height={350} 
                    symbol={assetType === 'stocks' ? 'NIFTY' : 'BTC'} 
                    timeFrame="1M" 
                    showControls={true}
                  />
                </CardContent>
              </Card>
              
              {/* Market Movers Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Gainers */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-success" />
                        Top Gainers
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/markets')}
                      >
                        View All
                      </Button>
                    </div>
                    <CardDescription>
                      {assetType === 'stocks' ? 'Best performing stocks today' : 'Best performing crypto today'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topGainers.map((asset) => (
                        <div 
                          key={asset.symbol} 
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => navigate(`/trade/${asset.symbol}`)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="text-primary font-medium">{asset.symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{asset.symbol}</div>
                              <div className="text-sm text-muted-foreground">{asset.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div>₹{asset.price.toLocaleString()}</div>
                            <div className="text-success flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              +{asset.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Top Losers */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingDown className="h-5 w-5 mr-2 text-destructive" />
                        Top Losers
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/markets')}
                      >
                        View All
                      </Button>
                    </div>
                    <CardDescription>
                      {assetType === 'stocks' ? 'Worst performing stocks today' : 'Worst performing crypto today'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topLosers.map((asset) => (
                        <div 
                          key={asset.symbol} 
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => navigate(`/trade/${asset.symbol}`)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="text-primary font-medium">{asset.symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{asset.symbol}</div>
                              <div className="text-sm text-muted-foreground">{asset.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div>₹{asset.price.toLocaleString()}</div>
                            <div className="text-destructive flex items-center justify-end">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {asset.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Portfolio Summary */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Portfolio Summary</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/portfolio')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PortfolioSummary compact={true} />
                  
                  <div className="mt-4 space-y-2">
                    <Button 
                      onClick={() => navigate('/paper-trading')} 
                      className="w-full flex items-center justify-center text-sm"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Paper Trading
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/portfolio')} 
                      className="w-full flex items-center justify-center text-sm"
                    >
                      Manage Portfolio
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Market Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketSummary compact={true} />
                </CardContent>
              </Card>
              
              {/* Trending Assets */}
              <Card>
                <CardHeader>
                  <CardTitle>Trending Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendingAssets compact={true} limit={3} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
