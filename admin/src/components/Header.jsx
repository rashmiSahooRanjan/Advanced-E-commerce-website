import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, ChevronRight } from "lucide-react";

import avatar from "../assets/avatar.jpg";

import { toggleNavbar } from "../store/slices/extraSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { openedComponent } = useSelector((state) => state.extra);

  return (
    <header className="sticky top-0 z-30 w-full h-20 px-4 md:px-6 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
      <div className="relative h-full flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-4 min-w-0">
          {/* mobile menu */}
          <button
            onClick={() => dispatch(toggleNavbar())}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-all"
          >
            <Menu className="w-5 h-5 text-orange-600" />
          </button>

          {/* title */}
          <div className="min-w-0">
            {/* breadcrumb */}
            <div className="text-xl flex items-center gap-2">
              <span className="text-zinc-500">Flint Admin</span>
              <ChevronRight className="w-4 h-4 text-orange-400" />
              <span className="font-semibold underline text-orange-600 truncate">
                {openedComponent}
              </span>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          {/* profile */}
          <div className="flex items-center gap-3">
            {/* user details */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-zinc-900 leading-none">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-orange-500 mt-1">
                {user?.role || "Administrator"}
              </p>
            </div>

            {/* avatar */}
            <div className="relative">
              <img
                src={user?.avatar?.url || avatar}
                alt={user?.name || "Admin"}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-orange-200 shadow-sm"
              />

              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;