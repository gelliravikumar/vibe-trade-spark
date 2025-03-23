
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="mb-8">
      <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Start Trading Today</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of traders using TradePaisa to invest in stocks and cryptocurrencies with zero commission fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/paper-trading')}>
                Try Paper Trading
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/learn')}>
                Learn Trading Basics
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="max-w-xs">
              <img 
                src="/lovable-uploads/ee875c5a-4a74-4430-aad3-f52e67ef759a.png" 
                alt="Trading App" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
