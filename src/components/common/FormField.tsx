"use client";
import React, { Fragment } from "react";
import DatePicker from "react-datepicker";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check, Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
}

export default function FormField({
  label,
  children,
  required = false,
  error,
  className = "",
  labelClassName = ""
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className={`block text-sm font-medium mb-1 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", value, ...props }: InputProps) {
  return (
    <input
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
        } ${props.disabled ? 'bg-gray-100 text-gray-800' : ''} ${className}`}
      value={value || ""}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function Select({ error, options, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${error ? 'border-red-500' : 'border-gray-300'
        } ${props.disabled ? 'bg-gray-100 text-gray-800' : ''} ${className}`}
      {...props}
    />
  );
}

interface DatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  className?: string;
  placeholderText?: string;
  dateFormat?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  disabled?: boolean;
}

export function DatePickerInput({
  error,
  className = "",
  dateFormat = "dd/MM/yyyy",
  ...props
}: DatePickerProps) {
  return (
    <div className="relative">
      <DatePicker
        className={`w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
          } ${props.disabled ? 'bg-gray-100 text-gray-800' : ''} ${className}`}
        dateFormat={dateFormat}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={15}
        scrollableYearDropdown
        {...props}
      />
      <Calendar
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
    </div>
  );
}

interface ListboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ListboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ListboxOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  dropUp?: boolean;
}

export function CustomListbox({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error = false,
  disabled = false,
  className = "",
  dropUp = false
}: ListboxProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={`relative w-full cursor-default rounded border py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:border-gray-400'} ${className}`}
        >
          <span className="block truncate text-sm">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={`absolute z-10 ${dropUp ? 'bottom-full mb-1' : 'mt-1'} max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active, selected }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                }
                value={option.value}
                disabled={option.disabled}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ClockTimePicker({
  value,
  onChange,
  error = false,
  disabled = false,
  className = "",
  placeholder = "Pilih waktu"
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(parseInt(h) || 0);
      setMinutes(parseInt(m) || 0);
    }
  }, [value]);

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const timeString = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:00`;
    onChange(timeString);
  };

  const displayTime = value ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}` : "";

  // Clock calculations
  const hourAngle = (hours % 12) * 30 + (minutes * 0.5); // 30 degrees per hour + minute adjustment
  const minuteAngle = minutes * 6; // 6 degrees per minute

  const handleClockClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Adjust so 12 o'clock is 0 degrees

    const distance = Math.sqrt(x * x + y * y);
    const radius = 80; // Clock radius

    if (distance <= radius) {
      // Determine if clicking on hour or minute hand area
      if (distance <= radius * 0.6) {
        // Hour selection
        const newHour = Math.round(angle / 30) % 12;
        const finalHour = newHour === 0 ? (hours >= 12 ? 12 : 0) : newHour + (hours >= 12 ? 12 : 0);
        setHours(finalHour);
        handleTimeChange(finalHour, minutes);
      } else {
        // Minute selection
        const newMinute = Math.round(angle / 6) % 60;
        setMinutes(newMinute);
        handleTimeChange(hours, newMinute);
      }
    }
  };

  return (
    <Listbox value={value} onChange={() => { }} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'} ${className}`}
        >
          <span className="block truncate text-sm">
            {displayTime || placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${disabled ? 'text-gray-400' : 'text-gray-500'} ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          show={isOpen}
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute z-10 mt-1 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-6">
              {/* Clock Display */}
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-gray-800 mb-4">
                  {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
                </div>

                {/* Analog Clock */}
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  className="cursor-pointer"
                  onClick={handleClockClick}
                >
                  {/* Clock face */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />

                  {/* Hour markers */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const x1 = 100 + Math.cos(angle - Math.PI / 2) * 75;
                    const y1 = 100 + Math.sin(angle - Math.PI / 2) * 75;
                    const x2 = 100 + Math.cos(angle - Math.PI / 2) * 85;
                    const y2 = 100 + Math.sin(angle - Math.PI / 2) * 85;
                    const textX = 100 + Math.cos(angle - Math.PI / 2) * 65;
                    const textY = 100 + Math.sin(angle - Math.PI / 2) * 65;

                    return (
                      <g key={i}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#374151"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-sm font-medium fill-gray-700"
                        >
                          {i === 0 ? 12 : i}
                        </text>
                      </g>
                    );
                  })}

                  {/* Minute markers */}
                  {Array.from({ length: 60 }, (_, i) => {
                    if (i % 5 !== 0) {
                      const angle = (i * 6) * (Math.PI / 180);
                      const x1 = 100 + Math.cos(angle - Math.PI / 2) * 80;
                      const y1 = 100 + Math.sin(angle - Math.PI / 2) * 80;
                      const x2 = 100 + Math.cos(angle - Math.PI / 2) * 85;
                      const y2 = 100 + Math.sin(angle - Math.PI / 2) * 85;

                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#9ca3af"
                          strokeWidth="1"
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Hour hand */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + Math.cos((hourAngle - 90) * (Math.PI / 180)) * 50}
                    y2={100 + Math.sin((hourAngle - 90) * (Math.PI / 180)) * 50}
                    stroke="#18448C"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Minute hand */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + Math.cos((minuteAngle - 90) * (Math.PI / 180)) * 70}
                    y2={100 + Math.sin((minuteAngle - 90) * (Math.PI / 180)) * 70}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Center dot */}
                  <circle cx="100" cy="100" r="4" fill="#18448C" />
                </svg>

                {/* AM/PM Toggle */}
                <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => {
                      const newHours = hours >= 12 ? hours - 12 : hours;
                      setHours(newHours);
                      handleTimeChange(newHours, minutes);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${hours < 12 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => {
                      const newHours = hours < 12 ? hours + 12 : hours;
                      setHours(newHours);
                      handleTimeChange(newHours, minutes);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${hours >= 12 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    handleTimeChange(hours, minutes);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Listbox>
  );
}



interface TimeInput24Props {
  value: string;
  onChange: (time: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function TimeInput24({
  value,
  onChange,
  error = false,
  disabled = false,
  className = "",
  placeholder = "HH:MM:SS"
}: TimeInput24Props) {
  const [inputValue, setInputValue] = React.useState("");

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  const formatTime = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, "");

    if (digits.length === 0) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
  };

  const validateTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length !== 3) return false;

    const [hours, minutes, seconds] = parts.map(p => parseInt(p));
    return hours >= 0 && hours <= 23 &&
      minutes >= 0 && minutes <= 59 &&
      seconds >= 0 && seconds <= 59;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatTime(input);

    setInputValue(formatted);

    // Only call onChange if we have a complete valid time
    if (formatted.length === 8 && validateTime(formatted)) {
      onChange(formatted);
    }
  };

  const handleBlur = () => {
    // Auto-complete incomplete time on blur
    const digits = inputValue.replace(/\D/g, "");
    let completed = "";

    if (digits.length >= 2) {
      const hours = Math.min(parseInt(digits.slice(0, 2)), 23).toString().padStart(2, "0");
      const minutes = digits.length >= 4 ?
        Math.min(parseInt(digits.slice(2, 4)), 59).toString().padStart(2, "0") : "00";
      const seconds = digits.length >= 6 ?
        Math.min(parseInt(digits.slice(4, 6)), 59).toString().padStart(2, "0") : "00";

      completed = `${hours}:${minutes}:${seconds}`;
      setInputValue(completed);
      onChange(completed);
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={placeholder}
      maxLength={8}
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 text-gray-800' : ''} ${className}`}
    />
  );
}