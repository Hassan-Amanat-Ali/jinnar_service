import React from "react";
import { Link } from "react-router-dom";
import JobCard from "../JobCard";
import worker1 from "../../../assets/images/worker-services-1.jpg";
import worker2 from "../../../assets/images/worker-services-2.jpg";
import worker3 from "../../../assets/images/worker-services-3.jpg";
import worker4 from "../../../assets/images/worker-services-4.jpg";

const LatestJobs = () => {
  const jobsData = [
    {
      id: 1,
      customerName: "Sarah Johnson",
      jobType: "Kitchen Sink Repair",
      timeAgo: "2 minutes ago",
      distance: "$40-700",
      price: "$40-700",
      urgency: "Emergency",
      image: worker1, // You'll need to add appropriate images
      timeframe: "Today",
    },
    {
      id: 2,
      customerName: "David Chen",
      jobType: "Bathroom Plumbing",
      timeAgo: "16 minutes ago",
      distance: "$100-150",
      price: "$100-150",
      image: worker2,
      timeframe: "Tomorrow",
    },
    {
      id: 3,
      customerName: "Emily Davis",
      jobType: "Water Heater Installation",
      timeAgo: "23 minutes ago",
      distance: "$80-100",
      price: "$80-100",
      image: worker3,
      timeframe: "This Week",
    },
    {
      id: 4,
      customerName: "Robert Wilson",
      jobType: "Pipe Replacement",
      timeAgo: "23 minutes ago",
      distance: "$80-100",
      price: "$80-100",
      image: worker4,
      timeframe: "Today",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5 my-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Latest Job Requests Near You
          </h2>
          <p className="text-gray-600">
            Browse and apply to job opportunities in your area.
          </p>
        </div>
        <Link
          to="/jobs"
          className="px-4 py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg text-sm font-medium hover:bg-[#74C7F2] hover:text-white transition-colors"
        >
          View All Services
        </Link>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobsData.map((job) => (
          <JobCard
            key={job.id}
            customerName={job.customerName}
            jobType={job.jobType}
            timeAgo={job.timeAgo}
            distance={job.distance}
            price={job.price}
            urgency={job.urgency}
            image={job.image}
            timeframe={job.timeframe}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestJobs;
