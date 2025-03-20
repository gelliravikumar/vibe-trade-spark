
import { stockData } from './stocksData';
import { cryptoData } from './cryptoData';

// Combined data for websocket simulation
export const websocketData = [
  ...stockData.map(stock => ({
    ...stock,
    previousPrice: stock.price,
  })),
  ...cryptoData.map(crypto => ({
    ...crypto,
    previousPrice: crypto.price,
  }))
];
