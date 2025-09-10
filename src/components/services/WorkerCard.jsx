import React from "react";
import { Star, Clock, MapPin, Eye } from "lucide-react";

const WorkerCard = ({
  name,
  image,
  rating,
  reviews,
  available,
  experience,
  distance,
  bio,
  skills,
  jobsCompleted,
  rate,
}) => {
  return (
    <div className="w-full max-w-sm h-90 rounded-2xl shadow p-4 text-gray-800 text-sm bg-white border-1 border-gray-300">
      {/* Top Section */}
      <div className="flex items-start gap-3">
        <img
          src={image}
          alt={name}
          className="w-15 h-15 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base">{name}</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                available
                  ? "bg-green-100 text-black"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {available ? "Available" : "Busy"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star size={14} fill="currentColor" />
            <span className="font-medium text-black">{rating}</span>
            <span className="text-gray-500 text-xs">({reviews} Reviews)</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-3 mt-5 text-gray-600 text-xs">
        <span className="flex items-center gap-1">
          <Clock size={14} color="#74C7F2" /> {experience} Exp
        </span>
        <div className="bg-gray-400 h-[15px] w-[1px]"></div>
        <span className="flex items-center gap-1">
          <MapPin size={14} color="#74C7F2" /> {distance} Away
        </span>
      </div>

      {/* Bio */}
      <p className="mt-3.5 text-black text-base leading-tight ">
        {bio.split(" ").splice(0, 20).join(" ")}...
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-2.5">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-xs rounded-lg font-"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-around items-center mt-4 bg-gray-50 rounded-xl p-2 text-xs py-3.5">
        <div className="text-center">
          <p className="font-semibold">{jobsCompleted}</p>
          <p className="text-gray-500">Jobs</p>
        </div>
        <div className="w-px bg-gray-200 h-6" />
        <div className="text-center">
          <p className="font-semibold">${rate}/hr</p>
          <p className="text-gray-500">Rate</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3">
        <button className="flex items-center justify-center gap-1 border rounded-lg w-1/2 py-2.5 text-xs font-medium text-gray-400 hover:text-gray-600 hover:border-gray-400 transition cursor-pointer">
          <Eye size={14} /> View
        </button>
        <button className="w-1/2 py-2.5 rounded-lg bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-xs font-medium cursor-pointer">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;
