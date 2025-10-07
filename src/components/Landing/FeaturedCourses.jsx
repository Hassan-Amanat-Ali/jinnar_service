import { useEffect, useState } from "react";
import { FiClock, FiUsers } from "react-icons/fi";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, orderBy("createdAt", "desc"), limit(6));
        const querySnapshot = await getDocs(q);

        if (!isMounted) return;

        const coursesData = [];
        querySnapshot.forEach((doc) => {
          const courseData = {
            id: doc.id,
            ...doc.data(),
          };
          coursesData.push(courseData);
        });

        console.log("Fetched courses from Firebase:", coursesData); // Debug log
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses from Firebase:", error);
        if (!isMounted) return;

        // Fallback demo data
        setCourses([
          {
            id: "sample-1",
            title: "Professional Communication Basics",
            description:
              "Master essential communication skills for the modern workplace. Learn verbal, written, and digital communication techniques.",
            duration: "2 weeks",
            enrolled: 1250,
            image:
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=240&fit=crop",
            url: "https://jinnar.vercel.app/courses/communication-basics",
          },
          {
            id: "sample-2",
            title: "Time Management Essentials",
            description:
              "Boost your productivity with proven time management strategies and tools for better work-life balance.",
            duration: "1 week",
            enrolled: 890,
            image:
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop",
            url: "https://jinnar.vercel.app/courses/time-management",
          },
          {
            id: "sample-3",
            title: "Tool Safety & Preparedness",
            description:
              "Essential safety protocols and best practices for using tools safely in various work environments.",
            duration: "3 weeks",
            enrolled: 2150,
            image:
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop",
            url: "https://jinnar.vercel.app/courses/tool-safety",
          },
          {
            id: "sample-4",
            title: "Digital Literacy Fundamentals",
            description:
              "Build essential digital skills for today's connected world. Learn computer basics, internet safety, and more.",
            duration: "2 weeks",
            enrolled: 1680,
            image:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop",
            url: "https://jinnar.vercel.app/courses/digital-literacy",
          },
          {
            id: "sample-5",
            title: "Customer Service Excellence",
            description:
              "Deliver outstanding customer experiences with proven service techniques and communication strategies.",
            duration: "1 week",
            enrolled: 950,
            image:
              "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400&h=240&fit=crop",
            url: "https://jinnar.vercel.app/courses/customer-service",
          },
          {
            id: "sample-6",
            title: "Financial Literacy Basics",
            description:
              "Learn fundamental financial concepts including budgeting, saving, and understanding basic financial products.",
            duration: "2 weeks",
            enrolled: 1420,
            image:
              "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=240&fit=crop",
            url: "https://jinnar.vercel.app/courses/financial-literacy",
          },
        ]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
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
              <div
                key={course.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={course.thumbnail}
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

                  <div className="flex items-center gap-3 mt-auto">
                    <a
                      href={course.url || "https://jinnar.vercel.app/courses"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center btn-primary text-sm py-2 px-4"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <a
            href="https://jinnar.vercel.app/courses"
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
