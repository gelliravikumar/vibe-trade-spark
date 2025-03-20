
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ApiProvider, ConnectionMethod, DataType, fetchMarketData, createWebSocketConnection, closeWebSocketConnection, getConnectionStatus } from '../data/api';
import { stockData } from '../data/stocksData';
import { cryptoData } from '../data/cryptoData';
import { toast } from 'sonner';

interface DataContextType {
  isLoading: boolean;
  apiProvider: ApiProvider;
  connectionMethod: ConnectionMethod;
  useDummyData: boolean;
  stocksData: any[];
  cryptoData: any[];
  connectionStatus: { status: string; icon: string };
  setApiProvider: (provider: ApiProvider) => void;
  setConnectionMethod: (method: ConnectionMethod) => void;
  setUseDummyData: (use: boolean) => void;
  refreshData: () => Promise<void>;
}

const defaultContextValue: DataContextType = {
  isLoading: true,
  apiProvider: 'DUMMY',
  connectionMethod: 'WEBSOCKET',
  useDummyData: true,
  stocksData: [],
  cryptoData: [],
  connectionStatus: { status: 'disconnected', icon: '❌' },
  setApiProvider: () => {},
  setConnectionMethod: () => {},
  setUseDummyData: () => {},
  refreshData: async () => {},
};

// Local storage keys
const LS_KEY_PREFIX = 'tradingApp_';
const LS_KEYS = {
  apiProvider: `${LS_KEY_PREFIX}apiProvider`,
  connectionMethod: `${LS_KEY_PREFIX}connectionMethod`,
  useDummyData: `${LS_KEY_PREFIX}useDummyData`,
};

// Helper to get values from localStorage with fallbacks
const getFromLS = <T extends string | boolean>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    return (typeof defaultValue === 'boolean') 
      ? (storedValue === 'true') as T
      : storedValue as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Helper to set values in localStorage
const setToLS = (key: string, value: string | boolean): void => {
  try {
    localStorage.setItem(key, value.toString());
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const DataContext = createContext<DataContextType>(defaultContextValue);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with localStorage values if available
  const [isLoading, setIsLoading] = useState(true);
  const [apiProvider, setApiProviderState] = useState<ApiProvider>(
    getFromLS(LS_KEYS.apiProvider, 'DUMMY') as ApiProvider
  );
  const [connectionMethod, setConnectionMethodState] = useState<ConnectionMethod>(
    getFromLS(LS_KEYS.connectionMethod, 'WEBSOCKET') as ConnectionMethod
  );
  const [useDummyData, setUseDummyDataState] = useState<boolean>(
    getFromLS(LS_KEYS.useDummyData, true)
  );
  const [stocksData, setStocksData] = useState<any[]>(stockData);
  const [cryptos, setCryptoData] = useState<any[]>(cryptoData);
  const [connectionStatus, setConnectionStatus] = useState(getConnectionStatus());
  const [dataFetchPromise, setDataFetchPromise] = useState<Promise<void> | null>(null);

  // Wrapper functions to update localStorage when state changes
  const setApiProvider = useCallback((provider: ApiProvider) => {
    setApiProviderState(provider);
    setToLS(LS_KEYS.apiProvider, provider);
  }, []);

  const setConnectionMethod = useCallback((method: ConnectionMethod) => {
    setConnectionMethodState(method);
    setToLS(LS_KEYS.connectionMethod, method);
  }, []);

  const setUseDummyData = useCallback((use: boolean) => {
    setUseDummyDataState(use);
    setToLS(LS_KEYS.useDummyData, use);
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (!dataFetchPromise) {
      const promise = refreshData();
      setDataFetchPromise(promise);
      
      promise.finally(() => {
        setDataFetchPromise(null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiProvider, useDummyData]);

  // Handle connection method changes
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (connectionMethod === 'WEBSOCKET') {
      cleanup = initializeWebSocket();
    } else {
      // Close any existing websocket when switching to REST
      closeWebSocketConnection();
      setConnectionStatus({ status: 'using REST', icon: '🔄' });
      
      // Set up polling interval for REST
      const intervalId = setInterval(() => {
        if (!dataFetchPromise) {
          const promise = refreshData();
          setDataFetchPromise(promise);
          
          promise.finally(() => {
            setDataFetchPromise(null);
          });
        }
      }, 10000); // Poll every 10 seconds
      
      cleanup = () => clearInterval(intervalId);
    }
    
    return () => {
      if (cleanup) cleanup();
      closeWebSocketConnection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionMethod, apiProvider, useDummyData]);

  const updateConnectionStatus = useCallback(() => {
    setConnectionStatus(getConnectionStatus());
  }, []);

  const initializeWebSocket = useCallback(() => {
    // Get symbols from current data
    const stockSymbols = stocksData.map(stock => stock.symbol);
    const cryptoSymbols = cryptos.map(crypto => crypto.symbol);
    const allSymbols = [...stockSymbols, ...cryptoSymbols];
    
    // Create websocket connection
    const cleanup = createWebSocketConnection(
      useDummyData ? 'DUMMY' : apiProvider,
      allSymbols,
      handleWebSocketMessage,
      handleWebSocketError
    );
    
    // Update connection status periodically
    const statusInterval = setInterval(updateConnectionStatus, 2000);
    
    return () => {
      clearInterval(statusInterval);
      if (cleanup) cleanup();
    };
  }, [apiProvider, cryptos, stocksData, updateConnectionStatus, useDummyData]);

  const handleWebSocketMessage = useCallback((data: any) => {
    if (Array.isArray(data)) {
      // Handle dummy data format
      const stockUpdates = data.filter(item => item.type === 'STOCK');
      const cryptoUpdates = data.filter(item => item.type === 'CRYPTO');
      
      if (stockUpdates.length > 0) {
        setStocksData(stockUpdates);
      }
      
      if (cryptoUpdates.length > 0) {
        setCryptoData(cryptoUpdates);
      }
    } else {
      // Handle real websocket data formats based on provider
      try {
        if (apiProvider === 'BINANCE' && data.e === 'trade') {
          // Update specific crypto
          setCryptoData(prevData => 
            prevData.map(crypto => 
              crypto.symbol === data.s ? {
                ...crypto,
                previousPrice: crypto.price,
                price: parseFloat(data.p),
                change: parseFloat((parseFloat(data.p) - crypto.price).toFixed(2)),
                changePercent: parseFloat((((parseFloat(data.p) - crypto.price) / crypto.price) * 100).toFixed(2))
              } : crypto
            )
          );
        } else if (apiProvider === 'COINBASE' && data.type === 'ticker') {
          // Update specific crypto
          setCryptoData(prevData => 
            prevData.map(crypto => 
              crypto.symbol === data.product_id ? {
                ...crypto,
                previousPrice: crypto.price,
                price: parseFloat(data.price),
                change: parseFloat((parseFloat(data.price) - crypto.price).toFixed(2)),
                changePercent: parseFloat((((parseFloat(data.price) - crypto.price) / crypto.price) * 100).toFixed(2))
              } : crypto
            )
          );
        }
      } catch (error) {
        console.error('Error processing websocket message:', error);
      }
    }
  }, [apiProvider]);

  const handleWebSocketError = useCallback((error: any) => {
    console.error('WebSocket error:', error);
    toast.error('WebSocket connection error. Switching to dummy data.');
    setUseDummyData(true);
  }, [setUseDummyData]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch stocks data
      const stocks = await fetchMarketData(
        useDummyData ? 'DUMMY' : apiProvider,
        'STOCK'
      );
      setStocksData(stocks);
      
      // Fetch crypto data
      const cryptos = await fetchMarketData(
        useDummyData ? 'DUMMY' : apiProvider,
        'CRYPTO'
      );
      setCryptoData(cryptos);
      
      updateConnectionStatus();
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
    
    return Promise.resolve();
  }, [apiProvider, updateConnectionStatus, useDummyData]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        apiProvider,
        connectionMethod,
        useDummyData,
        stocksData,
        cryptoData: cryptos,
        connectionStatus,
        setApiProvider,
        setConnectionMethod,
        setUseDummyData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
