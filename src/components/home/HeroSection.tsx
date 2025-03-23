
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DetailedChart from '@/components/charts/DetailedChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, Clock } from 'lucide-react';
import { usePaperTrading } from '@/hooks/use-paper-trading';
import { usePortfolio } from '@/hooks/use-portfolio';
import { useData } from '@/context/DataContext';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { stocksData, cryptoData } = useData();
  const { paperBalance, portfolioValue, isPaperTrading } = usePaperTrading();
  const { portfolio } = usePortfolio();
  const [chartAsset, setChartAsset] = React.useState('NIFTY');
  const [timeFrame, setTimeFrame] = React.useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  
  // Calculate portfolio stats
  const portfolioStats = {
    totalValue: portfolioValue + paperBalance,
    stocksValue: Object.values(portfolio)
      .filter(pos => pos.type === 'STOCK')
      .reduce((sum, pos) => {
        const stockData = stocksData.find(s => s.symbol === pos.symbol);
        return sum + (pos.quantity * (stockData?.price || pos.avgPrice));
      }, 0),
    cryptoValue: Object.values(portfolio)
      .filter(pos => pos.type === 'CRYPTO')
      .reduce((sum, pos) => {
        const cryptoData2 = cryptoData.find(c => c.symbol === pos.symbol);
        return sum + (pos.quantity * (cryptoData2?.price || pos.avgPrice));
      }, 0),
  };
  
  return (
    <section className="mb-8">
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome to TradePaisa
        </h1>
        <p className="text-muted-foreground text-lg">
          The smart way to trade stocks and crypto in India
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Market Chart</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue={chartAsset} onValueChange={setChartAsset}>
                    <TabsList>
                      <TabsTrigger value="NIFTY">NIFTY</TabsTrigger>
                      <TabsTrigger value="SENSEX">SENSEX</TabsTrigger>
                      <TabsTrigger value="BTC">BTC</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Tabs defaultValue={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
                    <TabsList>
                      <TabsTrigger value="1D">1D</TabsTrigger>
                      <TabsTrigger value="1W">1W</TabsTrigger>
                      <TabsTrigger value="1M">1M</TabsTrigger>
                      <TabsTrigger value="3M">3M</TabsTrigger>
                      <TabsTrigger value="1Y">1Y</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <DetailedChart 
                height={400} 
                symbol={chartAsset} 
                timeFrame={timeFrame} 
                showControls={true} 
                fullWidth={true}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4 space-y-6">
          <PortfolioSummaryCard 
            portfolioStats={portfolioStats} 
            paperBalance={paperBalance} 
            portfolioValue={portfolioValue} 
            isPaperTrading={isPaperTrading} 
          />
          
          <MarketHoursCard />
        </div>
      </div>
    </section>
  );
};

interface PortfolioSummaryCardProps {
  portfolioStats: {
    totalValue: number;
    stocksValue: number;
    cryptoValue: number;
  };
  paperBalance: number;
  portfolioValue: number;
  isPaperTrading: boolean;
}

const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({ 
  portfolioStats,
  paperBalance,
  portfolioValue,
  isPaperTrading
}) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          Portfolio Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-muted-foreground text-sm">Total Value</div>
              <div className="text-2xl font-bold">
                ₹{portfolioStats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-muted-foreground text-sm">Stocks</div>
                <div className="text-lg font-medium">
                  ₹{portfolioStats.stocksValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-muted-foreground text-sm">Crypto</div>
                <div className="text-lg font-medium">
                  ₹{portfolioStats.cryptoValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {isPaperTrading && (
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-muted-foreground">Paper Cash</span>
                <span>₹{paperBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-muted-foreground">Assets</span>
              <span>₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-muted-foreground">Trading Mode</span>
              <Badge variant={isPaperTrading ? 'outline' : 'default'}>
                {isPaperTrading ? 'Paper Trading' : 'Real Trading'}
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 grid grid-cols-2 gap-2">
            <Button 
              variant="default" 
              onClick={() => navigate('/trade/RELIANCE')}
              className="w-full"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Trade Now
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/portfolio')}
              className="w-full"
            >
              <PieChart className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketHoursCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Market Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-medium">NSE & BSE</span>
              <span className="text-sm text-muted-foreground">Indian Markets</span>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
              Open
            </Badge>
          </div>
          <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-muted-foreground">Trading Hours:</div>
            <div>9:15 AM - 3:30 PM</div>
            <div className="text-muted-foreground">Pre-market:</div>
            <div>9:00 AM - 9:15 AM</div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-medium">Crypto</span>
              <span className="text-sm text-muted-foreground">Global Markets</span>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
              24/7
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
