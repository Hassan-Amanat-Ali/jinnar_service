import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Clock,
  FileText,
  X,
  Upload,
  AlertTriangle,
} from "lucide-react";
import {
  useGetMyGigsQuery,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useUploadOtherImagesMutation,
} from "../../services/workerApi";
import toast from "react-hot-toast";

const WorkerGigs = () => {
  const { data, isLoading, error } = useGetMyGigsQuery();
  const [createGig, { isLoading: isCreating }] = useCreateGigMutation();
  const [updateGig, { isLoading: isUpdating }] = useUpdateGigMutation();
  const [deleteGig, { isLoading: isDeleting }] = useDeleteGigMutation();
  const [uploadOtherImages, { isLoading: isUploadingImages }] =
    useUploadOtherImagesMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingGig, setEditingGig] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricingMethod: "fixed",
    price: "",
    images: [],
    skills: [],
  });
  const [imagePreview, setImagePreview] = useState([]);

  const gigs = data?.gigs || [];

  // Skeleton Component with Shimmer
  const Skeleton = ({ className = "" }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}>
      <div className="shimmer"></div>
    </div>
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imagePreview.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Remove image from preview
  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Open modal for creating new gig
  const handleCreateNew = () => {
    setEditingGig(null);
    setFormData({
      title: "",
      description: "",
      pricingMethod: "fixed",
      price: "",
      images: [],
      skills: [],
    });
    setImagePreview([]);
    setShowModal(true);
  };

  // Open modal for editing existing gig
  const handleEdit = (gig) => {
    setEditingGig(gig);
    setFormData({
      title: gig.title,
      description: gig.description,
      pricingMethod: gig.pricing.method,
      price: gig.pricing.price || "",
      images: [],
      skills: gig.skills || [],
    });
    setImagePreview(gig.images?.map((img) => img.url) || []);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (formData.pricingMethod !== "negotiable" && !formData.price) {
      toast.error("Price is required for fixed/hourly pricing");
      return;
    }
    if (!formData.skills || formData.skills.length === 0) {
      toast.error("At least one skill/category is required");
      return;
    }

    const loadingToast = toast.loading(
      editingGig ? "Updating gig..." : "Creating gig..."
    );

    try {
      // Upload new images if any
      let uploadedImageUrls = [];
      if (formData.images.length > 0) {
        toast.loading("Uploading images...", { id: loadingToast });

        const formDataImages = new FormData();
        formData.images.forEach((image) => {
          formDataImages.append("otherImages", image);
        });

        const uploadResult = await uploadOtherImages(formDataImages).unwrap();
        uploadedImageUrls = uploadResult.files.map((file) => file.url); // Extract only URLs
      }

      // For editing, preserve existing images and add new ones
      let finalImages = uploadedImageUrls;
      if (editingGig && editingGig.images) {
        // Keep existing images that weren't removed
        const existingImageUrls = editingGig.images
          .filter((img) => imagePreview.includes(img.url))
          .map((img) => img.url);
        finalImages = [...existingImageUrls, ...uploadedImageUrls];
      }

      toast.loading(editingGig ? "Updating gig..." : "Creating gig...", {
        id: loadingToast,
      });

      const gigData = {
        title: formData.title,
        description: formData.description,
        pricingMethod: formData.pricingMethod,
        price:
          formData.pricingMethod !== "negotiable"
            ? Number(formData.price)
            : undefined,
        images: finalImages,
        skills: formData.skills,
      };

      if (editingGig) {
        await updateGig({ id: editingGig._id, ...gigData }).unwrap();
        toast.success("Gig updated successfully", { id: loadingToast });
      } else {
        await createGig(gigData).unwrap();
        toast.success("Gig created successfully", { id: loadingToast });
      }

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        pricingMethod: "fixed",
        price: "",
        images: [],
        skills: [],
      });
      setImagePreview([]);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to save gig", {
        id: loadingToast,
      });
    }
  };

  // Handle delete
  const handleDeleteClick = (gig) => {
    setGigToDelete(gig);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!gigToDelete) return;

    const loadingToast = toast.loading("Deleting gig...");
    try {
      await deleteGig(gigToDelete._id).unwrap();
      toast.success("Gig deleted successfully", { id: loadingToast });
      setShowDeleteConfirm(false);
      setGigToDelete(null);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to delete gig", {
        id: loadingToast,
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setGigToDelete(null);
  };

  // Render loading skeleton only for gigs grid
  const renderGigsGrid = () => {
    if (isLoading) {
      return (
        <>
          <style>{`
            @keyframes shimmer {
              0% {
                background-position: -1000px 0;
              }
              100% {
                background-position: 1000px 0;
              }
            }
            .shimmer {
              animation: shimmer 2s infinite;
              background: linear-gradient(
                to right,
                transparent 0%,
                rgba(255, 255, 255, 0.6) 50%,
                transparent 100%
              );
              background-size: 1000px 100%;
            }
          `}</style>

          {/* Gigs Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="relative h-48 bg-gray-200">
                  <Skeleton className="w-full h-full" />
                  {/* Price Badge Skeleton */}
                  <div className="absolute top-3 right-3">
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-4">
                  {/* Title Skeleton */}
                  <Skeleton className="h-6 w-3/4 mb-2" />

                  {/* Description Skeleton */}
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />

                  {/* Badges Skeleton */}
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex gap-2">
                    <Skeleton className="flex-1 h-10 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (gigs.length === 0) {
      return (
        <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Gigs Yet
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Create your first gig to start receiving job requests
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Create Your First Gig
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Gig Image */}
            <div className="relative h-48 bg-gray-200">
              {gig.images && gig.images.length > 0 ? (
                <img
                  src={gig.images[0].url}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={48} />
                </div>
              )}
              {/* Pricing Badge */}
              <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-md">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} className="text-green-600" />
                  <span className="text-sm font-bold text-gray-900">
                    {gig.pricing.method === "negotiable"
                      ? "Negotiable"
                      : `TZS ${gig.pricing.price?.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Gig Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-1">
                  {gig.title}
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {gig.description}
              </p>

              {/* Pricing Method Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                  <Clock size={12} />
                  <span className="capitalize">{gig.pricing.method}</span>
                </div>
                {gig.images && gig.images.length > 1 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    <ImageIcon size={12} />
                    <span>{gig.images.length} images</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(gig)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(gig)}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load gigs</p>
          <p className="text-gray-500">
            {error?.data?.error || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">My Gigs</h2>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Create New Gig
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Manage your service offerings and pricing
        </p>
      </div>

      {/* Gigs List - Dynamic Content with Shimmer */}
      {renderGigsGrid()}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingGig ? "Edit Gig" : "Create New Gig"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gig Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional Electrical Installation"
                  maxLength={100}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service in detail..."
                  maxLength={1000}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Skills/Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills/Categories <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                skills: prev.skills.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Skill Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill or category"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value && !formData.skills.includes(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              skills: [...prev.skills, value],
                            }));
                            e.target.value = "";
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        const value = input.value.trim();
                        if (value && !formData.skills.includes(value)) {
                          setFormData((prev) => ({
                            ...prev,
                            skills: [...prev.skills, value],
                          }));
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter or click + to add skills. Add skills like
                    "Plumbing", "Electrical", "Carpentry", etc.
                  </p>
                </div>
              </div>

              {/* Pricing Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["fixed", "hourly", "negotiable"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          pricingMethod: method,
                        }))
                      }
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.pricingMethod === method
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {method === "fixed" && "Fixed Price"}
                      {method === "hourly" && "Hourly Rate"}
                      {method === "negotiable" && "Negotiable"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              {formData.pricingMethod !== "negotiable" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (TZS) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      min={0}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required={formData.pricingMethod !== "negotiable"}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.pricingMethod === "hourly"
                      ? "Price per hour"
                      : "Total price for the service"}
                  </p>
                </div>
              )}

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Max 3)
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  {imagePreview.length < 3 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <span className="text-sm text-gray-600">
                        Click to upload images
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingGig
                    ? "Update Gig"
                    : "Create Gig"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && gigToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Gig?
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{gigToDelete.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
              >
                {isDeleting ? "Deleting..." : "Delete Gig"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerGigs;
