
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
import { toast } from 'sonner';
import { Wallet, RefreshCcw, DollarSign, LineChart, BadgePlus } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { AssetTable } from '@/components/markets/AssetTable';
import { usePaperTrading } from '@/hooks/use-paper-trading';

const PaperTrading = () => {
  const { isLoading } = useData();
  const { 
    paperBalance, 
    portfolioValue, 
    resetAccount, 
    addFunds, 
    tradingHistory 
  } = usePaperTrading();
  const [fundAmount, setFundAmount] = useState('');

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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                {tradingHistory.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No trading history yet. Start trading to see your transactions here.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradingHistory.slice(0, 10).map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                          <TableCell>{trade.symbol}</TableCell>
                          <TableCell className={trade.type === 'BUY' ? 'text-success' : 'text-destructive'}>
                            {trade.type}
                          </TableCell>
                          <TableCell>{trade.quantity}</TableCell>
                          <TableCell>₹{trade.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">
                            ₹{trade.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                <AssetTable type="ALL" showSearch={true} compact={true} />
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
