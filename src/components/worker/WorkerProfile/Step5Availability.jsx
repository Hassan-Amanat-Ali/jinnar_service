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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 space-y-3 sm:space-y-0">
      <div className="flex items-center justify-between sm:justify-start sm:w-auto">
        <div className="text-sm font-medium text-gray-800 min-w-[3rem]">
          {label}
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <Toggle checked={value} onChange={onToggle} />
          <span className="text-xs text-gray-600">Available</span>
        </div>
      </div>

      {/* Desktop toggle (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-2">
        <Toggle checked={value} onChange={onToggle} />
        <span className="text-xs text-gray-600">Available</span>
      </div>

      {/* Time selectors */}
      <div className="flex items-center gap-2 justify-center sm:justify-end">
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

// Calendar-based availability editor
const CalendarAvailability = ({ slots, setSlots }) => {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null); // Date object

  const monthLabel = cursor.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const startOfCalendar = () => {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    // Monday-first offset
    const day = firstDay.getDay(); // 0(Sun) - 6(Sat)
    const offset = (day + 6) % 7; // 0(Mon) - 6(Sun)
    return new Date(cursor.getFullYear(), cursor.getMonth(), 1 - offset);
  };

  const daysMatrix = () => {
    const start = startOfCalendar();
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + i
      );
      days.push(d);
    }
    return days;
  };

  const keyOf = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const isCurrentMonth = (d) => d.getMonth() === cursor.getMonth();
  const isSelected = (d) =>
    selected && d.toDateString() === selected.toDateString();

  const selectedKey = selected ? keyOf(selected) : null;
  const selectedSlot = selectedKey
    ? slots[selectedKey] || { on: true, start: "09:00", end: "17:00" }
    : null;

  const updateSelected = (patch) => {
    if (!selectedKey) return;
    setSlots((prev) => ({
      ...prev,
      [selectedKey]: {
        ...(prev[selectedKey] || { on: true, start: "09:00", end: "17:00" }),
        ...patch,
      },
    }));
  };

  // Dropdown open states for editor
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="p-1 rounded-md border border-gray-200 hover:bg-gray-50"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="text-sm font-semibold text-gray-900">{monthLabel}</div>
        <button
          className="p-1 rounded-md border border-gray-200 hover:bg-gray-50"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-gray-500 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
          <div key={w} className="text-center py-1">
            <span className="hidden sm:inline">{w}</span>
            <span className="sm:hidden">{w[0]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {daysMatrix().map((d) => {
          const key = keyOf(d);
          const slot = slots[key];
          const inMonth = isCurrentMonth(d);
          const selectedCls = isSelected(d)
            ? "ring-1 sm:ring-2 ring-sky-300 border-sky-300"
            : "border-gray-200";
          const activeCls =
            inMonth && slot?.on ? "bg-[#F0F7FF] border-sky-200" : "bg-white";
          const textCls = inMonth ? "text-gray-900" : "text-gray-300";
          return (
            <button
              key={key}
              onClick={() => setSelected(new Date(d))}
              className={`relative h-12 sm:h-16 rounded-md sm:rounded-lg border ${selectedCls} ${activeCls} ${textCls} hover:bg-sky-50 transition`}
            >
              <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 text-[10px] sm:text-[11px]">
                {d.getDate()}
              </div>
              {slot?.on && inMonth && (
                <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 right-0.5 sm:right-1 text-[8px] sm:text-[10px] text-sky-700 truncate">
                  <span className="hidden sm:inline">
                    {slot.start} – {slot.end}
                  </span>
                  <span className="sm:hidden">•</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Editor for selected date */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
        {selected ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-800">
              {selected.toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Toggle
                  checked={!!selectedSlot?.on}
                  onChange={(v) => updateSelected({ on: v })}
                />
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  !selectedSlot?.on ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Dropdown
                  icon={<Clock size={14} className="text-gray-400 mr-2" />}
                  placeholder={selectedSlot?.start || "09:00"}
                  options={times}
                  isOpen={openStart}
                  onToggle={() =>
                    setOpenStart((o) => (selectedSlot?.on ? !o : o))
                  }
                  onSelect={(opt) => {
                    updateSelected({ start: opt });
                    setOpenStart(false);
                  }}
                  className="h-9 text-sm min-w-[5.5rem]"
                />
                <span className="text-xs text-gray-500">to</span>
                <Dropdown
                  icon={<Clock size={14} className="text-gray-400 mr-2" />}
                  placeholder={selectedSlot?.end || "17:00"}
                  options={times}
                  isOpen={openEnd}
                  onToggle={() =>
                    setOpenEnd((o) => (selectedSlot?.on ? !o : o))
                  }
                  onSelect={(opt) => {
                    updateSelected({ end: opt });
                    setOpenEnd(false);
                  }}
                  className="h-9 text-sm min-w-[5.5rem]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            Select a date to edit availability
          </div>
        )}
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
  const [calendarSlots, setCalendarSlots] = useState({}); // { 'YYYY-MM-DD': { on, start, end } }

  const setDay = (day, key, value) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [key]: value } }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-0">
      {/* Top helper */}
      <div className="flex items-start gap-2 text-[#2E90FA] bg-[#EFF6FF] rounded-2xl border border-[#B6E0FE] p-4 sm:p-5">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <div className="text-sm font-semibold text-gray-900 mb-3">
          Choose Your Availability Method
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            className={`rounded-xl border p-3 sm:p-4 text-left ${
              method === "calendar"
                ? "border-sky-300 bg-[#F0F7FF]"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setMethod("calendar")}
          >
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-gray-600 flex-shrink-0" />
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
            className={`rounded-xl border p-3 sm:p-4 text-left ${
              method === "timeblocks"
                ? "border-sky-300 bg-[#F0F7FF]"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setMethod("timeblocks")}
          >
            <div className="flex items-start gap-3">
              <Blocks className="w-5 h-5 text-gray-600 flex-shrink-0" />
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

      {/* Availability editor - conditional */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <div className="text-sm font-semibold text-gray-900 mb-3">
          {method === "calendar"
            ? "Set Your Calendar Availability"
            : "Set Your Weekly Schedule"}
        </div>
        {method === "calendar" ? (
          <CalendarAvailability
            slots={calendarSlots}
            setSlots={setCalendarSlots}
          />
        ) : (
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
        )}
      </div>

      {/* Emergency */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-600 flex-shrink-0" />
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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
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
