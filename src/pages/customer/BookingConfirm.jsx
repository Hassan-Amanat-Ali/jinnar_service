import {
  Check,
  Star,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  User,
  Eye,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import ali from "../../assets/images/ali-hassan.jpg";
import { useNavigate } from "react-router-dom";

const BookingConfirm = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-[28px] border border-neutral-200 shadow-xl p-6 sm:p-10">
          {/* Top icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#DBF0FF] to-[#74C7F2] shadow-lg ring-4 ring-[#74C7F2]/10 flex items-center justify-center">
              <Check
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Your booking with Ali Hassan has been successfully placed.
          </p>

          {/* Worker summary card */}
          <div className="mt-6 sm:mt-8 rounded-xl border border-[#74C7F2]/30 bg-[#DBF0FF] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: worker */}
              <div className="flex items-center gap-3">
                <img
                  src={ali}
                  alt="Ali Hassan"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm sm:text-base font-semibold">
                    Ali Hassan
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <Star
                      className="w-3.5 h-3.5 text-yellow-400"
                      fill="currentColor"
                    />
                    <Star
                      className="w-3.5 h-3.5 text-yellow-400"
                      fill="currentColor"
                    />
                    <Star
                      className="w-3.5 h-3.5 text-yellow-400"
                      fill="currentColor"
                    />
                    <Star
                      className="w-3.5 h-3.5 text-yellow-400"
                      fill="currentColor"
                    />
                    <Star
                      className="w-3.5 h-3.5 text-gray-300"
                      fill="currentColor"
                    />
                    <span className="ml-1">4.9 (127 Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Right: date/time and address (stacked rows) */}
              <div className="text-xs sm:text-sm text-gray-800 sm:text-left ">
                <div className="flex items-start gap-2 justify-start ">
                  <Calendar className="w-4 h-4 text-[#74C7F2] mt-0.5" />
                  <div className="leading-tight">
                    <p className="font-medium">1/19/2025</p>
                    <p>5:00 PM – 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-2 justify-start sm:justify-end ">
                  <MapPin className="w-4 h-4 text-[#74C7F2] mt-0.5" />
                  <p className="max-w-[220px] sm:max-w-[200 px] leading-tight">
                    House #25, Street 8, Gulshan Colony
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom row: booking id + payment */}
            <div className="mt-4 pt-4 border-t border-white/70 grid grid-cols-2 text-xs sm:text-sm">
              <div>
                <p className="text-gray-700">Booking ID:</p>
                <p className="font-semibold">BK-2045</p>
              </div>
              <div className="text-right">
                <p className="text-gray-700">Payment Status:</p>
                <p className="font-semibold">To be paid ($150)</p>
              </div>
            </div>
          </div>

          {/* What's next */}
          <p className="mt-7 sm:mt-8 text-center text-sm font-semibold text-gray-800">
            What's next?
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center hover:bg-[#DBF0FF] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#DBF0FF] mx-auto flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5 text-[#74C7F2]" />
              </div>
              <p className="text-sm font-medium">Chat with Worker</p>
              <p className="text-xs text-gray-600">Discuss Detail</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center hover:bg-[#DBF0FF] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#DBF0FF] mx-auto flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-[#74C7F2]" />
              </div>
              <p className="text-sm font-medium">View Worker Profile</p>
              <p className="text-xs text-gray-600">See Review and Work</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center hover:bg-[#DBF0FF] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#DBF0FF] mx-auto flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-[#74C7F2]" />
              </div>
              <p className="text-sm font-medium">View Booking Detail</p>
              <p className="text-xs text-gray-600">Track Progress</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#74C7F2] to-[#74C7F2] text-white py-3 rounded-xl font-medium hover:opacity-95 transition-all shadow" onClick={() => navigate("/customer-booking/BK-2045")}>
              Go to Booking Details
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[#74C7F2] text-[#74C7F2] py-3 rounded-xl font-medium hover:bg-[#DBF0FF] transition-colors"
              onClick={() => navigate("/customer-home")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          {/* Tip */}
          <div className="mt-6 pt-4 border-t border-neutral-200 text-xs sm:text-sm text-gray-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-500 mt-0.5" />
            <p>
              Tip: Your worker will contact you shortly to confirm details. You
              can message them anytime from your booking details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
