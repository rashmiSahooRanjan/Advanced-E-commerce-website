import React from "react";
import { useSelector } from "react-redux";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { PackageCheck } from "lucide-react";

const OrdersChart = () => {
  const { orderStatusCounts } = useSelector((state) => state.admin);

  const statusColors = {
    Processing: "#f59e0b",
    Shipped: "#3b82f6",
    Delivered: "#22c55e",
    Cancelled: "#ef4444",
  };

  const orderStatusData = Object.keys(orderStatusCounts || {}).map(
    (status) => ({
      status,
      count: Number(orderStatusCounts[status]),
    }),
  );

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Order Status</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Distribution of customer orders
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
          <PackageCheck className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {/* chart */}
      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.status] || "#d4d4d8"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {orderStatusData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: statusColors[item.status],
                }}
              />
              <span className="text-sm text-zinc-700">{item.status}</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersChart;