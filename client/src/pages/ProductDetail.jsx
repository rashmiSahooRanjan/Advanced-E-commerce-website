import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import ReviewsContainer from "../components/Products/ReviewsContainer";

import { fetchProductDetails } from "../store/slices/productSlice";
import { addToCart, checkout } from "../store/slices/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    productDetails: product,
    loading,
    productReviews,
  } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Product Not Found
          </h1>

          <p className="text-muted-foreground">
            The product you requested does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* images */}
          <div className="lg:sticky lg:top-24 self-start">
            {/* main image */}
            <div className="rounded-3xl border border-border bg-background p-6 mb-5">
              <img
                src={product.images?.[selectedImage]?.url}
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
            </div>

            {/* thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name}-${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* content */}
          <div>
            {/* badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {Date.now() - new Date(product.created_at) <
                30 * 24 * 60 * 60 * 1000 && (
                <span className="px-3 py-1 rounded-xl text-xs font-medium bg-primary text-primary-foreground">
                  NEW
                </span>
              )}

              {product.ratings >= 4.5 && (
                <span className="px-3 py-1 rounded-xl text-xs font-medium bg-yellow-400/20 text-yellow-400">
                  TOP RATED
                </span>
              )}
            </div>

            {/* title */}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratings || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <span className="text-muted-foreground">
                {product.ratings} ({productReviews?.length} reviews)
              </span>
            </div>

            {/* price */}
            <h2 className="text-3xl font-bold text-primary mb-6">
              ₹{product.price}
            </h2>

            {/* metadata */}
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="text-muted-foreground">
                Category: {product.category}
              </span>

              <span
                className={`px-3 py-1 rounded-xl text-xs font-medium ${
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

            {/* quantity */}
            <div className="mb-8">
              <p className="font-medium text-foreground mb-4">Quantity</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 rounded-2xl border border-border flex items-center justify-center hover:bg-secondary transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 rounded-2xl border border-border flex items-center justify-center hover:bg-secondary transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleAddToCart()}
                disabled={product.stock === 0}
                className="h-14 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  dispatch(checkout({ product, quantity }));
                  navigate("/payment");
                }}
                disabled={product.stock === 0}
                className="h-14 rounded-2xl border border-border hover:bg-secondary transition-all font-medium disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* extra */}
            <div className="flex gap-6 text-muted-foreground">
              <button className="flex items-center gap-2 hover:text-primary transition-all">
                <Heart className="w-5 h-5" />
                Wishlist
              </button>

              <button className="flex items-center gap-2 hover:text-primary transition-all">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="rounded-3xl border border-border bg-background">
          <div className="flex border-b border-border">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-5 font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {activeTab === "reviews" && (
              <ReviewsContainer
                product={product}
                productReviews={productReviews}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
