import ali from "../../assets/images/ali-hassan.jpg";
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Hero from "../../components/common/Hero";
import { useNavigate } from "react-router-dom";

const BookingDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] bg-white">
      {/* Banner */}
      <Hero
        title="Booking #BK-2045"
        subtitle="Worker Has Accepted Your Booking"
        place="Worker"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Worker Card */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={ali}
                alt="Ali Hassan"
                className="w-20 h-20 rounded-full object-cover"
              />
              <h3 className="text-lg font-semibold mt-3">Ali Hassan</h3>
              <p className="text-sm text-gray-600">Expert Plumbing</p>
              <div className="flex items-center gap-1 mt-1 text-yellow-400">
                <Star className="w-4 h-4" fill="currentColor" />
                <Star className="w-4 h-4" fill="currentColor" />
                <Star className="w-4 h-4" fill="currentColor" />
                <Star className="w-4 h-4" fill="currentColor" />
                <Star className="w-4 h-4 text-gray-300" fill="currentColor" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">4.9 (127 Reviews)</p>
            </div>

            <p className="text-sm font-medium text-center mt-3">
              Expert in pipe repairs & installations
            </p>

            <div className="bg-gradient-to-b from-[#DBF0FF] to-[#DBF0FF]/60 rounded-xl text-center py-4 mt-4">
              <p className="text-xl font-bold">$45/hour</p>
              <p className="text-sm text-gray-500">
                Final price negotiable with worker
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] text-white font-medium"
                onClick={() => navigate("/worker-profile/slug")}
              >
                View Profile
              </button>
              <button className="w-full py-3 rounded-xl border border-[#74C7F2] text-[#74C7F2] font-medium hover:bg-[#DBF0FF]" onClick={() => navigate("/chat")}>
                Message Worker
              </button>
            </div>
          </div>
        </aside>

        {/* Right: Details */}
        <section className="lg:col-span-2 space-y-5">
          {/* Job Summary */}
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-5">
            <h4 className="text-lg font-semibold">Job Summary</h4>
            <h3 className="font-semibold mt-2">Plumbing Service</h3>
            <p className="text-sm text-gray-600 mt-1">
              Kitchen sink leakage, needs urgent fixing. Water is dripping from
              the main pipe connection under the sink.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1">Date</p>
                <p className="text-sm font-semibold">1/19/2025</p>
              </div>
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1">Time</p>
                <p className="text-sm font-semibold">5:00 PM - 7:00 PM</p>
              </div>
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1">Duration</p>
                <p className="text-sm font-semibold">~2 hours</p>
              </div>
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <DollarSign className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1">Price</p>
                <p className="text-sm font-semibold">$150</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-5">
            <h4 className="text-lg font-semibold">Location</h4>
            <div className="mt-3 flex items-start gap-3 justify-between">
              <div>
                <div className="flex items-start justify-center gap-2">
                  <MapPin className="w-4 h-4 text-[#74C7F2]" />
                  <p className="text-sm">House #25, Street 8, Gulshan Colony</p>
                </div>
                <button className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white bg-[#74C7F2] hover:bg-[#74C7F2]/90">
                  Open In Map
                </button>
              </div>

              <div className="w-24 h-20 rounded-xl bg-neutral-200 flex items-center justify-center text-gray-600">
                <MapPin className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>

          {/* Pricing & Payment */}
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-5">
            <h4 className="text-lg font-semibold">Pricing & Payment</h4>
            <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 mt-3 space-y-4 ">
              <div className="flex items-center justify-between text-sm">
                <span>Hourly Rate</span>
                <span className="font-semibold">$45/hour</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Emergency Multiplier:</span>
                <span className="font-semibold text-red-500">x1.5</span>
              </div>
              <hr className="text-gray-300" />
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="font-semibold">Total Estimate:</span>
                <span className="font-bold text-[#1F2937]">$150</span>
              </div>
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">Payment Method: M-Pesa</p>
                <p className="text-xs text-gray-600">
                  Payment processed after job completion
                </p>
              </div>
              <span className="px-3 py-2 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Payment Pending
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 border border-red-400 text-red-500 py-3 rounded-xl font-medium hover:bg-red-50">
                Cancel booking
              </button>
              <button className="flex-1 border border-[#74C7F2] text-white bg-[#74C7F2] py-3 rounded-xl font-medium hover:bg-[#74C7F2]/90">
                Reschedule
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingDetail;
