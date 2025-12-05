"use client";
import React, { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  id: string;
  [key: string]: any;
}

interface CustomDropdownProps {
  label?: string;
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  className?: string;
  labelKey: string; // 🔑 key used to display text (e.g., 'jenis_nasabah', 'kriteria')
  disabled?: boolean; // <-- add this
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
  labelKey,
  disabled = false, // default to false
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className={`relative w-full rounded-md border p-2 text-left flex justify-between items-center focus:outline-none ${
                disabled
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-br from-white to-white focus:ring-2 focus:ring-blue-400"
              }`}
              disabled={disabled}
            >
              <span>
                {value?.[labelKey] || "Pilih salah satu"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Listbox.Button>

            {open && !disabled && (
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md overflow-hidden max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    as={Fragment}
                  >
                    {({ active, selected }) => (
                      <li
                        className={`cursor-pointer px-4 py-2 border-b last:border-0 ${
                          active ? "bg-gray-100" : ""
                        } ${selected ? "font-medium" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          {option[labelKey]}
                          {selected && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            )}
          </div>
        )}
      </Listbox>
    </div>
  );
};


export default CustomDropdown;
