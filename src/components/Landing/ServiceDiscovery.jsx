import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/workerApi";
import { Wrench, Zap, Truck, Home, Briefcase, Monitor, Scissors, Coffee, Palette, Gavel, HeartPulse, GraduationCap, ChevronRight } from "lucide-react";

const ServiceDiscovery = () => {
    const navigate = useNavigate();
    const { data: categories, isLoading } = useGetCategoriesQuery();

    // Helper map to get background image and icon based on category name
    const getCategoryConfig = (name) => {
        const lower = name?.toLowerCase() || "";

        // 1. Agriculture
        if (lower.includes("agri") || lower.includes("farm") || lower.includes("rural") || lower.includes("fishing"))
            return {
                icon: <Home size={20} />,
                image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400", // Farming (Fields)
                jobCount: "200+"
            };

        // 2. Arts & Crafts
        if (lower.includes("art") || lower.includes("craft") || lower.includes("fabrication"))
            return {
                icon: <Palette size={20} />,
                image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=400", // Art/Painting
                jobCount: "200+"
            };

        // 3. Beauty & Wellness
        if (lower.includes("beauty") || lower.includes("grooming") || lower.includes("wellness"))
            return {
                icon: <Scissors size={20} />,
                image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=400", // Spa/Wellness
                jobCount: "900+"
            };

        // 4. Construction & Maintenance
        if (lower.includes("construct") || lower.includes("mainten") || lower.includes("technical"))
            return {
                icon: <Wrench size={20} />,
                image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400", // Construction Site
                jobCount: "850+"
            };

        // 5. Domestic & Household
        if (lower.includes("domestic") || lower.includes("household") || lower.includes("personal"))
            return {
                icon: <Coffee size={20} />,
                image: "https://images.unsplash.com/photo-1527513230969-1e285a392e2d?auto=format&fit=crop&q=80&w=400", // Domestic/Home Interior
                jobCount: "200+"
            };

        // 6. Education
        if (lower.includes("education") || lower.includes("training") || lower.includes("tutor"))
            return {
                icon: <GraduationCap size={20} />,
                image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400", // Education/Books
                jobCount: "200+"
            };

        // 7. Electronics & Appliances
        if (lower.includes("electron") || lower.includes("appliance") || lower.includes("repair"))
            return {
                icon: <Monitor size={20} />,
                image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=400", // Repair
                jobCount: "850+"
            };

        // 8. Events & Media
        if (lower.includes("event") || lower.includes("media") || lower.includes("entertain"))
            return {
                icon: <Zap size={20} />,
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400", // Event
                jobCount: "200+"
            };

        // Other Fallbacks
        if (lower.includes("move") || lower.includes("transport"))
            return {
                icon: <Truck size={20} />,
                image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400",
                jobCount: "100+"
            };

        if (lower.includes("health"))
            return {
                icon: <HeartPulse size={20} />,
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400",
                jobCount: "150+"
            };

        // Default Fallback
        return {
            icon: <Briefcase size={20} />,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400", // Corporate/Office
            jobCount: "100+"
        };
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/landing-services?category=${categoryId}`);
    };

    if (isLoading) {
        return (
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-10 animate-pulse" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const displayedCategories = categories?.slice(0, 8) || [];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 text-left">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Popular Services Near You
                        </h2>
                        <p className="mt-3 text-lg text-gray-500">
                            Discover the most requested services in your area with verified professionals
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/landing-services')}
                        className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group transition-colors"
                    >
                        View All Services <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    {displayedCategories.map((category) => {
                        const style = getCategoryConfig(category.name);
                        return (
                            <div
                                key={category._id}
                                onClick={() => handleCategoryClick(category._id)}
                                className="group relative aspect-square rounded-2xl sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 isolate"
                            >
                                {/* Background Image */}
                                <img
                                    src={style.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400"; // Fallback to safe office image
                                    }}
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col justify-end h-full">
                                    <div className="flex items-center gap-2 mb-1 text-white/90">
                                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                                            {style.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5 tracking-tight group-hover:translate-x-1 transition-transform line-clamp-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-medium text-white/70">
                                        {style.jobCount} Jobs
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <button
                        onClick={() => navigate('/landing-services')}
                        className="inline-flex items-center px-8 py-3.5 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
                    >
                        View All Services
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServiceDiscovery;

