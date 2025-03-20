
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high52Week: number;
  low52Week: number;
  marketCap: number;
  pe: number;
  dividend: number;
  sector: string;
  type: 'STOCK';
  exchange: string;
}

export const stockData: StockData[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2896.45,
    change: 32.55,
    changePercent: 1.14,
    volume: 7520000,
    high52Week: 2978.80,
    low52Week: 2180.10,
    marketCap: 1958721000000,
    pe: 30.45,
    dividend: 1.02,
    sector: 'Energy',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3548.25,
    change: -42.30,
    changePercent: -1.18,
    volume: 3210000,
    high52Week: 3990.00,
    low52Week: 3150.80,
    marketCap: 1308612000000,
    pe: 29.10,
    dividend: 2.25,
    sector: 'Technology',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    price: 1678.55,
    change: 8.45,
    changePercent: 0.51,
    volume: 8942000,
    high52Week: 1725.00,
    low52Week: 1460.25,
    marketCap: 934512000000,
    pe: 22.85,
    dividend: 1.75,
    sector: 'Financial Services',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    price: 1512.30,
    change: -18.70,
    changePercent: -1.22,
    volume: 6731000,
    high52Week: 1620.00,
    low52Week: 1215.45,
    marketCap: 634891000000,
    pe: 24.60,
    dividend: 1.85,
    sector: 'Technology',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank',
    price: 965.20,
    change: 12.35,
    changePercent: 1.30,
    volume: 9821000,
    high52Week: 985.75,
    low52Week: 795.30,
    marketCap: 672345000000,
    pe: 19.70,
    dividend: 1.25,
    sector: 'Financial Services',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever',
    price: 2478.65,
    change: -5.20,
    changePercent: -0.21,
    volume: 2143000,
    high52Week: 2768.50,
    low52Week: 2365.10,
    marketCap: 582405000000,
    pe: 62.15,
    dividend: 2.85,
    sector: 'Consumer Goods',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel',
    price: 885.40,
    change: 15.75,
    changePercent: 1.81,
    volume: 5246000,
    high52Week: 900.25,
    low52Week: 720.40,
    marketCap: 493578000000,
    pe: 28.35,
    dividend: 0.75,
    sector: 'Telecommunications',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    price: 625.85,
    change: 8.30,
    changePercent: 1.34,
    volume: 12450000,
    high52Week: 645.30,
    low52Week: 525.15,
    marketCap: 558723000000,
    pe: 12.45,
    dividend: 3.15,
    sector: 'Financial Services',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints',
    price: 3245.10,
    change: -28.45,
    changePercent: -0.87,
    volume: 1862000,
    high52Week: 3590.00,
    low52Week: 3050.25,
    marketCap: 312456000000,
    pe: 78.35,
    dividend: 1.15,
    sector: 'Consumer Goods',
    type: 'STOCK',
    exchange: 'NSE'
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro',
    price: 423.75,
    change: 5.85,
    changePercent: 1.40,
    volume: 7891000,
    high52Week: 485.60,
    low52Week: 385.20,
    marketCap: 232568000000,
    pe: 18.55,
    dividend: 2.05,
    sector: 'Technology',
    type: 'STOCK',
    exchange: 'NSE'
  }
];
