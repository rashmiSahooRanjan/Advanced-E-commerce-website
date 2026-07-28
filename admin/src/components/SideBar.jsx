import React, { useState } from "react";

import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

import { logout } from "../store/slices/authSlice";

import { toggleComponent, toggleNavbar } from "../store/slices/extraSlice";

const SideBar = () => {
  const dispatch = useDispatch();

  const [activeLink, setActiveLink] = useState(0);

  const links = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Dashboard",
      color: "text-blue-600",
      active: "bg-blue-50 text-blue-700 border-blue-100",
      hover: "hover:bg-blue-50 hover:text-blue-600",
      iconBg: "bg-blue-100",
    },

    {
      icon: <ListOrdered className="w-5 h-5" />,
      title: "Orders",
      color: "text-emerald-600",
      active: "bg-emerald-50 text-emerald-700 border-emerald-100",
      hover: "hover:bg-emerald-50 hover:text-emerald-600",
      iconBg: "bg-emerald-100",
    },

    {
      icon: <Package className="w-5 h-5" />,
      title: "Products",
      color: "text-purple-600",
      active: "bg-purple-50 text-purple-700 border-purple-100",
      hover: "hover:bg-purple-50 hover:text-purple-600",
      iconBg: "bg-purple-100",
    },

    {
      icon: <Users className="w-5 h-5" />,
      title: "Users",
      color: "text-amber-600",
      active: "bg-amber-50 text-amber-700 border-amber-100",
      hover: "hover:bg-amber-50 hover:text-amber-600",
      iconBg: "bg-amber-100",
    },

    {
      icon: <User className="w-5 h-5" />,
      title: "Profile",
      color: "text-rose-600",
      active: "bg-rose-50 text-rose-700 border-rose-100",
      hover: "hover:bg-rose-50 hover:text-rose-600",
      iconBg: "bg-rose-100",
    },
  ];

  const { isNavbarOpened } = useSelector((state) => state.extra);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* mobile overlay */}
      {isNavbarOpened && (
        <div
          onClick={() => dispatch(toggleNavbar())}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-[290px]
          bg-white border-r border-zinc-200
          flex flex-col justify-between
          transition-all duration-300
          shadow-sm
          ${isNavbarOpened ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* top */}
        <div>
          {/* logo */}
          <div className="h-20 px-6 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-[0.18em] text-orange-500">
                FLINT.
              </h1>

              <p className="text-xs text-zinc-500 mt-1">
                Administrative Workspace
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleNavbar())}
              className="md:hidden w-10 h-10 rounded-2xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-all"
            >
              <PanelLeftClose className="w-5 h-5 text-zinc-700" />
            </button>
          </div>

          {/* analytics quick card */}
          

          {/* nav */}
          <nav className="px-4 space-y-2 py-4">
            {links.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveLink(index);

                  dispatch(toggleComponent(item.title));

                  if (window.innerWidth < 768) {
                    dispatch(toggleNavbar());
                  }
                }}
                className={`
                  w-full h-16 px-4 rounded-2xl border
                  flex items-center gap-4
                  transition-all duration-200
                  text-left
                  ${
                    activeLink === index
                      ? item.active
                      : `border-transparent text-zinc-700 ${item.hover}`
                  }
                `}
              >
                {/* icon */}
                <div
                  className={`
                    w-11 h-11 rounded-2xl
                    flex items-center justify-center
                    transition-all
                    ${activeLink === index ? "bg-white shadow-sm" : item.iconBg}
                    ${item.color}
                  `}
                >
                  {item.icon}
                </div>

                {/* text */}
                <div>
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-xs opacity-70 mt-0.5">
                    Manage {item.title.toLowerCase()}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* bottom */}
        <div className="p-4 border-t border-zinc-200">
          <button
            onClick={handleLogout}
            className="w-full h-14 rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 font-semibold flex items-center justify-center gap-3 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* floating mobile trigger */}
      {!isNavbarOpened && (
        <button
          onClick={() => dispatch(toggleNavbar())}
          className="fixed bottom-5 left-5 z-30 md:hidden w-14 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-200 text-white flex items-center justify-center transition-all"
        >
          <PanelLeftOpen className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default SideBar;
