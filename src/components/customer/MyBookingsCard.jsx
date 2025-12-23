import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, DollarSign, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageButton from "../common/MessageButton";
import { reverseGeocode } from "../../utils/fileUrl";

const JobCard = ({
  serviceImage,
  serviceTitle,
  serviceDescription,
  emergencyTag,
  statusTag,
  workerImage,
  workerName,
  workerRating,
  date,
  time,
  location,
  price,
  onViewDetails,
  bookingId,
  workerId,
  messageButtonRole,
}) => {
  const navigate = useNavigate();
  const [parsedLocation, setParsedLocation] = useState("");

  useEffect(() => {
    setParsedLocation(reverseGeocode(location));
  }, [location]);

  const statusClasses =
    statusTag === "Completed"
      ? "bg-green-100 text-green-700"
      : statusTag === "In Progress"
      ? "bg-yellow-100 text-yellow-700"
      : statusTag === "Accepted"
      ? "bg-green-100 text-gray-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 border border-gray-100 sm:h-92">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-h-12 sm:h-18">
        {serviceImage ? (
          <img
            src={serviceImage}
            alt="Service"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
            <span className="text-blue-600 text-xs font-semibold">
              {serviceTitle?.charAt(0) || "S"}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-lg text-gray-800 truncate font-semibold">
            {serviceTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-1">
            {serviceDescription.slice(0, 30)}...
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
          {emergencyTag && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-lg bg-red-100 text-red-600 whitespace-nowrap font-light">
              {emergencyTag}
            </span>
          )}
          <span
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-lg font-light whitespace-nowrap ${statusClasses}`}
          >
            {statusTag}
          </span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 bg-[#E3F3FF] p-2 sm:p-3 rounded-xl">
        {workerImage ? (
          <img
            src={workerImage}
            alt="Worker"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {workerName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "W"}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm text-gray-800 truncate font-semibold">
            {workerName}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Star
              size={10}
              className="text-yellow-500 fill-yellow-500 sm:w-3 sm:h-3"
            />
            {workerRating?.average}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 p-2 gap-2 sm:gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 sm:h-25">
        <div className="flex gap-1 sm:gap-2">
          <Calendar size={14} className="text-[#74C7F2] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium">Date</span>
            <span className="truncate font-semibold text-xs">{date}</span>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Clock size={14} className="text-[#74C7F2] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Time</span>
            <span className="truncate font-semibold text-xs capitalize">
              {time}
            </span>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 xs:col-span-2">
          <MapPin size={14} className="text-[#74C7F2] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Location</span>
            <span className="truncate text-xs font-semibold w-30">
              {parsedLocation}
            </span>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <DollarSign size={14} className="text-[#74C7F2] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Fee</span>
            <span className="truncate font-semibold text-xs">{price}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
        <button
          className="flex-1 px-3 sm:px-4 py-2 rounded-xl bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium hover:opacity-80 transition whitespace-nowrap cursor-pointer text-xs sm:text-sm"
          onClick={
            onViewDetails || (() => navigate(`/customer-booking/${bookingId}`))
          }
        >
          View Detail
        </button>

        <MessageButton
          participantId={workerId}
          participantRole={messageButtonRole ? "customer" : "worker"}
          participantName="Worker"
          size="small"
          className="flex-1 text-xs sm:text-sm"
        />
      </div>
    </div>
  );
};

export default JobCard;
