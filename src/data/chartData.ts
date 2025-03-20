
export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  symbol: string;
  timeframes: {
    '1D': PricePoint[];
    '1W': PricePoint[];
    '1M': PricePoint[];
    '3M': PricePoint[];
    '1Y': PricePoint[];
  };
}

// Helper function to generate realistic price movements
const generatePriceData = (
  basePrice: number, 
  days: number, 
  volatility: number,
  trend: number, // -1 to 1, where -1 is downtrend, 0 neutral, 1 uptrend
  startDate = new Date()
): PricePoint[] => {
  let currentPrice = basePrice;
  const data: PricePoint[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - (days - i - 1));
    
    // Generate daily price movement with trend bias
    const dailyChange = (Math.random() - 0.5 + trend * 0.1) * volatility;
    
    // Calculate open, high, low, close
    const open = currentPrice;
    const close = open * (1 + dailyChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    
    // Generate volume (higher on bigger price movements)
    const volumeBase = basePrice * 5000 * (1 + Math.abs(dailyChange) * 10);
    const volume = Math.floor(volumeBase * (0.7 + Math.random() * 0.6));
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate chart data for each timeframe
const generateChartDataForSymbol = (
  symbol: string,
  basePrice: number,
  volatility: number,
  trend: number
): ChartData => {
  const now = new Date();
  
  return {
    symbol,
    timeframes: {
      '1D': generatePriceData(basePrice, 24, volatility * 0.2, trend, now), // Hours for 1D
      '1W': generatePriceData(basePrice, 7, volatility * 0.4, trend, now),
      '1M': generatePriceData(basePrice, 30, volatility * 0.6, trend, now),
      '3M': generatePriceData(basePrice, 90, volatility * 0.8, trend, now),
      '1Y': generatePriceData(basePrice, 365, volatility, trend, now),
    }
  };
};

// Generate chart data for all stock symbols
export const generateAllChartData = (stocksData: any[], cryptoData: any[]): Record<string, ChartData> => {
  const allChartData: Record<string, ChartData> = {};
  
  // Generate for stocks
  stocksData.forEach(stock => {
    // Use the stock's price as base, volatility based on sector
    const basePrice = stock.price;
    const volatility = stock.sector === 'Technology' ? 0.03 : 
                       stock.sector === 'Finance' ? 0.02 : 0.025;
    
    // Trend based on current performance
    const trend = stock.changePercent > 0 ? 0.3 : -0.3;
    
    allChartData[stock.symbol] = generateChartDataForSymbol(
      stock.symbol,
      basePrice,
      volatility,
      trend
    );
  });
  
  // Generate for cryptos (higher volatility)
  cryptoData.forEach(crypto => {
    const basePrice = crypto.price;
    const volatility = 0.05; // Cryptos are more volatile
    const trend = crypto.changePercent > 0 ? 0.4 : -0.4;
    
    allChartData[crypto.symbol] = generateChartDataForSymbol(
      crypto.symbol,
      basePrice,
      volatility,
      trend
    );
  });
  
  return allChartData;
};

// Cache for chart data
let chartDataCache: Record<string, ChartData> | null = null;

// Function to get chart data (generates once and caches)
export const getChartData = (stocksData: any[], cryptoData: any[]): Record<string, ChartData> => {
  if (!chartDataCache) {
    chartDataCache = generateAllChartData(stocksData, cryptoData);
  }
  return chartDataCache;
};

// Function to get chart data for a specific symbol and timeframe
export const getSymbolChartData = (
  symbol: string, 
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y', 
  stocksData: any[], 
  cryptoData: any[]
): PricePoint[] => {
  const allData = getChartData(stocksData, cryptoData);
  
  if (allData[symbol] && allData[symbol].timeframes[timeframe]) {
    return allData[symbol].timeframes[timeframe];
  }
  
  // If not found, find the asset and generate data
  const asset = [...stocksData, ...cryptoData].find(a => a.symbol === symbol);
  
  if (!asset) {
    // Return empty array if asset not found
    return [];
  }
  
  // Generate data for this specific asset
  const basePrice = asset.price;
  const volatility = asset.type === 'CRYPTO' ? 0.05 : 0.025;
  const trend = asset.changePercent > 0 ? 0.3 : -0.3;
  
  const days = 
    timeframe === '1D' ? 24 : 
    timeframe === '1W' ? 7 :
    timeframe === '1M' ? 30 :
    timeframe === '3M' ? 90 : 365;
  
  return generatePriceData(basePrice, days, volatility, trend);
};
