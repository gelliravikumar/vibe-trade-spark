
import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePortfolio } from '@/hooks/use-portfolio';

interface TradingFormProps {
  asset: any;
}

type OrderType = 'buy' | 'sell';
type OrderMode = 'market' | 'limit' | 'stop' | 'stop-limit';

export const TradingForm: React.FC<TradingFormProps> = ({ asset }) => {
  const { portfolio, addPosition, updatePosition, removePosition } = usePortfolio();
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [orderMode, setOrderMode] = useState<OrderMode>('market');
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  
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
    
    // Reset form after order
    setQuantity('1');
  };
  
  return (
    <div className="glass-card rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        Place Order
      </h2>
      
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            orderType === 'buy' 
              ? 'bg-success/10 text-success border border-success' 
              : 'bg-muted text-muted-foreground border border-transparent'
          }`}
          onClick={() => setOrderType('buy')}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            orderType === 'sell' 
              ? 'bg-destructive/10 text-destructive border border-destructive' 
              : 'bg-muted text-muted-foreground border border-transparent'
          }`}
          onClick={() => setOrderType('sell')}
        >
          Sell
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Order Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            className={`py-1 px-2 rounded-md text-xs font-medium ${
              orderMode === 'market' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setOrderMode('market')}
          >
            Market
          </button>
          <button
            className={`py-1 px-2 rounded-md text-xs font-medium ${
              orderMode === 'limit' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setOrderMode('limit')}
          >
            Limit
          </button>
          <button
            className={`py-1 px-2 rounded-md text-xs font-medium ${
              orderMode === 'stop' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setOrderMode('stop')}
          >
            Stop
          </button>
          <button
            className={`py-1 px-2 rounded-md text-xs font-medium ${
              orderMode === 'stop-limit' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setOrderMode('stop-limit')}
          >
            Stop Limit
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {orderMode !== 'market' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (₹)
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-lg bg-muted"
            />
          </div>
        )}
        
        {(orderMode === 'stop' || orderMode === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Stop Price (₹)
            </label>
            <input
              type="text"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              className="w-full p-2 border rounded-lg bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {orderType === 'buy' ? 
                'Order will execute when price rises to this value' : 
                'Order will execute when price falls to this value'}
            </p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded-lg bg-muted"
            min="0"
            step="0.01"
          />
        </div>
        
        {orderMode === 'market' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Market Price (₹)
            </label>
            <input
              type="text"
              value={asset?.price?.toFixed(2) || ''}
              className="w-full p-2 border rounded-lg bg-muted"
              readOnly
            />
          </div>
        )}
        
        {assetPortfolio && (
          <div className="p-3 rounded-lg bg-secondary/20 mt-4">
            <h3 className="font-medium mb-2">Your Position</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Holding:</div>
              <div className="text-right font-medium">{assetPortfolio.quantity} {asset.symbol}</div>
              <div>Avg. Cost:</div>
              <div className="text-right font-medium">₹{assetPortfolio.avgPrice.toFixed(2)}</div>
              <div>Investment:</div>
              <div className="text-right font-medium">₹{assetPortfolio.totalInvestment.toFixed(2)}</div>
              <div>Current Value:</div>
              <div className="text-right font-medium">₹{(assetPortfolio.quantity * asset.price).toFixed(2)}</div>
              <div>P&L:</div>
              <div className={`text-right font-medium ${(assetPortfolio.quantity * asset.price) > assetPortfolio.totalInvestment ? 'text-success' : 'text-destructive'}`}>
                ₹{((assetPortfolio.quantity * asset.price) - assetPortfolio.totalInvestment).toFixed(2)} 
                ({(((assetPortfolio.quantity * asset.price) / assetPortfolio.totalInvestment - 1) * 100).toFixed(2)}%)
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between py-2 mb-2">
          <span>Order Value:</span>
          <span className="font-semibold">₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
        </div>
        
        <button
          className={`w-full py-3 rounded-lg font-medium ${
            orderType === 'buy' ? 'bg-success text-white' : 'bg-destructive text-white'
          }`}
          onClick={handlePlaceOrder}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {asset?.symbol}
        </button>
        
        {(orderMode === 'limit' || orderMode === 'stop' || orderMode === 'stop-limit') && (
          <div className="flex items-center mt-2 p-2 rounded bg-warning/10 text-warning">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-xs">Advanced orders are simulated for demonstration. In a real app, these would be sent to an exchange.</span>
          </div>
        )}
      </div>
    </div>
  );
};
