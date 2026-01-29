import { useNavigate } from "react-router-dom";
import { useFindWorkersQuery } from "../../services/workerApi";
import OptimizedImage from "../common/OptimizedImage";
import { getFullImageUrl } from "../../utils/fileUrl";
import { Star, ALargeSmall, CheckCircle, Briefcase, ArrowRight } from "lucide-react";
import Button from "../common/Button";

const WorkerSection = ({ title, subtitle, queryOptions, limit = 4, viewAllUrl = "/landing-workers", isLanding = true }) => {
    const navigate = useNavigate();

    const {
        data: apiData,
        isLoading,
        isError,
    } = useFindWorkersQuery({
        ...queryOptions,
        limit,
    });

    const workers = apiData?.data || [];

    if (isLoading) {
        return (
            <section className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse mx-auto" />
                    <div className="h-4 w-96 bg-gray-200 rounded mb-8 animate-pulse mx-auto" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(limit)].map((_, i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!isLoading && !isError && workers.length === 0) return null;

    return (
        <section className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4 text-left">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-2 max-w-2xl text-gray-600">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {viewAllUrl && (
                        <button
                            onClick={() => navigate(viewAllUrl)}
                            className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group transition-colors"
                        >
                            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workers.map((worker) => {
                        const rating = typeof worker.rating === "number" ? worker.rating : worker.rating?.average || 0;
                        const reviewCount = worker.rating?.count || 0;
                        const jobsCompleted = worker.jobsCompleted || worker.ordersCompleted || 0;

                        return (
                            <div
                                key={worker._id}
                                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                                onClick={() => navigate(isLanding ? `/landing-worker-profile/${worker.id}` : `/worker-profile/${worker.id}`)}
                            >
                                {/* Profile Image with Status Indicator */}
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-100 to-blue-50">
                                        <OptimizedImage
                                            src={getFullImageUrl(worker.profilePicture)}
                                            alt={worker.name || "Worker"}
                                            className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                            fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || "Worker")}&background=random&color=fff`}
                                        />
                                    </div>
                                    {worker.isVerified && (
                                        <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Pro">
                                            <CheckCircle size={12} fill="currentColor" className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Name & Profession */}
                                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {worker.name || "Jinnar Pro"}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-3 line-clamp-1">
                                    {worker.categories?.[0]?.name || worker.skills?.[0] || "Professional Service"}
                                </p>

                                {/* Rating Pill */}
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-sm font-semibold text-gray-900 mb-4">
                                    <Star size={14} className="text-black fill-black" />
                                    <span>{rating.toFixed(1)}</span>
                                    <span className="text-gray-400 font-normal">({reviewCount})</span>
                                </div>

                                {/* Divider */}
                                <div className="w-full border-t border-gray-50 mb-4"></div>

                                {/* Footer Stats (Horizontal) */}
                                <div className="w-full flex items-center justify-between px-2">
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Jobs Done</span>
                                        <span className="text-sm font-bold text-gray-900">{jobsCompleted || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-10 sm:hidden">
                    <Button
                        title="Explore All Workers"
                        onClick={() => navigate(viewAllUrl)}
                        className="!px-8 !py-3 !text-base" // Override standard button styles if needed
                    />
                </div>
            </div>
        </section>
    );
};

export default WorkerSection;
