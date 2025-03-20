
import { stockData } from './stocksData';
import { cryptoData } from './cryptoData';
import { websocketData } from './websocketData';
import { getChartData, getSymbolChartData } from './chartData';

// API Endpoints
const API_ENDPOINTS = {
  NSE: {
    base: 'https://www.nseindia.com/api',
    quotes: '/quote-equity',
  },
  BSE: {
    base: 'https://api.bseindia.com/BseIndiaAPI/api',
    stockReachGraph: '/StockReachGraph/w',
  },
  BINANCE: {
    rest: 'https://api.binance.com/api/v3',
    ticker: '/ticker/price',
    ws: 'wss://stream.binance.com:9443/ws',
  },
  COINGECKO: {
    base: 'https://api.coingecko.com/api/v3',
    simplePrice: '/simple/price',
  },
  COINBASE: {
    rest: 'https://api.exchange.coinbase.com',
    ticker: '/products',
    ws: 'wss://ws-feed.exchange.coinbase.com',
  },
};

// Types
export type ApiProvider = 'NSE' | 'BSE' | 'BINANCE' | 'COINGECKO' | 'COINBASE' | 'DUMMY';
export type DataType = 'STOCK' | 'CRYPTO';
export type ConnectionMethod = 'REST' | 'WEBSOCKET';
export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y';

// Websocket connection tracking
let websocketConnection: WebSocket | null = null;
let websocketInterval: NodeJS.Timeout | null = null;

// Simulate websocket data when using dummy data
export function simulateWebSocketData(callback: (data: any) => void) {
  if (websocketInterval) {
    clearInterval(websocketInterval);
  }
  
  websocketInterval = setInterval(() => {
    // Create simulated price updates
    const updates = websocketData.map(item => {
      const randomChange = (Math.random() - 0.5) * (item.price * 0.01);
      const newPrice = item.price + randomChange;
      
      return {
        ...item,
        previousPrice: item.price,
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat(randomChange.toFixed(2)),
        changePercent: parseFloat(((randomChange / item.price) * 100).toFixed(2))
      };
    });
    
    callback(updates);
  }, 1500);
  
  return () => {
    if (websocketInterval) {
      clearInterval(websocketInterval);
      websocketInterval = null;
    }
  };
}

// Create websocket connection
export function createWebSocketConnection(
  provider: ApiProvider,
  symbols: string[],
  onMessage: (data: any) => void,
  onError?: (error: any) => void
) {
  closeWebSocketConnection();
  
  if (provider === 'DUMMY') {
    return simulateWebSocketData(onMessage);
  }
  
  try {
    let url = '';
    
    switch (provider) {
      case 'BINANCE':
        const streams = symbols.map(s => `${s.toLowerCase()}@trade`).join('/');
        url = `${API_ENDPOINTS.BINANCE.ws}/${streams}`;
        break;
      case 'COINBASE':
        url = API_ENDPOINTS.COINBASE.ws;
        break;
      default:
        throw new Error(`WebSocket not supported for provider: ${provider}`);
    }
    
    websocketConnection = new WebSocket(url);
    
    websocketConnection.onopen = () => {
      console.log(`WebSocket connected to ${provider}`);
      
      // Subscribe to channels for Coinbase
      if (provider === 'COINBASE' && websocketConnection) {
        const subscribeMsg = {
          type: 'subscribe',
          product_ids: symbols,
          channels: ['ticker'],
        };
        websocketConnection.send(JSON.stringify(subscribeMsg));
      }
    };
    
    websocketConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    websocketConnection.onerror = (error) => {
      console.error(`WebSocket error with ${provider}:`, error);
      if (onError) onError(error);
    };
    
    websocketConnection.onclose = () => {
      console.log(`WebSocket disconnected from ${provider}`);
    };
    
    return () => closeWebSocketConnection();
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    if (onError) onError(error);
    return () => {};
  }
}

// Close websocket connection
export function closeWebSocketConnection() {
  if (websocketConnection) {
    websocketConnection.close();
    websocketConnection = null;
  }
  
  if (websocketInterval) {
    clearInterval(websocketInterval);
    websocketInterval = null;
  }
}

// Fetch data from REST API
export async function fetchMarketData(
  provider: ApiProvider,
  dataType: DataType,
  symbols: string[] = []
) {
  if (provider === 'DUMMY') {
    return dataType === 'STOCK' ? stockData : cryptoData;
  }
  
  try {
    let url = '';
    let options: RequestInit = {};
    
    switch (provider) {
      case 'NSE':
        // Would normally fetch from NSE API, returning dummy data for now
        return stockData;
      case 'BSE':
        // Would normally fetch from BSE API, returning dummy data for now
        return stockData;
      case 'BINANCE':
        if (symbols.length === 0) {
          url = `${API_ENDPOINTS.BINANCE.rest}${API_ENDPOINTS.BINANCE.ticker}`;
        } else {
          url = `${API_ENDPOINTS.BINANCE.rest}${API_ENDPOINTS.BINANCE.ticker}?symbol=${symbols[0]}`;
        }
        break;
      case 'COINGECKO':
        const ids = symbols.length > 0 ? symbols.join(',') : 'bitcoin,ethereum,ripple';
        url = `${API_ENDPOINTS.COINGECKO.base}${API_ENDPOINTS.COINGECKO.simplePrice}?ids=${ids}&vs_currencies=inr,usd`;
        break;
      case 'COINBASE':
        if (symbols.length === 0) {
          url = `${API_ENDPOINTS.COINBASE.rest}${API_ENDPOINTS.COINBASE.ticker}`;
        } else {
          url = `${API_ENDPOINTS.COINBASE.rest}${API_ENDPOINTS.COINBASE.ticker}/${symbols[0]}/ticker`;
        }
        break;
      default:
        throw new Error(`Unknown API provider: ${provider}`);
    }
    
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Fallback to dummy data on error
    return dataType === 'STOCK' ? stockData : cryptoData;
  }
}

// Get connection status
export function getConnectionStatus() {
  return websocketConnection ? 
    websocketConnection.readyState === WebSocket.OPEN ? 
      { status: 'connected', icon: '✅' } : 
      { status: 'connecting', icon: '⏳' } : 
    { status: 'disconnected', icon: '❌' };
}

// Get chart data for a specific symbol and timeframe
export function fetchChartData(
  symbol: string,
  timeframe: TimeFrame = '1M',
  provider: ApiProvider = 'DUMMY'
) {
  // For dummy data, use our generated chart data
  if (provider === 'DUMMY') {
    return Promise.resolve(getSymbolChartData(symbol, timeframe, stockData, cryptoData));
  }
  
  // For real provider implementation (future)
  // ...
  
  // For now, return dummy data for all providers
  return Promise.resolve(getSymbolChartData(symbol, timeframe, stockData, cryptoData));
}
