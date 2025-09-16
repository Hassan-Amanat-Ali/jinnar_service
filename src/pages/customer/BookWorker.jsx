import Hero from "../../components/common/Hero";
import ali from "../../assets/images/ali-hassan.jpg";
import {
  Star,
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Calendar,
  ChevronDown,
} from "lucide-react";

const BookWorker = () => {
  return (
    <div>
      <Hero
        place="Worker"
        title="Book Worker"
        subtitle="Provide task details, select time & location, and secure your booking with this worker"
      />
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-5">
        {/* left div */}
        <div className="rounded-[25px] border border-neutral-300 w-full lg:w-1/3 h-fit py-6 flex flex-col items-center justify-center shadow-xl gap-4 bg-white">
          <div className="text-center flex flex-col items-center px-4">
            <img
              src={ali}
              alt=""
              className="w-20 h-20 object-cover rounded-full"
            />
            <h2 className="text-lg font-bold mt-2">Ali Hassan</h2>
            <p className="text-sm font-medium text-gray-600">Expert plumbing</p>
            <div className="flex gap-1 justify-center items-center mt-2">
              <p className="flex gap-1 items-center">
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />{" "}
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />{" "}
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />{" "}
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />{" "}
                <Star className="w-3 h-3 text-gray-300" fill="currentColor" />{" "}
              </p>
              <p className="text-xs text-gray-500 font-medium ml-1">
                4.0 (1273 reviews)
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-center px-4">
            Expert in pipe repairs & installations
          </p>
          <div className="bg-gradient-to-b from-[#DBF0FF] to-[#DBF0FF]/60 h-fit w-[90%] px-4 py-4 text-center rounded-lg">
            <p className="text-xl font-bold">$45/hour</p>
            <p className="text-sm text-gray-500">
              Final price negotiable with worker
            </p>
          </div>
          <div className="flex gap-2 flex-col mt-2 w-[90%]">
            <button className="text-sm bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] w-full py-3 rounded-lg text-white font-medium hover:shadow-md transition-all">
              View Profile
            </button>
            <button className="text-sm border border-[#74C7F2] text-[#74C7F2] w-full py-3 rounded-lg font-medium hover:bg-[#DBF0FF] transition-colors">
              Message Worker
            </button>
          </div>
        </div>
        {/* right div */}
        <div className="flex-1 max-w-none lg:w-2/3">
          <div className="space-y-4 sm:space-y-5">
            {/* Job Description */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Describe Your Job *
              </label>
              <textarea
                placeholder="Describe your task..."
                className="w-full h-24 p-3 border border-gray-300 bg-neutral-100 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
            </section>

            {/* Job type */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Job type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl p-4 border-2 border-[#74C7F2] bg-[#DBF0FF] cursor-pointer hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-[#74C7F2]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      Schedule Job
                    </p>
                    <p className="text-xs text-gray-600">Regular Pricing</p>
                  </div>
                </div>
                <div className="rounded-xl p-4 border-2 border-gray-200 bg-gray-100 cursor-pointer hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-center mb-2">
                    <span className="w-5 h-5 flex items-center justify-center text-lg">
                      ⚡
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      Schedule Job
                    </p>
                    <p className="text-xs text-gray-600">Regular Pricing</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Select Date */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2]"
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Time Slot *
                </label>
                <div className="relative">
                  <select className="appearance-none w-full pr-9 pl-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2]">
                    <option>select time slot...</option>
                    <option>9:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 3:00 PM</option>
                    <option>3:00 PM - 6:00 PM</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </section>

            {/* Job Location */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Job Location *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your address"
                  className="flex-1 p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2]"
                />
                <button className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-[#74C7F2] hover:bg-[#74C7F2]/90 transition-colors">
                  <MapPin className="w-4 h-4" /> Use GPS
                </button>
              </div>
            </section>

            {/* Price Estimate & Payment */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Price Estimate & Payment
              </label>
              <div className="rounded-xl p-4 text-center bg-gradient-to-r from-[#DBF0FF] to-[#DBF0FF]/70">
                <p className="text-xs text-gray-600 mb-1">Estimated Total</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">$135</p>
                <p className="text-xs text-gray-600">
                  Final price negotiable with worker
                </p>
              </div>
            </section>

            {/* Payment Methods Available */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Payment Methods Available
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl p-3 border border-gray-200 bg-white hover:bg-[#DBF0FF] cursor-pointer transition-colors text-center">
                  <Smartphone className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">M-Pesa</p>
                </div>
                <div className="rounded-xl p-3 border border-gray-200 bg-white hover:bg-[#DBF0FF] cursor-pointer transition-colors text-center">
                  <CreditCard className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">Credit/Debit Card</p>
                </div>
                <div className="rounded-xl p-3 border border-gray-200 bg-white hover:bg-[#DBF0FF] cursor-pointer transition-colors text-center">
                  <Wallet className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">Airtel Money</p>
                </div>
                <div className="rounded-xl p-3 border border-gray-200 bg-white hover:bg-[#DBF0FF] cursor-pointer transition-colors text-center">
                  <Building2 className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">Bank Transfer</p>
                </div>
              </div>
            </section>

            {/* Footer Actions */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 border border-[#74C7F2] text-[#74C7F2] py-3 rounded-xl font-medium hover:bg-[#DBF0FF] transition-colors">
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] text-white py-3 rounded-xl font-medium hover:from-[#DBF0FF]/90 hover:to-[#74C7F2]/90 transition-all shadow-md">
                  Confirm Booking
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookWorker;
