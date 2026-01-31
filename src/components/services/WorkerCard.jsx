import React from "react";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "../common/OptimizedImage";

const WorkerCard = ({
  name, // This is actually the Gig Title based on GigSection usage
  image,
  rating,
  reviews,
  available,
  sellerId,
  gigId,
  rate, // "TZS 50,000" or similar
  // Props that might contain the "missing" job count
  jobsCompleted,
  sellerName,
  sellerImage
}) => {
  const navigate = useNavigate();

  // Format rating to 1 decimal
  const formattedRating = Number(rating).toFixed(1);

  return (
    <div
      className="group flex flex-col w-full bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/book-worker/${sellerId}/${gigId}`)}
    >
      {/* 1. Gig Image (Cover) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <OptimizedImage
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Heart Icon Overlay (Placeholder for wishlist) */}
        {/* <div className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white text-white hover:text-red-500 transition-all">
          <Heart size={16} fill={false ? "currentColor" : "none"} />
        </div> */}
      </div>

      {/* 2. Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Seller Info (Mini Avatar + Name) */}
        {/* Note: GigSection currently doesn't pass sellerImage/sellerName explicitly to WorkerCard, 
            it passes 'name' as gig.title. We might need to adjust partials if we want seller avatar here. 
            For now, we'll keep it simple or assume we might update GigSection to pass seller details later.
        */}
        <div className="flex items-center gap-2">
          {/* If we had seller avatar, it would go here. For now, showing 'Level' or just spacing */}
          <h3 className="flex-1 font-medium text-gray-900 text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="text-black fill-black" />
          <span className="font-bold text-gray-900">{formattedRating}</span>
          <span className="text-gray-500">({reviews})</span>
        </div>

        {/* Footer: Price & Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          {/* Job Count - attempting to fix the "0 jobs" issue by showing it only if > 0 */}
          <div className="text-xs text-gray-500 font-medium">
            {/* Fallback to checking if available/pro if jobs is 0, or just hide it */}
            {/* {jobsCompleted > 0 && `${jobsCompleted} jobs done`} */}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-gray-400">Starting at</span>
            <span className="text-base font-bold text-gray-900">
              {typeof rate === "number" ? `TZS ${rate.toLocaleString()}` : rate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
