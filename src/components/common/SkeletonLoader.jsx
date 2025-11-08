const SkeletonLoader = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: "shimmer 1.5s infinite linear",
      }}
    >
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <SkeletonLoader className="h-8 w-48 mb-2" />
        <SkeletonLoader className="h-4 w-64" />
      </div>

      {/* Profile Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <SkeletonLoader className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
        <div className="flex-1 space-y-3">
          <SkeletonLoader className="h-6 w-40" />
          <SkeletonLoader className="h-4 w-64" />
          <SkeletonLoader className="h-6 w-32" />
        </div>
        <SkeletonLoader className="h-10 w-32 rounded-lg" />
      </div>

      {/* Content Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info Skeleton */}
        <div className="border-neutral-100 shadow-sm p-6 rounded-2xl">
          <SkeletonLoader className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <SkeletonLoader className="h-4 w-24 mb-2" />
                <SkeletonLoader className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Address Info Skeleton */}
        <div className="border-neutral-100 shadow-sm p-6 rounded-2xl">
          <SkeletonLoader className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            <div>
              <SkeletonLoader className="h-4 w-24 mb-2" />
              <SkeletonLoader className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Skeleton */}
      <div className="border-neutral-100 shadow-sm p-6 rounded-2xl mt-5">
        <SkeletonLoader className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i}>
              <SkeletonLoader className="h-4 w-24 mb-2" />
              <SkeletonLoader className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
