import { useRef, useState } from "react";
import {
  Info,
  UploadCloud,
  FileImage,
  FileVideo,
  FileText,
  X,
  Star,
} from "lucide-react";

const humanFileType = (file) => {
  const type = file.type || "";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type === "application/pdf") return "pdf";
  return "file";
};

const Thumb = ({ file, onRemove }) => {
  const kind = humanFileType(file);
  const Icon =
    kind === "image"
      ? FileImage
      : kind === "video"
      ? FileVideo
      : kind === "pdf"
      ? FileText
      : FileText;
  return (
    <div className="relative w-40 h-28 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
      <Icon className="w-10 h-10 text-gray-400" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-white border border-gray-300 text-gray-500 rounded-full p-1 shadow-sm hover:text-gray-700"
        aria-label="Remove file"
      >
        <X className="w-3 h-3" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 px-2 py-1 text-[11px] text-gray-600 truncate">
        {file.name || "file"}
      </div>
    </div>
  );
};

const Step3WorkSamples = () => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [bio, setBio] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const onPick = () => inputRef.current?.click();

  const onFiles = (list) => {
    const arr = Array.from(list || []);
    if (!arr.length) return;
    setFiles((prev) => [...prev, ...arr].slice(0, 12));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  const removeAt = (idx) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upload helper card */}
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

        <div
          className={`rounded-xl border-2 ${
            dragOver
              ? "border-[#74C7F2] bg-[#F0F7FF]"
              : "border-dashed border-gray-300 bg-gray-50"
          } p-8 text-center`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <UploadCloud className="w-10 h-10 text-gray-400 mx-auto" />
          <div className="mt-3 text-sm font-medium text-gray-900">
            Upload Your Work Samples
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Drag & drop files here, or click to browse
          </p>
          <ul className="mt-3 text-xs text-gray-500 space-y-1">
            <li>Images: JPG, PNG (max 10MB each)</li>
            <li>Videos: MP4 (max 10MB each)</li>
            <li>Certificates: PDF (max 10MB each)</li>
          </ul>

          <button
            type="button"
            onClick={onPick}
            className="mt-4 inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-white"
            style={{ background: "var(--gradient-main)" }}
          >
            Choose Files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/mp4,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Files list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="text-sm font-semibold text-gray-900 mb-3">
          Your Work Samples ({files.length})
        </div>
        {files.length === 0 ? (
          <p className="text-xs text-gray-500">
            No files yet. Add images, short videos, or PDFs of certificates.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {files.map((f, i) => (
              <Thumb
                key={`${f.name}-${i}`}
                file={f}
                onRemove={() => removeAt(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Portfolio description */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Describe Your Portfolio (Optional)
        </div>
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell customers about your work style, specialties, or anything that makes your work unique..."
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-gray-50"
        />
        <p className="text-[11px] text-gray-500 mt-2">
          This description helps customers understand your work approach and
          quality.
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
              Workers with work samples get 3x more bookings than those without.
              Your portfolio is one of the most important factors customers
              consider when choosing a worker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3WorkSamples;
