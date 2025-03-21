
import React from 'react';
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

interface DetailedChartProps {
  data: any[];
  height?: number;
  width?: string | number;
}

const DetailedChart: React.FC<DetailedChartProps> = ({
  data,
  height = 400,
  width = '100%',
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
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
  );
};

export default DetailedChart;
