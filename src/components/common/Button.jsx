import React from "react";
import { twMerge } from "tailwind-merge";

const Button = ({ title, className }) => {
  return (
    <button
      className={twMerge(
        "btn-base-medium btn-outline text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-black",
        className
      )}
    >
      {title}
    </button>
  );
};

export default Button;
