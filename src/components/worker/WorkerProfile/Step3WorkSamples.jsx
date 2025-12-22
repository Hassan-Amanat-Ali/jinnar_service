import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Info,
  UploadCloud,
  FileImage,
  FileVideo,
  FileText,
  X,
  Star,
} from "lucide-react";
import {
  useUpdateProfileMutation,
  useUploadPortfolioImagesMutation,
  useUploadVideosMutation,
  useUploadCertificatesMutation,
} from "../../../services/workerApi";
import { setProfile } from "../../../features/worker/profileSlice";
import { getFullImageUrl } from "../../../utils/fileUrl.js";

const humanFileType = (file) => {
  const type = file.type || "";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type === "application/pdf") return "pdf";
  return "file";
};

const Thumb = ({ file, onRemove, isExisting = false }) => {
  const kind = isExisting
    ? file.url?.includes("/videos/")
      ? "video"
      : file.url?.includes("/certificates/")
      ? "pdf"
      : "image"
    : humanFileType(file);

  const Icon =
    kind === "image"
      ? FileImage
      : kind === "video"
      ? FileVideo
      : kind === "pdf"
      ? FileText
      : FileText;

  const displayName = isExisting
    ? file.url?.split("/").pop()?.split("?")[0] || "Uploaded file"
    : file.name || "file";

  return (
    <div className="relative w-40 h-28 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center group">
      {isExisting && kind === "image" ? (
        <img
          src={getFullImageUrl(file.url)}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      ) : (
        <Icon className="w-10 h-10 text-gray-400" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Remove file"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 px-2 py-1 text-[11px] text-gray-600 truncate">
        {displayName}
      </div>
      {isExisting && (
        <div className="absolute top-1 left-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded">
          Uploaded
        </div>
      )}
    </div>
  );
};

const Step3WorkSamples = forwardRef(
  ({ profileData, isLoading, error }, ref) => {
    const dispatch = useDispatch();
    const [updateProfile] = useUpdateProfileMutation();
    const [uploadPortfolioImages] = useUploadPortfolioImagesMutation();
    const [uploadVideos] = useUploadVideosMutation();
    const [uploadCertificates] = useUploadCertificatesMutation();

    // Refs for file inputs
    const portfolioInputRef = useRef(null);
    const certificateInputRef = useRef(null);

    // State for new files to be uploaded
    const [portfolioFiles, setPortfolioFiles] = useState([]);
    const [certificateFiles, setCertificateFiles] = useState([]);
    // State for already existing files
    const [existingPortfolio, setExistingPortfolio] = useState([]);
    const [existingCertificates, setExistingCertificates] = useState([]);
    const [bio, setBio] = useState("");

    // Populate form data when profile data is loaded
    useEffect(() => {
      if (profileData) {
        console.log("Step3WorkSamples - Profile Data:", profileData);

        // Set bio if available
        if (profileData.bio) {
          setBio(profileData.bio);
        }

        // Load existing portfolio files (images and videos)
        const existingPort = [];
        if (
          profileData.portfolioImages &&
          profileData.portfolioImages.length > 0
        ) {
          existingPort.push(
            ...profileData.portfolioImages.map((img) => ({
              ...img,
              type: "portfolio",
            }))
          );
        }
        if (profileData.videos && profileData.videos.length > 0) {
          existingPort.push(
            ...profileData.videos.map((vid) => ({ ...vid, type: "video" }))
          );
        }
        setExistingPortfolio(existingPort);

        // Load existing certificates
        if (profileData.certificates && profileData.certificates.length > 0) {
          setExistingCertificates(profileData.certificates.map(cert => ({...cert, type: 'certificate'})));
        }
      }
    }, [profileData]);

    // Save profile data
    const handleSave = async () => {
      let loadingToast = null;
      try {
        console.log("Step3WorkSamples - Starting save process");
        loadingToast = toast.loading("Saving work samples...");

        const uploadedData = {
          portfolioImages: [],
          videos: [],
          certificates: [],
        };

        // Categorize files by type
        const imageFiles = portfolioFiles.filter((f) => f.type.startsWith("image/"));
        const videoFiles = portfolioFiles.filter((f) => f.type.startsWith("video/"));
        const pdfFiles = certificateFiles.filter((f) => f.type === "application/pdf");

        // Upload portfolio images
        if (imageFiles.length > 0) {
          try {
            toast.loading("Uploading images...", { id: loadingToast });
            console.log(`Uploading ${imageFiles.length} images...`);

            const imageFormData = new FormData();
            imageFiles.forEach((file) => {
              imageFormData.append("portfolioImages", file);
            });

            const imageResult = await uploadPortfolioImages(
              imageFormData
            ).unwrap();
            uploadedData.portfolioImages = imageResult.files;
            console.log("Images uploaded:", imageResult.files);
          } catch (imgError) {
            console.error("Image upload error:", imgError);
            toast.dismiss(loadingToast);
            toast.error(
              imgError?.data?.error ||
                "Failed to upload images. Please try again."
            );
            return false;
          }
        }

        // Upload videos
        if (videoFiles.length > 0) {
          try {
            toast.loading("Uploading videos...", { id: loadingToast });
            console.log(`Uploading ${videoFiles.length} videos...`);

            const videoFormData = new FormData();
            videoFiles.forEach((file) => {
              videoFormData.append("videos", file);
            });

            const videoResult = await uploadVideos(videoFormData).unwrap();
            uploadedData.videos = videoResult.files;
            console.log("Videos uploaded:", videoResult.files);
          } catch (vidError) {
            console.error("Video upload error:", vidError);
            toast.dismiss(loadingToast);
            toast.error(
              vidError?.data?.error ||
                "Failed to upload videos. Please try again."
            );
            return false;
          }
        }

        // Upload certificates (PDFs)
        if (pdfFiles.length > 0) {
          try {
            toast.loading("Uploading certificates...", { id: loadingToast });
            console.log(`Uploading ${pdfFiles.length} certificates...`);

            const certFormData = new FormData();
            pdfFiles.forEach((file) => {
              certFormData.append("certificates", file);
            });

            const certResult = await uploadCertificates(certFormData).unwrap();
            uploadedData.certificates = certResult.files;
            console.log("Certificates uploaded:", certResult.files);
          } catch (certError) {
            console.error("Certificate upload error:", certError);
            toast.dismiss(loadingToast);
            toast.error(
              certError?.data?.error ||
                "Failed to upload certificates. Please try again."
            );
            return false;
          }
        }

        // Update profile with bio and uploaded files
        toast.loading("Updating profile...", { id: loadingToast });

        const updateData = {
          bio: bio.trim() || undefined,
        };

        // Add uploaded files to update data
        if (uploadedData.portfolioImages.length > 0) {
          updateData.portfolioImages = uploadedData.portfolioImages.map(
            (file) => file.url
          );
        }
        if (uploadedData.videos.length > 0) {
          updateData.videos = uploadedData.videos.map((file) => file.url);
        }
        if (uploadedData.certificates.length > 0) {
          updateData.certificates = uploadedData.certificates.map(
            (file) => file.url
          );
        }

        console.log("Sending update data:", updateData);
        const result = await updateProfile(updateData).unwrap();
        console.log("Update result:", result);

        // Update Redux store
        dispatch(setProfile(result.user));

        // Clear files after successful upload
        setPortfolioFiles([]);
        setCertificateFiles([]);

        toast.dismiss(loadingToast);
        toast.success("Work samples saved successfully!");

        return true;
      } catch (err) {
        console.error("Failed to save work samples:", err);
        if (loadingToast) {
          toast.dismiss(loadingToast);
        }
        toast.error(
          err?.data?.error || "Failed to save work samples. Please try again."
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
              <div className="h-32 bg-gray-300 rounded"></div>
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

    const handleFileAdd = (list, currentFiles, setFiles, limit, acceptedTypes) => {
      const arr = Array.from(list || []);
      if (!arr.length) return;
    
      // Validate file types
      const validFiles = arr.filter(file => acceptedTypes.some(type => file.type.startsWith(type) || file.type === type));
      if (validFiles.length !== arr.length) {
        toast.error("Some files have an unsupported format.");
      }
    
      // Validate file sizes (10MB limit) for valid files
      const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error(`Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(", ")}`);
      }
    
      const finalFiles = validFiles.filter(file => file.size <= 10 * 1024 * 1024);
      if (finalFiles.length === 0) return;
    
      // Limit total files
      const totalAfterAdd = currentFiles.length + finalFiles.length;
      if (totalAfterAdd > limit) {
        toast.error(`You can upload a maximum of ${limit} files in this section.`);
        const allowedToAdd = finalFiles.slice(0, limit - currentFiles.length);
        setFiles([...currentFiles, ...allowedToAdd]);
        return;
      }
    
      setFiles([...currentFiles, ...finalFiles]);
      toast.success(`${finalFiles.length} file(s) added.`);
    };

    const onPortfolioFiles = (list) => handleFileAdd(list, portfolioFiles, setPortfolioFiles, 10, ['image/', 'video/mp4']);
    const onCertificateFiles = (list) => handleFileAdd(list, certificateFiles, setCertificateFiles, 5, ['application/pdf']);

    const onPortfolioDrop = (e) => {
      e.preventDefault();
      onPortfolioFiles(e.dataTransfer.files);
    };

    const onCertificateDrop = (e) => {
      e.preventDefault();
      onCertificateFiles(e.dataTransfer.files);
    };

    const removePortfolioFile = (idx) => setPortfolioFiles((prev) => prev.filter((_, i) => i !== idx));
    const removeCertificateFile = (idx) => setCertificateFiles((prev) => prev.filter((_, i) => i !== idx));
    const removeExistingPortfolio = (idx) => setExistingPortfolio((prev) => prev.filter((_, i) => i !== idx));
    const removeExistingCertificate = (idx) => setExistingCertificates((prev) => prev.filter((_, i) => i !== idx));

    const totalPortfolioFiles = existingPortfolio.length + portfolioFiles.length;
    const totalCertificateFiles = existingCertificates.length + certificateFiles.length;

    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Main helper card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-start gap-2 text-[#2E90FA] mb-4">
            <Info className="w-5 h-5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Showcase Your Best Work
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Upload images, short videos, or certificates to show customers
                your quality of work. Customers are more likely to hire workers
                who provide clear work samples.
              </p>
            </div>
          </div>

          {/* Portfolio Upload Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Portfolio (Images & Videos)</h3>
            <p className="text-xs text-gray-500 mb-4">Showcase your best work with images (JPG, PNG) and short videos (MP4). Max 10MB per file.</p>
            
            {/* Dropzone for portfolio */}
            <div
              className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onPortfolioDrop}
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="mt-3 text-sm font-medium text-gray-900">Upload Images & Videos</p>
              <p className="text-xs text-gray-600 mt-1">Drag & drop files here, or click to browse (Max 10MB)</p>
              <button type="button" onClick={() => portfolioInputRef.current?.click()} className="mt-4 btn-secondary text-xs">Choose Files</button>
              <input ref={portfolioInputRef} type="file" accept="image/*,video/mp4" multiple className="hidden" onChange={(e) => onPortfolioFiles(e.target.files)} />
            </div>

            {/* Portfolio Files List */}
            {totalPortfolioFiles > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-900 mb-3">Your Portfolio ({totalPortfolioFiles})</div>
                <div className="flex flex-wrap gap-4">
                  {existingPortfolio.map((f, i) => (
                    <Thumb key={`existing-port-${f.publicId || i}`} file={f} onRemove={() => removeExistingPortfolio(i)} isExisting={true} />
                  ))}
                  {portfolioFiles.map((f, i) => (
                    <Thumb key={`new-port-${f.name}-${i}`} file={f} onRemove={() => removePortfolioFile(i)} isExisting={false} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certificates Upload Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Certificates & Qualifications (PDF only)</h3>
            <p className="text-xs text-gray-500 mb-4">Upload any relevant certificates or licenses as PDF documents. Max 10MB per file.</p>

            {/* Dropzone for certificates */}
            <div
              className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onCertificateDrop}
            >
              <FileText className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="mt-3 text-sm font-medium text-gray-900">Upload PDF Documents</p>
              <p className="text-xs text-gray-600 mt-1">Drag & drop PDF files here, or click to browse (Max 10MB)</p>
              <button type="button" onClick={() => certificateInputRef.current?.click()} className="mt-4 btn-secondary text-xs">Choose Files</button>
              <input ref={certificateInputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => onCertificateFiles(e.target.files)} />
            </div>

            {/* Certificate Files List */}
            {totalCertificateFiles > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-900 mb-3">Your Certificates ({totalCertificateFiles})</div>
                <div className="flex flex-wrap gap-4">
                  {existingCertificates.map((f, i) => (
                    <Thumb key={`existing-cert-${f.publicId || i}`} file={f} onRemove={() => removeExistingCertificate(i)} isExisting={true} />
                  ))}
                  {certificateFiles.map((f, i) => (
                    <Thumb key={`new-cert-${f.name}-${i}`} file={f} onRemove={() => removeCertificateFile(i)} isExisting={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Describe Your Work Experience (Optional)
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers about your work style, specialties, or anything that makes your work unique..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-gray-50 text-sm"
          />
          <p className="text-[11px] text-gray-500 mt-2">
            This description helps customers understand your work approach and
            quality. It will appear on your public profile.
          </p>
        </div>

        {/* Tip */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-2">
            <span className="text-xl">
              <Star color="#D97706" className="font-extralight" />
            </span>
            <div>
              <div className="text-sm font-semibold text-amber-800">
                Stand Out From The Crowd
              </div>
              <p className="text-sm text-amber-800/80 mt-1">
                Workers with strong portfolios get 3x more bookings than those
                without. Your portfolio is one of the most important factors
                customers consider when choosing a worker.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Step3WorkSamples.displayName = "Step3WorkSamples";

export default Step3WorkSamples;
