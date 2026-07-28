import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SearchOverlay from "./SearchOverlay";
import CartSidebar from "./CartSidebar";
import ProfilePanel from "./ProfilePanel";
import LoginModal from "./LoginModal";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      {/* overlays */}
      <Sidebar />
      <SearchOverlay />
      <CartSidebar />
      <ProfilePanel />
      <LoginModal />


      {/* page */}
      <main>
        <Outlet />
      </main>


      <Footer />

    </div>
  );
};

export default MainLayout;