import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuary] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);
  if (!isSearchBarOpen) return null;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(toggleSearchBar());
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
  <div className="fixed inset-0 z-50 flex justify-center items-start pt-24">
    
    {/* backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-md"
      onClick={() => dispatch(toggleSearchBar())}
    />

    {/* search modal */}
    <div className="relative z-10 w-full max-w-2xl mx-4 animate-slide-in-top">
      
      <div className="glass-panel p-6 rounded-2xl border border-border bg-background/95 shadow-xl">
        
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">
            Search Products
          </h2>

          <button
            onClick={() => dispatch(toggleSearchBar())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* input */}
        <div className="relative">
          
          <button
            onClick={handleSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>

          <input
            autoFocus
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuary(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearch()
            }
            className="
              w-full
              pl-12
              pr-4
              py-4
              rounded-xl
              bg-secondary
              border border-border
              text-foreground
              placeholder:text-muted-foreground
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />
        </div>
        <div className="mt-6 text-center text-muted-foreground">
          <p>Start typing to search for products...</p>
        </div>
      </div>
    </div>
  </div>
);
};

export default SearchOverlay;
