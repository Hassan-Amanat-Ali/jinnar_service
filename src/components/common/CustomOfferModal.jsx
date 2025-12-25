import { useState, useEffect } from "react";
import {
  X,
  DollarSign,
  FileText,
  Package,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useSendCustomOfferMutation } from "../../services";
import { getFullImageUrl } from "../../utils/fileUrl";

const CustomOfferModal = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  selectedGig,
  onOfferSent,
}) => {
  const [formData, setFormData] = useState({
    price: "",
    description: "",
  });
  const [error, setError] = useState("");

  const [sendOffer, { isLoading: isSending }] = useSendCustomOfferMutation();

  const getPriceValue = (pricing) => {
    if (typeof pricing === "object" && pricing !== null) {
      return pricing.price || 0;
    }
    return pricing || 0;
  };

  useEffect(() => {
    if (!isOpen || !selectedGig) return;

    const basePrice = getPriceValue(selectedGig.pricing);

    setFormData({
      price: basePrice ? basePrice.toString() : "",
      description: "",
    });
    setError("");
  }, [isOpen, selectedGig]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGig || !formData.price || !formData.description) {
      setError("Please fill in all fields.");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setError("");

      const result = await sendOffer({
        receiverId,
        gigId: selectedGig._id,
        price,
        jobDescription: formData.description.trim(),
        date: new Date().toISOString(),
      }).unwrap();

      onOfferSent?.(result);
      onClose();
    } catch (err) {
      setError(
        err?.data?.message || "Failed to send the offer. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bgo">
      <div className="absolute inset-0 backdrop-blur-xl" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Custom Offer Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Recipient */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Sending offer to:</strong> {receiverName || "Customer"}
              </p>
            </div>

            {/* Selected Gig */}
            {selectedGig && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">
                    Selected Service
                  </h3>
                </div>

                <div className="flex items-start gap-4">
                  {selectedGig.images?.length > 0 && (
                    <img
                      src={getFullImageUrl(
                        selectedGig.images[0]?.url || selectedGig.images[0]
                      )}
                      alt={selectedGig.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {selectedGig.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {selectedGig.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        Base Price: TZS {getPriceValue(selectedGig.pricing)}
                      </span>
                      {selectedGig.deliveryTime && (
                        <span> • {selectedGig.deliveryTime} days</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Custom Price (TZS)
              </label>
              <input
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    price: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                required
              />
              {selectedGig && (
                <p className="text-xs text-gray-600 mt-2">
                  Base price for this service is TZS{" "}
                  {getPriceValue(selectedGig.pricing)}.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Offer Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={
                isSending ||
                !selectedGig ||
                !formData.price ||
                !formData.description
              }
              className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <DollarSign className="w-4 h-4" />
              )}
              {isSending ? "Sending Offer..." : "Send Custom Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomOfferModal;
