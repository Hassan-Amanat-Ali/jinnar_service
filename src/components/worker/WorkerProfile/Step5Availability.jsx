import { useState } from "react";
import {
  Info,
  CalendarDays,
  Blocks,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Dropdown from "../../common/DropDown";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "12:00",
  "15:00",
  "17:00",
  "19:00",
];

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-10 h-6 rounded-full relative transition ${
      checked ? "bg-[#74C7F2]" : "bg-gray-300"
    }`}
    aria-pressed={checked}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
        checked ? "translate-x-4" : ""
      }`}
    />
  </button>
);

const Row = ({ label, value, onToggle, start, end, onStart, onEnd }) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="w-16 text-sm text-gray-800">{label}</div>
      <div className="flex items-center gap-2">
        <Toggle checked={value} onChange={onToggle} />
        <span className="text-xs text-gray-600">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={!value ? "opacity-50 pointer-events-none" : ""}>
          <Dropdown
            icon={<Clock size={14} className="text-gray-400 mr-2" />}
            placeholder={start}
            options={times}
            isOpen={openStart}
            onToggle={() => setOpenStart((o) => (value ? !o : o))}
            onSelect={(opt) => {
              onStart(opt);
              setOpenStart(false);
            }}
            className="h-9 text-sm min-w-[5.5rem]"
          />
        </div>
        <span className="text-xs text-gray-500">to</span>
        <div className={!value ? "opacity-50 pointer-events-none" : ""}>
          <Dropdown
            icon={<Clock size={14} className="text-gray-400 mr-2" />}
            placeholder={end}
            options={times}
            isOpen={openEnd}
            onToggle={() => setOpenEnd((o) => (value ? !o : o))}
            onSelect={(opt) => {
              onEnd(opt);
              setOpenEnd(false);
            }}
            className="h-9 text-sm min-w-[5.5rem]"
          />
        </div>
      </div>
    </div>
  );
};

const Step5Availability = () => {
  const [method, setMethod] = useState("timeblocks");
  const [emergency, setEmergency] = useState(true);
  const [schedule, setSchedule] = useState(
    days.reduce((acc, d) => {
      acc[d] = { on: true, start: "09:00", end: "17:00" };
      return acc;
    }, {})
  );

  const setDay = (day, key, value) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [key]: value } }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top helper */}
      <div className="flex items-start gap-2 text-[#2E90FA] bg-[#EFF6FF] rounded-2xl border border-[#B6E0FE] p-5">
        <Info className="w-5 h-5" />
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Set Your Working Hours
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Let customers know when you're available to work. This helps them
            book you at the right time and reduces back-and- forth
            communication.
          </p>
        </div>
      </div>

      {/* Method selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="text-sm font-semibold text-gray-900 mb-3">
          Choose Your Availability Method
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            className={`rounded-xl border p-4 text-left ${
              method === "calendar"
                ? "border-sky-300 bg-[#F0F7FF]"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setMethod("calendar")}
          >
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Calendar View
                </div>
                <div className="text-xs text-gray-600">
                  Mark specific dates when you're available to work.
                </div>
              </div>
            </div>
          </button>
          <button
            className={`rounded-xl border p-4 text-left ${
              method === "timeblocks"
                ? "border-sky-300 bg-[#F0F7FF]"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setMethod("timeblocks")}
          >
            <div className="flex items-start gap-3">
              <Blocks className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Time Blocks
                </div>
                <div className="text-xs text-gray-600">
                  Set regular working hours for each day of the week
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="text-sm font-semibold text-gray-900 mb-3">
          Set Your Weekly Schedule
        </div>
        <div className="divide-y divide-gray-100">
          {days.map((d) => (
            <Row
              key={d}
              label={d}
              value={schedule[d].on}
              onToggle={(val) => setDay(d, "on", val)}
              start={schedule[d].start}
              end={schedule[d].end}
              onStart={(v) => setDay(d, "start", v)}
              onEnd={(v) => setDay(d, "end", v)}
            />
          ))}
        </div>
      </div>

      {/* Emergency */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-600" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-900">
              Emergency/Urgent Jobs
            </div>
            <p className="text-sm text-amber-900/80 mt-1">
              Get notified about urgent jobs that need immediate attention.
              Emergency workers often receive higher visibility and better
              rates.
            </p>
          </div>
          <Toggle checked={emergency} onChange={setEmergency} />
        </div>
      </div>

      {/* Completion banner */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm font-semibold text-green-800">
              Almost Done!
            </div>
            <p className="text-sm text-green-800/80 mt-1">
              You're about to complete your professional profile. Once finished,
              customers will be able to discover and book your services through
              the platform.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Personal Info",
                "Skills & Services",
                "Work Samples",
                "Pricing",
                "Availability",
              ].map((s, i) => (
                <span
                  key={s}
                  className={`text-[10px] px-2 py-1 rounded-full border ${
                    i < 4
                      ? "bg-white border-green-200 text-green-700"
                      : "bg-white border-blue-200 text-blue-700"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5Availability;
