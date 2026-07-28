import React, { useEffect, useState } from "react";

import {
  DollarSign,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { useSelector } from "react-redux";

import { formatNumber } from "../../lib/helper";

const Stats = () => {
  const {
    totalUsersCount,
    todayRevenue,
    yesterdayRevenue,
    totalRevenueAllTime,
  } = useSelector((state) => state.admin);

  const [revenueChange, setRevenueChange] = useState({
    value: "0%",
    positive: true,
  });

  useEffect(() => {
    const change =
      yesterdayRevenue === 0
        ? 100
        : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    setRevenueChange({
      value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
      positive: change >= 0,
    });
  }, [todayRevenue, yesterdayRevenue]);

  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${formatNumber(todayRevenue || 0)}`,
      change: revenueChange.value,
      positive: revenueChange.positive,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-100",
      accent: "border-emerald-100",
    },

    {
      title: "All Time Revenue",
      value: `₹${formatNumber(totalRevenueAllTime || 0)}`,
      change: null,
      icon: <Wallet className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100",
      accent: "border-purple-100",
    },

    {
      title: "Total Users",
      value: formatNumber(totalUsersCount || 0),
      change: null,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      accent: "border-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white border ${stat.accent} rounded-xl p-5 shadow-sm`}
        >
          {/* top */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.title}</p>

              <h2 className="text-2xl font-bold text-zinc-900 mt-3">
                {stat.value}
              </h2>
            </div>

            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
            >
              {stat.icon}
            </div>
          </div>

          {/* change */}
          {stat.change && (
            <div
              className={`
                mt-5
                inline-flex items-center gap-2
                px-3 py-1.5
                rounded-lg
                text-sm font-medium
                ${
                  stat.positive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }
              `}
            >
              {stat.positive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}

              <span>{stat.change} from yesterday</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stats;
