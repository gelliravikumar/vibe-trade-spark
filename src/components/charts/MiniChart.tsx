
import React, { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data?: { price: number }[];
  color?: string;
  height?: number;
  isPositive?: boolean;
}

// Generate random price history if none provided
const generateRandomData = (points = 20, initialPrice = 100, volatility = 0.02) => {
  let price = initialPrice;
  return Array.from({ length: points }, () => {
    price = price * (1 + (Math.random() - 0.5) * volatility);
    return { price };
  });
};

export const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  color = 'currentColor',
  height = 40,
  isPositive = true
}) => {
  const [chartData, setChartData] = useState<{ price: number }[]>([]);
  const chartColor = isPositive ? 'var(--success)' : 'var(--destructive)';
  
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData(generateRandomData());
    }
  }, [data]);

  return (
    <div className="w-full h-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorPrice-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={chartColor} 
            fill={`url(#colorPrice-${isPositive ? 'up' : 'down'})`}
            strokeWidth={1.5}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
