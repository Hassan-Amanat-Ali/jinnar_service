import Hero from "../../components/common/Hero";
import ali from "../../assets/images/ali-hassan.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  useGetPublicProfileQuery,
  useGetGigByIdQuery,
} from "../../services/workerApi";
import { useCreateOrderMutation } from "../../services/customerApi";
import LocationPicker from "../../components/common/LocationPicker";

import {
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
} from "lucide-react";

const BookWorker = () => {
  const navigate = useNavigate();
  const { sellerId, gigId } = useParams();
  const { data, isLoading, error } = useGetPublicProfileQuery(sellerId);
  const { data: gigData, isLoading: gigLoading } = useGetGigByIdQuery(gigId);

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const profile = data?.profile;
  const gig = gigData?.gig;

  // Form state
  const [formData, setFormData] = useState({
    jobDescription: "",
    date: "",
    timeSlot: "",
    emergency: false,
    location: null,
    image: "",
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleJobTypeSelect = (isEmergency) => {
    setFormData((prev) => ({ ...prev, emergency: isEmergency }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
    setShowLocationPicker(false);
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Time slot is required";
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const orderData = {
        gigId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        jobDescription: formData.jobDescription,
        image: formData.image || "",
        lat: formData.location.lat,
        lng: formData.location.lng,
        emergency: formData.emergency,
      };

      const result = await createOrder(orderData).unwrap();

      // Navigate to confirmation page or orders page
      navigate("/booking-confirm", { state: { orderId: result.data._id } });
    } catch (err) {
      console.error("Failed to create order:", err);
      alert(err?.data?.error || "Failed to create booking. Please try again.");
    }
  };

  return (
    <div>
      <Hero
        place="Worker"
        title="Book Worker"
        subtitle="Provide task details, select time & location, and secure your booking with this worker"
      />
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-5">
        {/* left div */}
        {isLoading ? (
          <div className="rounded-[25px] border border-neutral-300 w-full lg:w-1/3 h-fit py-6 flex flex-col items-center justify-center shadow-xl gap-4 bg-white">
            <div className="animate-pulse flex flex-col items-center gap-4 w-full px-4">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-16 w-[90%] bg-gray-200 rounded-lg" />
              <div className="h-10 w-[90%] bg-gray-200 rounded-lg" />
              <div className="h-10 w-[90%] bg-gray-200 rounded-lg" />
            </div>
          </div>
        ) : error || !profile ? (
          <div className="rounded-[25px] border border-neutral-300 w-full lg:w-1/3 h-fit py-6 flex flex-col items-center justify-center shadow-xl gap-4 bg-white">
            <p className="text-red-600">Failed to load worker profile</p>
          </div>
        ) : (
          <div className="rounded-[25px] border border-neutral-300 w-full lg:w-1/3 h-fit py-6 flex flex-col items-center justify-center shadow-xl gap-4 bg-white">
            <div className="text-center flex flex-col items-center px-4">
              <img
                src={profile.profilePicture || ali}
                alt={profile.name}
                className="w-20 h-20 object-cover rounded-full"
              />
              <h2 className="text-lg font-bold mt-2">{profile.name}</h2>
              <p className="text-sm font-medium text-gray-600">
                {profile.skills?.[0] || "Service Provider"}
              </p>
              <div className="flex gap-1 justify-center items-center mt-2">
                <p className="flex gap-1 items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 ${
                        index < Math.round(profile.rating?.average || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </p>
                <p className="text-xs text-gray-500 font-medium ml-1">
                  {profile.rating?.average?.toFixed(1) || "0.0"} (
                  {profile.rating?.count || 0} reviews)
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-center px-4">
              {profile.bio || "Experienced professional"}
            </p>
            <div className="bg-gradient-to-b from-[#DBF0FF] to-[#DBF0FF]/60 h-fit w-[90%] px-4 py-4 text-center rounded-lg">
              {gigLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 w-32 bg-gray-200 rounded mx-auto" />
                </div>
              ) : gig ? (
                <>
                  <p className="text-xl font-bold">
                    {gig.pricing.method === "negotiable"
                      ? "Negotiable"
                      : gig.pricing.method === "hourly"
                      ? `TZS ${gig.pricing.price}/hour`
                      : `TZS ${gig.pricing.price}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {gig.pricing.method === "negotiable" ||
                    gig.pricing.method === "hourly"
                      ? "Final price negotiable with worker"
                      : "Fixed price"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold">Price not available</p>
                  <p className="text-sm text-gray-500">
                    Contact worker for pricing
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2 flex-col mt-2 w-[90%]">
              <button
                className="text-sm bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] w-full py-3 rounded-lg text-white font-medium hover:shadow-md transition-all"
                onClick={() => navigate(`/worker-profile/${sellerId}`)}
              >
                View Profile
              </button>
              <button
                className="text-sm border border-[#74C7F2] text-[#74C7F2] w-full py-3 rounded-lg font-medium hover:bg-[#DBF0FF] transition-colors"
                onClick={() => navigate("/chat")}
              >
                Message Worker
              </button>
            </div>
          </div>
        )}
        {/* right div */}
        <div className="flex-1 max-w-none lg:w-2/3">
          <div className="space-y-4 sm:space-y-5">
            {/* Job Description */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Describe Your Job *
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Describe your task..."
                className={`w-full h-24 p-3 border ${
                  errors.jobDescription ? "border-red-500" : "border-gray-300"
                } bg-neutral-100 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent`}
              />
              {errors.jobDescription && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.jobDescription}
                </p>
              )}
            </section>

            {/* Job type */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Job type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleJobTypeSelect(false)}
                  className={`rounded-xl p-4 border-2 cursor-pointer hover:shadow-sm transition-shadow ${
                    !formData.emergency
                      ? "border-[#74C7F2] bg-[#DBF0FF]"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
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
                <div
                  onClick={() => handleJobTypeSelect(true)}
                  className={`rounded-xl p-4 border-2 cursor-pointer hover:shadow-sm transition-shadow ${
                    formData.emergency
                      ? "border-[#74C7F2] bg-[#DBF0FF]"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <span className="w-5 h-5 flex items-center justify-center text-lg">
                      ⚡
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      Emergency Job
                    </p>
                    <p className="text-xs text-gray-600">Priority Pricing</p>
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
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full pl-9 pr-3 py-3 border ${
                      errors.date ? "border-red-500" : "border-gray-300"
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2]`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Time Slot *
                </label>
                <div className="relative">
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className={`appearance-none w-full pr-9 pl-3 py-3 border ${
                      errors.timeSlot ? "border-red-500" : "border-gray-300"
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74C7F2]`}
                  >
                    <option value="">select time slot...</option>
                    <option value="morning">
                      Morning (9:00 AM - 12:00 PM)
                    </option>
                    <option value="afternoon">
                      Afternoon (12:00 PM - 3:00 PM)
                    </option>
                    <option value="evening">Evening (3:00 PM - 6:00 PM)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.timeSlot && (
                  <p className="mt-1 text-xs text-red-600">{errors.timeSlot}</p>
                )}
              </div>
            </section>

            {/* Job Location */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Job Location *
              </label>

              {!showLocationPicker ? (
                <>
                  {formData.location ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <MapPin
                          className="text-[#74C7F2] mt-1 flex-shrink-0"
                          size={18}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Selected Location
                          </p>
                          <p className="text-xs text-gray-600">
                            {formData.location.address}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Lat: {formData.location.lat.toFixed(6)}, Lng:{" "}
                            {formData.location.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLocationPicker(true)}
                        className="w-full px-4 py-2 text-sm text-[#74C7F2] border border-[#74C7F2] rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Change Location
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(true)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 border ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      } rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors`}
                    >
                      <MapPin className="w-4 h-4" />
                      Select Location on Map
                    </button>
                  )}
                  {errors.location && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.location}
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={formData.location}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(false)}
                    className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </section>

            {/* Price Estimate & Payment */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Price Estimate & Payment
              </label>
              <div className="rounded-xl p-4 text-center bg-gradient-to-r from-[#DBF0FF] to-[#DBF0FF]/70">
                {gigLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 bg-gray-200 rounded mx-auto" />
                  </div>
                ) : gig ? (
                  <>
                    <p className="text-xs text-gray-600 mb-1">
                      Estimated Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {gig.pricing.method === "negotiable"
                        ? "Negotiable"
                        : `TZS ${gig.pricing.price}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {gig.pricing.method === "negotiable" ||
                      gig.pricing.method === "hourly"
                        ? "Final price negotiable with worker"
                        : "Fixed price for this service"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-gray-600 mb-1">
                      Estimated Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      Not Available
                    </p>
                    <p className="text-xs text-gray-600">
                      Contact worker for pricing
                    </p>
                  </>
                )}
              </div>
            </section>



            {/* Footer Actions */}
            <section className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 border border-[#74C7F2] text-[#74C7F2] py-3 rounded-xl font-medium hover:bg-[#DBF0FF] transition-colors"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] text-white py-3 rounded-xl font-medium hover:from-[#DBF0FF]/90 hover:to-[#74C7F2]/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating Booking..." : "Confirm Booking"}
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
