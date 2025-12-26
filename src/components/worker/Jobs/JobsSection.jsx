import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetNewJobRequestsQuery,
  useAcceptJobMutation,
  useDeclineJobMutation,
  useGetSellerStatsQuery,
} from "../../../services/workerApi";
import { reverseGeocode } from "../../../utils/fileUrl";

const StatItem = React.memo(({ rowBg, iconBg, icon, value, label }) => (
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
));

StatItem.displayName = 'StatItem';

const Badge = React.memo(({ children, color = "bg-gray-100 text-gray-700" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${color}`}
  >
    {children}
  </span>
));

Badge.displayName = 'Badge';

const ActionButton = React.memo(({ variant = "solid", icon, children, onClick, disabled }) => {
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
});

ActionButton.displayName = 'ActionButton';

const JobCard = React.memo(({ job }) => {
  const navigate = useNavigate();
  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDeclining }] = useDeclineJobMutation();
  const [locationAddress, setLocationAddress] = useState('Loading location...');

  // Fetch location address on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchLocation = async () => {
      if (job.location?.lat && job.location?.lng) {
        const address = await reverseGeocode(job.location.lat, job.location.lng);
        if (isMounted) {
          setLocationAddress(address || `${job.location.lat.toFixed(2)}, ${job.location.lng.toFixed(2)}`);
        }
      } else {
        if (isMounted) {
          setLocationAddress('Location not specified');
        }
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, [job.location?.lat, job.location?.lng]);

  const handleAccept = useCallback(async () => {
    try {
      await acceptJob({ id: job._id }).unwrap();
      toast.success('Job accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept job: ' + (error?.data?.message || 'Unknown error'));
    }
  }, [acceptJob, job._id]);

  const handleDecline = useCallback(async () => {
    try {
      await declineJob({ id: job._id }).unwrap();
      toast.success('Job declined successfully!');
    } catch (error) {
      toast.error('Failed to decline job: ' + (error?.data?.message || 'Unknown error'));
    }
  }, [declineJob, job._id]);

  const handleReschedule = useCallback(() => {
    console.log(`Rescheduling job ${job._id}`);
    // Add reschedule job logic here
  }, [job._id]);

  const handleViewDetails = useCallback(() => {
    navigate(`/job/${job._id}`);
  }, [navigate, job._id]);

  // Memoize computed values
  const initials = useMemo(() => {
    const name = job.buyerId?.name;
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }, [job.buyerId?.name]);

  const formattedDate = useMemo(() => {
    if (!job.date) return 'TBD';
    return new Date(job.date).toLocaleDateString();
  }, [job.date]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-start">
        {/* Left column: all details */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs sm:text-sm font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mr-1">
                  {job.buyerId?.name || 'Unknown Customer'}
                </h3>
                <Badge>
                  <Star size={12} className="text-yellow-300" fill="yellow" />{" "}
                  {job.buyerId?.rating?.average ?? 'N/A'}
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
                <span className="inline-flex items-center gap-1 max-w-[200px]">
                  <MapPin size={14} className="text-sky-500 flex-shrink-0" /> 
                  <span className="truncate">{locationAddress}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} className="text-sky-500" /> {formattedDate}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} className="text-sky-500" /> {job.timeSlot || 'TBD'}
                </span>
              </div>

              {/* Description and price */}
              <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
                {job.jobDescription || 'No description provided'}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <DollarSign size={14} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Price to be negotiated</span>
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
});

JobCard.displayName = 'JobCard';

const QuickStats = React.memo(() => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetSellerStatsQuery();

  const handleViewDashboard = useCallback(() => {
    navigate("/worker-home");
  }, [navigate]);

  // Memoize formatted currency
  const formattedPendingEarning = useMemo(() => {
    const amount = stats?.pendingEarning;
    if (!amount) return "TZS 0";
    return `TZS ${amount.toLocaleString()}`;
  }, [stats?.pendingEarning]);

  if (statsLoading) {
    return (
      <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 sticky top-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
        <div className="mt-3 space-y-2">
          {/* Loading skeleton */}
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
                <div className="h-9 w-9 rounded-md bg-gray-200"></div>
                <div className="leading-tight">
                  <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-md bg-white text-sky-600 border border-sky-300 text-sm font-medium px-4 py-2 hover:bg-sky-50"
          onClick={handleViewDashboard}
        >
          View Dashboard
        </button>
      </aside>
    );
  }

  if (statsError) {
    return (
      <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 sticky top-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
        <div className="mt-3 text-center text-red-500 text-sm py-4">
          Failed to load stats
        </div>
        <button
          className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-md bg-white text-sky-600 border border-sky-300 text-sm font-medium px-4 py-2 hover:bg-sky-50"
          onClick={handleViewDashboard}
        >
          View Dashboard
        </button>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
      <div className="mt-3 space-y-2">
        <StatItem
          rowBg="bg-sky-50"
          iconBg="bg-sky-500 text-white"
          icon={<Calendar1 size={16} />}
          value={stats?.activeJobs || 0}
          label="Active Jobs"
        />
        <StatItem
          rowBg="bg-emerald-50"
          iconBg="bg-emerald-600 text-white"
          icon={<CheckCircle size={16} />}
          value={stats?.completedJobs || 0}
          label="Total Completed"
        />
        <StatItem
          rowBg="bg-amber-50"
          iconBg="bg-amber-500 text-white"
          icon={<DollarSign size={16} />}
          value={formattedPendingEarning}
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
});

QuickStats.displayName = 'QuickStats';

const JobsSection = () => {
  const { data: jobRequests, isLoading, error } = useGetNewJobRequestsQuery();

  const jobs = useMemo(() => jobRequests?.jobs || [], [jobRequests]);

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
