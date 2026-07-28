import {
  Search,
  Sparkles,
  Star,
  X,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";

const MIN_PRICE = 0;
const MAX_PRICE = 1000000;

const FilterSection = ({
  title,
  id,
  children,
  expandedSections,
  toggleSection,
}) => (
  <div className="border-b border-border/50 pb-5 last:border-0 last:pb-0">
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between mb-4 group"
    >
      <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
        {title}
      </span>

      <ChevronDown
        className={`w-4 h-4 text-muted-foreground transition-transform ${
          expandedSections[id] ? "rotate-180" : ""
        }`}
      />
    </button>

    {expandedSections[id] && children}
  </div>
);

const Products = () => {
  const dispatch = useDispatch();

  const { products, totalProducts } = useSelector((state) => state.product);

  const query = new URLSearchParams(useLocation().search);

  const searchedTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchedTerm || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    searchedCategory || "",
  );

  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    availability: true,
    category: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMinPriceInput = (value) => {
    const num = Math.max(MIN_PRICE, Math.min(Number(value || 0), maxPrice));
    setMinPrice(num);
  };

  const handleMaxPriceInput = (value) => {
    const num = Math.min(MAX_PRICE, Math.max(Number(value || 0), minPrice));
    setMaxPrice(num);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedRating(0);
    setAvailability("");
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
  };
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery]);
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${minPrice}-${maxPrice}`,
        search: debouncedSearch,
        availability,
        ratings: selectedRating,
        page: currentPage,
      }),
    );
  }, [
    dispatch,
    selectedCategory,
    minPrice,
    maxPrice,
    debouncedSearch,
    availability,
    selectedRating,
    currentPage,
  ]);
  useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch, selectedCategory, minPrice, maxPrice, availability, selectedRating]);

  const handleMinPriceChange = (e) => {
    const value = e.target.value;

    // allow empty while typing
    if (value === "") {
      setMinPrice("");
      return;
    }

    const num = Math.max(
      MIN_PRICE,
      Math.min(Number(value), Number(maxPrice || MAX_PRICE)),
    );

    setMinPrice(num);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;

    // allow empty while typing
    if (value === "") {
      setMaxPrice("");
      return;
    }

    const num = Math.min(
      MAX_PRICE,
      Math.max(Number(value), Number(minPrice || MIN_PRICE)),
    );

    setMaxPrice(num);
  };

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Mobile Filters */}
          {isMobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
              <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background border-l border-border overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Filters</h2>

                    <button onClick={() => setIsMobileFilterOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <FilterSection
                    title="Price Range"
                    id="price"
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                  >
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="w-full p-3 rounded-xl border border-border"
                        placeholder="Min"
                      />

                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="w-full p-3 rounded-xl border border-border"
                        placeholder="Max"
                      />
                    </div>
                  </FilterSection>

                  <FilterSection
                    title="Rating"
                    id="rating"
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                  >
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setSelectedRating(
                              selectedRating === rating ? 0 : rating,
                            )
                          }
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary"
                        >
                          {rating}★ & up
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection
                    title="Category"
                    id="category"
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                  >
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.name)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </div>
            </div>
          )}

          <aside className="hidden lg:block sticky top-24 h-fit">
            <div className="p-6 rounded-2xl border border-border bg-background space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-primary"
                >
                  Clear
                </button>
              </div>

              <FilterSection
                title="Price Range"
                id="price"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="rounded-2xl border border-border bg-secondary/30 p-5">
                  {/* Editable Input Fields */}
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <div className="px-3 py-2 rounded-xl bg-background border border-border flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Min
                      </p>
                      <div className="flex items-center">
                        <span className="text-sm mr-1">₹</span>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={handleMinPriceChange}
                          className="w-full bg-transparent font-semibold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <span className="text-sm text-muted-foreground">to</span>

                    <div className="px-3 py-2 rounded-xl bg-background border border-border flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Max
                      </p>
                      <div className="flex items-center">
                        <span className="text-sm mr-1">₹</span>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={handleMaxPriceChange}
                          className="w-full bg-transparent font-semibold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dual Range Slider */}
                  <div className="relative h-6 mb-6 flex items-center">
                    <div className="absolute h-2 w-full rounded-full bg-border" />

                    <div
                      className="absolute h-2 rounded-full bg-primary"
                      style={{
                        left: `${(minPrice / MAX_PRICE) * 100}%`,
                        right: `${100 - (maxPrice / MAX_PRICE) * 100}%`,
                      }}
                    />

                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={100}
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none"
                      style={{ zIndex: minPrice > MAX_PRICE / 2 ? 5 : 3 }}
                    />

                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={100}
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none"
                      style={{ zIndex: 4 }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      [0, 5000],
                      [5000, 25000],
                      [25000, 100000],
                    ].map(([min, max]) => (
                      <button
                        key={min}
                        onClick={() => {
                          setMinPrice(min);
                          setMaxPrice(max);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          minPrice === min && maxPrice === max
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-background"
                        }`}
                      >
                        ₹{min.toLocaleString()} - ₹{max.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </FilterSection>

              <FilterSection
                title="Rating"
                id="rating"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setSelectedRating(
                          selectedRating === rating ? 0 : rating,
                        )
                      }
                      className={`w-full flex items-center gap-1 px-3 py-2 rounded-xl border transition-all ${selectedRating === rating ? "border-primary bg-primary/10" : "border-transparent hover:bg-secondary"}`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-muted-foreground"}`}
                        />
                      ))}

                      <span className="text-xs ml-2">& up</span>
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Category"
                id="category"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-xl ${!selectedCategory ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                  >
                    All Categories
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl ${selectedCategory === category.name ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          <main>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}

                  placeholder="Search products..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-background"
                />
              </div>

              <button
                onClick={() => dispatch(toggleAIModal())}
                className="h-14 px-6 rounded-2xl text-white font-semibold flex items-center gap-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                AI Search
              </button>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <h3 className="text-2xl font-bold mb-3">No products found</h3>

                <p className="text-muted-foreground">
                  Try adjusting your filters.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <AISearchModal />
    </div>
  );
};

export default Products;
