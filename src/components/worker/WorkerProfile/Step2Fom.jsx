import { useState } from "react";
import { Info, Plus, BadgeCheck, House } from "lucide-react";
import Dropdown from "../../common/DropDown.jsx";
import { Wrench, Scissors, Smile, Axe, Car } from "lucide-react";

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

const Step2Fom = () => {
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

  const primaryService =
    serviceCatalog.find((s) => s.id === detail.serviceId) || serviceCatalog[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      ? "border-sky-300 bg-gradient-to-br from-[#F0F7FF] to-white"
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

      {/* Right column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-900" />
            <h4 className="text-base font-semibold text-gray-900">
              {primaryService.title} Details
            </h4>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Service Discription
            </label>
            <textarea
              value={detail.description}
              onChange={(e) =>
                setDetail({ ...detail, description: e.target.value })
              }
              placeholder="Pipe repairs, installation"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Experience */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Year of Experience
            </label>
            <Dropdown
              placeholder="Select your experience level"
              options={["0-1 years", "2-5 years", "6-10 years", "10+ years"]}
              isOpen={isExpOpen}
              onToggle={() => setIsExpOpen((v) => !v)}
              onSelect={(opt) => setDetail({ ...detail, experience: opt })}
              className="w-full text-sm"
            />
          </div>

          {/* Certificate */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Certificate Optional
            </label>
            <div className="rounded-md border border-gray-300 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-600">
                Upload certification or license
              </p>
              <label
                className="mt-2 inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-white cursor-pointer"
                style={{ background: "var(--gradient-main)" }}
              >
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      certificate: e.target.files?.[0] || null,
                    })
                  }
                />
              </label>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#74C7F2] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-[#74C7F2] mb-1">
                  💡 Pro Tip
                </h4>
                <p className="text-sm text-gray-700">
                  Adding certifications increases your credibility and can lead
                  to higher-paying jobs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Fom;
