
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/common/Loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Wallet, RefreshCcw, DollarSign, LineChart, BadgePlus, CreditCard, Bitcoin } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { AssetTable } from '@/components/markets/AssetTable';
import { usePaperTrading } from '@/hooks/use-paper-trading';

const PaperTrading = () => {
  const { isLoading, stocksData, cryptoData } = useData();
  const { 
    paperBalance, 
    portfolioValue, 
    resetAccount, 
    addFunds, 
    tradingHistory 
  } = usePaperTrading();

  const [fundAmount, setFundAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'stocks' | 'crypto'>('all');

  // Calculate stock and crypto values separately
  const calculateAssetTypeValue = (type: 'STOCK' | 'CRYPTO') => {
    const assetData = type === 'STOCK' ? stocksData : cryptoData;
    const tradingHistoryForType = tradingHistory.filter(trade => 
      assetData.some(asset => asset.symbol === trade.symbol)
    );
    
    // Simple calculation based on trading history - in a real app, this would use portfolio positions
    let value = 0;
    const assetHoldings: Record<string, {quantity: number, value: number}> = {};
    
    // Calculate current holdings
    tradingHistoryForType.forEach(trade => {
      const asset = assetData.find(a => a.symbol === trade.symbol);
      if (!asset) return;
      
      if (!assetHoldings[trade.symbol]) {
        assetHoldings[trade.symbol] = { quantity: 0, value: 0 };
      }
      
      // Add or subtract based on trade type
      if (trade.type === 'BUY') {
        assetHoldings[trade.symbol].quantity += trade.quantity;
      } else {
        assetHoldings[trade.symbol].quantity -= trade.quantity;
      }
    });
    
    // Calculate current value
    Object.keys(assetHoldings).forEach(symbol => {
      const asset = assetData.find(a => a.symbol === symbol);
      if (asset && assetHoldings[symbol].quantity > 0) {
        assetHoldings[symbol].value = assetHoldings[symbol].quantity * asset.price;
        value += assetHoldings[symbol].value;
      }
    });
    
    return value;
  };
  
  const stocksValue = calculateAssetTypeValue('STOCK');
  const cryptoValue = calculateAssetTypeValue('CRYPTO');

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    addFunds(amount);
    setFundAmount('');
    toast.success(`₹${amount.toLocaleString('en-IN')} added to your paper trading account`);
  };
  
  const handleResetAccount = () => {
    if (window.confirm("Are you sure you want to reset your paper trading account? This will clear all your positions and reset your balance to ₹10,000.")) {
      resetAccount();
      toast.success("Paper trading account has been reset");
    }
  };
  
  // Filter trading history based on the active tab
  const filteredTradingHistory = tradingHistory.filter(trade => {
    if (activeTab === 'all') return true;
    
    const isStock = stocksData.some(asset => asset.symbol === trade.symbol);
    if (activeTab === 'stocks' && isStock) return true;
    if (activeTab === 'crypto' && !isStock) return true;
    
    return false;
  });
  
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
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-8/12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold">Paper Trading</h1>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleResetAccount}
              >
                <RefreshCcw className="h-4 w-4" /> Reset Account
              </Button>
            </div>
            
            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as 'all' | 'stocks' | 'crypto')}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Assets</TabsTrigger>
                <TabsTrigger value="stocks">Stocks Only</TabsTrigger>
                <TabsTrigger value="crypto">Crypto Only</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Available Cash</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <Wallet className="mr-2 h-5 w-5 text-primary" />
                        ₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <LineChart className="mr-2 h-5 w-5 text-primary" />
                        ₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-primary" />
                        ₹{(paperBalance + portfolioValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="stocks" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Stocks Cash</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-primary" />
                        ₹{(paperBalance * 0.7).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Allocated for stock trading</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Stocks Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <LineChart className="mr-2 h-5 w-5 text-primary" />
                        ₹{stocksValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Current market value</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Equity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-primary" />
                        ₹{((paperBalance * 0.7) + stocksValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Cash + Stock holdings</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="crypto" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Crypto Cash</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <Bitcoin className="mr-2 h-5 w-5 text-primary" />
                        ₹{(paperBalance * 0.3).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Allocated for crypto trading</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Crypto Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <LineChart className="mr-2 h-5 w-5 text-primary" />
                        ₹{cryptoValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Current market value</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Crypto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-primary" />
                        ₹{((paperBalance * 0.3) + cryptoValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Cash + Crypto holdings</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle>Add Funds</CardTitle>
                <CardDescription>Add virtual funds to your paper trading account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={handleAddFunds} className="flex items-center gap-2">
                    <BadgePlus className="h-4 w-4" /> Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trading History</CardTitle>
                <CardDescription>Recent paper trading transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTradingHistory.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No trading history yet. Start trading to see your transactions here.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTradingHistory.slice(0, 10).map((trade) => {
                        const tradeDate = new Date(trade.date);
                        const isStock = stocksData.some(asset => asset.symbol === trade.symbol);
                        
                        return (
                          <TableRow key={trade.id}>
                            <TableCell>
                              <div>{tradeDate.toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">
                                {tradeDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium flex items-center">
                                {isStock ? (
                                  <CreditCard className="h-3 w-3 mr-1 text-primary" />
                                ) : (
                                  <Bitcoin className="h-3 w-3 mr-1 text-primary" />
                                )}
                                {trade.symbol}
                              </div>
                              <div className="text-xs text-muted-foreground">{trade.name}</div>
                            </TableCell>
                            <TableCell className={trade.type === 'BUY' ? 'text-success' : 'text-destructive'}>
                              {trade.type}
                            </TableCell>
                            <TableCell>{trade.quantity}</TableCell>
                            <TableCell>₹{trade.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right">
                              ₹{trade.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
                
                {filteredTradingHistory.length > 10 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm">View More</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-4/12 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Trade these assets with paper money</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Tabs defaultValue="all">
                  <div className="px-4">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="stocks">Stocks</TabsTrigger>
                      <TabsTrigger value="crypto">Crypto</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="all">
                    <AssetTable type="ALL" showSearch={true} compact={true} />
                  </TabsContent>
                  
                  <TabsContent value="stocks">
                    <AssetTable type="STOCK" showSearch={true} compact={true} />
                  </TabsContent>
                  
                  <TabsContent value="crypto">
                    <AssetTable type="CRYPTO" showSearch={true} compact={true} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaperTrading;
