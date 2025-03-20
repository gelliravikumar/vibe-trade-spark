
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Loader } from '@/components/common/Loader';

interface DetailedChartProps {
  symbol: string;
  type: 'STOCK' | 'CRYPTO';
  className?: string;
}

// Generate dummy chart data
const generateChartData = (
  symbol: string, 
  days = 30, 
  startPrice = 100, 
  volatility = 0.02,
  volume = 1000000
) => {
  let price = startPrice;
  const now = new Date();
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - i - 1));
    
    // Generate random price change
    const change = (Math.random() - 0.5) * volatility;
    price = price * (1 + change);
    
    // Calculate other values
    const open = price * (1 - Math.random() * 0.01);
    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);
    const close = price;
    
    // Random volume
    const dailyVolume = volume * (0.5 + Math.random());
    
    return {
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: dailyVolume,
      rsi: 30 + Math.random() * 40, // Random RSI between 30-70
      macd: (Math.random() - 0.5) * 5, // Random MACD
      signal: (Math.random() - 0.5) * 3, // Random signal line
    };
  });
};

export const DetailedChart: React.FC<DetailedChartProps> = ({ 
  symbol, 
  type, 
  className = '' 
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [indicators, setIndicators] = useState<{
    volume: boolean;
    rsi: boolean;
    macd: boolean;
  }>({
    volume: true,
    rsi: false,
    macd: false,
  });

  useEffect(() => {
    setLoading(true);
    
    // Simulate API fetch
    setTimeout(() => {
      const days = 
        timeframe === '1D' ? 1 : 
        timeframe === '1W' ? 7 : 
        timeframe === '1M' ? 30 : 
        timeframe === '3M' ? 90 : 
        365;
      
      const startPrice = type === 'CRYPTO' ? 
        (symbol.includes('BTC') ? 60000 : 3000) : 
        500;
      
      setData(generateChartData(symbol, days, startPrice));
      setLoading(false);
    }, 800);
  }, [symbol, type, timeframe]);

  const toggleIndicator = (indicator: keyof typeof indicators) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
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
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((option) => (
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
        
        <div className="flex space-x-2">
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
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
