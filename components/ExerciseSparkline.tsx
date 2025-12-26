
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const mockData = [
  { val: 60 }, { val: 62.5 }, { val: 62.5 }, { val: 65 }, { val: 67.5 }, { val: 65 }, { val: 70 }
];

const ExerciseSparkline: React.FC<{ color?: string }> = ({ color = "#3b82f6" }) => {
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
          />
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExerciseSparkline;
