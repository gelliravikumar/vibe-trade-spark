
import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

export interface DetailedChartProps {
  data?: Array<{
    date: string;
    close: number;
    volume: number;
    [key: string]: any;
  }>;
  height?: number;
  width?: string | number;
  symbol?: string;
  timeFrame?: string;
  showControls?: boolean;
  fullWidth?: boolean;
}

const DetailedChart: React.FC<DetailedChartProps> = ({
  data: providedData,
  height = 400,
  width = '100%',
  symbol = 'NIFTY',
  timeFrame = '1D',
  showControls = false,
  fullWidth = false,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { stocksData, cryptoData } = useData();
  
  // Use provided data or generate dummy data based on symbol
  const data = providedData || 
    (symbol ? Array.from({ length: 20 }, (_, i) => ({
      date: `${i + 1}/10`,
      close: Math.random() * 1000 + 500,
      volume: Math.random() * 5000 + 1000,
    })) : []);
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  return (
    <div className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {isFullScreen && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detailed Price Chart - {symbol}</h2>
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            className="absolute top-2 right-2 z-10"
          >
            <Minimize2 className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="relative">
        {!isFullScreen && showControls && (
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            className="absolute top-2 right-2 z-10"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        )}
        
        <ResponsiveContainer 
          width={isFullScreen ? '100%' : width} 
          height={isFullScreen ? 'calc(100vh - 100px)' : height}
        >
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="volume"
              fill="#8884d8"
              stroke="#8884d8"
              opacity={0.3}
            />
            <Bar
              yAxisId="left"
              dataKey="volume"
              fill="#8884d8"
              opacity={0.6}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="close"
              stroke="#ff7300"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DetailedChart;
