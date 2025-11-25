import Navbar from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
