import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  LockKeyhole,
} from "lucide-react";

import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { placeOrder, startPayment } from "../store/slices/orderSlice";

const Payment = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);

  const { cart, checkOutItem } = useSelector((state) => state.cart);

  const { orderStep, placingOrder, paymentLoading, currentOrderId } =
    useSelector((state) => state.order);

  const [shippingDetails, setShippingDetails] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    if (!authUser) {
      navigate("/products");
    }
  }, [authUser, navigate]);

  const subtotal = checkOutItem
    ? checkOutItem.product.price * checkOutItem.quantity
    : cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shipping = subtotal >= 5000 ? 0 : 99;

  const tax = subtotal * 0.18;

  const finalTotal = subtotal + shipping + tax;

  const totalItems = checkOutItem
    ? checkOutItem.quantity
    : cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    dispatch(
      placeOrder({
        shippingInfo: shippingDetails,
        orderItems: checkOutItem
          ? [
              {
                productId: checkOutItem.product.id,
                quantity: checkOutItem.quantity,
              },
            ]
          : cart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
      }),
    );
  };

  const handlePayment = () => {
    dispatch(
      startPayment({
        shippingDetails,
        onSuccess: () => {
          navigate("/orders?success=true");
        },
      }),
    );
  };
  console.log(checkOutItem);
  if (checkOutItem === null && cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-[32px] border border-border bg-background p-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center mb-7">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your cart is empty
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Looks like you haven’t added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-all"
          >
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Secure Checkout
            </h1>

            <p className="text-muted-foreground mt-3">
              Complete your order securely and quickly.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border px-5 py-4 bg-background">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <LockKeyhole className="w-5 h-5 text-primary" />
            </div>

            <div>
              <p className="font-semibold text-sm text-foreground">
                Secure Checkout
              </p>

              <p className="text-xs text-muted-foreground">
                SSL encrypted payment
              </p>
            </div>
          </div>
        </div>

        {/* steps */}
        <div className="flex items-center justify-center mb-14">
          <div className="flex items-center">
            {/* step 1 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  orderStep >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {orderStep > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>

              <span
                className={`font-medium ${
                  orderStep >= 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Shipping
              </span>
            </div>

            <div
              className={`w-24 h-[2px] mx-5 ${
                orderStep >= 2 ? "bg-primary" : "bg-border"
              }`}
            />

            {/* step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  orderStep >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                2
              </div>

              <span
                className={`font-medium ${
                  orderStep >= 2 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* main */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* left */}
          <div className="xl:col-span-2">
            {orderStep === 1 ? (
              <form
                onSubmit={handlePlaceOrder}
                className="rounded-[32px] border border-border bg-background p-8 md:p-10"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Shipping Information
                    </h2>

                    <p className="text-muted-foreground">
                      Enter your delivery details below.
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Protected Information
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.full_name}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          full_name: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.phone}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          phone: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.state}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          state: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Address
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.address}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          address: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.city}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          city: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.pincode}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          pincode: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Country
                    </label>

                    <input
                      type="text"
                      required
                      value={shippingDetails.country}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          country: e.target.value,
                        })
                      }
                      className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold mt-8 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder
                    ? "Saving Shipping Information..."
                    : "Continue to Payment"}
                </button>
              </form>
            ) : (
              <div className="rounded-[32px] border border-border bg-background p-10">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                  <Check className="w-12 h-12 text-primary" />
                </div>

                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Shipping Information Saved
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl">
                  Your delivery information has been securely saved. You can now
                  continue to complete your payment.
                </p>

                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay ₹{finalTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* summary */}
          <div>
            <div className="sticky top-24 rounded-[32px] border border-border bg-background p-7">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Order Summary
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary shrink-0">
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "https://www.momento.se/static/files/0/ecommerce-default-product.png"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </h3>

                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-sm">
                      ₹{(item.product.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-8 pt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>

                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <div className="pt-5 border-t border-border flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>

                  <span className="text-3xl font-bold text-foreground">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
