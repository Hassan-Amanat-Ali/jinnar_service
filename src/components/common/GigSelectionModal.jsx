import { useState } from "react";
import { X, Package, DollarSign, Star, Clock, Loader2 } from "lucide-react";
import { useGetMyGigsQuery } from "../../services";
import { getFullImageUrl } from "../../utils/fileUrl";

const GigSelectionModal = ({ isOpen, onClose, onGigSelect, receiverName }) => {
  const [selectedGigId, setSelectedGigId] = useState("");

  const { data: gigsResponse, isLoading } = useGetMyGigsQuery();
  const gigs = gigsResponse?.gigs || [];

  const getPriceValue = (pricing) => {
    if (!pricing) return 0;
    
    // Handle new nested pricing structure
    if (typeof pricing === "object" && pricing !== null) {
      // Try fixed price first
      if (pricing.fixed?.enabled && pricing.fixed?.price) {
        return pricing.fixed.price;
      }
      // Then hourly rate
      if (pricing.hourly?.enabled && pricing.hourly?.rate) {
        return pricing.hourly.rate;
      }
      // Old structure fallback
      if (pricing.price) {
        return pricing.price;
      }
    }
    
    return pricing || 0;
  };

  const formatPrice = (pricing) => {
    const price = getPriceValue(pricing);
    return price > 0 ? Number(price).toLocaleString() : "0";
  };

  const getPricingDisplay = (pricing) => {
    if (!pricing) return "Contact for pricing";
    
    if (pricing.inspection?.enabled) {
      return { text: "Inspection Required", type: "inspection" };
    }
    
    if (pricing.fixed?.enabled && pricing.fixed?.price) {
      return { 
        text: `TZS ${Number(pricing.fixed.price).toLocaleString()}`, 
        type: "fixed" 
      };
    }
    
    if (pricing.hourly?.enabled && pricing.hourly?.rate) {
      const minHours = pricing.hourly.minHours;
      return { 
        text: `TZS ${Number(pricing.hourly.rate).toLocaleString()}/hr${minHours ? ` (min ${minHours} hrs)` : ""}`, 
        type: "hourly" 
      };
    }
    
    return { text: "Contact for pricing", type: "unknown" };
  };

  const handleContinue = () => {
    const selectedGig = gigs.find((gig) => gig._id === selectedGigId);
    if (selectedGig) {
      onGigSelect(selectedGig);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 bg-opacity-10 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Select Your Service
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Receiver */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Creating offer for:</strong> {receiverName || "Customer"}
            </p>
          </div>

          {/* Gigs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Choose a service to offer
              </h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">
                  Loading your services...
                </span>
              </div>
            ) : gigs.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {gigs.map((gig) => (
                  <label
                    key={gig._id}
                    className={`block p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedGigId === gig._id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedGig"
                      value={gig._id}
                      checked={selectedGigId === gig._id}
                      onChange={(e) => setSelectedGigId(e.target.value)}
                      className="sr-only"
                    />

                    <div className="flex items-start gap-4">
                      {gig.images?.length > 0 && (
                        <img
                          src={getFullImageUrl(
                            gig.images[0]?.url || gig.images[0]
                          )}
                          alt={gig.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {gig.title}
                        </h4>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {gig.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium text-gray-900">
                              {getPricingDisplay(gig.pricing).text}
                            </span>
                          </div>

                          {gig.deliveryTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{gig.deliveryTime} days</span>
                            </div>
                          )}

                          {gig.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{gig.rating}</span>
                            </div>
                          )}
                        </div>

                        {gig.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {gig.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                            {gig.skills.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                                +{gig.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedGigId === gig._id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Services Available
                </h4>
                <p className="text-gray-600 mb-4">
                  You need to create a service first before sending custom
                  offers.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Service First
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        {gigs.length > 0 && (
          <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedGigId}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigSelectionModal;
