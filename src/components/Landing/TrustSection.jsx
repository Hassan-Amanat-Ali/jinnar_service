import { ShieldCheck, Users, Briefcase, Award } from "lucide-react";

const TrustSection = () => {
  const stats = [
    { id: 1, label: "Active Workers", value: "5,000+", icon: Users },
    { id: 2, label: "Jobs Completed", value: "12,000+", icon: Briefcase },
    { id: 3, label: "Verified Pros", value: "98%", icon: ShieldCheck },
    { id: 4, label: "Average Rating", value: "4.8/5", icon: Award },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-16 shadow-lg border border-blue-100/50 flex flex-col md:flex-row items-center justify-between text-left relative overflow-hidden group">
          {/* Decorative subtle background gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          {/* Content Side */}
          <div className="md:w-1/2 relative z-10 w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
              Trusted by Thousands
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              The Marketplace <br />{" "}
              <span className="text-blue-600">You Can Trust.</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-500 max-w-lg mb-10 leading-relaxed">
              Safe, secure, and reliable. We've built the most trusted platform
              for informal work in Africa.
            </p>
          </div>

          {/* Stats Side (Horizontal Row/Grid) */}
          <div className="md:w-1/2 mt-12 md:mt-0 relative z-10 w-full pl-0 md:pl-12">
            <div className="grid grid-cols-2 gap-y-12 gap-x-8">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <h3 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-500 font-medium text-lg flex items-center gap-2">
                    <stat.icon size={20} className="text-blue-500" />
                    {stat.label}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 leading-snug">
                    Verified metric across our platform ecosystem.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
