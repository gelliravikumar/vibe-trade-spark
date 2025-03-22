
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/common/Loader';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/context/DataContext';
import { usePortfolio } from '@/hooks/use-portfolio';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { BarChart, TrendingUp, TrendingDown, Clock, Wallet, ArrowRight, LineChart } from 'lucide-react';
import { AssetTable } from '@/components/markets/AssetTable';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { isLoading, stocksData, cryptoData } = useData();
  const { portfolio } = usePortfolio();
  const { paperBalance, portfolioValue } = usePaperTrading();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate total portfolio value including both real and paper trading
  const totalPortfolioValue = Object.values(portfolio).reduce((total, position) => {
    const asset = [...stocksData, ...cryptoData].find(a => a.symbol === position.symbol);
    if (asset) {
      return total + (position.quantity * asset.price);
    }
    return total + position.totalInvestment;
  }, 0);

  // Get top gaining and losing assets
  const topGainers = [...stocksData, ...cryptoData]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = [...stocksData, ...cryptoData]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  // Get recently traded assets
  const recentTrades = [
    { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', type: 'BUY', price: 2563.45, quantity: 10, time: '09:45 AM', changePercent: 1.25 },
    { id: 2, symbol: 'INFY', name: 'Infosys', type: 'SELL', price: 1874.20, quantity: 5, time: 'Yesterday', changePercent: -0.52 },
    { id: 3, symbol: 'BTC', name: 'Bitcoin', type: 'BUY', price: 4853123.50, quantity: 0.05, time: '2 days ago', changePercent: 2.34 }
  ];

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <LineChart className="h-8 w-8 mr-3 text-primary" />
                  Dashboard
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Welcome back, Paisa Raja! Here's an overview of your investments, market trends, and recent activities.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 
                  <span>Last Updated: Just Now</span>
                </Button>
                <Button>
                  Refresh
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      <div className="text-sm text-success flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" /> +8.35% overall
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Paper Trading Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Wallet className="h-4 w-4 mr-1" /> Available for paper trading
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Paper Trading Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      <div className="text-sm text-success flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" /> +3.21% overall
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Gainers</CardTitle>
                      <CardDescription>Best performing assets today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {topGainers.map(asset => (
                          <Link 
                            to={`/trade/${asset.symbol}`} 
                            key={asset.symbol}
                            className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors"
                          >
                            <div>
                              <div className="font-medium">{asset.symbol}</div>
                              <div className="text-sm text-muted-foreground">{asset.name}</div>
                            </div>
                            <div className="text-right">
                              <div>₹{asset.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                              <div className="text-success flex items-center justify-end">
                                <TrendingUp className="h-3 w-3 mr-1" /> 
                                +{asset.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Losers</CardTitle>
                      <CardDescription>Worst performing assets today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {topLosers.map(asset => (
                          <Link 
                            to={`/trade/${asset.symbol}`} 
                            key={asset.symbol}
                            className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors"
                          >
                            <div>
                              <div className="font-medium">{asset.symbol}</div>
                              <div className="text-sm text-muted-foreground">{asset.name}</div>
                            </div>
                            <div className="text-right">
                              <div>₹{asset.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                              <div className="text-destructive flex items-center justify-end">
                                <TrendingDown className="h-3 w-3 mr-1" /> 
                                {asset.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Trades</CardTitle>
                    <CardDescription>Your latest trading activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentTrades.map(trade => (
                        <div key={trade.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                          <div>
                            <div className="font-medium">{trade.symbol}</div>
                            <div className="text-sm text-muted-foreground">{trade.name}</div>
                          </div>
                          <div className="text-center">
                            <div className={trade.type === 'BUY' ? 'text-success' : 'text-destructive'}>
                              {trade.type}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {trade.quantity} × ₹{trade.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>₹{(trade.quantity * trade.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                            <div className="text-sm text-muted-foreground">{trade.time}</div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-center mt-4">
                        <Button variant="outline" size="sm">View All Trades</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Portfolio</CardTitle>
                    <CardDescription>Track all your investments in one place</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(portfolio).length > 0 ? (
                      <div className="relative overflow-x-auto">
                        <table className="w-full">
                          <thead className="text-sm text-muted-foreground">
                            <tr className="border-b">
                              <th className="pb-2 text-left">Asset</th>
                              <th className="pb-2 text-right">Quantity</th>
                              <th className="pb-2 text-right">Avg. Price</th>
                              <th className="pb-2 text-right">Current Value</th>
                              <th className="pb-2 text-right">P&L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(portfolio).map((position) => {
                              const asset = [...stocksData, ...cryptoData].find(a => a.symbol === position.symbol);
                              const currentPrice = asset ? asset.price : position.avgPrice;
                              const currentValue = position.quantity * currentPrice;
                              const profitLoss = currentValue - position.totalInvestment;
                              const profitLossPercent = (profitLoss / position.totalInvestment) * 100;
                              
                              return (
                                <tr key={position.symbol} className="border-b hover:bg-muted/50">
                                  <td className="py-3">
                                    <div className="font-medium">{position.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{position.name}</div>
                                  </td>
                                  <td className="py-3 text-right">{position.quantity}</td>
                                  <td className="py-3 text-right">₹{position.avgPrice.toFixed(2)}</td>
                                  <td className="py-3 text-right">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                  <td className={`py-3 text-right ${profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    ₹{profitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    <br />
                                    <span className="text-xs">
                                      ({profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%)
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Portfolio Assets</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't added any assets to your portfolio yet.
                        </p>
                        <Button asChild>
                          <Link to="/markets">Browse Markets</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="watchlist">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Watchlist</CardTitle>
                    <CardDescription>Keep track of assets you're interested in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AssetTable type="ALL" showSearch={true} compact={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your recent trades and account activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Activity items */}
                      <div className="border-l-2 border-primary pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5"></div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Bought RELIANCE</h4>
                            <p className="text-sm text-muted-foreground">10 shares at ₹2,563.45</p>
                          </div>
                          <div className="text-sm text-muted-foreground">Today, 09:45 AM</div>
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-destructive pl-4 relative">
                        <div className="absolute w-3 h-3 bg-destructive rounded-full -left-[6.5px] top-1.5"></div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Sold INFY</h4>
                            <p className="text-sm text-muted-foreground">5 shares at ₹1,874.20</p>
                          </div>
                          <div className="text-sm text-muted-foreground">Yesterday, 02:15 PM</div>
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-primary pl-4 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5"></div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Bought BTC</h4>
                            <p className="text-sm text-muted-foreground">0.05 BTC at ₹48,53,123.50</p>
                          </div>
                          <div className="text-sm text-muted-foreground">2 days ago, 10:30 AM</div>
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-muted-foreground pl-4 relative">
                        <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[6.5px] top-1.5"></div>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Account Funded</h4>
                            <p className="text-sm text-muted-foreground">Added ₹25,000 to your account</p>
                          </div>
                          <div className="text-sm text-muted-foreground">5 days ago, 11:20 AM</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <Button variant="outline" className="flex items-center gap-1">
                        View All Activities <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
