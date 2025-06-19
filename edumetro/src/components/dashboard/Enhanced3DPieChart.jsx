// --- START OF FILE components/dashboard/Enhanced3DPieChart.jsx ---
// This component now uses the 'recharts' library to create the pie chart.

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { SparklesIcon } from "./DashboardIcons";

// Custom Tooltip to match the design in the image
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-xl">
        <p className="font-semibold text-gray-800">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Label renderer to place labels outside the pie chart
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, payload }) => {
  const radius = outerRadius + 30; // Distance of the label from the pie chart
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={payload.color}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-bold"
    >
      {`${payload.name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const RechartsPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-80 text-gray-500">
        <SparklesIcon size={64} className="mb-4 text-gray-300" />
        <motion.p
          className="text-lg font-medium text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Upload notes to see your magical distribution
        </motion.p>
      </div>
    );
  }

  return (
    // ResponsiveContainer makes the chart fit its parent container
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90} // Adjust size of the pie
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsPieChart;
// --- END OF FILE components/dashboard/Enhanced3DPieChart.jsx ---