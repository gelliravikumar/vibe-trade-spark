import React, { useState } from 'react';
import DetailedChart from '@/components/charts/DetailedChart';
import { TradingViewChart } from '@/components/charts/TradingViewChart';
import { DataSourceSelector } from '@/components/ui/DataSourceSelector';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { 
  ArrowLeft, 
  Info, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  BookOpen,
  Layers,
  Building,
  DollarSign,
  PieChart,
  Users,
  Calendar,
  Star
} from 'lucide-react';
import { AssetList } from '@/components/markets/AssetList';
import { AssetTable } from '@/components/markets/AssetTable';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MiniChart } from '@/components/charts/MiniChart';
import { TradingForm } from '@/components/trade/TradingForm';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TradingTerminalProps {
  symbol?: string;
}

export const TradingTerminal: React.FC<TradingTerminalProps> = ({ symbol }) => {
  const navigate = useNavigate();
  const { stocksData, cryptoData } = useData();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [useAdvancedChart, setUseAdvancedChart] = useState(true);
  
  const asset = symbol ? [...stocksData, ...cryptoData].find(asset => asset.symbol === symbol) : null;
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (!symbol) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold">Markets Overview</h1>
            
            <Tabs defaultValue="cards" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger 
                    value="cards" 
                    onClick={() => setViewMode('cards')}
                  >
                    Cards View
                  </TabsTrigger>
                  <TabsTrigger 
                    value="table" 
                    onClick={() => setViewMode('table')}
                  >
                    Table View
                  </TabsTrigger>
                </TabsList>
                
                <DataSourceSelector />
              </div>
              
              <TabsContent value="cards">
                <AssetList type="ALL" showSearch={true} />
              </TabsContent>
              
              <TabsContent value="table">
                <AssetTable type="ALL" showSearch={true} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <WatchlistManager />
          </div>
        </div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <button onClick={handleBack} className="flex items-center text-sm mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="glass-card rounded-lg p-8 text-center">
          <p className="text-lg">Symbol not found: {symbol}</p>
          <button 
            onClick={() => navigate('/trade')}
            className="btn-primary mt-4"
          >
            Browse Markets
          </button>
        </div>
      </div>
    );
  }
  
  const isPositive = asset.change >= 0;
  
  const generateChartData = (asset: any) => {
    if (!asset) return [];
    
    const basePrice = asset.price;
    const data = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      
      const dayFactor = Math.sin(i / 5) * 0.1 + 0.95 + (Math.random() * 0.1);
      const price = basePrice * dayFactor;
      const volume = Math.round(asset.volume * (0.7 + Math.random() * 0.6));
      
      data.push({
        date: date.toISOString().split('T')[0],
        close: parseFloat(price.toFixed(2)),
        volume: volume
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData(asset);
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
      <button onClick={handleBack} className="flex items-center text-sm mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-semibold">{asset.name}</h1>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-secondary rounded-full">
                    {asset.symbol}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {asset.type === 'STOCK' ? asset.exchange : 'Cryptocurrency'}
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <div className="text-3xl font-semibold">
                  {asset.type === 'CRYPTO' && '₹'}
                  {asset.price.toLocaleString('en-IN', {
                    maximumFractionDigits: asset.price < 1 ? 6 : 2,
                  })}
                </div>
                <div className={`flex items-center ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span>
                    {isPositive ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Price Chart</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="advanced-chart"
                    checked={useAdvancedChart}
                    onCheckedChange={setUseAdvancedChart}
                  />
                  <Label htmlFor="advanced-chart">TradingView Chart</Label>
                </div>
              </div>
            </div>
            
            {useAdvancedChart ? (
              <TradingViewChart 
                symbol={asset.symbol} 
                type={asset.type} 
                height={400}
              />
            ) : (
              <DetailedChart 
                data={chartData} 
                height={400}
              />
            )}
          </div>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="info" className="flex items-center">
                <Info className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="financials" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" /> Financials
              </TabsTrigger>
              <TabsTrigger value="fundamentals" className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" /> Fundamentals
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" /> News
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">
                      {asset.volume.toLocaleString('en-IN')}
                    </p>
                  </CardContent>
                </Card>
                
                {asset.type === 'STOCK' ? (
                  <>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">52W Range</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          <span className="text-destructive">{asset.low52Week.toLocaleString('en-IN')}</span>
                          {' - '}
                          <span className="text-success">{asset.high52Week.toLocaleString('en-IN')}</span>
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">P/E Ratio</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">
                          {asset.pe.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">
                          ₹{(asset.marketCap / 10000000).toFixed(2)}Cr
                        </p>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">24h Range</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          <span className="text-destructive">{asset.low24h.toLocaleString('en-IN')}</span>
                          {' - '}
                          <span className="text-success">{asset.high24h.toLocaleString('en-IN')}</span>
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">
                          ₹{(asset.marketCap / 1000000000).toFixed(2)}B
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Circulating Supply</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xl font-bold">
                          {(asset.outstandingShares || 21000000).toLocaleString('en-IN')}
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Company Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sector</dt>
                        <dd className="font-medium">{asset.type === 'STOCK' ? asset.sector || 'Technology' : 'Cryptocurrency'}</dd>
                      </div>
                      {asset.type === 'STOCK' && (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Industry</dt>
                            <dd className="font-medium">{asset.industry || 'Software'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">CEO</dt>
                            <dd className="font-medium">{asset.ceo || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Employees</dt>
                            <dd className="font-medium">{asset.employees || '10,000+'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Founded</dt>
                            <dd className="font-medium">{asset.founded || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Headquarters</dt>
                            <dd className="font-medium">{asset.headquarters || 'N/A'}</dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Layers className="w-5 h-5 mr-2" />
                      {asset.type === 'STOCK' ? 'Stock Details' : 'Crypto Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      {asset.type === 'STOCK' ? (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Dividend Yield</dt>
                            <dd className="font-medium">{asset.dividendYield?.toFixed(2) || '0.00'}%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">EPS (TTM)</dt>
                            <dd className="font-medium">₹{asset.eps?.toFixed(2) || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">P/B Ratio</dt>
                            <dd className="font-medium">{asset.pb?.toFixed(2) || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Beta</dt>
                            <dd className="font-medium">{asset.beta?.toFixed(2) || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Outstanding Shares</dt>
                            <dd className="font-medium">{asset.outstandingShares?.toLocaleString('en-IN') || 'N/A'}</dd>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Algorithm</dt>
                            <dd className="font-medium">{asset.algorithm || 'SHA-256'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Max Supply</dt>
                            <dd className="font-medium">{asset.maxSupply?.toLocaleString('en-IN') || '21,000,000'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">All-Time High</dt>
                            <dd className="font-medium">₹{asset.ath?.toLocaleString('en-IN') || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">ATH Date</dt>
                            <dd className="font-medium">{asset.athDate || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Blockchain</dt>
                            <dd className="font-medium">{asset.blockchain || 'Own'}</dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financials">
              {asset.type === 'STOCK' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="w-5 h-5 mr-2" />
                        Quarterly Results
                      </CardTitle>
                      <CardDescription>Last 4 quarters financial performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quarter</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Net Profit</TableHead>
                            <TableHead>EPS</TableHead>
                            <TableHead>YoY Growth</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Q1 2023</TableCell>
                            <TableCell>₹10,550 Cr</TableCell>
                            <TableCell>₹2,120 Cr</TableCell>
                            <TableCell>₹15.75</TableCell>
                            <TableCell className="text-success">+12.5%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q4 2022</TableCell>
                            <TableCell>₹9,980 Cr</TableCell>
                            <TableCell>₹1,950 Cr</TableCell>
                            <TableCell>₹14.30</TableCell>
                            <TableCell className="text-success">+8.2%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q3 2022</TableCell>
                            <TableCell>₹9,350 Cr</TableCell>
                            <TableCell>₹1,820 Cr</TableCell>
                            <TableCell>₹13.45</TableCell>
                            <TableCell className="text-success">+5.1%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q2 2022</TableCell>
                            <TableCell>₹8,970 Cr</TableCell>
                            <TableCell>₹1,720 Cr</TableCell>
                            <TableCell>₹12.80</TableCell>
                            <TableCell className="text-destructive">-2.3%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Shareholding Pattern
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Promoters</dt>
                            <dd className="font-medium">45.2%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">FIIs</dt>
                            <dd className="font-medium">28.7%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">DIIs</dt>
                            <dd className="font-medium">15.3%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Public</dt>
                            <dd className="font-medium">10.8%</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          Upcoming Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Next Earnings</dt>
                            <dd className="font-medium">May 15, 2023</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Ex-Dividend Date</dt>
                            <dd className="font-medium">June 5, 2023</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">AGM Date</dt>
                            <dd className="font-medium">July 20, 2023</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Cryptocurrency Metrics</CardTitle>
                    <CardDescription>Key metrics for {asset.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Market Dominance</dt>
                          <dd className="font-medium">{asset.dominance || '42.5'}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Market Rank</dt>
                          <dd className="font-medium">#{asset.marketRank || '1'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Trading Volume (24h)</dt>
                          <dd className="font-medium">₹{(asset.volume/1000000).toFixed(2)}M</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Fully Diluted Valuation</dt>
                          <dd className="font-medium">₹{(asset.fdv || asset.marketCap * 1.2)/1000000000}B</dd>
                        </div>
                      </dl>
                      
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Genesis Date</dt>
                          <dd className="font-medium">{asset.genesisDate || 'Jan 3, 2009'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Hash Algorithm</dt>
                          <dd className="font-medium">{asset.algorithm || 'SHA-256'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Block Time</dt>
                          <dd className="font-medium">{asset.blockTime || '10 minutes'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Current Supply</dt>
                          <dd className="font-medium">{(asset.currentSupply || asset.outstandingShares || 19000000).toLocaleString('en-IN')}</dd>
                        </div>
                      </dl>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="fundamentals">
              {asset.type === 'STOCK' ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Ratios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">P/E</h4>
                          <p className="text-lg font-bold">{asset.pe?.toFixed(2) || '18.5'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">P/B</h4>
                          <p className="text-lg font-bold">{asset.pb?.toFixed(2) || '3.2'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">ROE</h4>
                          <p className="text-lg font-bold">{asset.roe?.toFixed(2) || '22.4'}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Debt to Equity</h4>
                          <p className="text-lg font-bold">{asset.debtToEquity?.toFixed(2) || '0.8'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Dividend Yield</h4>
                          <p className="text-lg font-bold">{asset.dividendYield?.toFixed(2) || '1.5'}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Dividend Payout</h4>
                          <p className="text-lg font-bold">{asset.dividendPayout?.toFixed(2) || '30.0'}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Current Ratio</h4>
                          <p className="text-lg font-bold">{asset.currentRatio?.toFixed(2) || '2.5'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">PEG Ratio</h4>
                          <p className="text-lg font-bold">{asset.pegRatio?.toFixed(2) || '1.2'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>On-Chain Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Active Addresses (24h)</h4>
                        <p className="text-lg font-bold">1.2M</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Transactions (24h)</h4>
                        <p className="text-lg font-bold">350K</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Average Transaction Value</h4>
                        <p className="text-lg font-bold">₹45,000</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Network Hash Rate</h4>
                        <p className="text-lg font-bold">135 EH/s</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Mining Difficulty</h4>
                        <p className="text-lg font-bold">35.61T</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Miner Revenue (24h)</h4>
                        <p className="text-lg font-bold">₹950.5M</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Realized Cap</h4>
                        <p className="text-lg font-bold">₹650B</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">MVRV Ratio</h4>
                        <p className="text-lg font-bold">2.1</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>Latest News</CardTitle>
                  <CardDescription>Recent news and updates about {asset.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold">Q1 Results: {asset.name} Reports Strong Growth</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        April 20, 2023 • 2 min read
                      </p>
                      <p className="text-sm">
                        {asset.name} reported better-than-expected first quarter results, with revenue up 15% year-over-year.
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold">{asset.name} Announces New Strategic Partnership</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        March 15, 2023 • 3 min read
                      </p>
                      <p className="text-sm">
                        The company has formed a strategic alliance with a major industry player to expand its market presence.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Analysts Upgrade {asset.name} Stock: What You Need to Know</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        February 28, 2023 • 4 min read
                      </p>
                      <p className="text-sm">
                        Several analysts have raised their price targets for {asset.name} following positive industry trends.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Data Settings
            </h2>
            
            <DataSourceSelector />
          </div>
          
          <TradingForm asset={asset} />
          
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Watchlist
            </h2>
            <WatchlistManager />
          </div>
        </div>
      </div>
    </div>
  );
};
