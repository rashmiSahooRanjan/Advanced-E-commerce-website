import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "About", icon: Info, path: "/about" },
    { name: "FAQ", icon: HelpCircle, path: "/faq" },
    { name: "Contact", icon: Phone, path: "/contact" },
    { name: "Cart", icon: ShoppingCart, path: "/cart" },
    authUser && { name: "My Orders", icon: List, path: "/orders" },
  ];

  const { isSidebarOpen } = useSelector((state) => state.popup);
  if (!isSidebarOpen) return null;

  return (
  <>
    {/* backdrop */}
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
      onClick={() => dispatch(toggleSidebar())}
    />

    {/* sidebar */}
    <aside
      className="
        fixed
        top-0
        left-0
        z-50
        h-screen
        w-72
        bg-background/95
        backdrop-blur-xl
        border-r border-border
        shadow-xl
        animate-slide-in-left
        overflow-y-auto
      "
    >
      {/* header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-border">
        
        <h2 className="text-xl font-bold text-primary">
          F L I N T .
        </h2>

        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* nav */}
      <nav className="p-4">
        <ul className="space-y-2">

          {menuItems.filter(Boolean).map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => dispatch(toggleSidebar())}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-foreground
                  hover:bg-secondary
                  hover:text-primary
                  transition-all
                  group
                "
              >
                <item.icon className="w-5 h-5" />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}

        </ul>
      </nav>
    </aside>
  </>
);
};

export default Sidebar;
