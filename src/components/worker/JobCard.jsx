import { MapPin, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({
  customerName,
  jobType,
  timeAgo,
  distance,
  price,
  urgency,
  image,
  timeframe,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Job Image */}
      <div className="h-32 bg-gray-200 overflow-hidden">
        <img src={image} alt={jobType} className="w-full h-full object-cover" />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Header with Customer Name and Urgency */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{customerName}</h3>
          {urgency && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
              {urgency}
            </span>
          )}
        </div>

        {/* Job Type */}
        <p className="text-sm text-gray-600 mb-3">{jobType}</p>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <DollarSign className="w-4 h-4" />
            <span>{price}</span>
          </div>

          {timeframe && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{timeframe}</span>
            </div>
          )}
        </div>

        {/* View Job Button */}
        <button
          className="w-full bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          onClick={() => {
            navigate("/job/id");
          }}
        >
          View Job
        </button>
      </div>
    </div>
  );
};

export default JobCard;
