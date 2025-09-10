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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <NavItem icon={<Home size={14} />} label="Home" active={false} />
              <NavItem
                icon={<Wrench size={14} />}
                label="Services"
                active={true}
              />
              <NavItem
                icon={<Calendar size={14} />}
                label="My Bookings"
                active={false}
              />
              <NavItem
                icon={<User size={14} />}
                label="Profile"
                active={false}
              />
            </div>

            {/* Right Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <IconButton icon={<MessageSquare size={14} color="#74C7F2" />} />
              <IconButton
                icon={<Bell size={14} color="white" />}
                className={
                  "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] border-0"
                }
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <IconButton icon={<MessageSquare size={14} color="#74C7F2" />} />
              <IconButton
                icon={<Bell size={14} color="white" />}
                className={
                  "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] border-0"
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
              active={false}
            />
            <MobileNavItem
              icon={<Wrench size={14} />}
              label="Services"
              active={true}
            />
            <MobileNavItem
              icon={<Calendar size={14} />}
              label="My Bookings"
              active={false}
            />
            <MobileNavItem
              icon={<User size={14} />}
              label="Profile"
              active={false}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Compact Nav Item Component
function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-md cursor-pointer transition
        ${
          active
            ? "bg-sky-100 text-sky-600 font-medium"
            : "text-gray-700 hover:text-sky-600"
        }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

// Mobile Nav Item Component
function MobileNavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center space-x-3 text-sm px-3 py-2.5 rounded-md cursor-pointer transition
        ${
          active
            ? "bg-sky-100 text-sky-600 font-medium"
            : "text-gray-700 hover:text-sky-600"
        }`}
    >
      {icon}
      <span>{label}</span>
    </div>
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
