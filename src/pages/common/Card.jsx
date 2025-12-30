import React from "react";
import Button from "../../components/common/Button";
import icon from "../../assets/icons/star.png";
import OptimizedImage from "../../components/common/OptimizedImage";
import { useNavigate } from "react-router-dom";

// Single Card Component
const SingleCard = ({
  place = "home",
  img = "",
  title,
  rating,
  description,
  starting,
  status,
  gigId,
  sellerId,
}) => {
  const navigate = useNavigate();

  if (place === "customer") {
    return (
      <div className="w-full h-auto overflow-hidden shadow-sm rounded-2xl border-[#F2F2F2] border-1 bg-white">
        <div className="relative">
          <div className="h-48 sm:h-50 w-full">
            <OptimizedImage
              src={img}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          {status && (
            <div className="absolute top-2 left-2 bg-white/30 backdrop-blur-sm py-0.5 sm:py-1 px-2 rounded-md text-xs sm:rounded-lg shadow-sm font-semibold">
              <span>{status}</span>
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold truncate flex-1">{title}</h2>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <img src={icon} alt="" className="w-3 h-3 object-cover" />
              <p className="text-sm font-semibold">{rating}</p>
            </div>
          </div>
          <p className="text-xs font-light text-gray-600 line-clamp-2">
            {description}
          </p>
          {starting && (
            <p className="text-sm font-medium text-[#74C7F2]">
              Starting {starting}
            </p>
          )}
          
          {/* Two buttons for customer gigs */}
          <div className="flex gap-2 pt-1">
            <button
              className="flex-1 text-white text-nowrap font-semibold text-xs h-8 rounded-lg bg-[#74C7F2] hover:bg-[#5bb3e8] transition-all duration-300"
              onClick={() => navigate(`/book-worker/${sellerId}/${gigId}`)}
            >
              Book Now
            </button>
            <button
              className="flex-1 text-[#74C7F2] text-nowrap font-semibold text-xs h-8 rounded-lg border border-[#74C7F2] hover:bg-[#74C7F2] hover:text-white transition-all duration-300"
              onClick={() => navigate(`/worker-profile/${sellerId}`)}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default "home" variant
  return (
    <div className="w-full h-auto overflow-hidden shadow-sm rounded-2xl border-[#F2F2F2] border-1 bg-white">
      <div className="h-48 sm:h-50 w-full">
        <OptimizedImage
          src={img}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold truncate flex-1">{title}</h2>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            <img src={icon} alt="" className="w-3 h-3 object-cover" />
            <p className="text-sm font-semibold">{rating}</p>
          </div>
        </div>
        <p className="text-xs font-light text-gray-600 line-clamp-3">
          {description}
        </p>
        <div className="pt-1" onClick={() => navigate("/services/slug")}>
          <Button
            onClick={() => navigate("/services/slug")}
            title="View Details"
            className="text-white font-semibold text-xs sm:text-sm h-8 sm:h-9 w-full rounded-xl bg-[#74C7F2] hover:bg-[#5bb3e8] transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

// Main Card Component with Grid Layout
const Card = ({
  services = [],
  place = "home",
  // Single card props (backward compatibility)
  img,
  title,
  rating,
  description,
  starting,
  status,
  gigId,
  sellerId,
}) => {
  // If services array is provided, render grid
  if (services && services.length > 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service) => (
            <SingleCard
              key={service.id}
              place={place}
              img={service.img}
              title={service.title}
              rating={service.rating}
              description={service.description}
              starting={service.starting}
              status={service.status}
              gigId={service.gigId}
              sellerId={service.sellerId}
            />
          ))}
        </div>
      </div>
    );
  }

  // Single card (backward compatibility)
  return (
    <SingleCard
      place={place}
      img={img}
      title={title}
      rating={rating}
      description={description}
      starting={starting}
      status={status}
      gigId={gigId}
      sellerId={sellerId}
    />
  );
};

export default Card;
