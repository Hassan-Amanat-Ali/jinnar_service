import React, { useState, useMemo } from "react";
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
  ChevronDown,
} from "lucide-react";
import {
  useGetMyGigsQuery,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useUploadGigImageMutation,
  useDeleteGigImageMutation,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetMyProfileQuery,
} from "../../services/workerApi";
import toast from "react-hot-toast";
import { getFullImageUrl } from "../../utils/fileUrl.js";

// Helper function to format category/subcategory names nicely
const formatName = (name) => {
  if (!name) return "";
  return name
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const WorkerGigs = () => {
  const { data, isLoading, error } = useGetMyGigsQuery();
  const { data: profileData } = useGetMyProfileQuery();
  const [createGig, { isLoading: isCreating }] = useCreateGigMutation();
  const [updateGig, { isLoading: isUpdating }] = useUpdateGigMutation();
  const [deleteGig, { isLoading: isDeleting }] = useDeleteGigMutation();
  const [uploadGigImage, { isLoading: isUploadingImages }] =
    useUploadGigImageMutation();
  const [deleteGigImage] = useDeleteGigImageMutation();

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Fetch ALL subcategories for displaying in gig cards
  const { data: allSubcategoriesData } = useGetSubcategoriesQuery();

  const [showModal, setShowModal] = useState(false);
  const [editingGig, setEditingGig] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // Multi-option pricing
    fixedEnabled: false,
    fixedPrice: "",
    hourlyEnabled: false,
    hourlyRate: "",
    minHours: "",
    inspectionEnabled: true,
    images: [],
    categoryId: "",
    primarySubcategory: "",
    extraSubcategories: [],
  });
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch subcategories for the selected category in the form
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery(formData.categoryId, {
      skip: !formData.categoryId,
    });

  // Categories and subcategories arrays
  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  const subcategories = useMemo(
    () => subcategoriesData || [],
    [subcategoriesData]
  );
  const allSubcategories = useMemo(
    () => allSubcategoriesData || [],
    [allSubcategoriesData]
  );

  // Helper functions to get names by ID
  const getCategoryName = (categoryIdOrObj) => {
    if (!categoryIdOrObj) return null;
    // If it's already an object with a name, use it
    if (typeof categoryIdOrObj === "object" && categoryIdOrObj.name) {
      return formatName(categoryIdOrObj.name);
    }
    // Otherwise, look it up in our categories
    const category = categories.find((c) => c._id === categoryIdOrObj);
    return category ? formatName(category.name) : null;
  };

  const getSubcategoryName = (subcategoryIdOrObj) => {
    if (!subcategoryIdOrObj) return null;
    // If it's already an object with a name, use it
    if (typeof subcategoryIdOrObj === "object" && subcategoryIdOrObj.name) {
      return formatName(subcategoryIdOrObj.name);
    }
    // Otherwise, look it up in all subcategories
    const subcategory = allSubcategories.find(
      (s) => s._id === subcategoryIdOrObj
    );
    return subcategory ? formatName(subcategory.name) : null;
  };

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
  const removeImage = async (index) => {
    const imageToRemove = imagePreview[index];
    const newImagePreviews = imagePreview.filter((_, i) => i !== index);

    // If it's a string, it's an existing image URL from the server
    if (editingGig && typeof imageToRemove === "string") {
      // Optimistically update the UI
      setImagePreview(newImagePreviews);
      // Fire and forget the delete request to the backend
      await deleteGigImage({ gigId: editingGig._id, imageUrl: imageToRemove });
    }

    // Also update the local state for new file uploads
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview(newImagePreviews);
  };

  // Open modal for creating new gig
  const handleCreateNew = () => {
    setEditingGig(null);
    setFormData({
      title: "",
      description: "",
      fixedEnabled: false,
      fixedPrice: "",
      hourlyEnabled: false,
      hourlyRate: "",
      minHours: "",
      inspectionEnabled: true,
      images: [],
      categoryId: "",
      primarySubcategory: "",
      extraSubcategories: [],
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
      fixedEnabled: gig.pricing.fixed?.enabled || false,
      fixedPrice: gig.pricing.fixed?.price || "",
      hourlyEnabled: gig.pricing.hourly?.enabled || false,
      hourlyRate: gig.pricing.hourly?.rate || "",
      minHours: gig.pricing.hourly?.minHours || "",
      inspectionEnabled: gig.pricing.inspection?.enabled !== false,
      images: [],
      categoryId: gig.category?._id || gig.category || "",
      primarySubcategory:
        gig.primarySubcategory?._id || gig.primarySubcategory || "",
      extraSubcategories: gig.extraSubcategories?.map((s) => s._id || s) || [],
    });
    setImagePreview(gig.images?.map((img) => getFullImageUrl(img.url)) || []);
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
    // At least one pricing option must be enabled
    if (!formData.fixedEnabled && !formData.hourlyEnabled && !formData.inspectionEnabled) {
      toast.error("Please enable at least one pricing option");
      return;
    }
    // Validate fixed pricing
    if (formData.fixedEnabled && !formData.fixedPrice) {
      toast.error("Fixed price is required when fixed pricing is enabled");
      return;
    }
    // Validate hourly pricing
    if (formData.hourlyEnabled && !formData.hourlyRate) {
      toast.error("Hourly rate is required when hourly pricing is enabled");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.primarySubcategory) {
      toast.error("Please select a primary subcategory");
      return;
    }

    const loadingToast = toast.loading(
      editingGig ? "Updating gig..." : "Creating gig..."
    );

    try {
      const gigData = {
        title: formData.title,
        description: formData.description,
        fixedEnabled: formData.fixedEnabled,
        fixedPrice: formData.fixedEnabled ? Number(formData.fixedPrice) : undefined,
        hourlyEnabled: formData.hourlyEnabled,
        hourlyRate: formData.hourlyEnabled ? Number(formData.hourlyRate) : undefined,
        minHours: formData.hourlyEnabled && formData.minHours ? Number(formData.minHours) : undefined,
        inspectionEnabled: formData.inspectionEnabled,
        categoryId: formData.categoryId,
        primarySubcategory: formData.primarySubcategory,
        extraSubcategories: formData.extraSubcategories,
      };

      if (editingGig) {
        // --- UPDATE GIG ---
        // 1. Update text data first. The backend will preserve existing images.
        toast.loading("Updating gig details...", { id: loadingToast });
        await updateGig({ id: editingGig._id, ...gigData }).unwrap();

        // 2. Upload only the *new* images, if any
        if (formData.images.length > 0) {
          toast.loading("Uploading new images...", { id: loadingToast });
          const imageFormData = new FormData();
          formData.images.forEach((imageFile) => {
            imageFormData.append("gig_images", imageFile);
          });
          await uploadGigImage({
            gigId: editingGig._id,
            formData: imageFormData,
          }).unwrap();
        }

        toast.success("Gig updated successfully", { id: loadingToast });
      } else {
        // --- CREATE GIG ---
        // 1. Create the gig with text data
        const newGig = await createGig(gigData).unwrap();

        // 2. If images were selected, upload them to the new gig's ID
        if (formData.images.length > 0 && newGig.gig?._id) {
          toast.loading("Uploading images...", { id: loadingToast });
          const imageFormData = new FormData();
          formData.images.forEach((imageFile) => {
            imageFormData.append("gig_images", imageFile);
          });
          await uploadGigImage({
            gigId: newGig.gig._id,
            formData: imageFormData,
          }).unwrap();
        }

        toast.success("Gig created successfully", { id: loadingToast });
      }

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        fixedEnabled: false,
        fixedPrice: "",
        hourlyEnabled: false,
        hourlyRate: "",
        minHours: "",
        inspectionEnabled: true,
        images: [],
        categoryId: "",
        primarySubcategory: "",
        extraSubcategories: [],
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
                  src={getFullImageUrl(gig.images[0].url)}
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
                  {(() => {
                    const enabledOptions = [
                      gig.pricing?.fixed?.enabled && 'fixed',
                      gig.pricing?.hourly?.enabled && 'hourly',
                      gig.pricing?.inspection?.enabled && 'inspection'
                    ].filter(Boolean);
                    
                    if (enabledOptions.length > 1) {
                      return (
                        <span className="text-sm font-bold text-gray-900">
                          {enabledOptions.length} Pricing Options
                        </span>
                      );
                    } else if (gig.pricing?.fixed?.enabled) {
                      return (
                        <>
                          <DollarSign size={14} className="text-green-600" />
                          <span className="text-sm font-bold text-gray-900">
                            TZS {gig.pricing.fixed.price?.toLocaleString()}
                          </span>
                        </>
                      );
                    } else if (gig.pricing?.hourly?.enabled) {
                      return (
                        <>
                          <DollarSign size={14} className="text-green-600" />
                          <span className="text-sm font-bold text-gray-900">
                            TZS {gig.pricing.hourly.rate?.toLocaleString()}/hr
                          </span>
                        </>
                      );
                    } else {
                      return (
                        <span className="text-sm font-bold text-gray-900">
                          Inspection Required
                        </span>
                      );
                    }
                  })()}
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

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {gig.description}
              </p>

              {/* Category & Subcategory Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {gig.category && getCategoryName(gig.category) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {getCategoryName(gig.category)}
                  </span>
                )}
                {gig.primarySubcategory &&
                  getSubcategoryName(gig.primarySubcategory) && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {getSubcategoryName(gig.primarySubcategory)}
                    </span>
                  )}
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

      {/* Verification Warning Banner */}
      {profileData?.profile?.verificationStatus !== "approved" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Verification Required</h4>
              <p className="text-sm text-gray-700 mb-2">
                Your gigs are currently hidden from customers. Complete your document verification to make your services visible and start receiving bookings.
              </p>
              <p className="text-xs text-gray-600">
                Status: <span className="font-medium">{profileData?.profile?.verificationStatus || "Not submitted"}</span>
              </p>
            </div>
          </div>
        </div>
      )}

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
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                        primarySubcategory: "",
                        extraSubcategories: [],
                      }));
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoriesLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {formatName(category.name)}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Primary Subcategory */}
              {formData.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Subcategory <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="primarySubcategory"
                      value={formData.primarySubcategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          primarySubcategory: value,
                          // Remove from extra if selected as primary
                          extraSubcategories: prev.extraSubcategories.filter(
                            (id) => id !== value
                          ),
                        }));
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select primary subcategory</option>
                      {subcategoriesLoading ? (
                        <option disabled>Loading subcategories...</option>
                      ) : (
                        subcategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {formatName(sub.name)}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This is the main service you offer
                  </p>
                </div>
              )}

              {/* Extra Subcategories */}
              {formData.categoryId && formData.primarySubcategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Subcategories (Optional)
                  </label>
                  <div className="space-y-3">
                    {/* Selected Extra Subcategories */}
                    {formData.extraSubcategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.extraSubcategories.map((subId) => {
                          const sub = subcategories.find(
                            (s) => s._id === subId
                          );
                          return (
                            <div
                              key={subId}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              <span>{sub ? formatName(sub.name) : subId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    extraSubcategories:
                                      prev.extraSubcategories.filter(
                                        (id) => id !== subId
                                      ),
                                  }));
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Extra Subcategory Dropdown */}
                    <div className="relative">
                      <select
                        value=""
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value &&
                            !formData.extraSubcategories.includes(value) &&
                            value !== formData.primarySubcategory
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              extraSubcategories: [
                                ...prev.extraSubcategories,
                                value,
                              ],
                            }));
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Add another subcategory</option>
                        {subcategories
                          .filter(
                            (sub) =>
                              sub._id !== formData.primarySubcategory &&
                              !formData.extraSubcategories.includes(sub._id)
                          )
                          .map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {formatName(sub.name)}
                            </option>
                          ))}
                      </select>
                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Add more subcategories if your gig covers multiple
                      services
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pricing Options <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-4">
                  Select one or more pricing options to offer customers flexibility
                </p>
                
                <div className="space-y-4">
                  {/* Fixed Price Option */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${
                    formData.fixedEnabled
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.fixedEnabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          fixedEnabled: e.target.checked
                        }))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Fixed Price</div>
                        <div className="text-sm text-gray-600">Standard pricing for repeatable jobs</div>
                      </div>
                    </label>
                    
                    {formData.fixedEnabled && (
                      <div className="mt-3 pl-7">
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
                            name="fixedPrice"
                            value={formData.fixedPrice}
                            onChange={handleInputChange}
                            placeholder="e.g., 50000"
                            min={0}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Total fixed price for the service
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hourly Rate Option */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${
                    formData.hourlyEnabled
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hourlyEnabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hourlyEnabled: e.target.checked
                        }))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Hourly Rate</div>
                        <div className="text-sm text-gray-600">Time-based pricing with optional minimum hours</div>
                      </div>
                    </label>
                    
                    {formData.hourlyEnabled && (
                      <div className="mt-3 pl-7 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hourly Rate (TZS) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <DollarSign
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="number"
                              name="hourlyRate"
                              value={formData.hourlyRate}
                              onChange={handleInputChange}
                              placeholder="e.g., 15000"
                              min={0}
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Amount charged per hour of work
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Hours (Optional)
                          </label>
                          <div className="relative">
                            <Clock
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="number"
                              name="minHours"
                              value={formData.minHours}
                              onChange={handleInputChange}
                              placeholder="e.g., 2"
                              min={0}
                              step="0.5"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Minimum hours required (leave empty if no minimum)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inspection-Based Option */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${
                    formData.inspectionEnabled
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.inspectionEnabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          inspectionEnabled: e.target.checked
                        }))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Inspection-Based</div>
                        <div className="text-sm text-gray-600">Final price determined after on-site inspection</div>
                      </div>
                    </label>
                    
                    {formData.inspectionEnabled && (
                      <div className="mt-3 pl-7">
                        <div className="bg-white border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> You'll visit the job site to assess the work before providing a final quote to the customer.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(index);
                            }}
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
                    <label
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${
                        isUploadingImages ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
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
                        disabled={isUploadingImages}
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
                  disabled={isCreating || isUpdating || isUploadingImages}
                  className="flex-1 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {isCreating || isUpdating || isUploadingImages
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
