
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useData } from '@/context/DataContext';

// Define the types for our context
export type Trade = {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: number;
  value: number;
  orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  limitPrice?: number;
  stopPrice?: number;
  date?: number; // For compatibility with existing code
  name?: string; // For displaying asset name
  total?: number; // For compatibility with existing code
};

export type Position = {
  symbol: string;
  quantity: number;
  avgPrice: number;
  type: 'STOCK' | 'CRYPTO';
};

export type PaperTradingContextType = {
  isPaperTrading: boolean;
  setIsPaperTrading: (value: boolean) => void;
  paperBalance: number;
  setPaperBalance: (balance: number) => void;
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  pendingOrders: Trade[];
  cancelOrder: (orderId: string) => void;
  executeOrder: (orderId: string, currentPrice: number) => void;
  positions: Record<string, Position>;
  portfolioValue: number;
  resetPaperTrading: () => void;
  
  // Additional functions needed for compatibility with existing code
  resetAccount: () => void;
  addFunds: (amount: number) => void;
  tradingHistory: Trade[];
  executeTrade: (tradeDetails: Omit<Trade, 'id' | 'timestamp' | 'status' | 'value'>) => void;
};

// Create context with default values
const PaperTradingContext = createContext<PaperTradingContextType>({
  isPaperTrading: true,
  setIsPaperTrading: () => {},
  paperBalance: 1000000, // 10 Lakhs
  setPaperBalance: () => {},
  trades: [],
  addTrade: () => {},
  pendingOrders: [],
  cancelOrder: () => {},
  executeOrder: () => {},
  positions: {},
  portfolioValue: 0,
  resetPaperTrading: () => {},
  
  // Additional functions needed for compatibility with existing code
  resetAccount: () => {},
  addFunds: () => {},
  tradingHistory: [],
  executeTrade: () => {},
});

// Create provider component
export const PaperTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // States
  const [isPaperTrading, setIsPaperTrading] = useState<boolean>(true);
  const [paperBalance, setPaperBalance] = useState<number>(1000000); // 10 Lakhs
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const { stocksData, cryptoData } = useData();
  
  // Calculate portfolio value based on current prices
  const portfolioValue = React.useMemo(() => {
    return Object.values(positions).reduce((total, position) => {
      const assetData = position.type === 'STOCK'
        ? stocksData.find(s => s.symbol === position.symbol)
        : cryptoData.find(c => c.symbol === position.symbol);
        
      const currentPrice = assetData?.price || position.avgPrice;
      return total + (position.quantity * currentPrice);
    }, 0);
  }, [positions, stocksData, cryptoData]);
  
  // Get pending orders
  const pendingOrders = trades.filter(trade => trade.status === 'PENDING');
  
  // Trading history - for compatibility with existing code
  const tradingHistory = trades.map(trade => ({
    ...trade,
    date: trade.date || trade.timestamp,
    name: trade.name || (
      stocksData.find(s => s.symbol === trade.symbol)?.name ||
      cryptoData.find(c => c.symbol === trade.symbol)?.name ||
      trade.symbol
    ),
    total: trade.total || trade.value
  }));
  
  // Add a new trade
  const addTrade = (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    const newTrade: Trade = {
      ...trade,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };
    
    // If it's a market order, execute it immediately
    if (trade.orderType === 'MARKET') {
      // Update positions
      const symbolKey = trade.symbol;
      
      if (trade.type === 'BUY') {
        // Deduct from balance
        setPaperBalance(prevBalance => prevBalance - trade.value);
        
        // Update positions
        setPositions(prevPositions => {
          const existingPosition = prevPositions[symbolKey];
          
          if (existingPosition) {
            // Update existing position
            const newQuantity = existingPosition.quantity + trade.quantity;
            const newAvgPrice = ((existingPosition.quantity * existingPosition.avgPrice) + trade.value) / newQuantity;
            
            return {
              ...prevPositions,
              [symbolKey]: {
                ...existingPosition,
                quantity: newQuantity,
                avgPrice: newAvgPrice,
              }
            };
          } else {
            // Create new position
            return {
              ...prevPositions,
              [symbolKey]: {
                symbol: trade.symbol,
                quantity: trade.quantity,
                avgPrice: trade.price,
                type: symbolKey.length <= 5 ? 'STOCK' : 'CRYPTO',
              }
            };
          }
        });
      } else if (trade.type === 'SELL') {
        // Update positions first
        setPositions(prevPositions => {
          const existingPosition = prevPositions[symbolKey];
          
          if (existingPosition && existingPosition.quantity >= trade.quantity) {
            const newQuantity = existingPosition.quantity - trade.quantity;
            
            // If selling all, remove the position
            if (newQuantity <= 0) {
              const { [symbolKey]: _, ...rest } = prevPositions;
              return rest;
            }
            
            // Otherwise update the position quantity
            return {
              ...prevPositions,
              [symbolKey]: {
                ...existingPosition,
                quantity: newQuantity,
              }
            };
          }
          
          return prevPositions;
        });
        
        // Add to balance
        setPaperBalance(prevBalance => prevBalance + trade.value);
      }
      
      // Add the completed trade to history
      setTrades(prevTrades => [
        ...prevTrades, 
        { ...newTrade, status: 'COMPLETED' }
      ]);
    } else {
      // For limit, stop, or stop-limit orders, add to pending orders
      setTrades(prevTrades => [
        ...prevTrades, 
        { ...newTrade, status: 'PENDING' }
      ]);
    }
  };
  
  // Execute trade function (simplified wrapper for addTrade) - for compatibility with existing code
  const executeTrade = (tradeDetails: Omit<Trade, 'id' | 'timestamp' | 'status' | 'value'>) => {
    const { symbol, type, quantity, price, orderType, limitPrice, stopPrice } = tradeDetails;
    const value = quantity * price;
    
    addTrade({
      symbol,
      type,
      quantity,
      price,
      value,
      orderType,
      limitPrice,
      stopPrice,
      status: 'PENDING'
    });
  };
  
  // Cancel a pending order
  const cancelOrder = (orderId: string) => {
    setTrades(prevTrades => 
      prevTrades.map(trade => 
        trade.id === orderId 
          ? { ...trade, status: 'CANCELLED' }
          : trade
      )
    );
  };
  
  // Execute a pending order based on current price
  const executeOrder = (orderId: string, currentPrice: number) => {
    // Find the order
    const order = trades.find(trade => trade.id === orderId);
    
    if (!order || order.status !== 'PENDING') return;
    
    // Execute the trade at the current price
    const executedTrade: Trade = {
      ...order,
      price: currentPrice,
      value: order.quantity * currentPrice,
      status: 'COMPLETED'
    };
    
    // Update the trades list
    setTrades(prevTrades => 
      prevTrades.map(trade => 
        trade.id === orderId ? executedTrade : trade
      )
    );
    
    // Update positions and balance
    const symbolKey = order.symbol;
    
    if (order.type === 'BUY') {
      // Deduct from balance
      setPaperBalance(prevBalance => prevBalance - executedTrade.value);
      
      // Update positions
      setPositions(prevPositions => {
        const existingPosition = prevPositions[symbolKey];
        
        if (existingPosition) {
          // Update existing position
          const newQuantity = existingPosition.quantity + order.quantity;
          const newAvgPrice = ((existingPosition.quantity * existingPosition.avgPrice) + executedTrade.value) / newQuantity;
          
          return {
            ...prevPositions,
            [symbolKey]: {
              ...existingPosition,
              quantity: newQuantity,
              avgPrice: newAvgPrice,
            }
          };
        } else {
          // Create new position
          return {
            ...prevPositions,
            [symbolKey]: {
              symbol: order.symbol,
              quantity: order.quantity,
              avgPrice: currentPrice,
              type: symbolKey.length <= 5 ? 'STOCK' : 'CRYPTO',
            }
          };
        }
      });
    } else if (order.type === 'SELL') {
      // Update positions first
      setPositions(prevPositions => {
        const existingPosition = prevPositions[symbolKey];
        
        if (existingPosition && existingPosition.quantity >= order.quantity) {
          const newQuantity = existingPosition.quantity - order.quantity;
          
          // If selling all, remove the position
          if (newQuantity <= 0) {
            const { [symbolKey]: _, ...rest } = prevPositions;
            return rest;
          }
          
          // Otherwise update the position quantity
          return {
            ...prevPositions,
            [symbolKey]: {
              ...existingPosition,
              quantity: newQuantity,
            }
          };
        }
        
        return prevPositions;
      });
      
      // Add to balance
      setPaperBalance(prevBalance => prevBalance + executedTrade.value);
    }
  };
  
  // Reset paper trading function
  const resetPaperTrading = () => {
    setPaperBalance(1000000); // Reset to 10 Lakhs
    setTrades([]); // Clear all trades
    setPositions({}); // Clear all positions
  };
  
  // Alias for resetPaperTrading (for compatibility)
  const resetAccount = () => resetPaperTrading();
  
  // Add funds function (for compatibility)
  const addFunds = (amount: number) => {
    setPaperBalance(prevBalance => prevBalance + amount);
  };
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedIsPaperTrading = localStorage.getItem('isPaperTrading');
    const savedPaperBalance = localStorage.getItem('paperBalance');
    const savedTrades = localStorage.getItem('paperTrades');
    const savedPositions = localStorage.getItem('paperPositions');
    
    if (savedIsPaperTrading) {
      setIsPaperTrading(JSON.parse(savedIsPaperTrading));
    }
    
    if (savedPaperBalance) {
      setPaperBalance(JSON.parse(savedPaperBalance));
    }
    
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
    
    if (savedPositions) {
      setPositions(JSON.parse(savedPositions));
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isPaperTrading', JSON.stringify(isPaperTrading));
    localStorage.setItem('paperBalance', JSON.stringify(paperBalance));
    localStorage.setItem('paperTrades', JSON.stringify(trades));
    localStorage.setItem('paperPositions', JSON.stringify(positions));
  }, [isPaperTrading, paperBalance, trades, positions]);
  
  return (
    <PaperTradingContext.Provider 
      value={{ 
        isPaperTrading, 
        setIsPaperTrading, 
        paperBalance, 
        setPaperBalance,
        trades,
        addTrade,
        pendingOrders,
        cancelOrder,
        executeOrder,
        positions,
        portfolioValue,
        resetPaperTrading,
        resetAccount,
        addFunds,
        tradingHistory,
        executeTrade
      }}
    >
      {children}
    </PaperTradingContext.Provider>
  );
};

// Custom hook to use the paper trading context
export const usePaperTrading = () => {
  const context = useContext(PaperTradingContext);
  
  if (context === undefined) {
    throw new Error('usePaperTrading must be used within a PaperTradingProvider');
  }
  
  return context;
};
