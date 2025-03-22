
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useData } from '@/context/DataContext';
import { usePortfolio } from '@/hooks/use-portfolio';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { TrendingUp, TrendingDown, ArrowRight, BarChart, PieChart, LineChart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MiniChart } from '@/components/charts/MiniChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const { stocksData, cryptoData, isLoading, error } = useData();
  const { portfolio } = usePortfolio();
  const { portfolioValue, paperBalance } = usePaperTrading();
  
  const [topGainersStocks, setTopGainersStocks] = useState<any[]>([]);
  const [topLosersStocks, setTopLosersStocks] = useState<any[]>([]);
  const [topGainersCrypto, setTopGainersCrypto] = useState<any[]>([]);
  const [topLosersCrypto, setTopLosersCrypto] = useState<any[]>([]);
  const [assetTypeFilter, setAssetTypeFilter] = useState<'all' | 'stocks' | 'crypto'>('all');
  
  // Calculate current portfolio value and get current prices
  const getCurrentPrice = (symbol: string) => {
    const asset = [...stocksData, ...cryptoData].find(item => item.symbol === symbol);
    return asset ? asset.price : 0;
  };
  
  // Filter portfolio based on asset type
  const filteredPortfolio = () => {
    if (assetTypeFilter === 'all') return portfolio;
    
    return Object.entries(portfolio).reduce((filtered, [symbol, position]) => {
      if ((assetTypeFilter === 'stocks' && position.type === 'STOCK') || 
          (assetTypeFilter === 'crypto' && position.type === 'CRYPTO')) {
        filtered[symbol] = position;
      }
      return filtered;
    }, {} as typeof portfolio);
  };
  
  // Create separate functions to calculate filtered portfolio values
  const calculateFilteredPortfolioValue = () => {
    const filtered = filteredPortfolio();
    return Object.values(filtered).reduce((total, position) => {
      const currentPrice = getCurrentPrice(position.symbol);
      return total + (position.quantity * currentPrice);
    }, 0);
  };
  
  useEffect(() => {
    if (stocksData.length && cryptoData.length) {
      // Sort stocks by percent change
      const sortedStocks = [...stocksData].sort((a, b) => b.changePercent - a.changePercent);
      setTopGainersStocks(sortedStocks.slice(0, 5));
      setTopLosersStocks([...sortedStocks].reverse().slice(0, 5));
      
      // Sort crypto by percent change
      const sortedCrypto = [...cryptoData].sort((a, b) => b.changePercent - a.changePercent);
      setTopGainersCrypto(sortedCrypto.slice(0, 5));
      setTopLosersCrypto([...sortedCrypto].reverse().slice(0, 5));
    }
  }, [stocksData, cryptoData]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your portfolio and market trends
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 space-x-2">
              <Select 
                value={assetTypeFilter}
                onValueChange={(value) => setAssetTypeFilter(value as 'all' | 'stocks' | 'crypto')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="stocks">Stocks Only</SelectItem>
                  <SelectItem value="crypto">Crypto Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{calculateFilteredPortfolioValue().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Including {assetTypeFilter === 'all' ? 'all assets' : assetTypeFilter === 'stocks' ? 'stocks only' : 'crypto only'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Available Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paper trading balance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  +₹{(calculateFilteredPortfolioValue() * 0.0121).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-success">
                  +1.21% today
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PortfolioSummary 
                isLoading={isLoading}
                portfolio={filteredPortfolio()}
                getCurrentPrice={getCurrentPrice}
                totalValue={calculateFilteredPortfolioValue()}
                profitLoss={calculateFilteredPortfolioValue() * 0.15} // Simulated profit/loss
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Asset Allocation</span>
                    <PieChart className="w-5 h-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>Breakdown of your portfolio by asset type</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(portfolio).length > 0 ? (
                    <div className="space-y-4">
                      {/* Calculate stock allocation */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>Stocks</span>
                        </div>
                        <span className="font-medium">
                          {(() => {
                            const stockValue = Object.values(portfolio)
                              .filter(p => p.type === 'STOCK')
                              .reduce((sum, p) => sum + (p.quantity * getCurrentPrice(p.symbol)), 0);
                            const totalValue = calculateFilteredPortfolioValue();
                            return totalValue > 0 ? `${((stockValue / totalValue) * 100).toFixed(1)}%` : '0%';
                          })()}
                        </span>
                      </div>
                      
                      {/* Calculate crypto allocation */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                          <span>Crypto</span>
                        </div>
                        <span className="font-medium">
                          {(() => {
                            const cryptoValue = Object.values(portfolio)
                              .filter(p => p.type === 'CRYPTO')
                              .reduce((sum, p) => sum + (p.quantity * getCurrentPrice(p.symbol)), 0);
                            const totalValue = calculateFilteredPortfolioValue();
                            return totalValue > 0 ? `${((cryptoValue / totalValue) * 100).toFixed(1)}%` : '0%';
                          })()}
                        </span>
                      </div>
                      
                      <div className="pt-4 pb-2">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full" 
                            style={{ 
                              width: (() => {
                                const stockValue = Object.values(portfolio)
                                  .filter(p => p.type === 'STOCK')
                                  .reduce((sum, p) => sum + (p.quantity * getCurrentPrice(p.symbol)), 0);
                                const totalValue = calculateFilteredPortfolioValue();
                                return totalValue > 0 ? `${(stockValue / totalValue) * 100}%` : '0%';
                              })()
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>No assets in your portfolio yet.</p>
                      <Button variant="link" asChild>
                        <Link to="/markets">Start Trading</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/portfolio">
                      View Full Portfolio <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Market Movers Tabs */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Market Movers</h2>
            
            <Tabs defaultValue="stocks" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stocks">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Gainers - Stocks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TrendingUp className="w-5 h-5 text-success mr-2" />
                        Top Gainers - Stocks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-1">
                        {topGainersStocks.map((stock) => (
                          <Link 
                            key={stock.symbol}
                            to={`/trade/${stock.symbol}`}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <span className="text-primary text-xs">{stock.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground">{stock.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div>₹{stock.price.toLocaleString()}</div>
                              <div className="text-success text-sm">+{stock.changePercent.toFixed(2)}%</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link to="/markets?filter=gainers&type=stock">
                          View All Gainers
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Top Losers - Stocks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TrendingDown className="w-5 h-5 text-destructive mr-2" />
                        Top Losers - Stocks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-1">
                        {topLosersStocks.map((stock) => (
                          <Link 
                            key={stock.symbol}
                            to={`/trade/${stock.symbol}`}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <span className="text-primary text-xs">{stock.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground">{stock.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div>₹{stock.price.toLocaleString()}</div>
                              <div className="text-destructive text-sm">{stock.changePercent.toFixed(2)}%</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link to="/markets?filter=losers&type=stock">
                          View All Losers
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="crypto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Gainers - Crypto */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TrendingUp className="w-5 h-5 text-success mr-2" />
                        Top Gainers - Crypto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-1">
                        {topGainersCrypto.map((crypto) => (
                          <Link 
                            key={crypto.symbol}
                            to={`/trade/${crypto.symbol}`}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <span className="text-primary text-xs">{crypto.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{crypto.symbol}</div>
                                <div className="text-xs text-muted-foreground">{crypto.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div>₹{crypto.price.toLocaleString()}</div>
                              <div className="text-success text-sm">+{crypto.changePercent.toFixed(2)}%</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link to="/markets?filter=gainers&type=crypto">
                          View All Gainers
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Top Losers - Crypto */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TrendingDown className="w-5 h-5 text-destructive mr-2" />
                        Top Losers - Crypto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="space-y-1">
                        {topLosersCrypto.map((crypto) => (
                          <Link 
                            key={crypto.symbol}
                            to={`/trade/${crypto.symbol}`}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <span className="text-primary text-xs">{crypto.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-medium">{crypto.symbol}</div>
                                <div className="text-xs text-muted-foreground">{crypto.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div>₹{crypto.price.toLocaleString()}</div>
                              <div className="text-destructive text-sm">{crypto.changePercent.toFixed(2)}%</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link to="/markets?filter=losers&type=crypto">
                          View All Losers
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Trading Activity
                </CardTitle>
                <CardDescription>Your recent trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(portfolio).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(portfolio).slice(0, 5).map(([symbol, position]) => (
                      <div key={symbol} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-primary">{symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{position.name}</div>
                            <div className="text-sm text-muted-foreground">{position.quantity} shares at avg. ₹{position.avgPrice.toFixed(2)}</div>
                          </div>
                        </div>
                        <Link to={`/trade/${symbol}`} className="text-primary hover:underline">
                          Trade
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No trading activity yet.</p>
                    <Button variant="link" asChild>
                      <Link to="/markets">Start Trading</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/portfolio">
                    View All Activity <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
