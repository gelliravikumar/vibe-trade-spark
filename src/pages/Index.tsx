
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarketSummary } from '@/components/home/MarketSummary';
import { TrendingAssets } from '@/components/home/TrendingAssets';
import { BarChart3, LineChart, TrendingUp, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              Trade Smarter, Not Harder
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-in">
              Advanced trading platform for Indian stocks and cryptocurrencies with real-time market data
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link to="/markets" className="btn-primary text-lg py-3 px-8">
                Explore Markets
              </Link>
              <Link to="/trade" className="btn-secondary text-lg py-3 px-8">
                Start Trading
              </Link>
            </div>
          </div>
        </section>
        
        {/* Market Overview */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <MarketSummary />
            
            <div className="mt-10">
              <TrendingAssets />
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
                  API Flexibility
                </h3>
                <p className="text-muted-foreground">
                  Choose your preferred data provider and connection method
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of traders using our platform for Indian stocks and cryptocurrencies
            </p>
            <Link to="/markets" className="btn-primary text-lg py-3 px-8">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
