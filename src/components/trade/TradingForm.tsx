
import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, ShieldCheck, ExternalLink, Info, Tag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { usePortfolio } from '@/hooks/use-portfolio';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TradingFormProps {
  asset: any;
}

type OrderType = 'buy' | 'sell';
type OrderMode = 'market' | 'limit' | 'stop' | 'stop-limit';

export const TradingForm: React.FC<TradingFormProps> = ({ asset }) => {
  const { portfolio, addPosition, updatePosition, removePosition } = usePortfolio();
  const { 
    paperBalance, 
    executeTrade, 
    isPaperTrading, 
    setIsPaperTrading 
  } = usePaperTrading();
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [orderMode, setOrderMode] = useState<OrderMode>('market');
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderValidity, setOrderValidity] = useState<string>('day');
  const [buyingMode, setBuyingMode] = useState<'quantity' | 'amount'>('quantity');
  
  const assetPortfolio = asset ? portfolio[asset.symbol] : null;
  
  useEffect(() => {
    if (asset) {
      const numQuantity = parseFloat(quantity) || 0;
      const assetPrice = orderMode === 'market' ? 
        asset.price : 
        parseFloat(price) || asset.price;
        
      setOrderTotal(numQuantity * assetPrice);
    }
  }, [quantity, price, asset, orderMode]);
  
  useEffect(() => {
    if (asset) {
      setPrice(asset.price.toString());
      setStopPrice((asset.price * 0.95).toFixed(2));
    }
  }, [asset]);
  
  const calculateQuantity = (amount: string) => {
    if (!asset) return '0';
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return '0';
    
    const assetPrice = orderMode === 'market' ? 
      asset.price : 
      parseFloat(price) || asset.price;
      
    return (numAmount / assetPrice).toFixed(asset.type === 'CRYPTO' ? 6 : 2);
  };
  
  const handleAmountChange = (amount: string) => {
    setQuantity(calculateQuantity(amount));
  };
  
  const handlePlaceOrder = () => {
    if (!asset) return;
    
    const orderAction = orderType === 'buy' ? 'bought' : 'sold';
    const numQuantity = parseFloat(quantity);
    const assetPrice = orderMode === 'market' ? 
      asset.price : 
      parseFloat(price) || asset.price;
    
    if (isNaN(numQuantity) || numQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    if (orderMode !== 'market' && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if ((orderMode === 'stop' || orderMode === 'stop-limit') && 
        (isNaN(parseFloat(stopPrice)) || parseFloat(stopPrice) <= 0)) {
      toast.error("Please enter a valid stop price");
      return;
    }
    
    // Calculate the order value
    const orderValue = numQuantity * assetPrice;
    
    if (isPaperTrading) {
      // Execute paper trade
      const success = executeTrade(
        asset.symbol,
        orderType === 'buy' ? 'BUY' : 'SELL',
        numQuantity,
        assetPrice,
        asset.name,
        asset.type
      );
      
      if (success) {
        toast.success(
          `Paper Trading: Successfully ${orderAction} ${quantity} ${asset.symbol} for ₹${orderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
          {
            description: `Order Type: ${orderMode.toUpperCase()}, Paper Trading Mode`,
          }
        );
      }
    } else {
      // Real trading logic
      if (orderType === 'buy') {
        // Execute buy order
        addPosition(
          asset.symbol, 
          numQuantity, 
          assetPrice, 
          orderValue,
          asset.name,
          asset.type
        );
        
        toast.success(
          `Successfully ${orderAction} ${quantity} ${asset.symbol} for ₹${orderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
          {
            description: `Order Type: ${orderMode.toUpperCase()}`,
          }
        );
      } else {
        // Execute sell order
        if (!assetPortfolio || assetPortfolio.quantity < numQuantity) {
          toast.error("Cannot sell more than you own");
          return;
        }
        
        // Update the position
        if (assetPortfolio.quantity === numQuantity) {
          // Remove the position if selling all
          removePosition(asset.symbol);
        } else {
          // Update position if selling part
          const newQuantity = assetPortfolio.quantity - numQuantity;
          // Calculate remaining investment based on average cost method
          const newInvestment = assetPortfolio.totalInvestment * (newQuantity / assetPortfolio.quantity);
          
          updatePosition(
            asset.symbol,
            newQuantity,
            newInvestment / newQuantity,
            newInvestment
          );
        }
        
        toast.success(
          `Successfully ${orderAction} ${quantity} ${asset.symbol} for ₹${orderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
          {
            description: `Order Type: ${orderMode.toUpperCase()}`,
          }
        );
      }
    }
    
    // Reset form after order
    setQuantity('1');
  };
  
  // Robinhood-style trading form
  return (
    <div className="glass-card rounded-lg">
      <div className="bg-card rounded-t-lg p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center justify-between">
          <span>
            {orderType === 'buy' ? 'Buy' : 'Sell'} {asset?.symbol}
          </span>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paper Trading Mode: {isPaperTrading ? 'On' : 'Off'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              id="paper-trading"
              checked={isPaperTrading}
              onCheckedChange={setIsPaperTrading}
            />
          </div>
        </h2>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <Label className="text-sm text-muted-foreground mb-1 block">Order type</Label>
          <div className="flex gap-2">
            <Select defaultValue="market" value={orderMode} onValueChange={(value) => setOrderMode(value as OrderMode)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
                <SelectItem value="stop-limit">Stop Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {orderMode !== 'market' && (
            <div className="mt-4">
              <Label className="text-sm text-muted-foreground mb-1 block">
                {orderMode === 'limit' ? 'Limit Price' : 
                 orderMode === 'stop' ? 'Stop Price' : 
                 'Stop-Limit Price'}
              </Label>
              <div className="flex items-center">
                <span className="text-sm mr-2">₹</span>
                <Input
                  type="number"
                  value={orderMode === 'stop' ? stopPrice : price}
                  onChange={(e) => orderMode === 'stop' ? setStopPrice(e.target.value) : setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
              
              {orderMode === 'stop-limit' && (
                <div className="mt-2">
                  <Label className="text-sm text-muted-foreground mb-1 block">
                    Stop Price
                  </Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">₹</span>
                    <Input
                      type="number"
                      value={stopPrice}
                      onChange={(e) => setStopPrice(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <Label className="text-sm text-muted-foreground mb-1 block">Buy in</Label>
          <Tabs defaultValue="quantity" onValueChange={(value) => setBuyingMode(value as 'quantity' | 'amount')}>
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="quantity">Quantity</TabsTrigger>
              <TabsTrigger value="amount">Amount</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quantity">
              <div className="flex items-center mt-2">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  step={asset?.type === 'CRYPTO' ? "0.000001" : "1"}
                  min="0"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="amount">
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2">₹</span>
                <Input
                  type="number"
                  value={orderTotal.toString()}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-4 mb-6">
          <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-muted-foreground">Market Price</span>
            <span>₹{asset?.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-muted-foreground">Estimated {orderType === 'buy' ? 'Cost' : 'Credit'}</span>
            <span>₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          
          {buyingMode === 'amount' && (
            <div className="flex justify-between items-center py-2 text-sm">
              <span className="text-muted-foreground">Estimated Quantity</span>
              <span>{quantity} {asset?.symbol}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <Button 
            className={`w-full py-3 ${orderType === 'buy' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}`}
            onClick={handlePlaceOrder}
          >
            Review Order
          </Button>
          
          <div>
            <div className="flex justify-center gap-4 mb-2">
              <Button variant="outline" 
                className={`flex-1 ${orderType === 'buy' ? 'border-success text-success' : 'border-gray-400 text-muted-foreground'}`} 
                onClick={() => setOrderType('buy')}
              >
                Buy
              </Button>
              <Button variant="outline" 
                className={`flex-1 ${orderType === 'sell' ? 'border-destructive text-destructive' : 'border-gray-400 text-muted-foreground'}`} 
                onClick={() => setOrderType('sell')}
              >
                Sell
              </Button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground">
              {isPaperTrading ? 
                `Paper Trading Balance: ₹${paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : 
                'Trading with real money'}
            </p>
          </div>
        </div>
      </div>
      
      {assetPortfolio && (
        <div className="mt-4 p-4 border-t">
          <h3 className="font-medium mb-2">Your Position</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Holding:</div>
            <div className="text-right font-medium">{assetPortfolio.quantity} {asset.symbol}</div>
            <div>Avg. Cost:</div>
            <div className="text-right font-medium">₹{assetPortfolio.avgPrice.toFixed(2)}</div>
            <div>Market Value:</div>
            <div className="text-right font-medium">₹{(assetPortfolio.quantity * asset.price).toFixed(2)}</div>
            <div>P&L:</div>
            <div className={`text-right font-medium ${(assetPortfolio.quantity * asset.price) > assetPortfolio.totalInvestment ? 'text-success' : 'text-destructive'}`}>
              ₹{((assetPortfolio.quantity * asset.price) - assetPortfolio.totalInvestment).toFixed(2)} 
              ({(((assetPortfolio.quantity * asset.price) / assetPortfolio.totalInvestment - 1) * 100).toFixed(2)}%)
            </div>
          </div>
          
          {asset.type === 'STOCK' && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full text-sm">
                Trade {asset.symbol} Options <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 mt-4 border-t flex justify-between items-center">
        <Button variant="ghost" size="sm" className="text-xs">
          <Tag className="w-3.5 h-3.5 mr-1" />
          Add to Lists
        </Button>
        
        <Button variant="ghost" size="sm" className="text-xs">
          <Info className="w-3.5 h-3.5 mr-1" />
          Learn More
        </Button>
      </div>
    </div>
  );
};
