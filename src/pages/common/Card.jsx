import React from "react";
import Button from "../../components/common/Button";
import icon from "../../assets/icons/star.png";

const Card = ({
  place = "home",
  img = "",
  title,
  rating,
  description,
  starting,
  status,
}) => {
  return (
    <>
      {place === "home" && (
        <div className="h-82 w-65 md:w-80 lg:w-70 overflow-hidden shadow-sm rounded-2xl border-[#F2F2F2] border-1">
          <div className="h-50 w-full">
            <img src={img} alt={place} className="w-full h-full object-cover" />
          </div>
          <div className="px-3 pt-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{title}</h2>
            <div className="flex items-center gap-1.5">
              <img src={icon} alt="" className="w-3 h-3 object-cover" />
              <p className="text-sm font-semibold">{rating}</p>
            </div>
          </div>
          <p className="px-3 h-10 mt-1.5 overflow-hidden text-xs font-light">
            {description.slice(0, 70)}...
          </p>
          <div className="px-3 py-2 flex justify-center">
            <Button
              title="View All"
              className={"text-white font-semibold sm:text-sm h-9 sm:px-20 "}
            />
          </div>
        </div>
      )}
      {place === "customer" && (
        <div className="h-82 w-65 md:w-80 lg:w-75 overflow-hidden shadow-sm rounded-2xl border-[#F2F2F2] border-1">
          <div className="relative">
            <div className="h-50 w-full">
              <img
                src={img}
                alt={place}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 left-2 bg-white/30 backdrop-blur-sm py-0.5 sm:py-1 px-2 rounded-md text-xs sm:rounded-lg shadow-sm font-semibold">
              <h2>{status}</h2>
            </div>
          </div>
          <div className="px-3 pt-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{title}</h2>
            <div className="flex items-center gap-1.5">
              <img src={icon} alt="" className="w-3 h-3 object-cover" />
              <p className="text-sm font-semibold">{rating}</p>
            </div>
          </div>
          <p className="px-3 h-4 mt-1.5 overflow-hidden text-xs font-light">
            {description.slice(0, 35)}...
          </p>
          <h1 className="text-sm font-base px-3 text-[#74C7F2]">
            Starting from {starting}
          </h1>
          <div className="px-3 py-2 flex justify-center">
            <Button
              title="View Details"
              className={
                "text-white text-nowrap font-semibold sm:text-sm h-9 sm:px-18 rounded-xl hover:bg-white hover:text-[#74C7F2] border border-[#74C7F2] bg-[#74C7F2] transition-all duration-300"
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
