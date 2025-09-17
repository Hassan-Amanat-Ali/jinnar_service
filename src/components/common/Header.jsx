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
            <div className="font-bold text-lg tracking-wide">LOGO HERE</div>

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
            <div className="hidden md:flex items-center space-x-3">
              <div onClick={() => navigate("/chat")}>
                <IconButton
                  icon={<MessageSquare size={14} color="#74C7F2" />}
                />
              </div>
              <IconButton
                icon={<Bell size={14} color="white" />}
                className={
                  "bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] border-0"
                }
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <IconButton icon={<MessageSquare size={14} color="#74C7F2" />} />
              <IconButton
                icon={<Bell size={14} color="white" />}
                className={
                  "bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] border-0"
                }
              />
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-lg mx-4 mt-2 border border-sky-100">
          <div className="px-4 py-3 space-y-2">
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
