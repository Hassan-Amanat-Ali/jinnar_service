import { Check } from "lucide-react";

const defaultSteps = [
  { key: 1, label: "Personal Info" },
  { key: 2, label: "Skills & Services" },
  { key: 3, label: "Work Experience" },
  { key: 4, label: "Location & Address" },
  { key: 5, label: "Availability" },
];

const StepDot = ({ state, index }) => {
  // state: 'completed' | 'current' | 'upcoming'
  if (state === "completed") {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
        <Check className="w-4 h-4" />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="w-8 h-8 rounded-full bg-[#74C7F2] flex items-center justify-center text-white text-sm font-medium">
        {index}
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
      {index}
    </div>
  );
};

const Connector = ({ active }) => (
  <div
    className={`flex-1 mx-4 h-px ${active ? "bg-green-300" : "bg-gray-300"}`}
  ></div>
);

const SetupProgress = ({ current = 1, steps = defaultSteps }) => {
  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Progress - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((s, idx) => {
            const index = idx + 1;
            const isCompleted = index < current;
            const isCurrent = index === current;
            const state = isCompleted
              ? "completed"
              : isCurrent
              ? "current"
              : "upcoming";
            const labelClass = isCompleted
              ? "text-sm font-medium text-green-700"
              : isCurrent
              ? "text-sm font-medium text-gray-900"
              : "text-sm text-gray-500";

            return (
              <div className="flex items-center" key={s.key}>
                <div className="flex items-center">
                  <StepDot state={state} index={index} />
                  <span className={`ml-3 ${labelClass}`}>{s.label}</span>
                </div>
                {index < steps.length && <Connector active={index < current} />}
              </div>
            );
          })}
        </div>

        {/* Mobile Progress - Simplified version */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">
              Step {current} of {steps.length}
            </span>
            <span className="text-xs text-gray-500">
              {Math.round((current / steps.length) * 100)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-[#74C7F2] to-[#A8D8F0] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(current / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Current Step Label */}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-900">
              {steps[current - 1]?.label}
            </span>
          </div>

          {/* Step dots for mobile */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {steps.map((s, idx) => {
              const index = idx + 1;
              const isCompleted = index < current;
              const isCurrent = index === current;
              const state = isCompleted
                ? "completed"
                : isCurrent
                ? "current"
                : "upcoming";

              return (
                <div key={s.key} className="flex flex-col items-center">
                  <StepDot state={state} index={index} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProgress;
