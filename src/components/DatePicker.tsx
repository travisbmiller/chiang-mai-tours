"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function DatePicker({ onDateSelect, selectedDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const selectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(date);
    setIsOpen(false);
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none"
      >
        <CalendarIcon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700 flex-1 text-left">
          {selectedDate ? formatSelectedDate(selectedDate) : "Select date"}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Calendar Dropdown */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={i} className="w-8 h-8" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isSelected = isDateSelected(day);
                const isDisabled = isDateDisabled(day);
                const isToday = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === today.toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => !isDisabled && selectDate(day)}
                    disabled={isDisabled}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-black text-white'
                        : isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : isToday
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
