import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Info, Plus, BadgeCheck, House } from "lucide-react";
import Dropdown from "../../common/DropDown.jsx";
import { Wrench, Scissors, Smile, Axe, Car } from "lucide-react";
import {
  useUpdateProfileMutation,
  useUploadCertificatesMutation,
} from "../../../services/workerApi";
import { setProfile } from "../../../features/worker/profileSlice";

const serviceCatalog = [
  {
    id: "plumbing",
    title: "Plumbing",
    category: "Home Maintenance",
    image: Wrench,
    desc: "Pipe repairs, installations, and maintenance",
  },
  {
    id: "hair",
    title: "Hair Styling",
    category: "Beauty & Personal Care",
    image: Scissors,

    desc: "Hair cutting, styling, and treatments",
  },
  {
    id: "cleaning",
    title: "House Cleaning",
    category: "Home Services",
    image: House,

    desc: "Residential cleaning and maintenance",
  },
  {
    id: "babysitting",
    title: "Babysitting",
    category: "Childcare",
    image: Smile,
    desc: "Child supervision and care",
  },
  {
    id: "carpentry",
    title: "Carpentry",
    category: "Home Maintenance",
    image: Axe,
    desc: "Wood work and furniture repairs",
  },
  {
    id: "carwash",
    title: "Car Washing",
    category: "Automotive",
    image: Car,
    desc: "Vehicle cleaning and detailing",
  },
];

const Step2Fom = forwardRef(({ profileData, isLoading, error }, ref) => {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadCertificates, { isLoading: isUploadingCert }] =
    useUploadCertificatesMutation();

  const [selected, setSelected] = useState(["plumbing"]);
  const [customService, setCustomService] = useState("");
  const [isExpOpen, setIsExpOpen] = useState(false);
  const [detail, setDetail] = useState({
    serviceId: "plumbing",
    description: "",
    experience: "",
    certificate: null,
  });

  const toggleService = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    // when selecting a new primary, also update right panel title
    setDetail((d) => ({ ...d, serviceId: id }));
  };

  const addCustomService = () => {
    const trimmed = customService.trim();
    if (!trimmed) return;
    const id = `custom:${trimmed.toLowerCase().replace(/\s+/g, "-")}`;
    if (!selected.includes(id)) setSelected((p) => [...p, id]);
    setCustomService("");
  };

  // Populate form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      console.log("Step2Form - Profile Data:", profileData);

      // Set skills from profile
      if (profileData.skills && profileData.skills.length > 0) {
        console.log("Loading skills:", profileData.skills);
        setSelected(profileData.skills);
        // Set first skill as primary for detail panel
        setDetail((prev) => ({ ...prev, serviceId: profileData.skills[0] }));
      } else {
        console.log("No skills found in profileData");
      }
    }
  }, [profileData]);

  // Save profile data
  const handleSave = async () => {
    let loadingToast = null;
    try {
      if (selected.length === 0) {
        toast.error("Please select at least one service");
        return false;
      }

      console.log("Step2Form - Saving skills:", selected);
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

      // Step 2: Update profile with skills
      // Update loading message
      toast.loading("Updating profile...", { id: loadingToast });

      const updateData = {
        skills: selected,
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
  if (isLoading) {
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

  const primaryService =
    serviceCatalog.find((s) => s.id === detail.serviceId) || serviceCatalog[0];

  return (
    <div className="align-center gap-6">
      {/* Left column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Your Skills / Services
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose the services you provide. You can add multiple services to
            reach more customers.
          </p>

          {/* services grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {serviceCatalog.map((s) => {
              const isActive = selected.includes(s.id);
              const IconComp = s.image || Wrench;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`relative text-left rounded-xl border p-3 transition shadow-sm hover:shadow-md ${
                    isActive
                      ? "border-sky-300 bg-linear-to-br from-[#F0F7FF] to-white"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {" "}
                        <div
                          className={`${
                            isActive ? "bg-secondary" : "bg-[#F3F4F6]"
                          } py-1 px-2 rounded`}
                        >
                          <IconComp
                            className="w-4"
                            color={isActive ? "gray" : "gray"}
                            fill={isActive ? "white" : "none"}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {s.title}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {s.category}
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
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Other Service */}
          <div className="mt-5">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Other Service (Not Listed)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Enter your custom service"
                className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCustomService}
                className="h-10 aspect-square flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Selected services */}
          <div className="mt-5 rounded-xl bg-sky-50 border border-sky-100 p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Selected Services ({selected.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 text-xs bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-md"
                >
                  {id.startsWith("custom:")
                    ? id.replace("custom:", "")
                    : serviceCatalog.find((s) => s.id === id)?.title}
                  <button
                    onClick={() => toggleService(id)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-3">
              Tip: Add at least one service. The more services you list, the
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
