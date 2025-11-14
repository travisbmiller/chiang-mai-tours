"use client";

import { useEffect, useState } from "react";

interface FloatingFooterProps {
  onBookingClick: () => void;
  isDisabled: boolean;
}

export function FloatingFooter({ onBookingClick, isDisabled }: FloatingFooterProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bookingSection = document.getElementById('booking-section');

    if (!bookingSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hide floating footer when booking section is visible
          setIsVisible(!entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of booking section is visible
      }
    );

    observer.observe(bookingSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    if (isDisabled) {
      // If disabled, scroll to booking section to fill required fields
      document.getElementById('booking-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // If enabled, trigger booking
      onBookingClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900">฿4,800</span>
          <span className="text-sm text-gray-500">up to 8 persons</span>
        </div>
        <button
          onClick={handleClick}
          className={`text-white px-6 py-4 md:py-3 rounded-xl font-semibold transition-colors shadow-md ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#000000] hover:bg-[#1a1a1a]'
          }`}
          disabled={isDisabled}
        >
          Request Booking
        </button>
      </div>
    </div>
  );
}
