import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Check,
  Zap,
  X,
  RotateCcw,
  Eye,
  Calendar1,
  DollarSign,
} from "lucide-react";

const jobs = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    service: "Plumbing",
    rating: 4.8,
    reviews: 23,
    tag: "Emergency",
    location: "Dar es Salaam, Kinondoni",
    distance: "2.3 km",
    date: "11/4/2024",
    time: "09:00 AM",
    description: "Kitchen sink is completely blocked and water is overflowing",
    price: "TZS 95,000",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    service: "House Cleaning",
    rating: 4.6,
    reviews: 18,
    tag: "New",
    location: "Dar es Salaam, Mbezi",
    distance: "4.7 km",
    date: "11/5/2024",
    time: "10:30 AM",
    description: "Deep cleaning for 3-bedroom apartment after renovation",
    price: "TZS 35,000",
  },
  {
    id: 3,
    name: "Fatima Hassan",
    initials: "FH",
    service: "Electrical",
    rating: 4.9,
    reviews: 31,
    tag: "",
    location: "Dar es Salaam, Masaki",
    distance: "6.1 km",
    date: "11/4/2024",
    time: "02:00 PM",
    description: "Power outlet not working in living room and bedroom",
    price: "TZS 75,000",
  },
  {
    id: 4,
    name: "James Wilson",
    initials: "JW",
    service: "Carpentry",
    rating: 4.7,
    reviews: 29,
    tag: "Normal",
    location: "Dar es Salaam, Oyster Bay",
    distance: "8.2 km",
    date: "11/6/2024",
    time: "11:30 AM",
    description: "Custom bookshelf installation in home office",
    price: "TZS 120,000",
  },
];

const StatItem = ({ rowBg, iconBg, icon, value, label }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${rowBg}`}>
    <div
      className={`h-9 w-9 rounded-md flex items-center justify-center ${iconBg}`}
    >
      {icon}
    </div>
    <div className="leading-tight">
      <div className={`text-sm font-semibold text-gray-900`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  </div>
);

const Badge = ({ children, color = "bg-gray-100 text-gray-700" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${color}`}
  >
    {children}
  </span>
);

const ActionButton = ({ variant = "solid", icon, children }) => {
  const base =
    "w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium px-3 py-1.5 border";
  const styles = {
    solid: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600",
    outlineRed:
      "bg-white text-rose-600 border-rose-300 hover:bg-rose-50 hover:border-rose-400",
    outlineGray:
      "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    ghost:
      "bg-white text-sky-700 border-sky-200 hover:bg-sky-50 hover:border-sky-300",
  };
  return (
    <button className={`${base} ${styles[variant]}`}>
      {icon}
      {children}
    </button>
  );
};

const JobCard = ({ job }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-start">
      {/* Left column: all details */}
      <div>
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs sm:text-sm font-semibold">
            {job.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mr-1">
                {job.name}
              </h3>
              <Badge>
                <Star size={12} className="text-yellow-300" fill="yellow" />{" "}
                {job.rating}
              </Badge>
              {job.tag === "Emergency" && (
                <Badge color="bg-[#EF4444] text-white">
                  <Zap className="text-white" size={12} fill="white" />{" "}
                  Emergency
                </Badge>
              )}
              {job.tag === "New" && <Badge>New</Badge>}
              {job.tag === "Normal" && <Badge>Normal</Badge>}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{job.service}</p>

            {/* Meta */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-600">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} className="text-sky-500" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                • {job.distance}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} className="text-sky-500" /> {job.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} className="text-sky-500" /> {job.time}
              </span>
            </div>

            {/* Description and price */}
            <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
              {job.description}
            </p>
            <div className="mt-2 text-emerald-600 font-semibold text-sm sm:text-base">
              {job.price}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: actions */}
      <div className="w-full md:w-[220px] xl:w-[240px] md:justify-self-end">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-2">
          <ActionButton variant="solid" icon={<Check size={14} />}>
            Accept
          </ActionButton>
          <ActionButton variant="outlineRed" icon={<X size={14} />}>
            Decline
          </ActionButton>
          <ActionButton variant="outlineGray" icon={<RotateCcw size={14} />}>
            Reschedule
          </ActionButton>
          <ActionButton variant="ghost" icon={<Eye size={14} />}>
            View Details
          </ActionButton>
        </div>
      </div>
    </div>
  </div>
);

const QuickStats = () => (
  <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 sticky top-4">
    <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
    <div className="mt-3 space-y-2">
      <StatItem
        rowBg="bg-sky-50"
        iconBg="bg-sky-500 text-white"
        icon={<Calendar1 size={16} />}
        value="3"
        label="Jobs Today"
      />
      <StatItem
        rowBg="bg-emerald-50"
        iconBg="bg-emerald-600 text-white"
        icon={<div className="h-3.5 w-3.5 bg-white/0 rounded-sm" />}
        value="147"
        label="Total Completed"
      />
      <StatItem
        rowBg="bg-amber-50"
        iconBg="bg-amber-500 text-white"
        icon={<DollarSign size={16} />}
        value="TZS 285,000"
        label="Pending Earnings"
      />
    </div>
    <button className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-md bg-white text-sky-600 border border-sky-300 text-sm font-medium px-4 py-2 hover:bg-sky-50">
      View Dashboard
    </button>
  </aside>
);

const JobsSection = () => {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Jobs list */}
          <div className="lg:col-span-2 space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {/* Right: Quick stats */}
          <div className="order-first lg:order-none">
            <QuickStats />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
