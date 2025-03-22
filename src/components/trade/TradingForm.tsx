
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink, 
  Info, 
  Tag, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  AlertTriangle, 
  Check,
  Wallet,
  BarChart2,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Timer
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TradingFormProps {
  asset: any;
}

type OrderType = 'buy' | 'sell';
type OrderMode = 'market' | 'limit' | 'stop' | 'stop-limit';
type OrderValidity = 'day' | 'gtc' | 'ioc' | 'fok';
type OrderStatus = 'pending' | 'executed' | 'cancelled' | 'expired';

interface PendingOrder {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  orderMode: OrderMode;
  quantity: number;
  price: number;
  stopPrice?: number;
  limitPrice?: number;
  validity: OrderValidity;
  status: OrderStatus;
  createdAt: Date;
  expiresAt?: Date;
}

export const TradingForm: React.FC<TradingFormProps> = ({ asset }) => {
  const { portfolio, addPosition, updatePosition, removePosition } = usePortfolio();
  const { 
    paperBalance, 
    executeTrade, 
    isPaperTrading, 
    setIsPaperTrading,
    tradingHistory
  } = usePaperTrading();
  
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [orderMode, setOrderMode] = useState<OrderMode>('market');
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderValidity, setOrderValidity] = useState<OrderValidity>('day');
  const [buyingMode, setBuyingMode] = useState<'quantity' | 'amount'>('quantity');
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'trade' | 'orders' | 'history'>('trade');
  
  // Get the current position for this asset from the portfolio
  const assetPortfolio = asset ? portfolio[asset.symbol] : null;
  
  // Filter trade history for this specific asset
  const assetTradeHistory = tradingHistory.filter(
    trade => trade.symbol === asset?.symbol
  ).slice(0, 10);
  
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
      setLimitPrice((asset.price * 0.97).toFixed(2));
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
    
    if (orderMode === 'stop-limit' && 
        (isNaN(parseFloat(limitPrice)) || parseFloat(limitPrice) <= 0)) {
      toast.error("Please enter a valid limit price");
      return;
    }
    
    // Calculate the order value
    const orderValue = numQuantity * assetPrice;
    
    // For market orders, execute immediately
    if (orderMode === 'market') {
      executeTradeNow(numQuantity, assetPrice, orderValue);
    } else {
      // For limit, stop, and stop-limit orders, add to pending orders
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const newOrder: PendingOrder = {
        id: Date.now().toString(),
        symbol: asset.symbol,
        name: asset.name,
        type: orderType === 'buy' ? 'BUY' : 'SELL',
        orderMode,
        quantity: numQuantity,
        price: assetPrice,
        status: 'pending',
        validity: orderValidity,
        createdAt: now,
        expiresAt: orderValidity === 'day' ? tomorrow : undefined
      };
      
      if (orderMode === 'stop' || orderMode === 'stop-limit') {
        newOrder.stopPrice = parseFloat(stopPrice);
      }
      
      if (orderMode === 'limit' || orderMode === 'stop-limit') {
        newOrder.limitPrice = parseFloat(limitPrice);
      }
      
      // Add to pending orders
      setPendingOrders([newOrder, ...pendingOrders]);
      
      // Show toast notification
      toast.success(
        `Order placed: ${orderType === 'buy' ? 'Buy' : 'Sell'} ${quantity} ${asset.symbol} at ${orderMode} price`,
        {
          description: `${orderMode.toUpperCase()} order created and pending execution.`,
        }
      );
      
      // If in paper trading mode, reserve the funds/assets
      if (isPaperTrading && orderType === 'buy') {
        // Reserve funds
        // In a real app, you would track reserved funds separately
      }
    }
    
    // Reset form after order
    setQuantity('1');
  };
  
  const executeTradeNow = (numQuantity: number, assetPrice: number, orderValue: number) => {
    if (!asset) return;
    
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
        const orderAction = orderType === 'buy' ? 'bought' : 'sold';
        toast.success(
          `Paper Trading: Successfully ${orderAction} ${numQuantity} ${asset.symbol} for ₹${orderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
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
          `Successfully bought ${numQuantity} ${asset.symbol} for ₹${orderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
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
          `Successfully sold ${numQuantity} ${asset.symbol} for ₹${orderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
          {
            description: `Order Type: ${orderMode.toUpperCase()}`,
          }
        );
      }
    }
  };
  
  const cancelOrder = (orderId: string) => {
    setPendingOrders(pendingOrders.map(order => 
      order.id === orderId
        ? { ...order, status: 'cancelled' }
        : order
    ));
    
    toast.info("Order canceled successfully");
  };
  
  // For simulation purposes - would be replaced with real-time price monitoring
  const simulateOrderExecution = (symbol: string) => {
    if (!asset) return;
    
    // Find executable orders
    const executableOrders = pendingOrders.filter(order => 
      order.symbol === symbol && 
      order.status === 'pending' && 
      ((order.type === 'BUY' && asset.price <= order.price) || 
       (order.type === 'SELL' && asset.price >= order.price))
    );
    
    if (executableOrders.length > 0) {
      executableOrders.forEach(order => {
        // Execute the order
        executeTradeNow(order.quantity, order.price, order.quantity * order.price);
        
        // Update the order status
        setPendingOrders(pendingOrders.map(o => 
          o.id === order.id
            ? { ...o, status: 'executed' }
            : o
        ));
      });
    }
  };
  
  // For demo/UI purposes only
  useEffect(() => {
    const interval = setInterval(() => {
      if (asset && pendingOrders.filter(o => o.status === 'pending').length > 0) {
        simulateOrderExecution(asset.symbol);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [asset, pendingOrders]);
  
  const getMaxQuantity = () => {
    if (!asset) return '0';
    
    if (orderType === 'buy') {
      const maxBuyAmount = isPaperTrading ? paperBalance : 1000000; // Default to large amount for real trading
      const maxQty = maxBuyAmount / asset.price;
      return maxQty.toFixed(asset.type === 'CRYPTO' ? 6 : 0);
    } else {
      // For sell, max is what user owns
      return assetPortfolio ? assetPortfolio.quantity.toString() : '0';
    }
  };
  
  const handleMaxQuantity = () => {
    setQuantity(getMaxQuantity());
  };
  
  return (
    <Card className="rounded-lg border shadow-sm">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            {asset?.symbol} Trading
          </CardTitle>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center mr-2">
                    <ShieldCheck className="h-5 w-5 mr-1 text-primary" />
                    <span className="text-sm">{isPaperTrading ? 'Paper' : 'Real'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paper Trading Mode: {isPaperTrading ? 'On' : 'Off'}</p>
                  <p className="text-xs">Change in Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              id="paper-trading"
              checked={isPaperTrading}
              onCheckedChange={setIsPaperTrading}
            />
          </div>
        </div>
      </CardHeader>
      
      <div>
        <Tabs defaultValue="trade" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="w-full justify-start rounded-none border-b p-0">
            <TabsTrigger value="trade" className="rounded-none py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Trade
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-none py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Orders
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-none py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trade" className="p-6 pt-4">
            <div className="mb-6 flex justify-center space-x-4">
              <Button 
                variant={orderType === 'buy' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  "flex-1 h-12 font-semibold text-base",
                  orderType === 'buy' ? "bg-success hover:bg-success/90" : "text-success border-success"
                )}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </Button>
              <Button 
                variant={orderType === 'sell' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  "flex-1 h-12 font-semibold text-base",
                  orderType === 'sell' ? "bg-destructive hover:bg-destructive/90" : "text-destructive border-destructive"
                )}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">Order Type</Label>
                <Select value={orderMode} onValueChange={(value) => setOrderMode(value as OrderMode)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <div>
                          <div>Market</div>
                          <div className="text-xs text-muted-foreground">Execute immediately at current price</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="limit">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        <div>
                          <div>Limit</div>
                          <div className="text-xs text-muted-foreground">Execute at specified price or better</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="stop">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <div>
                          <div>Stop</div>
                          <div className="text-xs text-muted-foreground">Execute when price reaches stop value</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="stop-limit">
                      <div className="flex items-center">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <div>
                          <div>Stop-Limit</div>
                          <div className="text-xs text-muted-foreground">Combines stop and limit orders</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {orderMode !== 'market' && (
                <div className="space-y-4">
                  {(orderMode === 'limit' || orderMode === 'stop-limit') && (
                    <div>
                      <Label className="text-sm text-muted-foreground mb-1 block">
                        Limit Price
                      </Label>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">₹</span>
                        <Input
                          type="number"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                  
                  {(orderMode === 'stop' || orderMode === 'stop-limit') && (
                    <div>
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
                  
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">
                      Time in Force
                    </Label>
                    <Select value={orderValidity} onValueChange={(value) => setOrderValidity(value as OrderValidity)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Order validity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <div>
                              <div>Day</div>
                              <div className="text-xs text-muted-foreground">Valid until market close</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="gtc">
                          <div className="flex items-center">
                            <Timer className="h-4 w-4 mr-2" />
                            <div>
                              <div>Good Till Cancelled (GTC)</div>
                              <div className="text-xs text-muted-foreground">Valid until manually cancelled</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="ioc">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <div>
                              <div>Immediate or Cancel (IOC)</div>
                              <div className="text-xs text-muted-foreground">Execute immediately or cancel</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="fok">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <div>
                              <div>Fill or Kill (FOK)</div>
                              <div className="text-xs text-muted-foreground">Execute completely or cancel</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm text-muted-foreground">Quantity</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs text-primary"
                    onClick={handleMaxQuantity}
                  >
                    Max
                  </Button>
                </div>
                <Tabs value={buyingMode} onValueChange={(value) => setBuyingMode(value as 'quantity' | 'amount')}>
                  <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="quantity">Quantity</TabsTrigger>
                    <TabsTrigger value="amount">Amount (₹)</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quantity">
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        step={asset?.type === 'CRYPTO' ? "0.000001" : "1"}
                        min="0"
                        className="text-right"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amount">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">₹</span>
                      <Input
                        type="number"
                        value={orderTotal.toString()}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        step="0.01"
                        min="0"
                        className="text-right"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Market Price</span>
                  <span className="font-medium">₹{asset?.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Estimated {orderType === 'buy' ? 'Cost' : 'Credit'}</span>
                  <span className="font-medium">₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                
                {buyingMode === 'amount' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimated Quantity</span>
                    <span className="font-medium">{quantity} {asset?.symbol || ''}</span>
                  </div>
                )}
                
                {isPaperTrading && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Available Cash</span>
                    <span className="font-medium">₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                
                {assetPortfolio && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Current Holdings</span>
                    <span className="font-medium">{assetPortfolio.quantity} {asset?.symbol || ''}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className={`w-full py-6 text-base font-semibold ${
                  orderType === 'buy' 
                    ? 'bg-success hover:bg-success/90' 
                    : 'bg-destructive hover:bg-destructive/90'
                }`}
                onClick={handlePlaceOrder}
              >
                {orderMode === 'market' 
                  ? `${orderType === 'buy' ? 'Buy' : 'Sell'} Now` 
                  : `Place ${orderMode.charAt(0).toUpperCase() + orderMode.slice(1)} Order`}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="p-6 pt-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Active Orders</h3>
              {pendingOrders.filter(order => order.status === 'pending' && order.symbol === asset?.symbol).length > 0 ? (
                <div className="space-y-3">
                  {pendingOrders
                    .filter(order => order.status === 'pending' && order.symbol === asset?.symbol)
                    .map(order => (
                      <div key={order.id} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Badge variant={order.type === 'BUY' ? 'success' : 'destructive'} className="mr-2">
                              {order.type}
                            </Badge>
                            <span className="font-medium">{order.orderMode.toUpperCase()}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-muted-foreground"
                            onClick={() => cancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-1 text-sm">
                          <div className="text-muted-foreground">Quantity:</div>
                          <div className="text-right">{order.quantity} {order.symbol}</div>
                          
                          {(order.orderMode === 'limit' || order.orderMode === 'stop-limit') && (
                            <>
                              <div className="text-muted-foreground">Limit Price:</div>
                              <div className="text-right">₹{order.limitPrice?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                            </>
                          )}
                          
                          {(order.orderMode === 'stop' || order.orderMode === 'stop-limit') && (
                            <>
                              <div className="text-muted-foreground">Stop Price:</div>
                              <div className="text-right">₹{order.stopPrice?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                            </>
                          )}
                          
                          <div className="text-muted-foreground">Total Value:</div>
                          <div className="text-right">₹{(order.quantity * order.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          
                          <div className="text-muted-foreground">Created:</div>
                          <div className="text-right">{order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          
                          {order.validity === 'day' && order.expiresAt && (
                            <>
                              <div className="text-muted-foreground">Expires:</div>
                              <div className="text-right">{order.expiresAt.toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <p>No active orders for {asset?.symbol || 'this asset'}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Completed Orders</h3>
              {pendingOrders.filter(order => order.status !== 'pending' && order.symbol === asset?.symbol).length > 0 ? (
                <div className="space-y-3">
                  {pendingOrders
                    .filter(order => order.status !== 'pending' && order.symbol === asset?.symbol)
                    .map(order => (
                      <div key={order.id} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Badge variant={order.type === 'BUY' ? 'success' : 'destructive'} className="mr-2">
                              {order.type}
                            </Badge>
                            <span className="font-medium">{order.orderMode.toUpperCase()}</span>
                          </div>
                          <Badge variant={
                            order.status === 'executed' ? 'outline' : 
                            order.status === 'cancelled' ? 'secondary' : 'destructive'
                          }>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-1 text-sm">
                          <div className="text-muted-foreground">Quantity:</div>
                          <div className="text-right">{order.quantity} {order.symbol}</div>
                          
                          <div className="text-muted-foreground">Price:</div>
                          <div className="text-right">₹{order.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          
                          <div className="text-muted-foreground">Total Value:</div>
                          <div className="text-right">₹{(order.quantity * order.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          
                          <div className="text-muted-foreground">Date:</div>
                          <div className="text-right">{order.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <p>No completed orders for {asset?.symbol || 'this asset'}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-6 pt-4">
            <h3 className="font-medium mb-4">Trade History for {asset?.symbol || 'Asset'}</h3>
            
            {assetTradeHistory.length > 0 ? (
              <div className="space-y-3">
                {assetTradeHistory.map((trade) => {
                  const tradeDate = new Date(trade.date);
                  
                  return (
                    <div key={trade.id} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant={trade.type === 'BUY' ? 'success' : 'destructive'}>
                          {trade.type}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {tradeDate.toLocaleDateString()} {tradeDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-1 text-sm">
                        <div className="text-muted-foreground">Quantity:</div>
                        <div className="text-right">{trade.quantity} {trade.symbol}</div>
                        
                        <div className="text-muted-foreground">Price:</div>
                        <div className="text-right">₹{trade.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                        
                        <div className="text-muted-foreground">Total Value:</div>
                        <div className="text-right">₹{trade.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p>No trade history for {asset?.symbol || 'this asset'}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('trade')}
                >
                  Start Trading
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {assetPortfolio && activeTab === 'trade' && (
        <CardFooter className="p-6 border-t">
          <div className="w-full">
            <h3 className="font-medium mb-3">Your Position</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Holding:</div>
              <div className="text-right font-medium">{assetPortfolio.quantity} {asset?.symbol || ''}</div>
              
              <div className="text-muted-foreground">Avg. Cost:</div>
              <div className="text-right font-medium">₹{assetPortfolio.avgPrice.toFixed(2)}</div>
              
              <div className="text-muted-foreground">Market Value:</div>
              <div className="text-right font-medium">₹{(assetPortfolio.quantity * (asset?.price || 0)).toFixed(2)}</div>
              
              <div className="text-muted-foreground">P&L:</div>
              <div className={`text-right font-medium ${
                (assetPortfolio.quantity * (asset?.price || 0)) > assetPortfolio.totalInvestment 
                  ? 'text-success' 
                  : 'text-destructive'
              }`}>
                ₹{((assetPortfolio.quantity * (asset?.price || 0)) - assetPortfolio.totalInvestment).toFixed(2)} 
                ({(((assetPortfolio.quantity * (asset?.price || 0)) / assetPortfolio.totalInvestment - 1) * 100).toFixed(2)}%)
              </div>
            </div>
            
            {asset?.type === 'STOCK' && (
              <Button variant="outline" className="w-full mt-4 text-sm">
                Trade {asset.symbol} Options <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
