"use client";
import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface TailwindDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  align?: "left" | "right";
  roundedClass?: string;
}

export default function TailwindDatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  className = "",
  disabled = false,
  error = false,
  align = "left",
  roundedClass = "rounded"
}: TailwindDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Generate year range (current year ± 50 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(selectedDate);
    setIsOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      day === value.getDate() &&
      currentMonth.getMonth() === value.getMonth() &&
      currentMonth.getFullYear() === value.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`relative w-full cursor-default ${roundedClass} border py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-white hover:border-gray-400"
        }`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <Calendar
            className={`h-4 w-4 ${disabled ? "text-gray-400" : "text-gray-500"}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && !disabled && (
        <div className={`absolute z-50 mt-1 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${align === "right" ? "right-0" : "left-0"}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMonthPicker(!showMonthPicker);
                  setShowYearPicker(false);
                }}
                className="font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {months[currentMonth.getMonth()]}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowYearPicker(!showYearPicker);
                  setShowMonthPicker(false);
                }}
                className="font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {currentMonth.getFullYear()}
              </button>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid / Month Picker / Year Picker */}
          <div className="p-3">
            {showMonthPicker ? (
              /* Month Picker */
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthSelect(index)}
                    className={`py-2 px-3 text-sm rounded transition-colors ${
                      currentMonth.getMonth() === index
                        ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            ) : showYearPicker ? (
              /* Year Picker */
              <div className="h-64 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`py-2 px-3 text-sm rounded transition-colors ${
                        currentMonth.getFullYear() === year
                          ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Calendar Grid */
              <>
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day ? (
                        <button
                          type="button"
                          onClick={() => handleDateClick(day)}
                          className={`w-full h-full flex items-center justify-center text-sm rounded transition-colors ${
                            isSelected(day)
                              ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                              : isToday(day)
                              ? "bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!showMonthPicker && !showYearPicker && (
            <div className="flex items-center justify-between p-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  onChange(new Date());
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
