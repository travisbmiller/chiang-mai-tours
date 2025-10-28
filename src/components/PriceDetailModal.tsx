"use client";

import { useState } from "react";
import { X, Users, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { dmSans, dmSerifDisplay } from "@/lib/fonts";
import { DatePicker } from "@/components/DatePicker";

interface PriceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  adults: number;
  childrenCount: number;
  includeMorningAlms: boolean;
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  onMorningAlmsChange: (included: boolean) => void;
}

export function PriceDetailModal({
  isOpen,
  onClose,
  adults,
  childrenCount,
  includeMorningAlms,
  selectedDate,
  onDateChange,
  onAdultsChange,
  onChildrenChange,
  onMorningAlmsChange
}: PriceDetailModalProps) {
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const guests = adults + childrenCount;
  const basePrice = 1500;
  const guestsTotal = guests * basePrice;
  const morningAlmsAddon = includeMorningAlms ? 500 : 0;
  const almsOffering = includeMorningAlms ? guests * 100 : 0;
  const total = guestsTotal + morningAlmsAddon + almsOffering;

  const formatDate = (date?: Date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto" style={{ height: '100dvh', minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-black transition-colors z-10 group"
        style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)' }}
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
      </button>

      {/* Content */}
      <div className="max-w-lg mx-auto px-2 py-8" style={{ marginTop: '25px' }}>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.15)' }}>
          <div style={{ paddingLeft: '25px', paddingTop: '25px', paddingRight: '25px', paddingBottom: '0' }}>
            {/* Tour Title with Image */}
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                {/* Tour Title */}
                <div className={`text-lg text-[#000000] ${dmSans.className}`}>Discover the Magic of</div>
                <div className={`font-bold text-[#000000] leading-tight ${dmSerifDisplay.className}`} style={{ fontSize: '2.75rem' }}>Doi Suthep</div>
              </div>

              {/* Tour Image */}
              <img
                src="https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg"
                alt="Doi Suthep Temple"
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            </div>

            {/* Tour Details - Full Width */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
              <div className="text-center">
                <div className="text-xs md:text-sm text-[#000000]" style={{ fontWeight: 600 }}>4-6 hrs</div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5">Duration</div>
              </div>
              <div className="text-gray-300 text-xs md:text-sm">|</div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-[#000000]" style={{ fontWeight: 600 }}>5 Stops</div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5">Stops</div>
              </div>
              <div className="text-gray-300 text-xs md:text-sm">|</div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-[#000000]" style={{ fontWeight: 600 }}>Private</div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5">Tour Type</div>
              </div>
              <div className="text-gray-300 text-xs md:text-sm">|</div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-[#000000]" style={{ fontWeight: 600 }}>Chiang Mai</div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5">Depart / Return</div>
              </div>
              <div className="text-gray-300 text-xs md:text-sm">|</div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-[#000000]" style={{ fontWeight: 600 }}>English</div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5">Language</div>
              </div>
            </div>

            {/* Date and People Selectors */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Date Picker */}
                <div className="flex-1">
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={onDateChange}
                  />
                </div>

                {/* People Selector */}
                <div className="flex-1 relative">
                <button
                  type="button"
                  onClick={() => setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 flex-1 text-left">
                    {adults === 1 && childrenCount === 0 ? "1 Adult" : `${adults} Adult${adults > 1 ? 's' : ''}${childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}` : ''}`}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {isPeopleDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsPeopleDropdownOpen(false)}
                    />
                    <div className="absolute z-50 w-full mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-lg space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[#000000]">Adult</div>
                          <div className="text-xs text-gray-500">Age 13 & older</div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                            className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                          >
                            <span className="text-lg leading-none">−</span>
                          </button>
                          <div className="w-8 text-center font-medium text-[#000000]">{adults}</div>
                          <button
                            type="button"
                            onClick={() => onAdultsChange(Math.min(10, adults + 1))}
                            disabled={adults >= 10}
                            className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                          >
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[#000000]">Child</div>
                          <div className="text-xs text-gray-500">12 & younger</div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => onChildrenChange(Math.max(0, childrenCount - 1))}
                            disabled={childrenCount <= 0}
                            className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                          >
                            <span className="text-lg leading-none">−</span>
                          </button>
                          <div className="w-8 text-center font-medium text-[#000000]">{childrenCount}</div>
                          <button
                            type="button"
                            onClick={() => onChildrenChange(Math.min(10, childrenCount + 1))}
                            disabled={childrenCount >= 10}
                            className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                          >
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                </div>
              </div>

              {/* Add Morning Monk Alms */}
              <div className="mt-3">
                <div className="text-xs text-gray-600 font-bold mb-2">Tour add-on</div>
                <div className="flex items-center justify-between px-4 py-3 border-2 border-yellow-400 rounded-xl">
                  <label htmlFor="morning-alms-price" className="text-[#000000] font-medium cursor-pointer flex-1">
                    Morning Monk Alms
                  </label>
                  <input
                    id="morning-alms-price"
                    type="checkbox"
                    checked={includeMorningAlms}
                    onChange={(e) => onMorningAlmsChange(e.target.checked)}
                    className="w-5 h-5 border-2 border-yellow-400 rounded cursor-pointer"
                    style={{ accentColor: '#EAB308' }}
                  />
                </div>
              </div>
            </div>

            {/* Price details heading */}
            <h3 className="text-2xl font-bold text-[#000000] mb-3">Price details</h3>

            {/* Price breakdown */}
            <div className="space-y-2 mb-8">
              {/* Guests */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[#000000] font-medium">Guests x {guests}</span>
                  <span className="text-gray-500 text-xs ml-2">/ {basePrice.toLocaleString()} Baht per guest</span>
                </div>
                <div className="text-[#000000] font-bold text-xl">{guestsTotal.toLocaleString()}</div>
              </div>

              {/* Morning Monk Alms - only show if included */}
              {includeMorningAlms && (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#000000] font-medium">Morning Monk Alms</span>
                      <span className="text-gray-500 text-xs ml-2">/ Tour Add-on</span>
                    </div>
                    <div className="text-[#000000] font-bold text-xl">{morningAlmsAddon}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#000000] font-medium">Monk Alms Offering</span>
                      <span className="text-gray-500 text-xs ml-2">/ 100 Baht per guest</span>
                    </div>
                    <div className="text-[#000000] font-bold text-xl">{almsOffering}</div>
                  </div>
                </>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mb-6">
              <div className="text-2xl font-bold text-[#000000]">
                Total <span className="text-base font-normal text-gray-500">/ Baht</span>
              </div>
              <div className="text-4xl font-bold text-[#000000]">{total.toLocaleString()}</div>
            </div>
          </div>

          {/* Footer note with grey background */}
          <div className="bg-gray-100 py-6" style={{ paddingLeft: '25px', paddingRight: '25px' }}>
            <p className="text-xs text-[#000000] leading-relaxed">
              Price includes all listed <span className="font-semibold">entry fees</span> and <span className="font-semibold">transportation costs</span>. A licensed professional guide can be arranged for an additional 1,000–1,500 Baht.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
