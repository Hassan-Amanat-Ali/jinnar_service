import {
  Home,
  Wrench,
  Calendar,
  User,
  MessageSquare,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GoogleTranslate from "./GoogleTranslate.jsx";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full bg-white shadow-sm rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex space-x-3.5">
              <NavItem
                icon={<Home size={14} />}
                label="Home"
                to="/customer-home"
              />
              <NavItem
                icon={<Wrench size={14} />}
                label="Services"
                to="/services"
              />
              <NavItem
                icon={<Calendar size={14} />}
                label="My Bookings"
                to="/customer-bookings"
              />
              <NavItem
                icon={<User size={14} />}
                label="Profile"
                to="/profile"
              />
            </div>

            {/* Right Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-3 cursop">
              <div onClick={() => navigate("/chat")}>
                <IconButton
                  icon={<MessageSquare size={14} color="#74C7F2" />}
                  className={"border-0 cursor-pointer"}
                />
              </div>
              <div onClick={() => navigate("/profile?tab=notifications")}>
                <IconButton
                  icon={<Bell size={14} color="white" />}
                  className={
                    "bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] border-0 cursor-pointer"
                  }
                />
              </div>
              <div className="">
                <GoogleTranslate containerId="gt-header-desktop" />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="">
                <GoogleTranslate containerId="gt-header-mobile" />
              </div>
              <button
                onClick={toggleMobileMenu}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 transition"
              >
                {isMobileMenuOpen ? (
                  <X size={14} color="#74C7F2" />
                ) : (
                  <Menu size={14} color="#74C7F2" />
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
                  <MobileNavItem
                    icon={<Home size={14} />}
                    label="Home"
                    to="/customer-home"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    icon={<Wrench size={14} />}
                    label="Services"
                    to="/services"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    icon={<Calendar size={14} />}
                    label="My Bookings"
                    to="/customer-bookings"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    icon={<User size={14} />}
                    label="Profile"
                    to="/profile"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    icon={<MessageSquare size={14} />}
                    label="Messages"
                    to="/chat"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    icon={<Bell size={14} />}
                    label="Notifications"
                    to="/profile?tab=notifications"
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
}

// Compact Nav Item Component
function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          "flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-md transition",
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
function IconButton({ icon, className }) {
  return (
    <button
      className={twMerge(
        "w-8 h-8 flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 transition",
        className
      )}
    >
      {icon}
    </button>
  );
}
