
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePortfolio, PortfolioPosition, TradeHistoryItem } from '@/hooks/use-portfolio';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

// Default paper trading initial balance
const DEFAULT_PAPER_BALANCE = 10000;

// Local storage keys
const PAPER_BALANCE_KEY = 'trading_app_paper_balance';
const PAPER_HISTORY_KEY = 'trading_app_paper_history';
const PAPER_ORDERS_KEY = 'trading_app_paper_orders';

export type OrderMode = 'market' | 'limit' | 'stop' | 'stop-limit';
export type OrderValidity = 'day' | 'gtc' | 'ioc' | 'fok';
export type OrderStatus = 'pending' | 'executed' | 'cancelled' | 'expired';

export interface PendingOrder {
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
  assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER';
  category?: string;
}

interface PaperTradingContextType {
  paperBalance: number;
  portfolioValue: number;
  isPaperTrading: boolean;
  setIsPaperTrading: (value: boolean) => void;
  addFunds: (amount: number) => void;
  resetAccount: () => void;
  executeTrade: (
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    name: string,
    assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    category?: string
  ) => boolean;
  placeLimitOrder: (
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    name: string,
    assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    orderMode: OrderMode,
    validity: OrderValidity,
    stopPrice?: number,
    limitPrice?: number,
    category?: string
  ) => boolean;
  cancelOrder: (orderId: string) => void;
  pendingOrders: PendingOrder[];
  tradingHistory: TradeHistoryItem[];
}

const PaperTradingContext = createContext<PaperTradingContextType | undefined>(undefined);

export const PaperTradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { portfolio, addPosition, updatePosition, removePosition, tradeHistory } = usePortfolio();
  const { stocksData, cryptoData } = useData();
  
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    try {
      const storedBalance = localStorage.getItem(PAPER_BALANCE_KEY);
      return storedBalance ? parseFloat(storedBalance) : DEFAULT_PAPER_BALANCE;
    } catch (error) {
      console.error('Failed to parse paper balance from localStorage:', error);
      return DEFAULT_PAPER_BALANCE;
    }
  });
  
  const [tradingHistory, setTradingHistory] = useState<TradeHistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(PAPER_HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Failed to parse paper trading history from localStorage:', error);
      return [];
    }
  });
  
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(() => {
    try {
      const storedOrders = localStorage.getItem(PAPER_ORDERS_KEY);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        // Ensure dates are properly parsed
        return parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          expiresAt: order.expiresAt ? new Date(order.expiresAt) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to parse paper orders from localStorage:', error);
      return [];
    }
  });
  
  const [isPaperTrading, setIsPaperTrading] = useState<boolean>(true);
  
  // Calculate portfolio value
  const calculatePortfolioValue = (): number => {
    let totalValue = 0;
    
    Object.values(portfolio).forEach((position) => {
      // Find current price for the asset
      const asset = 
        [...stocksData, ...cryptoData].find(a => a.symbol === position.symbol);
      
      if (asset) {
        totalValue += position.quantity * asset.price;
      } else {
        // If asset not found, use the last known average price
        totalValue += position.quantity * position.avgPrice;
      }
    });
    
    return totalValue;
  };
  
  const portfolioValue = calculatePortfolioValue();
  
  // Save paper balance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PAPER_BALANCE_KEY, paperBalance.toString());
    } catch (error) {
      console.error('Failed to save paper balance to localStorage:', error);
    }
  }, [paperBalance]);
  
  // Save trading history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PAPER_HISTORY_KEY, JSON.stringify(tradingHistory));
    } catch (error) {
      console.error('Failed to save paper trading history to localStorage:', error);
    }
  }, [tradingHistory]);
  
  // Save pending orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PAPER_ORDERS_KEY, JSON.stringify(pendingOrders));
    } catch (error) {
      console.error('Failed to save paper orders to localStorage:', error);
    }
  }, [pendingOrders]);
  
  // Process pending orders on interval
  useEffect(() => {
    const checkOrders = () => {
      const currentPrice = (symbol: string): number | null => {
        const asset = [...stocksData, ...cryptoData].find(a => a.symbol === symbol);
        return asset ? asset.price : null;
      };
      
      // Check for expired orders
      const now = new Date();
      let updatedOrders = [...pendingOrders];
      let ordersChanged = false;
      
      // Check each pending order
      updatedOrders = updatedOrders.map(order => {
        if (order.status !== 'pending') return order;
        
        // Check for expired orders
        if (order.validity === 'day' && order.expiresAt && now > order.expiresAt) {
          ordersChanged = true;
          return { ...order, status: 'expired' };
        }
        
        // Get current price for this asset
        const price = currentPrice(order.symbol);
        if (!price) return order;
        
        // Check if order conditions are met
        let shouldExecute = false;
        
        if (order.orderMode === 'limit') {
          // For limit buy, execute when price falls below limit
          // For limit sell, execute when price rises above limit
          shouldExecute = (order.type === 'BUY' && price <= order.price) || 
                          (order.type === 'SELL' && price >= order.price);
        } 
        else if (order.orderMode === 'stop') {
          // For stop buy, execute when price rises above stop
          // For stop sell, execute when price falls below stop
          shouldExecute = (order.type === 'BUY' && price >= (order.stopPrice || 0)) || 
                          (order.type === 'SELL' && price <= (order.stopPrice || 0));
        }
        else if (order.orderMode === 'stop-limit') {
          // Stop-limit is a two-stage order
          // First stop triggers, then limit applies
          const stopTriggered = (order.type === 'BUY' && price >= (order.stopPrice || 0)) || 
                               (order.type === 'SELL' && price <= (order.stopPrice || 0));
          
          if (stopTriggered) {
            shouldExecute = (order.type === 'BUY' && price <= (order.limitPrice || 0)) || 
                            (order.type === 'SELL' && price >= (order.limitPrice || 0));
          }
        }
        
        // Execute order if conditions are met
        if (shouldExecute) {
          ordersChanged = true;
          
          // Attempt to execute the trade
          const success = executeTrade(
            order.symbol,
            order.type,
            order.quantity,
            order.type === 'BUY' ? order.price : price, // For buy, use limit price; for sell, use current price
            order.name,
            order.assetType,
            order.category
          );
          
          if (success) {
            return { ...order, status: 'executed' };
          }
        }
        
        return order;
      });
      
      // Update orders if any changed
      if (ordersChanged) {
        setPendingOrders(updatedOrders);
      }
    };
    
    // Check orders every 5 seconds
    const interval = setInterval(checkOrders, 5000);
    
    return () => clearInterval(interval);
  }, [pendingOrders, stocksData, cryptoData]);
  
  // Add funds to paper trading account
  const addFunds = (amount: number) => {
    if (amount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }
    
    setPaperBalance(prev => prev + amount);
  };
  
  // Reset paper trading account
  const resetAccount = () => {
    setPaperBalance(DEFAULT_PAPER_BALANCE);
    setTradingHistory([]);
    setPendingOrders([]);
    
    // Clear all positions (ideally would be limited to paper trading positions)
    Object.keys(portfolio).forEach(symbol => {
      removePosition(symbol);
    });
    
    toast.success("Paper trading account reset to ₹10,000");
  };
  
  // Execute a trade (buy or sell)
  const executeTrade = (
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    name: string,
    assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    category?: string
  ): boolean => {
    const total = quantity * price;
    
    if (type === 'BUY') {
      // Check if sufficient balance
      if (total > paperBalance) {
        toast.error("Insufficient funds for this transaction");
        return false;
      }
      
      // Execute buy order
      addPosition(symbol, quantity, price, total, name, assetType, category);
      
      // Update paper balance
      setPaperBalance(prev => prev - total);
      
      // Add to trading history
      const tradeRecord: TradeHistoryItem = {
        id: Date.now().toString(),
        date: new Date(),
        symbol,
        name,
        type: 'BUY',
        quantity,
        price,
        total
      };
      
      setTradingHistory(prev => [tradeRecord, ...prev]);
      
      return true;
    } else if (type === 'SELL') {
      // Check if has the position
      const position = portfolio[symbol];
      if (!position || position.quantity < quantity) {
        toast.error("You don't have enough shares to sell");
        return false;
      }
      
      // Execute sell order
      if (position.quantity === quantity) {
        removePosition(symbol);
      } else {
        const newQuantity = position.quantity - quantity;
        const newTotalInvestment = position.totalInvestment * (newQuantity / position.quantity);
        
        updatePosition(
          symbol,
          newQuantity,
          newTotalInvestment / newQuantity,
          newTotalInvestment
        );
      }
      
      // Update paper balance
      setPaperBalance(prev => prev + total);
      
      // Add to trading history
      const tradeRecord: TradeHistoryItem = {
        id: Date.now().toString(),
        date: new Date(),
        symbol,
        name,
        type: 'SELL',
        quantity,
        price,
        total
      };
      
      setTradingHistory(prev => [tradeRecord, ...prev]);
      
      return true;
    }
    
    return false;
  };
  
  // Place a limit or stop order
  const placeLimitOrder = (
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    name: string,
    assetType: 'STOCK' | 'CRYPTO' | 'BANK' | 'OTHER',
    orderMode: OrderMode,
    validity: OrderValidity,
    stopPrice?: number,
    limitPrice?: number,
    category?: string
  ): boolean => {
    // Validation
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return false;
    }
    
    if (price <= 0) {
      toast.error("Price must be greater than zero");
      return false;
    }
    
    if ((orderMode === 'stop' || orderMode === 'stop-limit') && (!stopPrice || stopPrice <= 0)) {
      toast.error("Stop price must be greater than zero");
      return false;
    }
    
    if ((orderMode === 'limit' || orderMode === 'stop-limit') && (!limitPrice || limitPrice <= 0)) {
      toast.error("Limit price must be greater than zero");
      return false;
    }
    
    // For BUY orders, check if there's enough balance
    if (type === 'BUY') {
      const total = quantity * price;
      if (total > paperBalance) {
        toast.error("Insufficient funds for this transaction");
        return false;
      }
      
      // Reserve funds (ideally we'd track reserved funds separately)
      setPaperBalance(prev => prev - total);
    }
    else if (type === 'SELL') {
      // Check if has enough of the position to sell
      const position = portfolio[symbol];
      if (!position || position.quantity < quantity) {
        toast.error("You don't have enough shares to sell");
        return false;
      }
    }
    
    // Calculate expiration date for day orders
    const now = new Date();
    let expiresAt: Date | undefined = undefined;
    
    if (validity === 'day') {
      expiresAt = new Date(now);
      expiresAt.setHours(23, 59, 59, 999); // End of the current day
    }
    
    // Create order object
    const newOrder: PendingOrder = {
      id: Date.now().toString(),
      symbol,
      name,
      type,
      quantity,
      price,
      orderMode,
      validity,
      stopPrice,
      limitPrice,
      status: 'pending',
      createdAt: now,
      expiresAt,
      assetType,
      category
    };
    
    // Add to pending orders
    setPendingOrders(prev => [newOrder, ...prev]);
    
    toast.success(
      `${type} order placed for ${quantity} ${symbol} at ₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      {
        description: `${orderMode.toUpperCase()} order has been placed and is pending execution.`
      }
    );
    
    return true;
  };
  
  // Cancel an order
  const cancelOrder = (orderId: string) => {
    const order = pendingOrders.find(o => o.id === orderId && o.status === 'pending');
    
    if (!order) {
      toast.error("Order not found or already processed");
      return;
    }
    
    // Update order status
    setPendingOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    );
    
    // Refund reserved balance for buy orders
    if (order.type === 'BUY') {
      const refundAmount = order.quantity * order.price;
      setPaperBalance(prev => prev + refundAmount);
    }
    
    toast.success("Order cancelled successfully");
  };
  
  return (
    <PaperTradingContext.Provider
      value={{
        paperBalance,
        portfolioValue,
        isPaperTrading,
        setIsPaperTrading,
        addFunds,
        resetAccount,
        executeTrade,
        placeLimitOrder,
        cancelOrder,
        pendingOrders,
        tradingHistory
      }}
    >
      {children}
    </PaperTradingContext.Provider>
  );
};

export const usePaperTrading = () => {
  const context = useContext(PaperTradingContext);
  if (context === undefined) {
    throw new Error('usePaperTrading must be used within a PaperTradingProvider');
  }
  return context;
};
