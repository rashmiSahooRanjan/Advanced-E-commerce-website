import React from "react";

import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
} from "lucide-react";

import { useSelector } from "react-redux";

import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    topSellingProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
    currentMonthSales,
    orderStatusCounts,
  } = useSelector((state) => state.admin);

  const totalOrders = Object.values(orderStatusCounts || {}).reduce(
    (acc, count) => acc + count,
    0,
  );

  const summary = [
    {
      title: "Monthly Sales",
      description: `Revenue generated this month`,
      value: `₹${formatNumber(currentMonthSales || 0)}`,
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-100",
      border: "border-emerald-100",
    },

    {
      title: "Orders Placed",
      description: `${totalOrders} total orders processed`,
      value: totalOrders,
      icon: <PackageCheck className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100",
      border: "border-blue-100",
    },

    {
      title: "Top Product",
      description: topSellingProducts?.[0]
        ? `${topSellingProducts[0]?.name}`
        : "No sales available",
      value: topSellingProducts?.[0]?.total_sold || 0,
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
      border: "border-purple-100",
    },

    {
      title: "Low Stock Alerts",
      description: "Products running low on stock",
      value: lowStockProducts || 0,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-100",
      border: "border-amber-100",
    },

    {
      title: "Revenue Growth",
      description: "Compared to previous month",
      value: revenueGrowth || "0%",
      icon: <BarChart4 className="w-5 h-5 text-cyan-600" />,
      bg: "bg-cyan-100",
      border: "border-cyan-100",
    },

    {
      title: "New Customers",
      description: "Users joined this month",
      value: newUsersThisMonth || 0,
      icon: <UserPlus className="w-5 h-5 text-rose-600" />,
      bg: "bg-rose-100",
      border: "border-rose-100",
    },
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      {/* header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">Monthly Summary</h2>

        <p className="text-sm text-zinc-500 mt-1">
          Quick overview of operational metrics
        </p>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {summary.map((item, index) => (
          <div
            key={index}
            className={`border ${item.border} rounded-xl p-4 hover:shadow-sm transition-all`}
          >
            {/* top */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  {item.title}
                </p>

                <h3 className="text-xl font-bold text-zinc-900 mt-2">
                  {item.value}
                </h3>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                {item.icon}
              </div>
            </div>

            {/* bottom */}
            <p className="text-sm text-zinc-500 mt-4 line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniSummary;
