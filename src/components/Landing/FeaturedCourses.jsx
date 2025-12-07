import { useEffect, useState } from "react";
import { FiClock, FiUsers } from "react-icons/fi";
import { getFullImageUrl } from "../../utils/fileUrl.js";
import { jinnarCoursesData } from "../../data/jinnarCourses.js";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = () => {
      try {
        setLoading(true);

        // Filter out employee-only courses and limit to 6 public courses
        const publicCourses = jinnarCoursesData
          .filter((course) => !course.employeeOnly)
          .slice(0, 6);

        // Transform courses to match the expected format
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Featured Free Courses
          </h2>
          <p className="text-lg text-black/70 max-w-2xl mx-auto">
            Learn at your own pace and earn verified Jinnar badges with our
            curated selection of professional development courses
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
                  <div className="flex gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-9 bg-gray-200 rounded flex-1" />
                    <div className="h-9 bg-gray-200 rounded flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Course List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <a
                key={course.id}
                href="https://training.jinnar.com/courses"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title || "Course Image"}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 leading-tight">
                    {course.title || "Untitled Course"}
                  </h3>

                  <p className="text-black/70 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {course.description ||
                      "No description available for this course."}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-black/60">
                      <FiClock className="text-secondary" />
                      <span>{course.duration || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black/60">
                      <FiUsers className="text-secondary" />
                      <span>
                        {course.totalEnrollments
                          ? Number(course.totalEnrollments).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <a
            href="https://training.jinnar.com/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            View All Free Courses
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
