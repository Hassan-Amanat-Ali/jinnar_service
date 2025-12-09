import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, X } from "lucide-react";
import logo from "../../assets/logo.png";

const LanguagePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const languages = [
    // Major Continental Languages (75%+ coverage)
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },

    // East African Languages
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "ti", name: "Tigrinya", flag: "🇪🇷" },
    { code: "so", name: "Somali", flag: "🇸🇴" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },

    // West African Languages
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "tw", name: "Twi", flag: "🇬🇭" },
    { code: "bm", name: "Bambara", flag: "🇲🇱" },
    { code: "wo", name: "Wolof", flag: "🇸🇳" },

    // Southern African Languages
    { code: "zu", name: "Zulu", flag: "🇿🇦" },
    { code: "xh", name: "Xhosa", flag: "🇿🇦" },
    { code: "af", name: "Afrikaans", flag: "🇿🇦" },
    { code: "ts", name: "Tsonga", flag: "🇿🇦" },
    { code: "tn", name: "Setswana", flag: "🇧🇼" },
    { code: "st", name: "Sesotho", flag: "🇱🇸" },
    { code: "sn", name: "Shona", flag: "🇿🇼" },
    { code: "ny", name: "Chichewa", flag: "🇲🇼" },

    // Central African Languages
    { code: "ln", name: "Lingala", flag: "🇨🇩" },
    { code: "bem", name: "Bemba", flag: "🇿🇲" },

    // Indian Ocean Islands
    { code: "mg", name: "Malagasy", flag: "🇲🇬" },
  ];

  useEffect(() => {
    const languageSelected = localStorage.getItem("languageSelected");
    if (!languageSelected) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // Delay to allow the page to load
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = (langCode) => {
    setSelectedLang(langCode);

    // Use the global function exposed by GoogleTranslate.jsx
    if (window.setGoogleTranslateLanguage) {
      window.setGoogleTranslateLanguage(langCode);
    } else {
      console.warn("Google Translate function not ready.");
    }

    // Remember the user's choice and hide the popup
    localStorage.setItem("languageSelected", "true");

    // Delay closing to allow user to see the selection
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleClose = () => {
    // If user closes without selecting, default to English
    if (!localStorage.getItem("languageSelected")) {
      handleLanguageSelect("en");
    } else {
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-white">
                <img src={logo} alt="Jinnar" className="h-14 mb-3" />
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={24} />
                  <h2 className="text-2xl font-bold">
                    Select Your Language
                  </h2>
                </div>
                <p className="text-white/90 text-sm">
                  Chagua Lugha Yako / Choose your preferred language
                </p>
              </div>
            </div>

            {/* Language Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-[#74C7F2] bg-gradient-to-r from-[#B6E0FE]/10 to-[#74C7F2]/10 shadow-md"
                          : "border-gray-200 hover:border-[#74C7F2]/50 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-[#0EA5E9]" : "text-gray-700"
                          }`}
                        >
                          {lang.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#74C7F2] flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                You can change this at any time from the language selector in the header
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguagePopup;