import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../Products/ProductCard";
import { useDispatch } from "react-redux";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left:
        direction === "left"
          ? -scrollRef.current.clientWidth * 0.8
          : scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-xl border border-border hover:bg-secondary transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-xl border border-border hover:bg-secondary transition-all"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
