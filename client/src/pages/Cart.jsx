import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";
import { toggleAuthPopup } from "../store/slices/popupSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);

  const { authUser } = useSelector((state) => state.auth);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(
        updateCartQuantity({
          id,
          quantity,
        }),
      );
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 5000 ? 0 : 99;

  const tax = subtotal * 0.18;

  const finalTotal = subtotal + shipping + tax;

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center border border-border rounded-3xl p-10 bg-background">
          <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your cart is empty
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Looks like you haven’t added anything yet.
          </p>

          <Link
            to="/products"
            className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Shopping Cart
          </h1>

          <p className="text-muted-foreground">
            {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>

        {/* layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* cart items */}
          <div className="xl:col-span-2 space-y-5">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="rounded-3xl border border-border bg-background p-5"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-secondary shrink-0"
                  >
                    <img
                      src={
                        item.product?.images?.[0]?.url ||
                        "https://www.momento.se/static/files/0/ecommerce-default-product.png"
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link to={`/product/${item.product.id}`}>
                            <h2 className="text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                              {item.product.name}
                            </h2>
                          </Link>

                          <p className="text-sm text-muted-foreground mt-2">
                            Category: {item.product.category}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.product.id))
                          }
                          className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      <p className="text-2xl font-bold text-primary mt-5">
                        ₹{item.product.price}
                      </p>
                    </div>

                    {/* bottom row */}
                    <div className="flex flex-wrap items-center justify-between gap-5 mt-6">
                      {/* quantity */}
                      <div className="flex items-center border border-border rounded-2xl overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <div className="w-14 text-center font-semibold">
                          {item.quantity}
                        </div>

                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* item total */}
                      <p className="text-xl font-bold text-foreground">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* summary */}
          <div>
            <div className="sticky top-24 rounded-3xl border border-border bg-background p-7">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>

                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-5 flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>

                  <span className="text-3xl font-bold text-foreground">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* actions */}
              <div className="mt-8 space-y-4">
                {authUser ? (
                  <Link
                    onClick={() => dispatch(clearCheckOutItem())}
                    to="/payment"
                    className="h-14 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center hover:opacity-90 transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    onClick={() => dispatch(toggleAuthPopup())}
                    className="h-14 w-full rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center hover:opacity-90 transition-all"
                  >
                    Login to Checkout
                  </button>
                )}

                <Link
                  to="/products"
                  className="h-14 rounded-2xl border border-border font-medium flex items-center justify-center hover:bg-secondary transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
