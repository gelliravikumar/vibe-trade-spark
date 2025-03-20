
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { Wallet, Clock, BarChart3 } from 'lucide-react';
import { AssetList } from '@/components/markets/AssetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
          
          <div className="space-y-8">
            <PortfolioSummary />
            
            <div>
              <Tabs defaultValue="holdings">
                <TabsList className="mb-6">
                  <TabsTrigger value="holdings" className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    Holdings
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Trade History
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    Performance
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="holdings" className="mt-0">
                  <div className="glass-card rounded-lg p-5">
                    <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
                    
                    <div className="relative overflow-x-auto rounded-lg">
                      <table className="w-full text-left">
                        <thead className="bg-muted text-sm">
                          <tr>
                            <th className="px-4 py-3">Asset</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Avg. Price</th>
                            <th className="px-4 py-3">Current Price</th>
                            <th className="px-4 py-3">Value</th>
                            <th className="px-4 py-3">Profit/Loss</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="bg-card">
                            <td className="px-4 py-3 font-medium">Reliance</td>
                            <td className="px-4 py-3">10</td>
                            <td className="px-4 py-3">₹2,850.00</td>
                            <td className="px-4 py-3">₹2,896.45</td>
                            <td className="px-4 py-3">₹28,964.50</td>
                            <td className="px-4 py-3 text-success">+₹464.50 (1.63%)</td>
                          </tr>
                          <tr className="bg-card">
                            <td className="px-4 py-3 font-medium">TCS</td>
                            <td className="px-4 py-3">5</td>
                            <td className="px-4 py-3">₹3,600.00</td>
                            <td className="px-4 py-3">₹3,548.25</td>
                            <td className="px-4 py-3">₹17,741.25</td>
                            <td className="px-4 py-3 text-destructive">-₹258.75 (-1.44%)</td>
                          </tr>
                          <tr className="bg-card">
                            <td className="px-4 py-3 font-medium">Bitcoin</td>
                            <td className="px-4 py-3">0.5</td>
                            <td className="px-4 py-3">₹60,000.00</td>
                            <td className="px-4 py-3">₹61,240.85</td>
                            <td className="px-4 py-3">₹30,620.43</td>
                            <td className="px-4 py-3 text-success">+₹620.43 (2.07%)</td>
                          </tr>
                          <tr className="bg-card">
                            <td className="px-4 py-3 font-medium">Ethereum</td>
                            <td className="px-4 py-3">5</td>
                            <td className="px-4 py-3">₹3,500.00</td>
                            <td className="px-4 py-3">₹3,452.70</td>
                            <td className="px-4 py-3">₹17,263.50</td>
                            <td className="px-4 py-3 text-destructive">-₹236.50 (-1.35%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <div className="glass-card rounded-lg p-5">
                    <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
                    
                    <div className="relative overflow-x-auto rounded-lg">
                      <table className="w-full text-left">
                        <thead className="bg-muted text-sm">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Asset</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="bg-card">
                            <td className="px-4 py-3">2023-06-15</td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-1 text-xs bg-success/20 text-success rounded-full">Buy</span>
                            </td>
                            <td className="px-4 py-3 font-medium">Bitcoin</td>
                            <td className="px-4 py-3">0.25</td>
                            <td className="px-4 py-3">₹60,000.00</td>
                            <td className="px-4 py-3">₹15,000.00</td>
                          </tr>
                          <tr className="bg-card">
                            <td className="px-4 py-3">2023-06-12</td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-1 text-xs bg-destructive/20 text-destructive rounded-full">Sell</span>
                            </td>
                            <td className="px-4 py-3 font-medium">TCS</td>
                            <td className="px-4 py-3">2</td>
                            <td className="px-4 py-3">₹3,650.00</td>
                            <td className="px-4 py-3">₹7,300.00</td>
                          </tr>
                          <tr className="bg-card">
                            <td className="px-4 py-3">2023-06-10</td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-1 text-xs bg-success/20 text-success rounded-full">Buy</span>
                            </td>
                            <td className="px-4 py-3 font-medium">Reliance</td>
                            <td className="px-4 py-3">5</td>
                            <td className="px-4 py-3">₹2,850.00</td>
                            <td className="px-4 py-3">₹14,250.00</td>
                          </tr>
                          <tr className="bg-card">
                            <td className="px-4 py-3">2023-06-05</td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-1 text-xs bg-success/20 text-success rounded-full">Buy</span>
                            </td>
                            <td className="px-4 py-3 font-medium">Ethereum</td>
                            <td className="px-4 py-3">2</td>
                            <td className="px-4 py-3">₹3,500.00</td>
                            <td className="px-4 py-3">₹7,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-0">
                  <div className="glass-card rounded-lg p-5">
                    <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
                    
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Portfolio analysis tools coming soon...
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
              <AssetList type="ALL" limit={3} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
