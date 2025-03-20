
import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  CandlestickChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  Brush,
  Scatter,
  Candlestick
} from 'recharts';
import { Loader } from '@/components/common/Loader';
import { Settings2 } from 'lucide-react';
import { fetchChartData, TimeFrame } from '@/data/api';
import { useData } from '@/context/DataContext';

interface DetailedChartProps {
  symbol: string;
  type: 'STOCK' | 'CRYPTO';
  className?: string;
}

interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  macd?: number;
  signal?: number;
}

export const DetailedChart: React.FC<DetailedChartProps> = ({ 
  symbol, 
  type, 
  className = '' 
}) => {
  const { apiProvider } = useData();
  const [data, setData] = useState<ChartData[]>([]);
  const [originalData, setOriginalData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle');
  const [indicators, setIndicators] = useState<{
    volume: boolean;
    rsi: boolean;
    macd: boolean;
    levelTwo: boolean;
  }>({
    volume: true,
    rsi: false,
    macd: false,
    levelTwo: false,
  });

  // For zooming functionality
  const [zoomArea, setZoomArea] = useState<{
    startIndex: number | null;
    endIndex: number | null;
  }>({ startIndex: null, endIndex: null });
  
  const [isZooming, setIsZooming] = useState(false);

  // Generate Level 2 market data (bids and asks)
  const generateLevel2Data = (currentPrice: number) => {
    const bidCount = 10;
    const askCount = 10;
    const bidPriceStep = 0.05; // 0.05% step
    const askPriceStep = 0.05;
    
    const bids = Array.from({ length: bidCount }, (_, i) => ({
      price: currentPrice * (1 - (i + 1) * bidPriceStep / 100),
      volume: Math.floor(1000 + Math.random() * 10000),
    }));
    
    const asks = Array.from({ length: askCount }, (_, i) => ({
      price: currentPrice * (1 + (i + 1) * askPriceStep / 100),
      volume: Math.floor(1000 + Math.random() * 10000),
    }));
    
    return { bids, asks };
  };

  const [level2Data, setLevel2Data] = useState<{
    bids: { price: number; volume: number }[];
    asks: { price: number; volume: number }[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Fetch chart data
    fetchChartData(symbol, timeframe, apiProvider)
      .then(chartData => {
        // Add technical indicators
        const enrichedData = chartData.map((point: ChartData, index: number, arr: ChartData[]) => {
          // Calculate basic RSI
          const rsi = index > 13 ? 
            30 + Math.random() * 40 : // Simplified random RSI
            50; // Default
          
          // Calculate basic MACD
          const macd = index > 25 ? 
            (Math.random() - 0.5) * 5 : // Simplified random MACD
            0; // Default
          
          // Calculate signal line
          const signal = index > 25 ? 
            macd + (Math.random() - 0.5) * 2 : // Simplified signal
            0; // Default
          
          return {
            ...point,
            rsi,
            macd,
            signal
          };
        });
        
        setOriginalData(enrichedData);
        setData(enrichedData);
        
        // Generate level 2 data based on the latest price
        if (chartData.length > 0) {
          const latestPrice = chartData[chartData.length - 1].close;
          setLevel2Data(generateLevel2Data(latestPrice));
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      });
  }, [symbol, type, timeframe, apiProvider]);

  const toggleIndicator = (indicator: keyof typeof indicators) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const handleZoom = () => {
    if (zoomArea.startIndex !== null && zoomArea.endIndex !== null) {
      // Ensure startIndex is less than endIndex
      const start = Math.min(zoomArea.startIndex, zoomArea.endIndex);
      const end = Math.max(zoomArea.startIndex, zoomArea.endIndex);
      
      if (start !== end) {
        setData(originalData.slice(start, end + 1));
      }
      
      // Reset zoom area
      setZoomArea({ startIndex: null, endIndex: null });
    }
  };

  const handleResetZoom = () => {
    setData(originalData);
    setZoomArea({ startIndex: null, endIndex: null });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZooming) return;
    
    const chart = e.currentTarget as HTMLElement;
    const rect = chart.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate index based on mouse position
    const index = Math.floor((x / width) * data.length);
    setZoomArea({ startIndex: index, endIndex: null });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZooming || zoomArea.startIndex === null) return;
    
    const chart = e.currentTarget as HTMLElement;
    const rect = chart.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate index based on mouse position
    const index = Math.floor((x / width) * data.length);
    if (index >= 0 && index < data.length) {
      setZoomArea(prev => ({ ...prev, endIndex: index }));
    }
  };

  const handleMouseUp = () => {
    if (isZooming && zoomArea.startIndex !== null && zoomArea.endIndex !== null) {
      handleZoom();
      setIsZooming(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-[400px] ${className}`}>
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {(['1D', '1W', '1M', '3M', '1Y'] as TimeFrame[]).map((option) => (
            <button
              key={option}
              className={`px-3 py-1 text-xs rounded-full ${
                timeframe === option
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setTimeframe(option)}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                chartType === 'line'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                chartType === 'candle'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setChartType('candle')}
            >
              Candle
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                indicators.volume
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => toggleIndicator('volume')}
            >
              Volume
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                indicators.rsi
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => toggleIndicator('rsi')}
            >
              RSI
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                indicators.macd
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => toggleIndicator('macd')}
            >
              MACD
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                indicators.levelTwo
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => toggleIndicator('levelTwo')}
            >
              Level 2
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full flex items-center ${
                isZooming
                  ? 'bg-success text-success-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setIsZooming(!isZooming)}
            >
              <Settings2 className="w-3 h-3 mr-1" />
              Zoom
            </button>
            {data.length !== originalData.length && (
              <button
                className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                onClick={handleResetZoom}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className="h-[400px] w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {chartType === 'candle' ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                stroke="var(--muted-foreground)"
              />
              <YAxis 
                yAxisId="price" 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="var(--muted-foreground)"
              />
              
              {indicators.volume && (
                <YAxis 
                  yAxisId="volume" 
                  orientation="right" 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="var(--muted-foreground)"
                />
              )}
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--card-foreground)'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
              />
              <Legend />
              
              <Candlestick
                yAxisId="price"
                name="Price"
                dataKey="price"
                fill="var(--background)"
                stroke="var(--foreground)"
                highDataKey="high"
                lowDataKey="low"
                openDataKey="open"
                closeDataKey="close"
                width={8}
                upFill="var(--success)"
                upStroke="var(--success)"
                downFill="var(--destructive)"
                downStroke="var(--destructive)"
              />
              
              {indicators.volume && (
                <Bar 
                  dataKey="volume" 
                  yAxisId="volume" 
                  fill="var(--accent)" 
                  opacity={0.5} 
                  name="Volume" 
                />
              )}
              
              {/* Reference area for zoom */}
              {isZooming && zoomArea.startIndex !== null && zoomArea.endIndex !== null && (
                <ReferenceArea
                  yAxisId="price"
                  x1={data[Math.min(zoomArea.startIndex, zoomArea.endIndex)]?.date}
                  x2={data[Math.max(zoomArea.startIndex, zoomArea.endIndex)]?.date}
                  strokeOpacity={0.3}
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
              )}
              
              <Brush
                dataKey="date"
                height={30}
                stroke="var(--primary)"
                fill="var(--background)"
                tickFormatter={() => ''}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                stroke="var(--muted-foreground)"
              />
              <YAxis 
                yAxisId="price" 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="var(--muted-foreground)"
              />
              {indicators.volume && (
                <YAxis 
                  yAxisId="volume" 
                  orientation="right" 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
              )}
              {indicators.rsi && (
                <YAxis 
                  yAxisId="rsi" 
                  orientation="right" 
                  domain={[0, 100]}
                  hide
                />
              )}
              {indicators.macd && (
                <YAxis 
                  yAxisId="macd" 
                  orientation="right"
                  hide
                />
              )}
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--card-foreground)'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="close"
                name="Price"
                fill="url(#colorPrice)"
                stroke="var(--primary)"
                yAxisId="price"
                strokeWidth={2}
              />
              {indicators.volume && (
                <Bar 
                  dataKey="volume" 
                  name="Volume" 
                  fill="var(--accent)" 
                  yAxisId="volume"
                  opacity={0.5}
                />
              )}
              {indicators.rsi && (
                <Line
                  type="monotone"
                  dataKey="rsi"
                  name="RSI"
                  stroke="var(--destructive)"
                  yAxisId="rsi"
                  dot={false}
                  strokeWidth={1.5}
                />
              )}
              {indicators.macd && (
                <>
                  <Line
                    type="monotone"
                    dataKey="macd"
                    name="MACD"
                    stroke="var(--success)"
                    yAxisId="macd"
                    dot={false}
                    strokeWidth={1.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="signal"
                    name="Signal"
                    stroke="var(--warning)"
                    yAxisId="macd"
                    dot={false}
                    strokeWidth={1.5}
                  />
                </>
              )}
              
              {/* Reference area for zoom */}
              {isZooming && zoomArea.startIndex !== null && zoomArea.endIndex !== null && (
                <ReferenceArea
                  yAxisId="price"
                  x1={data[Math.min(zoomArea.startIndex, zoomArea.endIndex)]?.date}
                  x2={data[Math.max(zoomArea.startIndex, zoomArea.endIndex)]?.date}
                  strokeOpacity={0.3}
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
              )}
              
              <Brush
                dataKey="date"
                height={30}
                stroke="var(--primary)"
                fill="var(--background)"
                tickFormatter={() => ''}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Level 2 Market Data */}
      {indicators.levelTwo && level2Data && (
        <div className="glass-card rounded-lg p-4 mt-4">
          <h3 className="text-sm font-semibold mb-2">Level 2 Market Data</h3>
          
          <div className="flex">
            <div className="w-1/2 pr-2">
              <div className="flex justify-between font-semibold text-xs mb-1">
                <span className="text-success">Bid Price</span>
                <span>Volume</span>
              </div>
              {level2Data.bids.map((bid, index) => (
                <div key={`bid-${index}`} className="flex justify-between text-xs py-0.5">
                  <span className="text-success">{bid.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  <span>{bid.volume.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            
            <div className="w-1/2 pl-2 border-l border-border">
              <div className="flex justify-between font-semibold text-xs mb-1">
                <span className="text-destructive">Ask Price</span>
                <span>Volume</span>
              </div>
              {level2Data.asks.map((ask, index) => (
                <div key={`ask-${index}`} className="flex justify-between text-xs py-0.5">
                  <span className="text-destructive">{ask.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  <span>{ask.volume.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
