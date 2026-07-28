import React from "react";

import { useSelector } from "react-redux";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { TrendingUp } from "lucide-react";

import { getLastNMonths } from "../../lib/helper";

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.admin);

  const months = getLastNMonths(4).map((m) => m.month);

  const filled = months.map((month) => {
    const found = monthlySales?.find((item) => item.month === month);

    return {
      month,
      totalSales: found?.totalSales || 0,
    };
  });

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Monthly Sales</h3>

          <p className="text-sm text-zinc-500 mt-1">
            Revenue trend over recent months
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* chart */}
      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filled}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: "#71717a",
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: "#71717a",
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                fontSize: "13px",
              }}
            />

            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "#ffffff",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;