import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiBell,
  FiUser,
  FiHome,
  FiCalendar,
  FiSearch,
  FiMessageSquare,
} from "react-icons/fi";
import { Wallet, BriefcaseBusiness } from "lucide-react";
import { twMerge } from "tailwind-merge";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import Footer from "../components/common/Footer";

const WorkerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const workerNavItems = [
    { to: "/worker-home", label: "Home", icon: FiHome },
    { to: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
    { to: "/worker-bookings", label: "My Bookings", icon: FiCalendar },
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/worker-setup-basic", label: "Profile", icon: FiUser },
  ];

  // const handleLogout = () => {
  //   // Add logout logic here
  //   navigate("/");
  // };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full bg-white shadow-sm rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo - Far Left */}
            <div className="font-bold text-lg tracking-wide">LOGO HERE</div>

            {/* Center Section - Nav Links and Search */}
            <div className="hidden md:flex items-center space-x-8.5">
              {/* Nav Links */}
              <div className="flex space-x-8.5">
                {workerNavItems.map((item) => (
                  <NavItem
                    key={item.to}
                    icon={<item.icon size={14} />}
                    label={item.label}
                    to={item.to}
                  />
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search job request"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-48 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#74C7F2] focus:border-[#74C7F2] bg-sky-50"
                />
              </div>
            </div>

            {/* Right Icons - Far Right */}
            <div className="hidden md:flex items-center space-x-3">
              <div onClick={() => navigate("/chat")}>
                <IconButton
                  icon={<FiMessageSquare size={14} color="#74C7F2" />}
                />
              </div>
              <IconButton
                icon={<FiBell size={14} color="white" />}
                className="bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] border-0"
                hasNotification={true}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <IconButton
                icon={<FiMessageSquare size={14} color="#74C7F2" />}
              />
              <IconButton
                icon={<FiBell size={14} color="white" />}
                className="bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] border-0"
                hasNotification={true}
              />
              <button
                onClick={toggleMobileMenu}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 transition"
              >
                {isMobileMenuOpen ? (
                  <FiX size={14} color="#74C7F2" />
                ) : (
                  <FiMenu size={14} color="#74C7F2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-lg mx-4 mt-2 border border-sky-100">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile Search */}
            <div className="mb-3">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search job request"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full text-xs border border-sky-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#74C7F2] focus:border-[#74C7F2] bg-sky-50"
                />
              </div>
            </div>

            {workerNavItems.map((item) => (
              <MobileNavItem
                key={item.to}
                icon={<item.icon size={14} />}
                label={item.label}
                to={item.to}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// Compact Nav Item Component
function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          "flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-md transition",
          isActive
            ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium"
            : "text-gray-700 hover:text-[#74C7F2]"
        )
      }
      end
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

// Mobile Nav Item Component
function MobileNavItem({ icon, label, to, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        twMerge(
          "flex items-center space-x-3 text-sm px-3 py-2.5 rounded-md transition",
          isActive
            ? "bg-[#DBF0FF] text-[#74C7F2] font-medium"
            : "text-gray-700 hover:text-[#74C7F2]"
        )
      }
      end
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

// Small Circle Icon Button
function IconButton({ icon, className, hasNotification }) {
  return (
    <button
      className={twMerge(
        "w-8 h-8 flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 transition relative",
        className
      )}
    >
      {icon}
      {hasNotification && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}

const WorkerFooter = () => {
  return <Footer />;
};

const WorkerLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <ScrollToTop />
      <WorkerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <WorkerFooter />
    </div>
  );
};

export default WorkerLayout;
