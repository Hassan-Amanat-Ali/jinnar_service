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
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetNewJobRequestsQuery,
  useAcceptJobMutation,
  useDeclineJobMutation,
} from "../../../services/workerApi";

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

const ActionButton = ({ variant = "solid", icon, children, onClick, disabled }) => {
  const base =
    "w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium px-3 py-1.5 border disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    solid: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 disabled:hover:bg-emerald-500",
    outlineRed:
      "bg-white text-rose-600 border-rose-300 hover:bg-rose-50 hover:border-rose-400 disabled:hover:bg-white disabled:hover:border-rose-300",
    outlineGray:
      "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:hover:bg-white disabled:hover:border-gray-300",
    ghost:
      "bg-white text-sky-700 border-sky-200 hover:bg-sky-50 hover:border-sky-300 disabled:hover:bg-white disabled:hover:border-sky-200",
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick} disabled={disabled}>
      {icon}
      {children}
    </button>
  );
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDeclining }] = useDeclineJobMutation();

  const handleAccept = async () => {
    try {
      await acceptJob({ id: job._id }).unwrap();
      toast.success('Job accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept job: ' + (error?.data?.message || 'Unknown error'));
    }
  };

  const handleDecline = async () => {
    try {
      await declineJob({ id: job._id }).unwrap();
      toast.success('Job declined successfully!');
    } catch (error) {
      toast.error('Failed to decline job: ' + (error?.data?.message || 'Unknown error'));
    }
  };

  const handleReschedule = () => {
    console.log(`Rescheduling job ${job._id}`);
    // Add reschedule job logic here
  };

  const handleViewDetails = () => {
    navigate(`/job/${job._id}`);
  };

  // Helper function to get initials from customer name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Format date from API
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString();
  };

  // Format location
  const formatLocation = () => {
    if (job.location?.lat && job.location?.lng) {
      return `${job.location.lat.toFixed(2)}, ${job.location.lng.toFixed(2)}`;
    }
    return 'Location not specified';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-start">
        {/* Left column: all details */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs sm:text-sm font-semibold">
              {getInitials(job.buyerId?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mr-1">
                  {job.buyerId?.name || 'Unknown Customer'}
                </h3>
                <Badge>
                  <Star size={12} className="text-yellow-300" fill="yellow" />{" "}
                  {job.buyerId?.rating?.average || 'N/A'}
                </Badge>
                {job.emergency && (
                  <Badge color="bg-[#EF4444] text-white">
                    <Zap className="text-white" size={12} fill="white" />{" "}
                    Emergency
                  </Badge>
                )}
                {job.status === 'pending' && <Badge>New</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Service Request</p>

              {/* Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} className="text-sky-500" /> {formatLocation()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} className="text-sky-500" /> {formatDate(job.date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} className="text-sky-500" /> {job.timeSlot || 'TBD'}
                </span>
              </div>

              {/* Description and price */}
              <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
                {job.jobDescription || 'No description provided'}
              </p>
              <div className="mt-2 text-emerald-600 font-semibold text-sm sm:text-base">
                Price to be negotiated
              </div>
            </div>
          </div>
        </div>

        {/* Right column: actions */}
        <div className="w-full md:w-[220px] xl:w-[240px] md:justify-self-end">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-2">
            <ActionButton
              variant="solid"
              icon={<Check size={14} />}
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
            >
              {isAccepting ? 'Accepting...' : 'Accept'}
            </ActionButton>
            <ActionButton
              variant="outlineRed"
              icon={<X size={14} />}
              onClick={handleDecline}
              disabled={isAccepting || isDeclining}
            >
              {isDeclining ? 'Declining...' : 'Decline'}
            </ActionButton>
            <ActionButton
              variant="outlineGray"
              icon={<RotateCcw size={14} />}
              onClick={handleReschedule}
              disabled={isAccepting || isDeclining}
            >
              Reschedule
            </ActionButton>
            <ActionButton
              variant="ghost"
              icon={<Eye size={14} />}
              onClick={handleViewDetails}
              disabled={isAccepting || isDeclining}
            >
              View Details
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStats = () => {
  const navigate = useNavigate();

  const handleViewDashboard = () => {
    navigate("/worker-home");
  };

  return (
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
      <button
        className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-md bg-white text-sky-600 border border-sky-300 text-sm font-medium px-4 py-2 hover:bg-sky-50"
        onClick={handleViewDashboard}
      >
        View Dashboard
      </button>
    </aside>
  );
};

const JobsSection = () => {
  const { data: jobRequests, isLoading, error } = useGetNewJobRequestsQuery();

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center py-20">
            <p className="text-red-500">Error loading job requests: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  const jobs = jobRequests?.jobs || [];

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Jobs list */}
          <div className="lg:col-span-2 space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No new job requests available.</p>
              </div>
            ) : (
              jobs.map((job) => <JobCard key={job._id} job={job} />)
            )}
          </div>
          {/* Right: Quick stats */}
          <div className="order-first lg:order-0">
            <QuickStats />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
