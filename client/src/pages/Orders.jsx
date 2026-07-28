import React, { useEffect, useState } from "react";
import {
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock3,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);

  const { myOrders, fetchingOrders } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    if (!authUser) {
      navigate("/products");
      return;
    }

    dispatch(fetchMyOrders());
  }, [dispatch, authUser, navigate]);

  const filteredOrders = myOrders.filter(
    (order) =>
      statusFilter === "All" ||
      order.order_status === statusFilter,
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return (
          <Clock3 className="w-3.5 h-3.5 text-yellow-400" />
        );

      case "Shipped":
        return (
          <Truck className="w-3.5 h-3.5 text-blue-400" />
        );

      case "Delivered":
        return (
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        );

      case "Cancelled":
        return (
          <XCircle className="w-3.5 h-3.5 text-red-400" />
        );

      default:
        return (
          <Package className="w-3.5 h-3.5 text-yellow-400" />
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "Shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "Delivered":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-secondary text-foreground border-border";
    }
  };

  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!authUser) {
    return null;
  }

  if (fetchingOrders) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border border-border" />

            <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>

          <p className="text-sm text-muted-foreground tracking-wide">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 pb-14">
        {/* top */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/40 text-xs text-muted-foreground mb-4">
              <ShoppingBag className="w-3.5 h-3.5" />
              Order History
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              Your Orders
            </h1>

            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Track shipments, monitor order status,
              and manage your purchases.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="min-w-[130px] rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Total Orders
              </p>

              <h3 className="text-2xl font-bold text-foreground">
                {myOrders.length}
              </h3>
            </div>

            <div className="min-w-[130px] rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Delivered
              </p>

              <h3 className="text-2xl font-bold text-green-400">
                {
                  myOrders.filter(
                    (o) =>
                      o.order_status ===
                      "Delivered",
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

        {/* filters */}

        <div className="rounded-2xl border border-border bg-background p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Filter className="w-4 h-4 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Filter Orders
                </h3>

                <p className="text-xs text-muted-foreground">
                  Browse by status
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusArray.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`h-9 px-4 rounded-xl border text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-background hover:bg-secondary text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* empty */}

        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-border bg-background py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-7">
              <Package className="w-9 h-9 text-primary" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              No Orders Found
            </h2>

            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
              {statusFilter === "All"
                ? "You haven't placed any orders yet."
                : `No "${statusFilter}" orders found.`}
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-background overflow-hidden"
              >
                {/* header */}

                <div className="border-b border-border px-6 py-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.order_status)}`}
                        >
                          {getStatusIcon(
                            order.order_status,
                          )}

                          {order.order_status}
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
                          <CreditCard className="w-3 h-3" />
                          {order.paid_at
                            ? "Paid"
                            : "Pending"}
                        </div>
                      </div>

                      <h2 className="text-lg font-bold text-foreground mb-1 break-all">
                        Order #{order.id}
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Placed on{" "}
                        {new Date(
                          order.created_at,
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Amount
                      </p>

                      <h3 className="text-3xl font-bold text-foreground">
                        ₹
                        {Number(
                          order.total_price,
                        ).toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* products */}

                <div className="px-6 py-5">
                  <div className="space-y-4">
                    {order?.order_items?.map(
                      (item) => (
                        <div
                          key={item.product_id}
                          className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-border p-4 hover:bg-secondary/30 transition-all"
                        >
                          {/* image */}

                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                            <img
                              src={
                                item.image ||
                                "https://www.momento.se/static/files/0/ecommerce-default-product.png"
                              }
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* content */}

                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-foreground mb-2">
                              {item.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <p>
                                Qty:{" "}
                                <span className="text-foreground font-medium">
                                  {
                                    item.quantity
                                  }
                                </span>
                              </p>

                              <p>
                                Price:{" "}
                                <span className="text-foreground font-medium">
                                  ₹
                                  {Number(
                                    item.price,
                                  ).toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* total */}

                          <div className="md:text-right">
                            <p className="text-xs text-muted-foreground mb-1">
                              Total
                            </p>

                            <h4 className="text-lg font-semibold text-foreground">
                              ₹
                              {(
                                item.price *
                                item.quantity
                              ).toLocaleString()}
                            </h4>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* actions */}

                  {/* <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                    <button className="h-10 px-4 rounded-xl border border-border bg-background hover:bg-secondary transition-all text-sm font-medium">
                      View Details
                    </button>

                    <button className="h-10 px-4 rounded-xl border border-border bg-background hover:bg-secondary transition-all text-sm font-medium">
                      Track Order
                    </button>

                    {order.order_status ===
                      "Delivered" && (
                      <>
                        <button className="h-10 px-4 rounded-xl border border-border bg-background hover:bg-secondary transition-all text-sm font-medium">
                          Write Review
                        </button>

                        <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium">
                          Buy Again
                        </button>
                      </>
                    )}

                    {order.order_status ===
                      "Processing" && (
                      <button className="h-10 px-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium">
                        Cancel Order
                      </button>
                    )}
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
