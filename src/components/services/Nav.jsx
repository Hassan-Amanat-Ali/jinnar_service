import React from "react";
import { useGetCategoriesQuery } from "../../services/workerApi";
import { useNavigate, useSearchParams } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();

  const categoryParam = searchParams.get("category");
  const [selectedService, setSelectedService] = React.useState(
    categoryParam || "All"
  );

  // Combine "All" with API categories
  const services = React.useMemo(() => {
    const apiCategories = categoriesData?.skills || [];
    return [
      "All",
      ...apiCategories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    ];
  }, [categoriesData]);

  React.useEffect(() => {
    if (categoryParam) {
      setSelectedService(
        categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
      );
    }
  }, [categoryParam]);

  const handleServiceClick = (service) => {
    setSelectedService(service);

    // Update URL with filter
    if (service === "All") {
      navigate("/services");
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("category", service.toLowerCase());
      navigate(`/services?${params.toString()}`);
    }
  };

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="w-full flex justify-center px-2 sm:px-4">
        <div className="max-w-[1200px] w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-start gap-2 sm:gap-3 py-3">
            {isLoading ? (
              <div className="text-gray-500 text-sm">Loading categories...</div>
            ) : (
              services.map((service, index) => (
                <button
                  key={index}
                  className={`cursor-pointer shrink-0 text-xs px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap transition-all duration-200 ${
                    selectedService === service
                      ? "bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium"
                      : "bg-[#F2F2F2] text-gray-600 hover:bg-gray-300"
                  }`}
                  onClick={() => handleServiceClick(service)}
                >
                  {service}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <hr className="border-[1px] border-t border-gray-200 mt-2 sm:mt-4" />
    </>
  );
};

export default Nav;
