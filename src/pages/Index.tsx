
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarketSummary } from '@/components/home/MarketSummary';
import { TrendingAssets } from '@/components/home/TrendingAssets';
import { ArrowRight, BarChart3, LineChart, TrendingUp, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { stocksData, cryptoData } = useData();
  const { portfolioValue, paperBalance } = usePaperTrading();
  const [stockGainers, setStockGainers] = useState<any[]>([]);
  const [cryptoGainers, setCryptoGainers] = useState<any[]>([]);
  
  useEffect(() => {
    // Get top gainers for stocks and crypto
    if (stocksData.length > 0) {
      const sortedStocks = [...stocksData].sort((a, b) => b.changePercent - a.changePercent);
      setStockGainers(sortedStocks.slice(0, 3));
    }
    
    if (cryptoData.length > 0) {
      const sortedCrypto = [...cryptoData].sort((a, b) => b.changePercent - a.changePercent);
      setCryptoGainers(sortedCrypto.slice(0, 3));
    }
  }, [stocksData, cryptoData]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Portfolio Overview Section (Robinhood-style) */}
        <section className="pt-8 pb-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-lg p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Investing
              </h1>
              <div className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                ₹{(portfolioValue + paperBalance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center text-success mb-6">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="text-lg font-semibold">
                  +₹{(portfolioValue * 0.0121).toLocaleString('en-IN', { maximumFractionDigits: 2 })} (+1.21%) Today
                </span>
              </div>
              
              <div className="w-full h-40 md:h-56 bg-muted/30 rounded-lg overflow-hidden mb-6">
                <img 
                  src="/public/lovable-uploads/214efdad-f251-4a0a-af21-c11274943344.png" 
                  alt="Portfolio chart" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2 mb-2">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  LIVE
                </Button>
                <Button variant="default" size="sm" className="whitespace-nowrap">
                  1D
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  1W
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  1M
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  3M
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  YTD
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  1Y
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  ALL
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t">
                <div className="flex items-center">
                  <span className="font-semibold">Buying power</span>
                  <ExternalLink className="w-4 h-4 ml-2 text-muted-foreground" />
                </div>
                <span className="font-semibold">₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Market Summary */}
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <MarketSummary />
          </div>
        </section>
        
        {/* Crypto and Stocks Sections */}
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cryptocurrency Section */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cryptocurrencies</h2>
                <Link to="/markets?type=crypto" className="text-sm flex items-center text-primary hover:underline">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {cryptoGainers.map((crypto) => (
                  <Link 
                    key={crypto.symbol} 
                    to={`/trade/${crypto.symbol}`} 
                    className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-medium">{crypto.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{crypto.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      <div className={crypto.changePercent >= 0 ? "text-success text-sm" : "text-destructive text-sm"}>
                        {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Stocks Section */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Stocks</h2>
                <Link to="/markets?type=stock" className="text-sm flex items-center text-primary hover:underline">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {stockGainers.map((stock) => (
                  <Link 
                    key={stock.symbol} 
                    to={`/trade/${stock.symbol}`} 
                    className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-medium">{stock.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-muted-foreground">{stock.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      <div className={stock.changePercent >= 0 ? "text-success text-sm" : "text-destructive text-sm"}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Trading Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LineChart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-Time Data
                </h3>
                <p className="text-muted-foreground">
                  Get instant price updates with WebSocket connections and REST APIs
                </p>
              </div>
              
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Advanced Charts
                </h3>
                <p className="text-muted-foreground">
                  Analyze market trends with powerful interactive charts and indicators
                </p>
              </div>
              
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Smart Portfolios
                </h3>
                <p className="text-muted-foreground">
                  Track your investments and performance with detailed analytics
                </p>
              </div>
              
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Paper Trading
                </h3>
                <p className="text-muted-foreground">
                  Practice with virtual money before investing real funds
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 text-center bg-card">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of traders using our platform for Indian stocks and cryptocurrencies
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/markets" className="btn-primary text-lg py-3 px-8 rounded-full">
                Explore Markets
              </Link>
              <Link to="/paper-trading" className="btn-secondary text-lg py-3 px-8 rounded-full">
                Try Paper Trading
              </Link>
            </div>
            
            <div className="mt-10 pt-10 border-t border-muted">
              <div className="flex justify-center items-center text-muted-foreground">
                <span className="flex items-center mr-6">
                  <LineChart className="w-5 h-5 mr-2" />
                  <span>NSE</span>
                </span>
                <span className="flex items-center mr-6">
                  <LineChart className="w-5 h-5 mr-2" />
                  <span>BSE</span>
                </span>
                <span className="flex items-center">
                  <LineChart className="w-5 h-5 mr-2" />
                  <span>Global Markets</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
