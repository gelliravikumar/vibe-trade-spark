
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarketSummary } from '@/components/home/MarketSummary';
import { TrendingAssets } from '@/components/home/TrendingAssets';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DetailedChart from '@/components/charts/DetailedChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/context/DataContext';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { usePortfolio } from '@/hooks/use-portfolio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, BarChart3, ChevronRight, LineChart, PieChart, TrendingUp, Wallet, ArrowUpDown, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { stocksData, cryptoData } = useData();
  const { paperBalance, portfolioValue, isPaperTrading } = usePaperTrading();
  const { portfolio } = usePortfolio();
  const [chartAsset, setChartAsset] = useState('NIFTY');
  const [timeFrame, setTimeFrame] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  
  // Top gainers and losers in stocks
  const topGainersStocks = [...stocksData]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
    
  const topLosersStocks = [...stocksData]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
  
  // Top gainers and losers in crypto
  const topGainersCrypto = [...cryptoData]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);
    
  const topLosersCrypto = [...cryptoData]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);
  
  // Calculate portfolio stats
  const portfolioStats = {
    totalValue: portfolioValue + paperBalance,
    stocksValue: Object.values(portfolio)
      .filter(pos => pos.type === 'STOCK')
      .reduce((sum, pos) => {
        const stockData = stocksData.find(s => s.symbol === pos.symbol);
        return sum + (pos.quantity * (stockData?.price || pos.avgPrice));
      }, 0),
    cryptoValue: Object.values(portfolio)
      .filter(pos => pos.type === 'CRYPTO')
      .reduce((sum, pos) => {
        const cryptoData = cryptoData.find(c => c.symbol === pos.symbol);
        return sum + (pos.quantity * (cryptoData?.price || pos.avgPrice));
      }, 0),
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome to TradePaisa
            </h1>
            <p className="text-muted-foreground text-lg">
              The smart way to trade stocks and crypto in India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Market Chart</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tabs defaultValue={chartAsset} onValueChange={setChartAsset}>
                        <TabsList>
                          <TabsTrigger value="NIFTY">NIFTY</TabsTrigger>
                          <TabsTrigger value="SENSEX">SENSEX</TabsTrigger>
                          <TabsTrigger value="BTC">BTC</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      <Tabs defaultValue={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
                        <TabsList>
                          <TabsTrigger value="1D">1D</TabsTrigger>
                          <TabsTrigger value="1W">1W</TabsTrigger>
                          <TabsTrigger value="1M">1M</TabsTrigger>
                          <TabsTrigger value="3M">3M</TabsTrigger>
                          <TabsTrigger value="1Y">1Y</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <DetailedChart 
                    height={400} 
                    symbol={chartAsset} 
                    timeFrame={timeFrame} 
                    showControls={true} 
                    fullWidth={true}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-primary" />
                    Portfolio Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-muted-foreground text-sm">Total Value</div>
                        <div className="text-2xl font-bold">
                          ₹{portfolioStats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="text-muted-foreground text-sm">Stocks</div>
                          <div className="text-lg font-medium">
                            ₹{portfolioStats.stocksValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="text-muted-foreground text-sm">Crypto</div>
                          <div className="text-lg font-medium">
                            ₹{portfolioStats.cryptoValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {isPaperTrading && (
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-muted-foreground">Paper Cash</span>
                          <span>₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-muted-foreground">Assets</span>
                        <span>₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-muted-foreground">Trading Mode</span>
                        <Badge variant={isPaperTrading ? 'outline' : 'default'}>
                          {isPaperTrading ? 'Paper Trading' : 'Real Trading'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <Button 
                        variant="default" 
                        onClick={() => navigate('/trade/RELIANCE')}
                        className="w-full"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Trade Now
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/portfolio')}
                        className="w-full"
                      >
                        <PieChart className="mr-2 h-4 w-4" />
                        Portfolio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Market Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">NSE & BSE</span>
                        <span className="text-sm text-muted-foreground">Indian Markets</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                        Open
                      </Badge>
                    </div>
                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="text-muted-foreground">Trading Hours:</div>
                      <div>9:15 AM - 3:30 PM</div>
                      <div className="text-muted-foreground">Pre-market:</div>
                      <div>9:00 AM - 9:15 AM</div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">Crypto</span>
                        <span className="text-sm text-muted-foreground">Global Markets</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                        24/7
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Market Summary Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Market Summary</h2>
            <Button variant="outline" onClick={() => navigate('/markets')}>
              View All Markets
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <MarketSummary />
            </CardContent>
          </Card>
        </section>
        
        {/* Top Gainers & Losers Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Top Movers</h2>
            <Tabs defaultValue="stocks">
              <TabsList>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <TabsContent value="stocks" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 mr-2 text-success" />
                    Top Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainersStocks.map((stock) => (
                      <div 
                        key={stock.symbol}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => navigate(`/trade/${stock.symbol}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-medium">{stock.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-muted-foreground">{stock.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          <div className="text-success flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 mr-2 text-destructive" transform="rotate(180)" />
                    Top Losers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosersStocks.map((stock) => (
                      <div 
                        key={stock.symbol}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => navigate(`/trade/${stock.symbol}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-medium">{stock.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-muted-foreground">{stock.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          <div className="text-destructive flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 mr-2 text-success" />
                    Top Crypto Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainersCrypto.map((crypto) => (
                      <div 
                        key={crypto.symbol}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => navigate(`/trade/${crypto.symbol}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-medium">{crypto.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{crypto.symbol}</div>
                            <div className="text-sm text-muted-foreground">{crypto.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>₹{crypto.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          <div className="text-success flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {crypto.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 mr-2 text-destructive" transform="rotate(180)" />
                    Top Crypto Losers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosersCrypto.map((crypto) => (
                      <div 
                        key={crypto.symbol}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => navigate(`/trade/${crypto.symbol}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary font-medium">{crypto.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{crypto.symbol}</div>
                            <div className="text-sm text-muted-foreground">{crypto.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>₹{crypto.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          <div className="text-destructive flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                            {crypto.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </section>
        
        {/* Trending Assets Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Assets</h2>
            <Button variant="outline" onClick={() => navigate('/markets')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Explore Markets
            </Button>
          </div>
          
          <TrendingAssets />
        </section>
        
        {/* Call to Action */}
        <section className="mb-8">
          <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Start Trading Today</h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of traders using TradePaisa to invest in stocks and cryptocurrencies with zero commission fees.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => navigate('/paper-trading')}>
                    Try Paper Trading
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/learn')}>
                    Learn Trading Basics
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="max-w-xs">
                  <img 
                    src="/lovable-uploads/ee875c5a-4a74-4430-aad3-f52e67ef759a.png" 
                    alt="Trading App" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
