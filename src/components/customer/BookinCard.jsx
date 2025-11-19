import React from "react";
import clockIcon from "../../assets/icons/clock.png";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const BookingCard = ({
  image,
  title,
  workerName,
  time,
  category,
  status,
  price,
  onClick,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full bg-white rounded-2xl shadow-sm p-4 gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Worker Image */}
        {image ? (
          <img
            src={image}
            alt={workerName}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-lg font-bold">
              {title?.charAt(0) || 'S'}
            </span>
          </div>
        )}

        {/* Job Info */}
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">Worker: {workerName}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <img src={clockIcon} alt="" className="w-3 h-3" />
              {time}
            </p>
            <span className="text-xs bg-[#D9F2FF] text-neutral-500 px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-2">
        {/* Status */}
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            status === "Confirmed"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </span>

        {/* View Job Button */}
        <div onClick={onClick || (() => navigate("/job/id"))}>
          <Button
            title={"View Job"}
            className="text-white h-7 w-fit text-xs sm:text-xs px-4 sm:px-4 py-0.5 hover:bg-white hover:text-[#74C7F2] border border-[#74C7F2] bg-[#74C7F2] transition-all duration-300 rounded-xl"
          />
        </div>

        {/* Price */}
        <p className="text-sm font-semibold text-[#74C7F2]">${price}</p>
      </div>
    </div>
  );
};

export default BookingCard;
