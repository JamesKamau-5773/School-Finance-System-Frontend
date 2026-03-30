import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date()
  );

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateSelect = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = selected.toISOString().split("T")[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-KE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date().toISOString().split("T")[0];
  const selectedDateFormatted = value;

  return (
    <div className="relative">
      <div className="relative">
        <Calendar
          size={14}
          className="absolute left-3 top-3 text-slate-500"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#050B14] border border-[#1A4D5C] text-white pl-9 pr-10 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all text-left"
        >
          {value ? formatDisplayDate(value) : "mm/dd/yyyy"}
        </button>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] bg-[#0B192C] border border-[#1A4D5C] rounded-lg shadow-2xl p-4 w-64">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <ChevronLeft size={18} className="text-slate-400" />
            </button>
            <h3 className="text-sm font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-slate-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }

              const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = selectedDateFormatted === dateString;
              const isToday = today === dateString;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`
                    p-2 text-xs font-semibold rounded transition-all
                    ${isSelected
                      ? "bg-[#05CD99] text-[#050B14]"
                      : isToday
                        ? "bg-[#1A4D5C] text-[#05CD99] border border-[#05CD99]"
                        : "text-white hover:bg-white/10"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer: Today Button */}
          <button
            type="button"
            onClick={() => {
              const todayDate = new Date();
              const formatted = todayDate.toISOString().split("T")[0];
              onChange(formatted);
              setCurrentDate(todayDate);
              setIsOpen(false);
            }}
            className="w-full mt-4 py-2 text-xs font-bold text-[#05CD99] hover:bg-[#05CD99]/10 border border-[#05CD99]/30 rounded transition-all"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
}
