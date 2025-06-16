import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, ScatterChart, Scatter, Rectangle } from 'recharts';

interface DataPoint {
  month: number;
  day: number;
  value: number;
}

const generateData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  for (let month = 0; month < 12; month++) {
    for (let day = 0; day < 7; day++) {
      data.push({
        month,
        day,
        value: Math.floor(Math.random() * 5),  // Random value 0-4 for demonstration
      });
    }
  }
  return data;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Date: ${data.month + 1}/${data.day + 1}`}</p>
        <p>{`Value: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

const ActivityHeatmap: React.FC = () => {
  const data = generateData();

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <XAxis 
            dataKey="month" 
            type="number" 
            domain={[0, 11]} 
            tickFormatter={(value) => value + 1}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            dataKey="day" 
            type="number" 
            domain={[0, 6]} 
            reversed={true}
            tickFormatter={(value) => value + 1}
            ticks={[0, 1, 2, 3, 4, 5, 6]}
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data}>
            {data.map((entry, index) => (
              <Rectangle
                key={`cell-${index}`}
                width={10}
                height={10}
                x={entry.month * 12}
                y={entry.day * 12}
                fill={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'][entry.value]}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityHeatmap;
