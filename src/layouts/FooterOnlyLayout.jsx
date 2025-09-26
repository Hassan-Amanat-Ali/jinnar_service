import Footer from "../components/common/Footer.jsx";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop.jsx";

const FooterOnlyLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FooterOnlyLayout;
