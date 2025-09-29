import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import GoogleTranslate from "../components/common/GoogleTranslate.jsx";
import logo from "../assets/logo-new.png";

const LandingHeader = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/#how-it-works", label: "How it Works" },
    { to: "/customer-home", label: "Services" },
    { to: "/services/slug", label: "Workers" },
    { to: "/profile?tab=help", label: "Help" },
  ];

  const isNavActive = (to) => {
    const [pathPart, hashPartRaw] = to.split("#");
    const targetPath = pathPart || "/";
    const targetHash = hashPartRaw ? `#${hashPartRaw}` : "";

    if (targetHash) {
      return location.pathname === targetPath && location.hash === targetHash;
    }

    if (targetPath === "/") {
      return location.pathname === "/" && !location.hash;
    }

    return location.pathname === targetPath;
  };

  const handleAnchorClick = (e, to) => {
    const [, hashPartRaw] = to.split("#");
    if (!hashPartRaw) return;

    const targetId = hashPartRaw;
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${targetId}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="absolute left-1/2 -translate-x-1/2 top-0 z-30 w-[calc(100%-12px)] sm:w-[calc(100%-24px)] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
        <div className="rounded-b-2xl bg-white/50 backdrop-blur shadow-sm px-3 sm:px-4 md:px-6 lg:px-8 h-[60px] sm:h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
          <Link to="/" className="font-semibold tracking-tight">
            <img
              src={logo}
              alt="Logo"
              className="h-8 sm:h-10 lg:h-12 w-auto object-cover"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-6 text-sm">
            {navItems.map((item) => {
              const active = isNavActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={(e) => handleAnchorClick(e, item.to)}
                  className={
                    active
                      ? "text-secondary hover:text-secondary font-medium"
                      : "text-black hover:text-black/80"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions & Mobile Menu Button */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {/* Desktop Login/Signup */}
            <Link
              to="/role"
              className="hidden sm:flex text-xs lg:text-sm font-medium text-black hover:text-black/80 items-center gap-2"
            >
              Login
            </Link>
            <Link
              to="/role"
              className="hidden sm:flex h-7 sm:h-8 lg:h-9 px-2 sm:px-3 lg:px-5 rounded-full text-xs lg:text-sm font-medium text-black shadow items-center justify-center"
              style={{ background: "var(--gradient-main)" }}
            >
              Sign Up
            </Link>

            {/* Google Translate - Desktop only */}
            <div className="">
              <GoogleTranslate />
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white/90 transition-colors border border-gray-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X size={18} className="text-gray-700" />
              ) : (
                <Menu size={18} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Panel under navbar */}
          <div className="absolute left-0 right-0 top-[60px] sm:top-[72px]">
            <div className="mx-3 sm:mx-6">
              <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-4 space-y-2">
                  {/* Mobile Navigation Links */}
                  {navItems.map((item) => {
                    const active = isNavActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={(e) => {
                          handleAnchorClick(e, item.to);
                          closeMobileMenu();
                        }}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* Mobile Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 text-center border border-gray-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-white shadow transition-all duration-200 text-center"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const LandingLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />
      <LandingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
