
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingAssets } from '@/components/home/TrendingAssets';
import { ArrowRight } from 'lucide-react';

export const TrendingAssetsSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trending Assets</h2>
        <Button variant="outline" onClick={() => navigate('/markets')}>
          <ArrowRight className="h-4 w-4 mr-2" />
          Explore Markets
        </Button>
      </div>
      
      <TrendingAssets />
    </section>
  );
};
