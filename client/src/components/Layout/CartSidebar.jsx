import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateCartQuantity,
} from "../../store/slices/cartSlice";

import { toggleCart } from "../../store/slices/popupSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();

  const { isCartOpen } = useSelector((state) => state.popup);

  const { cart } = useSelector((state) => state.cart);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateCartQuantity({ id, quantity }));
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (!isCartOpen) return null;

  return (
    <>
      {/* backdrop */}
      <div
        onClick={() => dispatch(toggleCart())}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-border shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Shopping Cart
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleCart())}
            className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-all"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* empty state */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>

            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Your cart is empty
            </h3>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              to="/products"
              onClick={() => dispatch(toggleCart())}
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center hover:opacity-90 transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* items */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex gap-4">
                    {/* image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary shrink-0">
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "https://www.momento.se/static/files/0/ecommerce-default-product.png"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2">
                            {item.product.name}
                          </h3>

                          <p className="text-primary font-bold mt-1">
                            ₹{item.product.price}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.product.id))
                          }
                          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* quantity */}
                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center border border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <div className="w-12 text-center text-sm font-semibold">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="font-bold text-foreground">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="border-t border-border p-6 shrink-0 bg-background">
              <div className="flex items-center justify-between mb-5">
                <span className="text-muted-foreground">Total</span>

                <span className="text-3xl font-bold text-foreground">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <Link
                to="/cart"
                onClick={() => dispatch(toggleCart())}
                className="h-14 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center hover:opacity-90 transition-all"
              >
                View Cart & Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
