import React from "react";
import Button from "../../components/common/Button";
import icon from "../../assets/icons/star.png";

const Card = ({ place = "home", img = "", title, rating, description }) => {
  return (
    <>
      {place === "home" && (
        <div className="h-82 w-65 md:w-80 lg:w-65 overflow-hidden shadow-sm rounded-2xl border-[#F2F2F2] border-1">
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
    </>
  );
};

export default Card;
