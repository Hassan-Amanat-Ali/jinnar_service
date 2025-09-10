import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import { twMerge } from "tailwind-merge";

function Dropdown({
  icon,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
  className = "",
  showStars = false,
}) {
  const [selected, setSelected] = useState("");

  const renderStars = (rating) => {
    const stars = [];
    const numStars = parseInt(rating.charAt(0));

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={`${
            i <= numStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        className={twMerge(
          "flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 transition cursor-pointer",
          className
        )}
        onClick={onToggle}
      >
        {icon}
        <span className="flex-1">{selected || placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                setSelected(opt);
                onSelect && onSelect(opt);
                onToggle(); // Close after selection
              }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 cursor-pointer transition first:rounded-t-lg last:rounded-b-lg"
            >
              {showStars && opt.includes("Star") ? (
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  <div className="flex items-center space-x-0.5 ml-2">
                    {renderStars(opt)}
                  </div>
                </div>
              ) : (
                opt
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
