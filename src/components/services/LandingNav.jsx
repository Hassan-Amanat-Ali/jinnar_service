import React from "react";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../../services/workerApi";
import { useSearchParams } from "react-router-dom";

// Helper function to format category/subcategory names nicely
const formatName = (name) => {
  if (!name) return "";
  // Replace dashes and underscores with spaces, then capitalize each word
  return name
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Nav = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [showSubcategories, setShowSubcategories] = React.useState(false);

  // Get subcategories for selected category
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery(selectedCategory?._id, {
      skip: !selectedCategory?._id,
    });

  // Categories array from API
  const categories = React.useMemo(() => {
    return categoriesData || [];
  }, [categoriesData]);

  // Subcategories array from API
  const subcategories = React.useMemo(() => {
    return subcategoriesData || [];
  }, [subcategoriesData]);

  // Set initial selection from URL params
  React.useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const found = categories.find(
        (cat) =>
          cat.value === categoryParam ||
          cat.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (found) {
        setSelectedCategory(found);
        setShowSubcategories(true);
      }
    }
  }, [categoryParam, categories]);

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();

    // Save scroll position
    const scrollY = window.scrollY;

    if (category === "All") {
      setSelectedCategory(null);
      setShowSubcategories(false);
      setSearchParams({}, { replace: true });
    } else {
      setSelectedCategory(category);
      setShowSubcategories(true);
      setSearchParams({ category: category.value }, { replace: true });
    }

    // Restore scroll position after React updates - use multiple frames for reliability
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    });
  };

  const handleSubcategoryClick = (e, subcategory) => {
    e.preventDefault();
    e.stopPropagation();

    // Save scroll position
    const scrollY = window.scrollY;

    setSearchParams(
      { category: selectedCategory.value, subcategory: subcategory.value },
      { replace: true }
    );

    // Restore scroll position after React updates - use multiple frames for reliability
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    });
  };

  const isLoading = categoriesLoading;

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

      {/* Categories Row */}
      <div className="w-full flex justify-center px-2 sm:px-4">
        <div className="max-w-[1200px] w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-start gap-2 sm:gap-3 py-3">
            {isLoading ? (
              <div className="text-gray-500 text-sm">Loading categories...</div>
            ) : (
              <>
                {/* All Button */}
                <button
                  className={`cursor-pointer shrink-0 text-xs px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap transition-all duration-200 ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium"
                      : "bg-[#F2F2F2] text-gray-600 hover:bg-gray-300"
                  }`}
                  onClick={(e) => handleCategoryClick(e, "All")}
                >
                  All
                </button>

                {/* Category Buttons */}
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className={`cursor-pointer shrink-0 text-xs px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap transition-all duration-200 ${
                      selectedCategory?._id === category._id
                        ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium"
                        : "bg-[#F2F2F2] text-gray-600 hover:bg-gray-300"
                    }`}
                    onClick={(e) => handleCategoryClick(e, category)}
                  >
                    {formatName(category.name)}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subcategories Row - Shows when a category is selected */}
      {showSubcategories && selectedCategory && (
        <div className="w-full flex justify-center px-2 sm:px-4 bg-gray-50">
          <div className="max-w-[1200px] w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-start gap-2 sm:gap-3 py-2">
              {subcategoriesLoading ? (
                <div className="text-gray-400 text-xs">
                  Loading subcategories...
                </div>
              ) : subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <button
                    key={subcategory._id}
                    className={`cursor-pointer shrink-0 text-xs px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                      subcategoryParam === subcategory.value
                        ? "bg-[#74C7F2] text-white font-medium"
                        : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-200"
                    }`}
                    onClick={(e) => handleSubcategoryClick(e, subcategory)}
                  >
                    {formatName(subcategory.name)}
                  </button>
                ))
              ) : (
                <div className="text-gray-400 text-xs">
                  No subcategories available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <hr className="border-[1px] border-t border-gray-200 mt-2 sm:mt-4" />
    </>
  );
};

export default Nav;
