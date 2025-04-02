
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const TopMoversSection: React.FC = () => {
  const navigate = useNavigate();
  const { stocksData, cryptoData } = useData();
  const [activeTab, setActiveTab] = useState<string>("stocks");
  
  // Top gainers and losers in stocks
  const topGainersStocks = [...stocksData]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
    
  const topLosersStocks = [...stocksData]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
  
  // Top gainers and losers in crypto
  const topGainersCrypto = [...cryptoData]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);
    
  const topLosersCrypto = [...cryptoData]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);
    
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Top Movers</h2>
      </div>
      
      {/* Use a single Tabs component to manage both the tab selection and content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="stocks">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stocks" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GainerLoserCard 
              title="Top Gainers"
              assets={topGainersStocks}
              isGainer={true}
              onAssetClick={(symbol) => navigate(`/trade/${symbol}`)}
            />
            
            <GainerLoserCard 
              title="Top Losers"
              assets={topLosersStocks}
              isGainer={false}
              onAssetClick={(symbol) => navigate(`/trade/${symbol}`)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="crypto" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GainerLoserCard 
              title="Top Crypto Gainers"
              assets={topGainersCrypto}
              isGainer={true}
              onAssetClick={(symbol) => navigate(`/trade/${symbol}`)}
            />
            
            <GainerLoserCard 
              title="Top Crypto Losers"
              assets={topLosersCrypto}
              isGainer={false}
              onAssetClick={(symbol) => navigate(`/trade/${symbol}`)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

interface Asset {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

interface GainerLoserCardProps {
  title: string;
  assets: Asset[];
  isGainer: boolean;
  onAssetClick: (symbol: string) => void;
}

const GainerLoserCard: React.FC<GainerLoserCardProps> = ({ 
  title, 
  assets, 
  isGainer, 
  onAssetClick 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TrendingUp 
            className={`h-5 w-5 mr-2 ${isGainer ? 'text-success' : 'text-destructive'}`} 
            transform={isGainer ? undefined : "rotate(180)"}
          />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assets.map((asset) => (
            <div 
              key={asset.symbol}
              className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onAssetClick(asset.symbol)}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">{asset.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium">{asset.symbol}</div>
                  <div className="text-sm text-muted-foreground">{asset.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div>₹{asset.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                <div className={isGainer ? "text-success flex items-center" : "text-destructive flex items-center"}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${!isGainer ? 'transform rotate-180' : ''}`} />
                  {asset.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
