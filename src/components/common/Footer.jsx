import growing from "../../assets/images/growing.jpg";
import arrow from "../../assets/icons/arrow.png";
import bubble1 from "../../assets/icons/bubble1.png";
import followUs from "../../assets/icons/follow-us.png";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      {/* CTA Section */}
      <div className="relative mx-auto mt-1 mb-12 sm:mb-16  sm:px-6">
        <div className="relative  max-w-7xl mx-auto h-50 m:h-48 md:h-56 lg:h-84 rounded-xl sm:rounded-2xl overflow-hidden w-[90%] md:w-full  xl:w-[90%]">
          {/* Background Image */}
          <img
            src={growing}
            alt="Growing business"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0225A1]/85 to-[#8203E9]/85"></div>

          {/* Decorative Bubbles */}
          <img
            src={bubble1}
            alt=""
            className="absolute top-2 left-2 sm:top-4 sm:left-4 md:left-6 w-6 sm:w-8 md:w-10 opacity-50 animate-pulse"
          />
          <img
            src={bubble1}
            alt=""
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:right-6 w-8 sm:w-10 md:w-12 opacity-30 animate-pulse"
          />

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight max-w-3xl">
              Join thousands of happy customers today!
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 mb-4 sm:mb-5 md:mb-6 leading-relaxed max-w-xl px-2">
              Experience the difference with our verified professionals. Quality
              service, guaranteed satisfaction.
            </p>
            <Link
              to="/services"
              className="bg-white hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Start Booking Now
              <img
                src={arrow}
                alt=""
                className="w-3 sm:w-4 md:w-5 h-2.5 sm:h-3 md:h-4"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#0C0D1D] pt-8 sm:pt-10 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-8">
          {/* Brand Info */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-base">Tanzania Marketplace</h1>
            <p className="text-xs sm:text-sm mt-2 text-gray-400 leading-relaxed">
              Connecting skilled informal workers with customers in communities
              worldwide. Building trust, creating opportunities.
            </p>
            <div className="text-xs sm:text-sm mt-6 space-y-1 font-light text-gray-400">
              <p className="flex items-center gap-2">
                <Mail size={16} /> hello@workconnect.com
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> +1 (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} /> San Francisco, CA
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-base">Quick Links</h1>
            <ul className="text-xs sm:text-sm mt-3 space-y-2 font-light text-gray-400">
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/customer-home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/#how-it-works"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/services"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/services/slug"
                >
                  Workers
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/about-us"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-base">Popular Services</h1>
            <ul className="text-xs sm:text-sm mt-3 space-y-2 font-light text-gray-400">
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/profile?tab=help"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/profile?tab=help"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/what-is-jinnar"
                >
                  What is Jinnar?
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/profile?tab=privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/profile?tab=terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="font-semibold text-base">Follow Us</h1>
            <img src={followUs} alt="Follow us" className="my-3 w-32 sm:w-40" />
            <p className="text-xs sm:text-sm text-gray-400 max-w-xs text-center md:text-left">
              Stay updated with our latest news and features.
            </p>
          </div>
        </div>
        <div className="mt-10 pb-2 text-gray-400">
          <p className="text-xs text-center">
            © 2024 TanzaniaMarketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
