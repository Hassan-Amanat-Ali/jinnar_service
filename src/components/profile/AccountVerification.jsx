import { useState } from "react";
import {
  useUploadIdentityDocumentMutation,
  useSubmitForVerificationMutation,
} from "../../services/verificationApi";
import { useGetMyProfileQuery } from "../../services/workerApi";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Shield,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AccountVerification = () => {
  const { data: profileData, refetch } = useGetMyProfileQuery();
  const [uploadIdentityDocument, { isLoading: isUploading }] =
    useUploadIdentityDocumentMutation();
  const [submitForVerification, { isLoading: isSubmitting }] =
    useSubmitForVerificationMutation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("national_id");
  const [previewUrl, setPreviewUrl] = useState(null);

  const profile = profileData?.profile;
  const verificationStatus = profile?.verificationStatus || "not_submitted";
  const uploadedDocuments = profile?.identityDocuments || [];

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPG, PNG) or PDF file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      await uploadIdentityDocument({
        file: selectedFile,
        documentType,
      }).unwrap();

      toast.success("Document uploaded successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to upload document");
    }
  };

  // Handle verification submission
  const handleSubmitVerification = async () => {
    if (uploadedDocuments.length === 0) {
      toast.error("Please upload at least one identity document");
      return;
    }

    try {
      await submitForVerification().unwrap();
      toast.success("Verification request submitted successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to submit verification");
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "approved":
        return (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <CheckCircle size={20} />
            <span className="font-medium">Verified</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg">
            <Clock size={20} />
            <span className="font-medium">Pending Review</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
            <AlertCircle size={20} />
            <span className="font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg">
            <Shield size={20} />
            <span className="font-medium">Not Verified</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Account Verification
            </h1>
            <p className="text-gray-600">
              Verify your account to increase trust and unlock premium features
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Status Messages */}
      {verificationStatus === "approved" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle
              className="text-green-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Account Verified
              </h3>
              <p className="text-sm text-green-700">
                Your account has been successfully verified. You now have access
                to all premium features.
              </p>
            </div>
          </div>
        </div>
      )}

      {verificationStatus === "pending" && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Verification Pending
              </h3>
              <p className="text-sm text-yellow-700">
                Your verification request is under review. This usually takes
                1-2 business days. We'll notify you once the review is complete.
              </p>
            </div>
          </div>
        </div>
      )}

      {verificationStatus === "rejected" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Verification Rejected
              </h3>
              <p className="text-sm text-red-700">
                Your verification request was rejected. Please upload clear,
                valid identity documents and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section - Show if not approved AND (not pending OR no documents uploaded) */}
      {verificationStatus !== "approved" &&
        (verificationStatus !== "pending" ||
          uploadedDocuments.length === 0) && (
          <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-[#74C7F2]" />
              Upload Identity Document
            </h2>

            {/* Document Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              >
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document (JPG, PNG, or PDF - Max 5MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#B6E0FE] file:text-gray-700 hover:file:bg-[#74C7F2] hover:file:text-white cursor-pointer"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview
                </p>
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="max-w-xs rounded-lg border border-gray-200"
                />
              </div>
            )}

            {selectedFile && !previewUrl && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <FileText size={20} className="text-gray-600" />
                <span className="text-sm text-gray-700">
                  {selectedFile.name}
                </span>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="ml-auto text-gray-500 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-gray-900 font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        )}

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#74C7F2]" />
            Uploaded Documents
          </h2>
          <div className="space-y-3">
            {uploadedDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {doc.documentType.replace("_", " ").toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded on{" "}
                      {new Date(
                        doc.uploadedAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#74C7F2] hover:underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit for Verification Button - Only show if documents exist and not already submitted */}
      {uploadedDocuments.length > 0 &&
        verificationStatus !== "approved" &&
        verificationStatus !== "pending" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Ready to Submit?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you submit your documents for verification, our team will
              review them within 1-2 business days.
            </p>
            <button
              onClick={handleSubmitVerification}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-gray-900 font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Shield size={18} />
          Why Verify Your Account?
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Increase trust with customers</li>
          <li>• Get priority in search results</li>
          <li>• Access premium features</li>
          <li>• Higher chance of getting hired</li>
        </ul>
      </div>
    </div>
  );
};

export default AccountVerification;
