import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Info, Plus, BadgeCheck, House } from "lucide-react";
import Dropdown from "../../common/DropDown.jsx";
import { Wrench, Scissors, Smile, Axe, Car } from "lucide-react";
import {
  useUpdateProfileMutation,
  useUploadCertificatesMutation,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../../../services/workerApi";
import { setProfile } from "../../../features/worker/profileSlice";

const Step2Fom = forwardRef(({ profileData, isLoading, error }, ref) => {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadCertificates, { isLoading: isUploadingCert }] =
    useUploadCertificatesMutation();

  // Fetch categories and subcategories from API
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery();

  const [selected, setSelected] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [isExpOpen, setIsExpOpen] = useState(false);
  const [detail, setDetail] = useState({
    categoryId: "",
    description: "",
    experience: "",
    certificate: null,
  });

  const toggleCategory = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setDetail((d) => ({ ...d, categoryId: id }));
  };

  const toggleSubcategory = (id) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Populate form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      console.log("Step2Form - Profile Data:", profileData);

      // Set categories from profile
      if (profileData.categories && profileData.categories.length > 0) {
        console.log("Loading categories:", profileData.categories);
        setSelected(profileData.categories);
        setDetail((prev) => ({
          ...prev,
          categoryId: profileData.categories[0],
        }));
      }

      // Set subcategories from profile
      if (profileData.subcategories && profileData.subcategories.length > 0) {
        console.log("Loading subcategories:", profileData.subcategories);
        setSelectedSubcategories(profileData.subcategories);
      }
    }
  }, [profileData]);

  // Save profile data
  const handleSave = async () => {
    let loadingToast = null;
    try {
      if (selected.length === 0) {
        toast.error("Please select at least one category");
        return false;
      }

      console.log("Step2Form - Saving categories:", selected);
      console.log("Step2Form - Saving subcategories:", selectedSubcategories);
      loadingToast = toast.loading("Saving services...");

      // Step 1: Upload certificate if provided
      let certificateData = null;
      if (detail.certificate instanceof File) {
        console.log("Certificate file selected:", {
          name: detail.certificate.name,
          type: detail.certificate.type,
          size: detail.certificate.size,
        });

        // Validate file type (must be PDF)
        if (detail.certificate.type !== "application/pdf") {
          toast.dismiss(loadingToast);
          toast.error("Certificate must be a PDF file");
          return false;
        }

        // Validate file size (10MB limit)
        if (detail.certificate.size > 10 * 1024 * 1024) {
          toast.dismiss(loadingToast);
          toast.error("Certificate file must be less than 10MB");
          return false;
        }

        try {
          // Update loading message
          toast.loading("Uploading certificate...", { id: loadingToast });
          console.log("Uploading certificate...");
          const certFormData = new FormData();
          certFormData.append("certificates", detail.certificate);

          const certResult = await uploadCertificates(certFormData).unwrap();
          certificateData = certResult.files; // Array of { url, publicId }
          console.log("Certificate uploaded:", certificateData);
        } catch (certError) {
          console.error("Certificate upload error:", certError);
          toast.dismiss(loadingToast);
          toast.error(
            certError?.data?.error ||
              "Failed to upload certificate. You can add it later."
          );
          return false;
        }
      }

      // Step 2: Update profile with categories and subcategories
      // Update loading message
      toast.loading("Updating profile...", { id: loadingToast });

      const updateData = {
        categories: selected,
        subcategories: selectedSubcategories,
      };

      // Add certificates if uploaded successfully
      if (certificateData && certificateData.length > 0) {
        updateData.certificates = certificateData;
      }

      console.log("Sending update data:", updateData);
      const result = await updateProfile(updateData).unwrap();
      console.log("Update result:", result);

      // Update Redux store
      dispatch(setProfile(result.user));

      // Dismiss loading and show success only after everything is complete
      toast.dismiss(loadingToast);
      toast.success("Services updated successfully!");

      return true;
    } catch (err) {
      console.error("Failed to save services:", err);
      // Dismiss loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      toast.error(
        err?.data?.error || "Failed to save services. Please try again."
      );
      return false;
    }
  };

  // Expose handleSave to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  // Show loading skeleton if data is still loading
  if (isLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="h-24 bg-gray-300 rounded"></div>
              <div className="h-24 bg-gray-300 rounded"></div>
              <div className="h-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Failed to load profile data. Please try again.
        </p>
      </div>
    );
  }

  const categories = categoriesData || [];
  const subcategories = subcategoriesData || [];

  // Helper function to format names
  const formatName = (name) =>
    name?.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  return (
    <div className="align-center gap-6">
      {/* Left column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Your Service Categories
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose the categories you provide services in. You can add multiple
            categories to reach more customers.
          </p>

          {/* Categories grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const isActive = selected.includes(category._id);
              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => toggleCategory(category._id)}
                  className={`relative text-left rounded-xl border p-3 transition shadow-sm hover:shadow-md ${
                    isActive
                      ? "border-sky-300 bg-linear-to-br from-[#F0F7FF] to-white"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`${
                            isActive ? "bg-secondary" : "bg-[#F3F4F6]"
                          } py-1 px-2 rounded`}
                        >
                          <Wrench
                            className="w-4"
                            color={isActive ? "gray" : "gray"}
                            fill={isActive ? "white" : "none"}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatName(category.name)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 text-[10px]">
                        <BadgeCheck size={12} /> Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {category.description || "Service category"}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Subcategories Section */}
          {selected.length > 0 && subcategories.length > 0 && (
            <div className="mt-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Select Specific Services (Subcategories)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {subcategories
                  .filter((sub) => selected.includes(sub.categoryId))
                  .map((subcategory) => {
                    const isActive = selectedSubcategories.includes(
                      subcategory._id
                    );
                    return (
                      <button
                        key={subcategory._id}
                        type="button"
                        onClick={() => toggleSubcategory(subcategory._id)}
                        className={`text-left rounded-lg border p-2 transition text-sm ${
                          isActive
                            ? "border-sky-300 bg-sky-50 text-sky-700"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {formatName(subcategory.name)}
                          </span>
                          {isActive && (
                            <BadgeCheck size={14} className="text-sky-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Selected categories and subcategories */}
          <div className="mt-5 rounded-xl bg-sky-50 border border-sky-100 p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Selected Categories ({selected.length}) & Subcategories (
              {selectedSubcategories.length})
            </div>

            {selected.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  Categories:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.map((id) => {
                    const category = categories.find((c) => c._id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 text-xs bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-md"
                      >
                        {category ? formatName(category.name) : id}
                        <button
                          onClick={() => toggleCategory(id)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedSubcategories.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">
                  Subcategories:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSubcategories.map((id) => {
                    const subcategory = subcategories.find((s) => s._id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 text-xs bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-md"
                      >
                        {subcategory ? formatName(subcategory.name) : id}
                        <button
                          onClick={() => toggleSubcategory(id)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-[11px] text-gray-500 mt-3">
              Tip: Add at least one category. The more services you list, the
              more customers can find you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

Step2Fom.displayName = "Step2Fom";

export default Step2Fom;
