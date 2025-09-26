import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Phone,
  Mail,
  Zap,
  DollarSign,
  Timer,
  Wrench,
  Download,
  Check,
  X,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

const InfoItem = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-white/90">
    {icon}
    {children}
  </span>
);

const Pill = ({ children, color = "bg-rose-500 text-white" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${color}`}
  >
    {children}
  </span>
);

const RowTile = ({ bg, iconBg, icon, title, subtitle }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${bg}`}>
    <div
      className={`h-9 w-9 rounded-md flex items-center justify-center ${iconBg}`}
    >
      {icon}
    </div>
    <div className="leading-tight">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </div>
  </div>
);

const AttachmentItem = ({ name }) => (
  <div className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 bg-white">
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
      {name}
    </div>
    <button className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700">
      <Download size={14} />
    </button>
  </div>
);

const ActionButton = ({ variant = "solid", icon, children }) => {
  const base =
    "w-full sm:w-100 inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium px-4 py-2 border";
  const styles = {
    solid: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600",
    outlineRed:
      "bg-white text-rose-600 border-rose-300 hover:bg-rose-50 hover:border-rose-400",
    outlineBlue:
      "bg-white text-sky-700 border-sky-300 hover:bg-sky-50 hover:border-sky-400",
    ghostBlue:
      "bg-white text-sky-700 border-sky-200 hover:bg-sky-50 hover:border-sky-300",
  };
  return (
    <button className={`${base} ${styles[variant]}`}>
      {icon}
      {children}
    </button>
  );
};

const JobDetailComponent = () => {
  // Static mock matching the screenshot
  const job = {
    title: "Plumbing",
    subtitle: "Request",
    date: "1/14/2024",
    time: "09:00 AM",
    duration: "2–3 hours",
    urgency: "Emergency",
    price: "TZS 50,000",
    posted: "Posted 2 hours ago",
    customer: {
      initials: "SJ",
      name: "Sarah Johnson",
      rating: 4.7,
      phone: "+255 678 124 58",
      email: "sarah.j@examplemail.com",
      address:
        "House 29, Vincent Street, Kinondoni, Dar es Salaam • 2.3 km away",
    },
    description:
      "Kitchen sink is completely blocked and water is overflowing. The blockage seems to be deep in the pipes and I've tried basic remedies but nothing is working. Water is backing up into the dishwasher as well. This needs immediate attention as it's affecting my entire kitchen functionality.",
    requirements: [
      "Bring professional drain cleaning equipment",
      "May need pipe inspection tools",
      "Potential replacement of pipe sections",
      "Clean-up after work completion",
    ],
    attachments: [
      "kitchen_sink_blockage.jpg",
      "water_damage_area.jpg",
      "home_layout.pdf",
    ],
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header card */}
            <div className="rounded-xl border border-sky-100 shadow-sm overflow-hidden">
              <div className="bg-[#60A5FA] px-4 sm:px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-white text-base sm:text-lg font-semibold leading-tight">
                      {job.title}
                    </h1>
                    <p className="text-white/90 text-sm -mt-0.5">
                      {job.subtitle}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <InfoItem
                        icon={<Calendar size={14} className="text-white" />}
                      >
                        {job.date}
                      </InfoItem>
                      <InfoItem
                        icon={<Clock size={14} className="text-white" />}
                      >
                        {job.time}
                      </InfoItem>
                      <InfoItem
                        icon={<Timer size={14} className="text-white" />}
                      >
                        {job.duration}
                      </InfoItem>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Pill>
                        <Zap size={12} className="text-white" /> {job.urgency}
                      </Pill>
                    </div>
                    <div className="mt-2 text-white text-sm sm:text-base font-semibold">
                      {job.price}
                    </div>
                    <div className="text-white/80 text-[11px]">
                      {job.posted}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer information */}
            <div className="rounded-xl border border-gray-100 shadow-lg bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Customer Information
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-semibold">
                    {job.customer.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {job.customer.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        {job.customer.rating}
                      </span>
                    </div>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                      <div className="inline-flex items-center gap-1">
                        <Phone size={14} className="text-sky-600" />{" "}
                        {job.customer.phone}
                      </div>
                      <div className="inline-flex items-center gap-1">
                        <Mail size={14} className="text-sky-600" />{" "}
                        {job.customer.email}
                      </div>
                      <div className="inline-flex items-center gap-1 sm:col-span-3">
                        <MapPin size={14} className="text-sky-600" />{" "}
                        {job.customer.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="rounded-xl border border-gray-100 shadow-lg bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Job Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.description}
              </p>
              {/* Requirements & Instructions */}
              <h2 className="text-lg font-bold text-gray-900 my-2">
                Requirements & Instructions
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Attachments */}
            <div className="rounded-xl border border-gray-100 shadow-sm bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Attachments ({job.attachments.length})
              </h2>
              <div className="space-y-2">
                {job.attachments.map((a) => (
                  <AttachmentItem key={a} name={a} />
                ))}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-3 ">
              <ActionButton variant="solid" icon={<Check size={14} />}>
                Accept Job
              </ActionButton>
              <ActionButton variant="outlineRed" icon={<X size={14} />}>
                Decline Job
              </ActionButton>
              <ActionButton
                variant="outlineBlue"
                icon={<RotateCcw size={14} />}
              >
                Reschedule
              </ActionButton>
              <ActionButton
                variant="ghostBlue"
                icon={<MessageSquare size={14} />}
              >
                Message Customer
              </ActionButton>
            </div>
          </div>

          {/* Right: Quick Details */}
          <div>
            <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 sticky top-4">
              <h3 className="text-base font-semibold text-gray-900">
                Quick Details
              </h3>
              <div className="mt-3 space-y-2">
                <RowTile
                  bg="bg-emerald-50"
                  iconBg="bg-emerald-500 text-white"
                  icon={<DollarSign size={16} />}
                  title="TZS 50,000"
                  subtitle="Estimated earnings"
                />
                <RowTile
                  bg="bg-sky-50"
                  iconBg="bg-sky-500 text-white"
                  icon={<Timer size={16} />}
                  title="1 hour"
                  subtitle="Response time"
                />
                <RowTile
                  bg="bg-violet-50"
                  iconBg="bg-violet-500 text-white"
                  icon={<Wrench size={16} />}
                  title="Plumbing"
                  subtitle="Job category"
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetailComponent;
