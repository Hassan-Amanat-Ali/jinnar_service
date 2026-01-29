import { useNavigate } from "react-router-dom";
import { useSearchGigsQuery } from "../../services/workerApi";
import WorkerCard from "../services/WorkerCard";
import { ArrowRight } from "lucide-react";
import { getFullImageUrl } from "../../utils/fileUrl";

const GigSection = ({ title, subtitle, queryOptions, limit = 4, viewAllUrl = "/landing-services" }) => {
    const navigate = useNavigate();

    // Construct query params
    const { data, isLoading } = useSearchGigsQuery({
        ...queryOptions,
        limit: limit
    });

    const gigs = data?.gigs || [];

    if (isLoading) {
        return (
            <section className="py-12 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-96 bg-gray-200 rounded mb-8 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(limit)].map((_, i) => (
                            <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (gigs.length === 0) return null;

    return (
        <section className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 text-left">
                    <div className="max-w-xl">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-2 text-lg text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate(viewAllUrl)}
                        className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group transition-colors"
                    >
                        View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {gigs.map((gig) => {
                        // Map API response to WorkerCard props
                        const pricing = gig.pricing || {};
                        let rate = "Contact for pricing";
                        if (pricing.fixed?.enabled) rate = pricing.fixed.price; // Pass as number if possible for formatting
                        else if (pricing.hourly?.enabled) rate = `${pricing.hourly.rate}/hr`;

                        // Attempt to find job count from various possible locations
                        const jobsCount = gig.ordersCompleted || gig.sellerId?.ordersCompleted || gig.sellerId?.jobsCompleted || 0;

                        return (
                            <WorkerCard
                                key={gig.id}
                                gigId={gig._id}
                                sellerId={gig.sellerId?._id}
                                name={gig.title}
                                image={gig.images?.[0]?.url
                                    ? getFullImageUrl(gig.images[0].url)
                                    : "https://via.placeholder.com/300x200"}
                                rating={gig.sellerId?.rating?.average || 0}
                                reviews={gig.sellerId?.rating?.count || 0}
                                available={true}
                                experience={gig.sellerId?.yearsOfExperience || 0}
                                distance="Online"
                                bio={gig.description}
                                skills={gig.subcategories?.map(s => s.name) || []}
                                jobsCompleted={jobsCount}
                                rate={rate}
                                sellerName={gig.sellerId?.name}
                                sellerImage={gig.sellerId?.profilePicture}
                            />
                        );
                    })}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <button
                        onClick={() => navigate(viewAllUrl)}
                        className="inline-flex items-center gap-2 text-blue-600 font-semibold"
                    >
                        View All {title} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GigSection;
