import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({product, quantity: 1}));
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group shrink-0 w-72 rounded-2xl border border-border bg-background hover:bg-secondary hover:shadow-md transition-all"
    >
      {/* image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={product?.images?.[0]?.url || "https://www.momento.se/static/files/0/ecommerce-default-product.png"}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {Date.now() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground">
              NEW
            </span>
          )}

          {product.ratings >= 4.5 && (
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-yellow-400/20 text-yellow-400">
              TOP RATED
            </span>
          )}
        </div>

        {/* cart */}
        <button
          disabled={product.stock === 0}
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-background/80 opacity-0 group-hover:opacity-100 transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* content */}
      <div className="p-5">
        {/* name */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.ratings || 0) ? "text-yellow-400 fill-current" : "text-muted-foreground"}`}
              />
            ))}
          </div>

          <span className="text-sm text-muted-foreground">
            ({product.review_count})
          </span>
        </div>

        {/* price */}
        <div className="flex items-center mb-3">
          <span className="text-xl font-bold text-primary">
            ₹{product.price}
          </span>
        </div>

        {/* stock */}
        <span
          className={`inline-block text-xs px-2 py-1 rounded-lg ${
            product.stock > 5
              ? "bg-green-500/20 text-green-400"
              : product.stock > 0
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {product.stock > 5
            ? "In Stock"
            : product.stock > 0
            ? "Limited Stock"
            : "Out of Stock"}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
