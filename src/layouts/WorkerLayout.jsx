import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext.jsx";
import { useDispatch } from "react-redux";
import { baseApi } from "../services/baseApi.js";
import { Wallet, BriefcaseBusiness, ArrowLeftRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import Footer from "../components/common/Footer";
import GoogleTranslate from "../components/common/GoogleTranslate.jsx";
import logo from "../assets/logo.png";

const SwitchRoleButton = ({ role, onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title={`Switch to ${role === "customer" ? "Worker" : "Customer"}`}
      className="flex items-center space-x-2 text-xs px-2.5 py-1.5 rounded-md transition bg-sky-50 hover:bg-sky-100 border border-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowLeftRight size={14} color="#74C7F2" />
      <span className="text-gray-700 font-medium">
        {isLoading
          ? "Switching..."
          : role === "customer"
          ? "Worker"
          : "Customer"}
      </span>
    </button>
  );
};

const WorkerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const workerNavItems = [
    { to: "/worker-home", label: "Home", icon: FiHome },
    { to: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
    { to: "/worker-bookings", label: "My Bookings", icon: FiCalendar },
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/worker/profile", label: "Profile", icon: FiUser },
  ];

  const { role, setRole, switchRole, isSwitchingRole } = useAuth();

  const handleSwitchRole = async () => {
    const newRole = role === "customer" ? "worker" : "customer";
    try {
      const resultingRole = await switchRole(newRole);
      if (resultingRole) {
        setRole(resultingRole);
        dispatch(baseApi.util.resetApiState());
        navigate(
          resultingRole === "worker" ? "/worker-home" : "/customer-home",
          {
            replace: true,
          }
        );
      }
    } catch (error) {
      // Error is already handled by toast in context
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full bg-white shadow-sm rounded-b-xl absolute md:static top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo - Far Left */}
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>

            {/* Center Section - Nav Links and Search */}
            <div className="hidden md:flex items-center space-x-4 md:flex-1 md:min-w-0 md:justify-center">
              {/* Nav Links */}
              <div className="flex space-x-2 shrink-0">
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
              <div className="relative min-w-0 ml-4">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search job request"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search job request"
                  className="pl-9 pr-3 py-1.5 w-40 lg:w-48 xl:w-56 max-w-full text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#74C7F2] focus:border-[#74C7F2] bg-sky-50"
                />
              </div>
            </div>

            {/* Right Icons - Far Right */}
            <div className="hidden md:flex items-center space-x-2 shrink-0">
              <SwitchRoleButton
                role={role}
                onClick={handleSwitchRole}
                isLoading={isSwitchingRole}
              />
              <div onClick={() => navigate("/worker-chat")}>
                <IconButton
                  icon={<FiMessageSquare size={14} color="#74C7F2" />}
                />
              </div>
              <div
                onClick={() => navigate("/worker/profile?tab=notifications")}
              >
                <IconButton
                  icon={<FiBell size={14} color="white" />}
                  className="bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] border-0 cursor-pointer"
                  hasNotification={true}
                />
              </div>
            </div>
            <div className="ml-6">
              <GoogleTranslate containerId="gt-worker-shared" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleMobileMenu}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 transition"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Mobile Menu as overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Panel under navbar (h-14) */}
          <div className="absolute left-0 right-0 top-14">
            <div className="flex justify-center px-4 sm:px-6">
              <div className="bg-white shadow-xl rounded-xl border border-sky-100 overflow-hidden transition-all duration-300 ease-out w-full max-w-sm relative z-[110]">
                <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                        aria-label="Search job request"
                        className="pl-9 pr-3 py-2.5 w-full text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#74C7F2] focus:border-[#74C7F2] bg-sky-50"
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

                  <MobileNavItem
                    icon={<ArrowLeftRight size={14} />}
                    label={`Switch to ${role === "customer" ? "Worker" : "Customer"}`}
                    to="#"
                    onNavigate={handleSwitchRole}
                  />
                  <MobileNavItem
                    icon={<FiMessageSquare size={14} />}
                    label="Messages"
                    to="/worker-chat"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    icon={<FiBell size={14} />}
                    label="Notifications"
                    to="/worker-notifications"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
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
          "flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-md transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium shadow-sm"
            : "text-gray-700 hover:text-[#74C7F2] hover:bg-sky-50"
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
          "flex items-center space-x-3 text-sm px-4 py-3 rounded-lg transition-all duration-200 w-full",
          isActive
            ? "bg-[#DBF0FF] text-[#74C7F2] font-medium shadow-sm"
            : "text-gray-700 hover:text-[#74C7F2] hover:bg-sky-50"
        )
      }
      end
    >
      <div className="flex items-center space-x-3 w-full">
        {icon}
        <span className="flex-1">{label}</span>
      </div>
    </NavLink>
  );
}

// Small Circle Icon Button
function IconButton({ icon, className, hasNotification }) {
  return (
    <button
      className={twMerge(
        "w-8 h-8 flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 transition-all duration-200 relative",
        className
      )}
    >
      {icon}
      {hasNotification && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      )}
    </button>
  );
}

const WorkerFooter = () => {
  return <Footer />;
};

const WorkerLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-50 pt-14 md:pt-0">
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
