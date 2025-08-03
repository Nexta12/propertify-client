
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = ({ title, data, XdataKey, BarKey1, BarKey2, fill1, fill2 }) => {
  const currentYear = new Date().getFullYear(); // Get the current year
  const startYear = 2025; // Starting year
  const years = Array.from(
    { length: currentYear - startYear },
    (_, i) => startYear + i
  );

  const [year, setYear] = useState(startYear);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
      <h3 className="text-gray-700 text-sm sm:text-base font-medium mb-3 sm:mb-4">
        {title}
      </h3>

      <div className=" flex items-center">
        <h1 className="font-primary text-accent">Year: {year}</h1>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      </div>
      <div className="h-64 sm:h-80">  {/* Increased height */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={XdataKey } />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={BarKey1} fill={fill1} />
            <Bar dataKey={BarKey2} fill={fill2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
