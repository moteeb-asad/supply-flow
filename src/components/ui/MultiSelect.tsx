"use client";

import { useState, useRef, useEffect } from "react";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  id?: string;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  id,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return options
      .filter((option) => value.includes(option.value))
      .map((option) => option.label);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[#4e6797]" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative" ref={containerRef}>
        <div
          className="w-full min-h-[42px] px-2 py-1.5 bg-gray-50 border border-[#e7ebf3] rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all flex flex-wrap gap-1.5 items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value.length > 0 ? (
            getSelectedLabels().map((label) => (
              <div
                key={label}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold border border-primary/20"
              >
                <span>{label}</span>
                <button
                  type="button"
                  className="flex items-center hover:text-primary/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    const option = options.find((o) => o.label === label);
                    if (option) removeOption(option.value);
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    close
                  </span>
                </button>
              </div>
            ))
          ) : (
            <span className="text-[#4e6797] text-sm ml-1 opacity-50">
              {placeholder}
            </span>
          )}
          <div className="ml-auto pr-1">
            <span
              className={`material-symbols-outlined text-[#4e6797] text-xl transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e7ebf3] rounded-lg shadow-xl z-10 overflow-hidden">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                  onClick={() => toggleOption(option.value)}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-[#e7ebf3] bg-white"
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px] text-white font-bold">
                        check
                      </span>
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
