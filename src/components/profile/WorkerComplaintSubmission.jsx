import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Upload, AlertCircle, Loader2, FileText, User } from "lucide-react";
import DropDown from "../common/DropDown";
import { toast } from "react-toastify";
import { useGetOrderByIdQuery, useGetPublicProfileQuery } from "../../services/workerApi";

const WorkerComplaintSubmission = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const customerId = searchParams.get("customerId");

  // Fetch context data if IDs are present
  const { data: orderData, isLoading: orderLoading } = useGetOrderByIdQuery(bookingId, {
    skip: !bookingId,
  });
  
  const { data: customerData, isLoading: customerLoading } = useGetPublicProfileQuery(customerId, {
    skip: !customerId,
  });

  const [formData, setFormData] = useState({
    category: "",
    relatedBooking: bookingId || "",
    customerName: "",
    description: "",
    files: null,
  });

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill form when data is loaded
  useEffect(() => {
    if (orderData) {
      const order = orderData.order || orderData;
      setFormData(prev => ({
        ...prev,
        relatedBooking: order._id,
        customerName: order.buyerId?.name || order.buyerId?.mobileNumber || prev.customerName
      }));
    }
  }, [orderData]);

  useEffect(() => {
    if (customerData?.profile) {
      setFormData(prev => ({
        ...prev,
        customerName: customerData.profile.name || prev.customerName
      }));
    }
  }, [customerData]);

  const complaintCategories = [
    "Spam",
    "Inappropriate Content",
    "Harassment",
    "Scam/Fraud",
    "Poor Service",
    "Did Not Pay",
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

  const uploadFiles = async (files) => {
    // Placeholder for file upload logic
    console.log("Uploading files:", files);
    return []; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const attachmentUrls = formData.files ? await uploadFiles(formData.files) : [];

      const payload = {
        reason: formData.category,
        description: formData.description,
        attachments: attachmentUrls,
      };

      if (formData.relatedBooking) {
        payload.orderId = formData.relatedBooking;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("https://api.jinnar.com/api/user/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Report submitted successfully. Our support team will review it.");
        handleCancel();
      } else {
        toast.error(data.error || "Failed to submit report. Please ensure you provide a valid Booking ID.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      category: "",
      relatedBooking: bookingId || "",
      customerName: "",
      description: "",
      files: null,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Submit a Report
        </h1>
        <p className="text-sm text-gray-500">
          Report an issue related to a customer or booking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Reason*
          </label>
          <DropDown
            icon={<AlertCircle size={16} className="text-gray-400 mr-2" />}
            placeholder="Select reason"
            options={complaintCategories}
            isOpen={isCategoryDropdownOpen}
            onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            onSelect={handleCategorySelect}
            className="w-full"
          />
        </div>

        {/* Context Info (if available) */}
        {(bookingId || customerId) && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col gap-2">
            {bookingId && (
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <FileText size={16} />
                <span className="font-medium">Related to Booking:</span>
                <span>#{bookingId.slice(-6).toUpperCase()}</span>
              </div>
            )}
            {formData.customerName && (
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <User size={16} />
                <span className="font-medium">Customer:</span>
                <span>{formData.customerName}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name (Optional)
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter customer's name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description*
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please provide details about the incident..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white placeholder:text-gray-400 resize-none"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Submit Report
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

export default WorkerComplaintSubmission;
