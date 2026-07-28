import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  PackageCheck,
  Truck,
  XCircle,
  Clock3,
  IndianRupee,
  ShoppingBag,
  LoaderCircle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";

import { fetchAllOrders, updateOrderStatus } from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.order);

  const [filterByStatus, setFilterByStatus] = useState("All");

  const [search, setSearch] = useState("");

  const STATUS_OPTIONS = ["Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (filterByStatus !== "All") {
      filtered = filtered.filter(
        (order) => order.order_status === filterByStatus,
      );
    }

    if (search.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.buyer?.name?.toLowerCase().includes(search.toLowerCase()) ||
          order.buyer?.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [orders, filterByStatus, search]);

  const handleStatusChange = (orderId, status) => {
    dispatch(
      updateOrderStatus({
        id: orderId,
        status,
      }),
    );
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock3 className="w-4 h-4" />;

      case "Shipped":
        return <Truck className="w-4 h-4" />;

      case "Delivered":
        return <PackageCheck className="w-4 h-4" />;

      case "Cancelled":
        return <XCircle className="w-4 h-4" />;

      default:
        return null;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <main className="flex-1 min-h-screen bg-zinc-50">
        <Header />

        <div className="p-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl bg-zinc-200 animate-pulse"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen bg-zinc-50">
      <div className="p-4 md:p-5 space-y-5">
        {/* top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Orders
            </h1>

            <p className="text-zinc-500 mt-1">
              Manage transactional workflows and customer purchases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-11 px-4 rounded-xl bg-white border border-zinc-200 flex items-center gap-2 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-orange-500" />

              <span className="text-sm font-semibold text-zinc-800">
                {filteredOrders.length} Orders
              </span>
            </div>
          </div>
        </div>

        {/* filters */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* search */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 text-sm"
            />
          </div>

          {/* filter */}
          <select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 text-sm"
          >
            <option value="All">All Orders</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              {/* icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-200 blur-2xl opacity-40 rounded-full" />

                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200 flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-11 h-11 text-orange-500" />
                </div>
              </div>

              {/* content */}
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                No Orders Found
              </h2>

              <p className="max-w-md text-zinc-500 mt-3 leading-relaxed">
                No transactional records match the current search criteria or
                status filters. Try adjusting the filters or wait for new
                customer purchases.
              </p>

              {/* stats */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <div className="px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-sm font-medium text-zinc-700">
                  Total Orders: {orders.length}
                </div>

                <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-sm font-medium text-orange-700">
                  Active Filter: {filterByStatus}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* header */}
                <div className="p-5 border-b border-zinc-100">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                    {/* left */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                          Order #{order.id.slice(0, 8)}
                        </h2>

                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusStyles(order.order_status)}`}
                        >
                          {getStatusIcon(order.order_status)}

                          {order.order_status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                        <div>
                          <p className="text-zinc-500">Customer</p>

                          <p className="font-medium text-zinc-900 mt-1">
                            {order.buyer?.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-zinc-500">Email</p>

                          <p className="font-medium text-zinc-900 mt-1">
                            {order.buyer?.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-zinc-500">Placed At</p>

                          <p className="font-medium text-zinc-900 mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* right */}
                    <div className="flex flex-col items-start xl:items-end gap-4">
                      <div>
                        <p className="text-sm text-zinc-500 text-left xl:text-right">
                          Total Amount
                        </p>

                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-5 h-5 text-zinc-800" />

                          <h3 className="text-3xl font-bold tracking-tight text-zinc-900">
                            {Number(order.total_price).toLocaleString()}
                          </h3>
                        </div>
                      </div>

                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        disabled={loading}
                        className="h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 text-sm disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* items */}
                <div className="p-5 bg-zinc-50 border-b border-zinc-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-zinc-900">Order Items</h3>

                    <p className="text-sm text-zinc-500">
                      {order.order_items?.length} items
                    </p>
                  </div>

                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-zinc-200 p-3 flex items-center gap-4"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-zinc-900 truncate">
                            {item.title}
                          </h4>

                          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                            <p>Qty: {item.quantity}</p>

                            <p>₹{item.price}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-zinc-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* shipping */}
                <div className="p-5">
                  <h3 className="font-semibold text-zinc-900 mb-4">
                    Shipping Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 text-sm">
                    <div>
                      <p className="text-zinc-500">Full Name</p>

                      <p className="font-medium text-zinc-900 mt-1">
                        {order.shipping_info?.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Phone</p>

                      <p className="font-medium text-zinc-900 mt-1">
                        {order.shipping_info?.phone}
                      </p>
                    </div>

                    <div className="xl:col-span-2">
                      <p className="text-zinc-500">Address</p>

                      <p className="font-medium text-zinc-900 mt-1 leading-relaxed">
                        {order.shipping_info?.address},{" "}
                        {order.shipping_info?.city},{" "}
                        {order.shipping_info?.state},{" "}
                        {order.shipping_info?.country} -{" "}
                        {order.shipping_info?.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default Orders;
