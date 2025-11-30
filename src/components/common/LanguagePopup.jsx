import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import logo from "../../assets/logo.png";

const LanguagePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // For testing: Always show the popup after a delay.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); // Delay to allow the page to load
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageSelect = (langCode) => {
    // Use the global function exposed by GoogleTranslate.jsx
    if (window.setGoogleTranslateLanguage) {
      window.setGoogleTranslateLanguage(langCode);
    } else {
      console.warn("Google Translate function not ready.");
    }

    // Remember the user's choice and hide the popup
    // localStorage.setItem("languageSelected", "true"); // Commented out for testing
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <img src={logo} alt="Jinnar" className="h-16 mx-auto mb-4" />

            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="text-gray-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Select Your Language
              </h2>
            </div>

            <p className="text-gray-600 mb-8">
              Chagua Lugha Yako / Choose your preferred language.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* English Button */}
              <button
                onClick={() => handleLanguageSelect("en")}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-lg"
              >
                English
              </button>

              {/* Swahili Button */}
              <button
                onClick={() => handleLanguageSelect("sw")}
                className="flex-1 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
              >
                Kiswahili
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              You can change this at any time from the header.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguagePopup;