import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import GoogleTranslate from "../components/common/GoogleTranslate.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES } from "../constants/roles.js";
import logo from "../assets/logo-new.png";
import Bot from "../components/chat-bot/Bot.jsx";

const LandingHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [translateKey, setTranslateKey] = useState(0);

  // Force GoogleTranslate remount when route changes
  useEffect(() => {
    setTranslateKey((prev) => prev + 1);
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Cleanup Google Translate on unmount
  useEffect(() => {
    return () => {
      // Clean up any Google Translate elements
      const gtHeaderContainer = document.getElementById("gt-landing-header");
      if (gtHeaderContainer) {
        gtHeaderContainer.innerHTML = "";
      }
      // Remove from pending IDs
      if (window._gtPendingIds) {
        window._gtPendingIds.delete("gt-landing-header");
      }
    };
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/what-is-jinnar", label: "What is Jinnar" },
    { to: "/landing-services", label: "Services" },
    { to: "/#top-workers", label: "Workers" },
    { to: "/how-training-works", label: "Free Training" },
    { to: "/help", label: "Help" },
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  const handleGoToDashboard = () => {
    const dashboardPath = role === ROLES.WORKER ? "/worker-home" : "/customer-home";
    navigate(dashboardPath);
    closeMobileMenu();
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
          <nav className="hidden lg:flex items-center justify-center gap-4 lg:gap-6 text-sm">
            {navItems.map((item) => {
              const active = isNavActive(item.to);
              return (
                <a
                  key={item.to}
                  href={item.to}
                  className={
                    active
                      ? "text-secondary hover:text-secondary font-medium"
                      : "text-black hover:text-black/80"
                  }
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions & Mobile Menu Button */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {/* Show Login/Signup or User Info based on auth status */}
            {user ? (
              <>
                {/* Logged In - Show User Info & Logout */}
                <button
                  onClick={handleGoToDashboard}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B6E0FE] to-[#74C7F2] flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-900 max-w-[100px] truncate">
                    {user.name || "User"}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Not Logged In - Show Login/Signup */}
                <Link
                  to="/login"
                  state={{ next: "login" }}
                  className="hidden lg:flex text-sm font-medium text-black hover:text-black/80 items-center gap-2"
                >
                  Login
                </Link>
                <Link
                  to="/role"
                  state={{ next: "signup" }}
                  className="hidden lg:flex h-9 px-5 rounded-full text-sm font-medium text-black shadow items-center justify-center"
                  style={{ background: "var(--gradient-main)" }}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Google Translate - Always visible */}
            <div>
              <GoogleTranslate
                key={`landing-translate-${translateKey}`}
                containerId="gt-landing-header"
              />
            </div>

            {/* Mobile/Tablet Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white/90 transition-colors border border-gray-200"
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

      {/* Mobile/Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
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
                      <a
                        key={item.to}
                        href={item.to}
                        onClick={closeMobileMenu}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {item.label}
                      </a>
                    );
                  })}

                  {/* Mobile Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                    {user ? (
                      <>
                        {/* Logged In - Show User Info & Actions */}
                        <button
                          onClick={handleGoToDashboard}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-200"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B6E0FE] to-[#74C7F2] flex items-center justify-center text-white text-sm font-bold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.name || "User"}
                            </p>
                            <p className="text-xs text-gray-600">
                              Go to Dashboard
                            </p>
                          </div>
                          <User size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Not Logged In - Show Login/Signup */}
                        <Link
                          to="/login"
                          state={{ next: "login" }}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 text-center border border-gray-300"
                        >
                          Login
                        </Link>
                        <Link
                          to="/role"
                          state={{ next: "signup" }}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 rounded-lg text-sm font-medium text-white shadow transition-all duration-200 text-center"
                          style={{ background: "var(--gradient-main)" }}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
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
