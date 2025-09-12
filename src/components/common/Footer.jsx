import growing from "../../assets/images/growing.jpg";
import arrow from "../../assets/icons/arrow.png";
import bubble1 from "../../assets/icons/bubble1.png";
import followUs from "../../assets/icons/follow-us.png";

const Footer = () => {
  return (
    <footer>
      <div className="text-center py-4 sm:py-6 mt-6 sm:mt-8 relative max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl xl:max-w-6xl 2xl:max-w-6xl h-50 sm:h-60 md:h-75 lg:h-80 xl:h-85 mb-12 sm:mb-16 md:mb-20 mx-auto px-4 rounded-lg overflow-hidden">
        <img
          src={growing}
          alt=""
          className="w-full h-full absolute top-0 left-0 object-cover rounded-2xl"
        />
        <div className="z-100 relative ">
          <h1 className="overflow-hidden text-sm w-60 sm:w-full sm:text-4xl sm:font-bold sm:mt-10 text-center mx-auto z-30 text-white">
            Join thousands of happy customers today!
          </h1>
          <p className="overflow-hidden text-sm w-60 text-center md:w-130 lg:w-180  sm:text-xl  mx-auto z-30 text-white mt-2.5">
            Experience the difference with our verified professionals. Quality
            service, guaranteed satisfaction.
          </p>
          <button className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-black flex items-center gap-1.5 sm:gap-2 mx-auto mt-4 font-semibold">
            Start Booking Now
            <img src={arrow} alt="" className="w-3 sm:w-4 h-2.5 sm:h-3" />
          </button>
        </div>
        <img
          src={bubble1}
          alt=""
          className="absolute top-0 z-300 bottom-8 sm:bottom-12 md:bottom-15 left-4 sm:left-12 md:left-20 lg:left-28 w-8 sm:w-10 md:w-12 lg:w-15"
        />

        <div className=" top-0 bg-gradient-to-r from-[#0225A1] to-[#8203E9] absolute opacity-80 z-10 rounded-lg sm:rounded-xl md:rounded-2xl left-0 w-full h-full"></div>
        <img
          src={bubble1}
          alt=""
          className="absolute z-300 bottom-0 right-4 sm:right-12 md:right-20 lg:right-34 w-12 sm:w-16 md:w-20 lg:w-25"
        />
      </div>

      <div className="bg-[#0C0D1D] py-8 sm:py-10 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 sm:px-10 lg:px-16">
          {/* Brand Info */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-base">Tanzania Marketplace</h1>
            <p className="text-xs sm:text-sm mt-2 text-gray-400 leading-relaxed">
              Connecting skilled informal workers with customers in communities
              worldwide. Building trust, creating opportunities.
            </p>
            <div className="text-xs sm:text-sm mt-6 space-y-1 font-light text-gray-400">
              <p>hello@workconnect.com</p>
              <p>+1 (555) 123-4567</p>
              <p>San Francisco, CA</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-base">Quick Links</h1>
            <ul className="text-xs sm:text-sm mt-3 space-y-2 font-light text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">
                Home
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                How It Works
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Services
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Workers
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                About Us
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-base">Popular Services</h1>
            <ul className="text-xs sm:text-sm mt-3 space-y-2 font-light text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">
                Help Center
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                FAQ
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Contact Us
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Privacy Policy
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Terms of Service
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
      </div>
    </footer>
  );
};

export default Footer;
