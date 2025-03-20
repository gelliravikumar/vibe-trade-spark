
export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  circulatingSupply: number;
  maxSupply: number | null;
  type: 'CRYPTO';
}

export const cryptoData: CryptoData[] = [
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    price: 61240.85,
    change: 1250.30,
    changePercent: 2.08,
    volume: 32500000000,
    high24h: 61800.25,
    low24h: 59750.50,
    marketCap: 1198567000000,
    circulatingSupply: 19585000,
    maxSupply: 21000000,
    type: 'CRYPTO'
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    price: 3452.70,
    change: -125.30,
    changePercent: -3.50,
    volume: 15780000000,
    high24h: 3590.40,
    low24h: 3400.10,
    marketCap: 414324000000,
    circulatingSupply: 120000000,
    maxSupply: null,
    type: 'CRYPTO'
  },
  {
    symbol: 'BNBUSDT',
    name: 'Binance Coin',
    price: 612.35,
    change: 8.65,
    changePercent: 1.43,
    volume: 2580000000,
    high24h: 615.85,
    low24h: 602.20,
    marketCap: 92480000000,
    circulatingSupply: 151000000,
    maxSupply: 200000000,
    type: 'CRYPTO'
  },
  {
    symbol: 'XRPUSDT',
    name: 'Ripple',
    price: 0.63,
    change: 0.02,
    changePercent: 3.28,
    volume: 3250000000,
    high24h: 0.64,
    low24h: 0.61,
    marketCap: 33950000000,
    circulatingSupply: 53900000000,
    maxSupply: 100000000000,
    type: 'CRYPTO'
  },
  {
    symbol: 'ADAUSDT',
    name: 'Cardano',
    price: 0.48,
    change: -0.02,
    changePercent: -4.00,
    volume: 1250000000,
    high24h: 0.51,
    low24h: 0.47,
    marketCap: 16780000000,
    circulatingSupply: 35000000000,
    maxSupply: 45000000000,
    type: 'CRYPTO'
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
    price: 138.20,
    change: 6.45,
    changePercent: 4.89,
    volume: 4680000000,
    high24h: 140.25,
    low24h: 131.15,
    marketCap: 59420000000,
    circulatingSupply: 430000000,
    maxSupply: null,
    type: 'CRYPTO'
  },
  {
    symbol: 'DOGEUSDT',
    name: 'Dogecoin',
    price: 0.163,
    change: 0.008,
    changePercent: 5.15,
    volume: 2140000000,
    high24h: 0.168,
    low24h: 0.154,
    marketCap: 21820000000,
    circulatingSupply: 134000000000,
    maxSupply: null,
    type: 'CRYPTO'
  },
  {
    symbol: 'DOTUSDT',
    name: 'Polkadot',
    price: 7.85,
    change: -0.31,
    changePercent: -3.80,
    volume: 680000000,
    high24h: 8.22,
    low24h: 7.81,
    marketCap: 9750000000,
    circulatingSupply: 1240000000,
    maxSupply: null,
    type: 'CRYPTO'
  },
  {
    symbol: 'AVAXUSDT',
    name: 'Avalanche',
    price: 36.70,
    change: 1.85,
    changePercent: 5.31,
    volume: 1520000000,
    high24h: 37.50,
    low24h: 34.80,
    marketCap: 12860000000,
    circulatingSupply: 350000000,
    maxSupply: 720000000,
    type: 'CRYPTO'
  },
  {
    symbol: 'MATICUSDT',
    name: 'Polygon',
    price: 0.72,
    change: 0.04,
    changePercent: 5.88,
    volume: 890000000,
    high24h: 0.73,
    low24h: 0.68,
    marketCap: 6720000000,
    circulatingSupply: 9320000000,
    maxSupply: 10000000000,
    type: 'CRYPTO'
  }
];
