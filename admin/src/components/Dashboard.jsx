import React from "react";
import Header from "./Header";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import MiniSummary from "./dashboard-components/MiniSummary";

const Dashboard = () => {
  return (
    <main className="flex-1 min-h-screen bg-zinc-50">
      {/* content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* top heading */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              Dashboard Overview
            </h1>

            <p className="text-sm text-zinc-500 mt-1">
              Monitor platform analytics, sales performance, and operational
              insights.
            </p>
          </div>

          {/* status */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 text-sm font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System operational
          </div>
        </div>

        {/* stats */}
        <Stats />

        {/* charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MonthlySalesChart />
          </div>

          <div>
            <OrdersChart />
          </div>
        </div>

        {/* lower charts */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
          <div>
            <TopProductsChart />
          </div>
          <div>
            <TopSellingProducts />
          </div>
        </div>

        {/* products table */}
        <MiniSummary />
        
      </div>
    </main>
  );
};

export default Dashboard;
