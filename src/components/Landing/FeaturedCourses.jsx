import { useEffect, useState, useRef } from "react";
import { FiClock, FiUsers, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { jinnarCoursesData } from "../../data/jinnarCourses.js";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCourses = () => {
      try {
        setLoading(true);

        const publicCourses = jinnarCoursesData
          .filter((course) => !course.employeeOnly)
          .slice(0, 10); // Load enough to scroll

        const transformedCourses = publicCourses.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          duration: course.duration,
          enrolled: 0,
          image: course.thumbnail,
          url: course.filePath,
          totalEnrollments: 0,
        }));

        setCourses(transformedCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const containerWidth = current.clientWidth;
      // Scroll one full viewport width minus a gentle padding to ensure next items snap correctly
      const scrollAmount = containerWidth * 0.9;

      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16 bg-white border-t border-gray-100 group/section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Free Courses</h2>
            <p className="mt-3 text-lg text-gray-500">Upskill to earn more on Jinnar</p>
          </div>

          <a
            href="https://training.jinnar.com/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            view all <FiArrowRight />
          </a>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex overflow-hidden gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[300px] w-[300px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons - Absolute Positioned */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all duration-200 opacity-90 hover:opacity-100 border border-gray-100"
              aria-label="Scroll left"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all duration-200 opacity-90 hover:opacity-100 border border-gray-100"
              aria-label="Scroll right"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Course List - Horizontal Slider */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth items-stretch"
            >
              {courses.map((course) => (
                <a
                  key={course.id}
                  href="https://training.jinnar.com/courses"
                  target="_blank"
                  rel="noopener noreferrer"
                  // Mobile: Full width (calc(100vw - 32px)). Desktop: Fixed width roughly 1/4th or 1/3rd but fluid
                  className="snap-center relative flex-shrink-0 w-[calc(100vw-48px)] sm:w-[300px] lg:w-[280px] xl:w-[290px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group/card"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-56 sm:h-44">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop";
                      }}
                    />
                    <div className="absolute bottom-3 right-3 bg-blue-500/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm">
                      Free
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover/card:text-blue-600 transition-colors">
                      {course.title || "Untitled Course"}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                      {course.description || "No description available."}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <FiClock className="text-blue-500" />
                        <span>{course.duration || "N/A"}</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover/card:bg-blue-600 group-hover/card:text-white transition-colors">
                        Start Learning
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 sm:hidden text-center">
          <a
            href="https://training.jinnar.com/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 font-medium bg-blue-50 px-6 py-2 rounded-full"
          >
            View all free courses <FiArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;

