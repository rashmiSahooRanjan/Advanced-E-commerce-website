import React from "react";

import { useSelector } from "react-redux";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { Trophy } from "lucide-react";

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  const products = topSellingProducts?.slice(0, 5) || [];

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <foreignObject x={x - 40} y={y - 16} width={32} height={32}>
        <img
          src={payload.value}
          alt="product"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            objectFit: "cover",
            border: "1px solid #e4e4e7",
          }}
        />
      </foreignObject>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const product = payload[0].payload;

      return (
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-lg text-sm">
          <p className="font-semibold text-zinc-900">{product.name}</p>

          <p className="text-zinc-500 mt-1">
            Sold:
            <span className="font-medium text-zinc-900 ml-1">
              {product.total_sold}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            Top Selling Products
          </h3>

          <p className="text-sm text-zinc-500 mt-1">
            Best performing products by sales
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* chart */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={products}
            margin={{
              top: 0,
              right: 20,
              bottom: 0,
              left: 10,
            }}
            barSize={36}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: "#71717a",
              }}
            />

            <YAxis
              dataKey="image"
              type="category"
              tick={<CustomYAxisTick />}
              tickLine={false}
              axisLine={false}
              width={55}
            />

            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{
                pointerEvents: "auto",
              }}
            />

            <Bar dataKey="total_sold" radius={[10, 10, 10, 10]}>
              {products.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;
