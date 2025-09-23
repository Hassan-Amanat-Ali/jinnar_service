import { useState } from "react";
import {
  Info,
  CheckCircle2,
  Tag,
  Clock3,
  Handshake,
  UsersRound,
  Shield,
  TrendingUp,
} from "lucide-react";

const modelDescriptions = {
  fixed: {
    title: "Fixed Price",
    subtitle: "Set price per task/project",
    help: "Customers see a clear upfront price.",
    pills: ["Best for standard services", "Clear cost"],
  },
  hourly: {
    title: "Hourly Rate",
    subtitle: "Charge by the hour",
    help: "Perfect for services that vary in time and complexity.",
    pills: ["Flexible time", "Fair for variable duration"],
  },
  negotiable: {
    title: "Negotiable",
    subtitle: "Decide price with customer",
    help: "Works best when pricing depends on specific job requirements.",
    pills: [
      "Custom pricing",
      "Covers unique situations",
      "Build customer relationship",
    ],
  },
};

const ModelRow = ({ id, icon: Icon, activeId, onSelect }) => {
  const active = activeId === id;
  const d = modelDescriptions[id];
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full text-left rounded-xl border p-4 transition shadow-sm hover:shadow-md  ${
        active ? "border-sky-300 bg-[#F0F7FF]" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-9 w-9 rounded-md flex items-center justify-center ${
            active ? "bg-[#74C7F2]" : "bg-gray-100"
          }`}
        >
          {Icon && (
            <Icon className="w-5 h-5" color={active ? "white" : "#6b7280"} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {d.title}
            </span>
            <span className="text-xs text-gray-500">{d.subtitle}</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">{d.help}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {d.pills.map((p) => (
              <span
                key={p}
                className={`text-[10px] px-2 py-1 rounded-full border ${
                  active
                    ? "bg-white border-sky-200 text-sky-700"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`w-4 h-4 rounded-full border ${
            active ? "bg-[#74C7F2] border-[#74C7F2]" : "border-gray-300"
          }`}
        />
      </div>
    </button>
  );
};

const Step4Pricing = () => {
  const [model, setModel] = useState("negotiable");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top helper */}
      <div className="flex items-start gap-2 text-[#2E90FA] bg-[#EFF6FF] rounded-2xl border border-[#B6E0FE] p-5">
        <Info className="w-5 h-5" />
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Set Your Preferred Pricing
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Choose how you want to charge for your services. Customers will see
            these rates on your profile. You can always adjust your pricing
            later.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 px-12">
        <p className="font-bold">Choose Your Pricing Model</p>
        {/* Model options */}
        <div className="mt-4 space-y-3">
          <ModelRow
            id="fixed"
            icon={Tag}
            activeId={model}
            onSelect={setModel}
          />
          <ModelRow
            id="hourly"
            icon={Clock3}
            activeId={model}
            onSelect={setModel}
          />
          <ModelRow
            id="negotiable"
            icon={Handshake}
            activeId={model}
            onSelect={setModel}
          />
        </div>
      </div>

      {/* Selected banner */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm font-semibold text-green-800">
              {modelDescriptions[model].title} Selected
            </div>
            <p className="text-sm text-green-800/80 mt-1">
              {model === "negotiable"
                ? "Your pricing will be discussed directly with customers based on their specific needs. This gives you maximum flexibility to price each job appropriately."
                : model === "hourly"
                ? "Customers will see your hourly rate and can estimate the total cost based on time and complexity."
                : "Customers will see a clear fixed price for your services on your profile."}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Pricing Notes (Optional)
        </div>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any helpful information about your pricing (e.g., materials not included, travel charges, minimum booking time)."
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-gray-50"
        />
        <p className="text-[11px] text-gray-500 mt-2">
          Help customers understand what’s included in your pricing.
        </p>
      </div>

      {/* Bottom tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tile 1 */}
        <div className="rounded-2xl border border-purple-200 bg-purple-50 py-8 text-center space-y-2">
          <div className="text-sm font-semibold text-purple-800 flex flex-col items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            Competitive Pricing
          </div>
          <p className="text-sm text-purple-800/80 mt-1">
            Research local market to stay competitive.
          </p>
        </div>
        {/* Tile 2 (match layout of tile 1) */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 py-8 text-center space-y-2">
          <div className="text-sm font-semibold text-amber-800 flex flex-col items-center gap-3">
            <UsersRound className="w-6 h-6" />
            Build Trust
          </div>
          <p className="text-sm text-amber-800/80 mt-1">
            Clear pricing builds trust with customers.
          </p>
        </div>
        {/* Tile 3 (match layout of tile 1) */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 py-8 text-center space-y-2">
          <div className="text-sm font-semibold text-emerald-800 flex flex-col items-center gap-3">
            <Shield className="w-6 h-6" />
            Flexible Options
          </div>
          <p className="text-sm text-emerald-800/80 mt-1">
            You can change your pricing anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step4Pricing;
