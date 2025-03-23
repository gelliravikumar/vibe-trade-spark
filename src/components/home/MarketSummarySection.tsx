
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketSummary } from '@/components/home/MarketSummary';

export const MarketSummarySection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Market Summary</h2>
        <Button variant="outline" onClick={() => navigate('/markets')}>
          View All Markets
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <MarketSummary />
        </CardContent>
      </Card>
    </section>
  );
};
