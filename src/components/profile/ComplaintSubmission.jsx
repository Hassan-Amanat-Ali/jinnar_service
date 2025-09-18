import { useState } from "react";
import { AlertTriangle, Upload, AlertCircle } from "lucide-react";
import DropDown from "../common/DropDown";

const ComplaintSubmission = () => {
  const [formData, setFormData] = useState({
    category: "",
    relatedBooking: "",
    workerName: "",
    description: "",
    files: null,
  });

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const complaintCategories = [
    "Service Quality",
    "Worker Behavior",
    "Billing Issues",
    "Safety Concerns",
    "Worker No-Show",
    "Property Damage",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: e.target.files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Complaint submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      category: "",
      relatedBooking: "",
      workerName: "",
      description: "",
      files: null,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Submit a Complaint
        </h1>
        <p className="text-sm text-gray-500">
          Report an issue related to a worker, service, or your booking.
        </p>
      </div>

      {/* Important Information Alert */}
      <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-orange-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="text-sm font-semibold text-orange-800 mb-1">
              Important Information
            </h3>
            <p className="text-sm text-orange-700 leading-relaxed">
              Please provide as much detail as possible. False complaints may
              result in account suspension. Our team will investigate promptly
              and respond within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Complaint Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Category*
          </label>
          <DropDown
            icon={<AlertCircle size={16} className="text-gray-400 mr-2" />}
            placeholder="Select the type of issue you're reporting"
            options={complaintCategories}
            isOpen={isCategoryDropdownOpen}
            onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            onSelect={handleCategorySelect}
            className="w-full"
          />
        </div>

        {/* Form Row with Related Booking and Worker Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Related Booking ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Booking Id (Optional)
            </label>
            <input
              type="text"
              name="relatedBooking"
              value={formData.relatedBooking}
              onChange={handleInputChange}
              placeholder="e.g. BK-123456"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              If your complaint relates to a specific booking, enter the booking
              ID here
            </p>
          </div>

          {/* Worker Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Worker Name (Optional)
            </label>
            <input
              type="text"
              name="workerName"
              value={formData.workerName}
              onChange={handleInputChange}
              placeholder="Enter the worker's name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              If your complaint involves a specific worker
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description*
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please provide a detailed..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white placeholder:text-gray-400 resize-none"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
            <Upload size={24} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Upload screenshots, images, or documents (Max 5 files, 10MB each)
            </p>
            <input
              type="file"
              id="file-upload"
              name="files"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200"
          >
            Submit Complaint
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 sm:flex-none px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintSubmission;
