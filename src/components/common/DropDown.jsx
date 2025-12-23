import { useState, useRef, useEffect } from "react";
import { ChevronDown, Star } from "lucide-react";
import { twMerge } from "tailwind-merge";

function Dropdown({
  icon,
  placeholder,
  options,
  isOpen,
  onToggle,
  onClose,
  onSelect,
  className = "",
  showStars = false,
  value = "",
}) {
  const [selected, setSelected] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (value !== undefined && value !== null) setSelected(value);
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;

    const close = () => (onClose ? onClose() : onToggle());

    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) close();
    };

    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, onToggle]);

  const displayValue = selected || value || "";

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={
          i < parseInt(rating.charAt(0))
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }
      />
    ));

  const handleSelect = (opt, e) => {
    e.stopPropagation();
    setSelected(opt);
    onSelect?.(opt);
    onClose ? onClose() : onToggle();
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={onToggle}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={twMerge(
          "flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 transition cursor-pointer",
          className
        )}
      >
        {icon}
        <span className="flex-1">{displayValue || placeholder}</span>
        <ChevronDown
          size={16}
          className={`ml-2 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-48 overflow-hidden">
          <div className="max-h-48 overflow-y-auto overflow-x-hidden text-start scrollbar-thin">
            {options.map((opt, i) => (
              <div
                key={i}
                onClick={(e) => handleSelect(opt, e)}
                className="px-2 py-2.5 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-700 cursor-pointer transition-all border-b border-gray-50 last:border-b-0"
              >
                {showStars && opt.includes("Star") ? (
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    <div className="flex items-center space-x-0.5">
                      {renderStars(opt)}
                    </div>
                  </div>
                ) : (
                  opt
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
