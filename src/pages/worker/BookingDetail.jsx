import React from "react";
import Hero from "../../components/common/Hero";
import map from "../../assets/icons/symbol-map.png";
import {
  Wrench,
  Calendar,
  Clock,
  BadgeCheck,
  MapPin,
  Star,
  Phone,
  Mail,
  Map as MapIcon,
  Navigation,
  CreditCard,
  Check,
  X,
  CalendarDaysIcon,
  User,
  MessageCircleMore,
  MessageSquare,
  Send,
  TriangleAlert,
  FileText,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

// Small UI helpers
const LabelValue = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className={twMerge(`font-semibold text-gray-900`, valueClass)}>
      {value}
    </span>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
  >
    {title && (
      <div className="px-4 sm:px-5 pt-4">
        <h3 className=" font-bold text-gray-900 text-xl">{title}</h3>
      </div>
    )}
    <div className={`px-4 sm:px-5 ${title ? "pb-5 pt-3" : "py-5"}`}>
      {children}
    </div>
  </div>
);

const BookingDetail = () => {
  // Static mock data to match the reference UI
  const booking = {
    id: "BK-4589",
    status: "Pending",
    service: "Plumbing Repair",
    dateLong: "Friday, January 19, 2024",
    time: "10:00 AM",
    duration: "(2–3 hours)",
    customer: {
      initials: "AK",
      name: "Ahmed Khan",
      rating: 4.7,
      phone: "+255 123 456 789",
      email: "ahmed.jk@email.com",
      address: "House No. 45, Kinweti Street, Kinondoni, Dar es Salaam",
      distance: "2.1 km away",
    },
    map: { lat: "-6.8204", lng: "39.2083" },
    pricing: {
      type: "Fixed Price",
      total: "TZS 50,000",
      method: "Mobile Wallet (M-Pesa)",
    },
    description:
      "Kitchen sink blockage repair needed urgently. Water is not draining properly and there seems to be a clog in the main pipe.",
    instructions: [
      "Please bring your own tools.",
      "The kitchen is on the ground floor.",
      "Parking is available in front of the house.",
    ],
    estimate: "2–3 hours",
  };

  return (
    <div>
      <Hero
        place="worker-detail"
        title="Booking Details"
        subtitle={`Booking ID: ${booking.id}`}
        className="h-[7rem] sm:h-[8rem] md:h-[12rem] lg:h-[12rem]"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Booking header card */}
              <SectionCard>
                <div className="flex flex-col items-start  gap-4">
                  <div className=" flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center">
                        <Wrench size={26} fill="currentColor" />
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                          {booking.service}
                        </div>
                        <div className="text-[11px] sm:text-xs text-gray-500">
                          Booking ID: {booking.id}
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#FEF3C7] rounded-xl text-center text-[#B45309] w-fit px-3 py-1 text-xs">
                      {booking.status}
                    </div>
                  </div>
                  <hr className="text-gray-400 w-full" />
                  <div className="flex text-xs justify-between items-center w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <CalendarDaysIcon size={12} />
                      <p>Friday, January 19, 2024</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock size={12} className="ml-4" />
                      <p>10:00 AM (2-3 Hours)</p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Customer information */}
              <SectionCard title="Customer Information">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-semibold">
                      {booking.customer.initials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {booking.customer.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />{" "}
                          {booking.customer.rating}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col gap-2 text-xs text-gray-600">
                        <div className="inline-flex items-center gap-1">
                          <Phone size={11} className="text-gray-400" />{" "}
                          {booking.customer.phone}
                        </div>
                        <div className="inline-flex items-center gap-1">
                          <Mail size={11} className="text-gray-400" />{" "}
                          {booking.customer.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs text-[#0284C7] border border-[#BAE6FD] font-medium hover:opacity-50 cursor-pointer px-2.5 py-1 rounded-lg">
                    <p className="flex items-center gap-1">
                      <span>
                        <User size={12} className="text-[#0284C7]" />
                      </span>
                      View Profile
                    </p>
                  </button>
                </div>
                <hr className="w-full border border-gray-200 mt-2" />
                {/* Map preview */}
                <div className=" rounded-xl mt-2">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col items-start gap-1 sm:col-span-3 mb-2">
                        <div className="inline-flex items-center gap-1">
                          <MapPin size={16} className="text-gray-400" />
                          <p className="text-sm font-bold">
                            {booking.customer.address}
                          </p>
                        </div>
                        <span className="ml-5 text-xs text-gray-400">
                          {booking.customer.distance}
                        </span>
                      </div>
                      <div className="h-36 w-full rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                        <div className="flex flex-col items-center text-center">
                          <img src={map} alt="" />
                          <div className="text-sm mt-1">
                            Interactive Map Preview
                          </div>
                          <div className="text-xs text-gray-600">
                            Lat: {booking.map.lat}, Lng: {booking.map.lng}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" w-full mt-2">
                    <button
                      className="mt-2 sm:mt-0 w-full inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-[#0284C7] font-medium text-xs px-3 py-2 border border-sky-200"
                      onClick={() => console.log("get-directions", booking.id)}
                    >
                      <Navigation size={14} /> Get Directions
                    </button>
                  </div>
                </div>
              </SectionCard>

              {/* Service Details */}
              <SectionCard title="Service Details">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {booking.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Special Instructions
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {booking.instructions.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-gray-700">
                    Estimated Duration:{" "}
                    <span className="font-semibold">{booking.estimate}</span>
                  </div>
                </div>
              </SectionCard>

              {/* Bottom actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionCard className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-13 h-13 rounded-full flex items-center justify-center">
                      <MessageCircleMore size={24} className="text-[#0EA5E9]" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900 mb-1">
                        Contact Customer
                      </div>
                      <p className="text-sm text-gray-600">
                        Send a message or call the customer directly
                      </p>
                    </div>
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium text-sm px-6 py-3 hover:opacity-90 transition-opacity"
                      onClick={() =>
                        console.log("message-customer", booking.id)
                      }
                    >
                      <Send size={16} /> Send Message
                    </button>
                  </div>
                </SectionCard>
                <SectionCard className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                      <TriangleAlert color="#FBBF24" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900 mb-1">
                        Report Issue
                      </div>
                      <p className="text-sm text-gray-600">
                        Submit a complaint or report a problem
                      </p>
                    </div>
                    <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-amber-300 text-[#F59E0B] font-medium text-sm px-6 py-3 bg-white hover:bg-amber-50 transition-colors">
                      <FileText color="#F59E0B" size={18} />
                      File Complaint
                    </button>
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* Right column sidebar (always visible on lg) */}
            <div className="lg:col-span-1">
              <aside className="sticky top-4 space-y-4">
                <SectionCard title="Pricing Information">
                  <div className="space-y-3">
                    <LabelValue
                      label="Service Type"
                      value={booking.pricing.type}
                    />
                    <LabelValue
                      label="Total Amount"
                      value={booking.pricing.total}
                      valueClass="text-emerald-600"
                    />
                    <div className="flex items-center justify-between text-sm bg-gray-100 p-4 rounded">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-900 ">
                        <CreditCard size={18} className="text-gray-500" />{" "}
                        {booking.pricing.method}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-sm font-medium px-4 py-2"
                      onClick={() => console.log("accept-booking", booking.id)}
                    >
                      <CircleCheck size={16} /> Accept Booking
                    </button>
                    <button
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 text-sm font-medium px-4 py-2"
                      onClick={() => console.log("decline-booking", booking.id)}
                    >
                      <CircleX size={16} /> Decline Booking
                    </button>
                  </div>
                </SectionCard>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingDetail;
