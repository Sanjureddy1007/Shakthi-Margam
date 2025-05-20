import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface BusinessMetricsChartProps {
  data: any;
  type: 'line' | 'bar' | 'pie';
  title: string;
  xAxisKey?: string;
  yAxisKey?: string;
  dataKey?: string | string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  className?: string;
}

const defaultColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe',
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const BusinessMetricsChart: React.FC<BusinessMetricsChartProps> = ({
  data,
  type,
  title,
  xAxisKey = 'name',
  yAxisKey,
  dataKey = 'value',
  colors = defaultColors,
  height = 300,
  showLegend = true,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {Array.isArray(dataKey) ? (
                dataKey.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={colors[0]}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {Array.isArray(dataKey) ? (
                dataKey.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                  />
                ))
              ) : (
                <Bar dataKey={dataKey} fill={colors[0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={Array.isArray(dataKey) ? dataKey[0] : dataKey}
                nameKey={xAxisKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                onMouseEnter={handlePieEnter}
              >
                {data.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke={activeIndex === index ? '#fff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default BusinessMetricsChart;
