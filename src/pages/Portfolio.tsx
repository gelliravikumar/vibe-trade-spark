
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { Wallet, Clock, BarChart3, Filter } from 'lucide-react';
import { AssetList } from '@/components/markets/AssetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioProvider, usePortfolio } from '@/hooks/use-portfolio';
import { format } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MiniChart } from '@/components/charts/MiniChart';
import { useData } from '@/context/DataContext';

type AssetType = 'ALL' | 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER';

const PortfolioContent = () => {
  const { portfolio, tradeHistory } = usePortfolio();
  const { stocksData, cryptoData } = useData();
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');
  
  // Calculate current value of assets
  const getCurrentPrice = (symbol: string) => {
    const asset = [...stocksData, ...cryptoData].find(a => a.symbol === symbol);
    return asset?.price || 0;
  };
  
  // Calculate total portfolio value
  const getTotalPortfolioValue = () => {
    return Object.values(portfolio).reduce((total, position) => {
      const currentPrice = getCurrentPrice(position.symbol);
      return total + (position.quantity * currentPrice);
    }, 0);
  };
  
  // Calculate total invested amount
  const getTotalInvestedAmount = () => {
    return Object.values(portfolio).reduce((total, position) => {
      return total + position.totalInvestment;
    }, 0);
  };
  
  // Calculate total profit/loss
  const getTotalProfitLoss = () => {
    const totalValue = getTotalPortfolioValue();
    const totalInvested = getTotalInvestedAmount();
    return totalValue - totalInvested;
  };
  
  // Filter positions by asset type
  const getFilteredPositions = () => {
    if (assetTypeFilter === 'ALL') {
      return Object.values(portfolio);
    }
    return Object.values(portfolio).filter(position => position.type === assetTypeFilter);
  };
  
  // Get asset type color for badges
  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'STOCK':
        return 'bg-blue-500/10 text-blue-500';
      case 'CRYPTO':
        return 'bg-orange-500/10 text-orange-500';
      case 'BANK':
        return 'bg-purple-500/10 text-purple-500';
      case 'OTHER':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  return (
    <div className="space-y-8">
      <PortfolioSummary 
        portfolio={portfolio} 
        getCurrentPrice={getCurrentPrice}
        totalValue={getTotalPortfolioValue()}
        profitLoss={getTotalProfitLoss()}
      />
      
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Assets</h2>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-full bg-secondary">
                    <Filter className="w-4 h-4" />
                    {assetTypeFilter === 'ALL' ? 'All Assets' : assetTypeFilter.charAt(0) + assetTypeFilter.slice(1).toLowerCase()}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={assetTypeFilter} onValueChange={(value: string) => setAssetTypeFilter(value as AssetType)}>
                      <DropdownMenuRadioItem value="ALL">All Assets</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="STOCK">Stocks</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="CRYPTO">Crypto</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="BANK">Banking</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="OTHER">Others</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="relative overflow-x-auto rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-muted text-sm">
                    <tr>
                      <th className="px-4 py-3">Asset</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Avg. Price</th>
                      <th className="px-4 py-3">Current Price</th>
                      <th className="px-4 py-3 text-right">Chart</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {getFilteredPositions().map((position) => {
                      const currentPrice = getCurrentPrice(position.symbol);
                      const currentValue = position.quantity * currentPrice;
                      const profitLoss = currentValue - position.totalInvestment;
                      const profitLossPercent = (profitLoss / position.totalInvestment) * 100;
                      const isPositive = profitLoss >= 0;
                      
                      return (
                        <tr key={position.symbol} className="bg-card">
                          <td className="px-4 py-3 font-medium">{position.name}</td>
                          <td className="px-4 py-3">
                            <Badge className={getAssetTypeColor(position.type)} variant="outline">
                              {position.type === 'STOCK' ? 'Stock' : 
                               position.type === 'CRYPTO' ? 'Crypto' :
                               position.type === 'BANK' ? 'Bank' : 'Other'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{position.quantity}</td>
                          <td className="px-4 py-3">₹{position.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3">₹{currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 w-24">
                            <MiniChart
                              symbol={position.symbol}
                              type={position.type === 'CRYPTO' ? 'CRYPTO' : 'STOCK'}
                              height={30}
                              isPositive={isPositive}
                            />
                          </td>
                          <td className="px-4 py-3">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          <td className={`px-4 py-3 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                            {isPositive ? '+' : ''}₹{profitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{profitLossPercent.toFixed(2)}%)
                          </td>
                        </tr>
                      );
                    })}
                    
                    {getFilteredPositions().length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                          No assets found in this category.
                        </td>
                      </tr>
                    )}
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
                    {tradeHistory.slice(0, 10).map((trade) => (
                      <tr key={trade.id} className="bg-card">
                        <td className="px-4 py-3">{format(new Date(trade.date), 'yyyy-MM-dd')}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 text-xs ${
                            trade.type === 'BUY' 
                              ? 'bg-success/20 text-success' 
                              : 'bg-destructive/20 text-destructive'
                          } rounded-full`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{trade.name}</td>
                        <td className="px-4 py-3">{trade.quantity}</td>
                        <td className="px-4 py-3">₹{trade.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3">₹{trade.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    
                    {tradeHistory.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                          No trade history available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-0">
            <div className="glass-card rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h3 className="text-sm text-muted-foreground mb-1">Total Value</h3>
                  <p className="text-2xl font-semibold">₹{getTotalPortfolioValue().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h3 className="text-sm text-muted-foreground mb-1">Total Invested</h3>
                  <p className="text-2xl font-semibold">₹{getTotalInvestedAmount().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                
                <div className={`${getTotalProfitLoss() >= 0 ? 'bg-success/10' : 'bg-destructive/10'} rounded-lg p-4`}>
                  <h3 className="text-sm text-muted-foreground mb-1">Total Profit/Loss</h3>
                  <p className={`text-2xl font-semibold ${getTotalProfitLoss() >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {getTotalProfitLoss() >= 0 ? '+' : ''}₹{getTotalProfitLoss().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    {' '}
                    <span className="text-sm">
                      ({getTotalProfitLoss() >= 0 ? '+' : ''}
                      {((getTotalProfitLoss() / getTotalInvestedAmount()) * 100).toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Detailed portfolio analytics coming soon... Check back for advanced portfolio performance metrics.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
        <AssetList type="ALL" limit={3} />
      </div>
    </div>
  );
};

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
          
          <PortfolioProvider>
            <PortfolioContent />
          </PortfolioProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
