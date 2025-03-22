
export interface TradingTerm {
  term: string;
  definition: string;
  category: 'basic' | 'technical' | 'fundamental' | 'derivatives' | 'market' | 'risk';
}

export const tradingTerminology: TradingTerm[] = [
  {
    term: "Bull Market",
    definition: "A financial market in which prices are rising or expected to rise. This term is most often used to refer to the stock market but can be applied to anything that is traded, such as bonds, real estate, currencies, and commodities.",
    category: "market"
  },
  {
    term: "Bear Market",
    definition: "A market condition in which the prices of securities are falling or are expected to fall. The term 'bear market' is typically used to refer to the stock market but can apply to any security that is trading, such as bonds, real estate, currencies, and commodities.",
    category: "market"
  },
  {
    term: "Dividend",
    definition: "A distribution of a portion of a company's earnings, decided by the board of directors, to a class of its shareholders. Dividends can be issued as cash payments, as shares of stock, or other property.",
    category: "fundamental"
  },
  {
    term: "Market Capitalization",
    definition: "The total market value of a company's outstanding shares. Market capitalization is calculated by multiplying a company's shares outstanding by the current market price of one share.",
    category: "fundamental"
  },
  {
    term: "P/E Ratio",
    definition: "The Price-to-Earnings Ratio is a valuation ratio of a company's current share price compared to its per-share earnings. It is calculated as: Market Value per Share / Earnings per Share.",
    category: "fundamental"
  },
  {
    term: "Volatility",
    definition: "A statistical measure of the dispersion of returns for a given security or market index. In most cases, the higher the volatility, the riskier the security.",
    category: "risk"
  },
  {
    term: "Volume",
    definition: "The number of shares or contracts traded in a security or an entire market during a given period of time. It is an important indicator in technical analysis as it is used to measure the worth of a market move.",
    category: "technical"
  },
  {
    term: "Liquidity",
    definition: "The degree to which an asset or security can be quickly bought or sold in the market without affecting the asset's price. Cash is considered the most liquid asset, while real estate, fine art and collectibles are all relatively illiquid.",
    category: "market"
  },
  {
    term: "Blue Chip Stocks",
    definition: "Shares of large, well-established and financially sound companies with an excellent reputation. These companies typically have a long record of paying stable or rising dividends.",
    category: "fundamental"
  },
  {
    term: "Day Trading",
    definition: "The practice of buying and selling a financial instrument within the same trading day, such that all positions are closed before the market closes for the trading day.",
    category: "basic"
  },
  {
    term: "Limit Order",
    definition: "An order to buy or sell a stock at a specific price or better. A buy limit order can only be executed at the limit price or lower, and a sell limit order can only be executed at the limit price or higher.",
    category: "basic"
  },
  {
    term: "Stop Order",
    definition: "An order to buy or sell a stock once the price reaches a specified price, known as the stop price. When the stop price is reached, a stop order becomes a market order.",
    category: "basic"
  },
  {
    term: "Moving Average",
    definition: "A technical analysis indicator that helps smooth out price action by filtering out the noise from random price fluctuations. It is a trend-following or lagging indicator because it is based on past prices.",
    category: "technical"
  },
  {
    term: "Relative Strength Index (RSI)",
    definition: "A momentum oscillator that measures the speed and change of price movements. The RSI oscillates between zero and 100 and is traditionally considered overbought when above 70 and oversold when below 30.",
    category: "technical"
  },
  {
    term: "Support Level",
    definition: "A price level where a downtrend can be expected to pause due to a concentration of demand or buying interest. As the price of assets or securities drops, demand for the shares increases, thus forming the support line.",
    category: "technical"
  },
  {
    term: "Resistance Level",
    definition: "A price point on a chart where upward price movement is impeded by an overwhelming level of supply. As the price of assets or securities rises, selling pressure increases, forming the resistance line.",
    category: "technical"
  },
  {
    term: "Options",
    definition: "Financial instruments that convey the right, but not the obligation, to buy or sell a security at a specified price on or before a given date. An option that conveys the right to buy is a 'call' option, and an option that conveys the right to sell is a 'put' option.",
    category: "derivatives"
  },
  {
    term: "Futures",
    definition: "Financial contracts obligating the buyer to purchase an asset or the seller to sell an asset at a predetermined future date and price. Unlike options, futures contracts constitute a binding obligation.",
    category: "derivatives"
  },
  {
    term: "Portfolio",
    definition: "A grouping of financial assets such as stocks, bonds, commodities, currencies and cash equivalents, as well as their fund counterparts. Portfolio management involves deciding what assets to include in the portfolio, given the goals of the portfolio owner and changing economic conditions.",
    category: "basic"
  },
  {
    term: "Diversification",
    definition: "A risk management strategy that mixes a wide variety of investments within a portfolio. The rationale behind this technique is that a portfolio constructed of different kinds of assets will, on average, yield higher long-term returns and lower the risk of any individual holding or security.",
    category: "risk"
  },
  {
    term: "Asset Allocation",
    definition: "An investment strategy that aims to balance risk and reward by apportioning a portfolio's assets according to an individual's goals, risk tolerance, and investment horizon.",
    category: "risk"
  },
  {
    term: "Exchange-Traded Fund (ETF)",
    definition: "A type of investment fund and exchange-traded product, i.e., they are traded on stock exchanges. ETFs are similar to mutual funds, but they can be bought and sold throughout the day like common stocks.",
    category: "basic"
  },
  {
    term: "Mutual Fund",
    definition: "An investment vehicle made up of a pool of funds collected from many investors for the purpose of investing in securities such as stocks, bonds, money market instruments, and other assets.",
    category: "basic"
  },
  {
    term: "Bid-Ask Spread",
    definition: "The difference between the highest price a buyer is willing to pay for an asset and the lowest price a seller is willing to accept. A securities price is ultimately determined by the bid-ask spread.",
    category: "market"
  },
  {
    term: "Short Selling",
    definition: "The sale of a security that is not owned by the seller or that the seller has borrowed. Short selling is motivated by the belief that a security's price will decline, enabling it to be bought back at a lower price to make a profit.",
    category: "basic"
  },
  {
    term: "Margin",
    definition: "Borrowed money that is used to purchase securities. This practice is referred to as 'buying on margin'. Margin is the difference between the market value of a stock and the loan a broker makes.",
    category: "risk"
  },
  {
    term: "Dividend Yield",
    definition: "A financial ratio that shows how much a company pays out in dividends each year relative to its share price. Dividend yield is calculated as the annual dividend per share divided by the stock price per share.",
    category: "fundamental"
  },
  {
    term: "Book Value",
    definition: "The net asset value of a company, calculated as total assets minus intangible assets (patents, goodwill) and liabilities. It is the value a shareholder would theoretically receive if a company were liquidated.",
    category: "fundamental"
  },
  {
    term: "Return on Equity (ROE)",
    definition: "A measure of financial performance calculated by dividing net income by shareholders' equity. ROE is considered a measure of how effectively management is using a company's assets to create profits.",
    category: "fundamental"
  }
];

export const getTradingTermsByCategory = (category: TradingTerm['category']) => {
  return tradingTerminology.filter(term => term.category === category);
};

export const searchTradingTerms = (query: string) => {
  return tradingTerminology.filter(
    term => 
      term.term.toLowerCase().includes(query.toLowerCase()) || 
      term.definition.toLowerCase().includes(query.toLowerCase())
  );
};
