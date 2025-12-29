import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  Upload,
  X,
  DollarSign,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import {
  useCreateGigMutation,
  useUploadGigImageMutation,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../../../services/workerApi";
import toast from "react-hot-toast";

// Helper function to format category/subcategory names
const formatName = (name) => {
  if (!name) return "";
  return name
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Step6Gig = forwardRef((props, ref) => {
  const [createGig, { isLoading: isCreating }] = useCreateGigMutation();
  const [uploadGigImage] = useUploadGigImageMutation();
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData || [];

  const [formData, setFormData] = useState({
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
  });

  const [imagePreview, setImagePreview] = useState([]);

  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery(formData.categoryId, {
      skip: !formData.categoryId,
    });
  const subcategories = subcategoriesData || [];

  // Expose save method to parent
  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      return await handleSubmit();
    },
  }));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a gig title");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return false;
    }
    if (!formData.fixedEnabled && !formData.hourlyEnabled && !formData.inspectionEnabled) {
      toast.error("Please enable at least one pricing option");
      return false;
    }
    if (formData.fixedEnabled && !formData.fixedPrice) {
      toast.error("Please enter a fixed price");
      return false;
    }
    if (formData.hourlyEnabled && !formData.hourlyRate) {
      toast.error("Please enter an hourly rate");
      return false;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return false;
    }
    if (!formData.primarySubcategory) {
      toast.error("Please select a subcategory");
      return false;
    }

    const loadingToast = toast.loading("Creating your gig...");

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
        extraSubcategories: [],
      };

      const newGig = await createGig(gigData).unwrap();

      // Upload images if any
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

      toast.success("Service offering created successfully", { id: loadingToast });
      return true;
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create gig", {
        id: loadingToast,
      });
      return false;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#AEDDFC]/20 to-[#AEDDFC]/10 border border-[#AEDDFC] rounded-xl p-5 mb-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#74C7F2] rounded-lg flex items-center justify-center">
              <AlertCircle className="text-white" size={20} />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Create Your Professional Service Offering</h4>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#74C7F2] mt-0.5">•</span>
                <span>Increase your visibility to potential customers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#74C7F2] mt-0.5">•</span>
                <span>Professional service listings improve booking conversion rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#74C7F2] mt-0.5">•</span>
                <span>Expand your offerings anytime from your profile dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AEDDFC] focus:border-[#AEDDFC] outline-none"
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
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AEDDFC] focus:border-[#AEDDFC] outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </p>
        </div>

        {/* Category */}
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
                }));
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
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

        {/* Subcategory */}
        {formData.categoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="primarySubcategory"
                value={formData.primarySubcategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AEDDFC] focus:border-[#AEDDFC] outline-none appearance-none bg-white"
              >
                <option value="">Select a subcategory</option>
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
          </div>
        )}

        {/* Pricing Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pricing Options <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            {/* Fixed Price */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  name="fixedEnabled"
                  checked={formData.fixedEnabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#74C7F2] rounded focus:ring-2 focus:ring-[#AEDDFC]"
                />
                <label className="text-sm font-medium text-gray-900">
                  Fixed Price
                </label>
              </div>
              {formData.fixedEnabled && (
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
                    placeholder="Enter fixed price (TZS)"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AEDDFC] focus:border-[#AEDDFC] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Hourly Rate */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  name="hourlyEnabled"
                  checked={formData.hourlyEnabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#74C7F2] rounded focus:ring-2 focus:ring-[#AEDDFC]"
                />
                <label className="text-sm font-medium text-gray-900">
                  Hourly Rate
                </label>
              </div>
              {formData.hourlyEnabled && (
                <div className="space-y-3">
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
                      placeholder="Rate per hour (TZS)"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AEDDFC] focus:border-[#AEDDFC] outline-none"
                    />
                  </div>
                  <input
                    type="number"
                    name="minHours"
                    value={formData.minHours}
                    onChange={handleInputChange}
                    placeholder="Minimum hours (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AEDDFC] focus:border-[#AEDDFC] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Inspection Required */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="inspectionEnabled"
                  checked={formData.inspectionEnabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#74C7F2] rounded focus:ring-2 focus:ring-[#AEDDFC]"
                />
                <label className="text-sm font-medium text-gray-900">
                  Inspection Required (Price after inspection)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Optional, max 3)
          </label>
          <div className="space-y-3">
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imagePreview.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imagePreview.length < 3 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#AEDDFC] transition-colors">
                <Upload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-600">
                  Click to upload images
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
      </div>
    </div>
  );
});

Step6Gig.displayName = "Step6Gig";

export default Step6Gig;
