import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import { FiLogIn } from "react-icons/fi";

const LandingHeader = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/#how-it-works", label: "How it Works" },
    { to: "/customer-home", label: "Services" },
    { to: "/#workers", label: "Workers" },
    { to: "/#help", label: "Help" },
  ];

  const isNavActive = (to) => {
    const [pathPart, hashPartRaw] = to.split("#");
    const targetPath = pathPart || "/";
    const targetHash = hashPartRaw ? `#${hashPartRaw}` : "";

    // If a hash is specified, require both path and hash to match
    if (targetHash) {
      return location.pathname === targetPath && location.hash === targetHash;
    }

    // No hash specified: Home is active only when no hash in URL
    if (targetPath === "/") {
      return location.pathname === "/" && !location.hash;
    }

    // Other plain paths: active when pathname matches regardless of hash
    return location.pathname === targetPath;
  };

  const handleAnchorClick = (e, to) => {
    // Only handle items with hash anchors
    const [, hashPartRaw] = to.split("#");
    if (!hashPartRaw) return; // not an anchor link

    const targetId = hashPartRaw;
    // If we're already on the landing page, smoothly scroll to element
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update hash so active state reflects current section (without jump)
      window.history.replaceState(null, "", `#${targetId}`);
      return;
    }
  };
  return (
    <header className="absolute left-1/2 -translate-x-1/2 top-0 z-30 w-[calc(100%-24px)] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
      <div className="rounded-b-2xl bg-white/50 backdrop-blur shadow-sm px-4 md:px-6 lg:px-8 h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link to="/" className="font-semibold tracking-tight">
          LOGO HERE
        </Link>
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm">
          {navItems.map((item) => {
            const active = isNavActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={(e) => handleAnchorClick(e, item.to)}
                className={
                  active ? "text-secondary hover:text-secondary" : "text-black"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-black hover:text-black/80 flex items-center gap-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="h-9 px-5 rounded-full text-sm font-medium text-black shadow flex items-center justify-center"
            style={{ background: "var(--gradient-main)" }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
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
