import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";

import { useDispatch, useSelector } from "react-redux";

import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar,
} from "../../store/slices/popupSlice";

const iconBtn = `
    p-2
    rounded-xl
    hover:bg-secondary
    active:scale-95
    transition-all
  `;

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);

  const cartItemsCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-background/85
        backdrop-blur-xl
        border-b border-border
      "
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* left */}
          <div className="flex items-center z-10">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className={iconBtn}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>
          </div>

          {/* centered logo */}
          <div
            className="
              absolute
              left-1/2
              -translate-x-1/2
              pointer-events-none
              select-none
            "
          >
            <h1
              className="
                text-lg
                sm:text-2xl
                font-bold
                tracking-[0.22em]
                sm:tracking-[0.35em]
                text-primary
                whitespace-nowrap
              "
            >
              FLINT.
            </h1>
          </div>

          {/* right */}
          <div className="flex items-center gap-0.5 sm:gap-1 z-10">
            {/* theme */}
            <button onClick={toggleTheme} className={iconBtn}>
              {theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              )}
            </button>

            {/* search */}
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className={iconBtn}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>

            {/* profile */}
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className={iconBtn}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>

            {/* cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className={`${iconBtn} relative hidden sm:block`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />

              {cartItemsCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    flex
                    items-center
                    justify-center
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-primary
                    text-primary-foreground
                    text-[10px]
                    font-medium
                  "
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
