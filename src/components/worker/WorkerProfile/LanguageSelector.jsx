import { useState, useRef, useEffect } from "react";
import { Search, X, Check } from "lucide-react";

// Comprehensive list of languages similar to Google Translate
const AVAILABLE_LANGUAGES = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Cebuano",
  "Chichewa",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Corsican",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Frisian",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Myanmar (Burmese)",
  "Nepali",
  "Norwegian",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Samoan",
  "Scots Gaelic",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Telugu",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
];

const LanguageSelector = ({ selectedLanguages = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter languages based on search query
  const filteredLanguages = AVAILABLE_LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleLanguage = (language) => {
    const isSelected = selectedLanguages.includes(language);
    if (isSelected) {
      onChange(selectedLanguages.filter((lang) => lang !== language));
    } else {
      onChange([...selectedLanguages, language]);
    }
  };

  const handleRemoveLanguage = (language, e) => {
    e.stopPropagation();
    onChange(selectedLanguages.filter((lang) => lang !== language));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Languages Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#74C7F2] focus-within:border-transparent cursor-pointer bg-white hover:border-[#74C7F2] transition-colors"
      >
        <div className="flex flex-wrap gap-2">
          {selectedLanguages.length > 0 ? (
            selectedLanguages.map((language) => (
              <span
                key={language}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-xs font-medium rounded-md"
              >
                {language}
                <button
                  onClick={(e) => handleRemoveLanguage(language, e)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">
              Select languages you speak...
            </span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[320px] flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
            </div>
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto flex-1">
            {filteredLanguages.length > 0 ? (
              <div className="py-1">
                {filteredLanguages.map((language) => {
                  const isSelected = selectedLanguages.includes(language);
                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleToggleLanguage(language)}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <span
                        className={`${
                          isSelected
                            ? "font-medium text-[#74C7F2]"
                            : "text-gray-700"
                        }`}
                      >
                        {language}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#74C7F2]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No languages found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              {selectedLanguages.length} language
              {selectedLanguages.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

