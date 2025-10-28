"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { dmSerifDisplay, dmSans } from "@/lib/fonts";

const otherTours = [
  { id: "doi-inthanon", name: "Explore Doi Inthanon" },
  { id: "best-of-pai", name: "The Best of Pai" },
  { id: "chiang-rai", name: "Chiang Rai & Golden Triangle" },
  { id: "sukhothai", name: "Sukhothai Adventure" }
];

const countryCodes = [
  // Top 10 tourist countries to Thailand
  { id: "cn", code: "+86", name: "China" },
  { id: "my", code: "+60", name: "Malaysia" },
  { id: "kr", code: "+82", name: "South Korea" },
  { id: "jp", code: "+81", name: "Japan" },
  { id: "in", code: "+91", name: "India" },
  { id: "ru", code: "+7", name: "Russia" },
  { id: "us", code: "+1", name: "United States" },
  { id: "sg", code: "+65", name: "Singapore" },
  { id: "gb", code: "+44", name: "United Kingdom" },
  { id: "de", code: "+49", name: "Germany" },
  // ... (rest omitted for brevity, but would be included in a real file)
  { id: "th", code: "+66", name: "Thailand" }
];

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get parameters from URL
  const tourName = searchParams.get('tour') || 'Discover the Magic of Doi Suthep';
  const initialDate = searchParams.get('date');
  const initialAdults = parseInt(searchParams.get('adults') || '2', 10);
  const initialChildren = parseInt(searchParams.get('children') || '0', 10);
  const initialMorningAlms = searchParams.get('morningAlms') === 'true';
  const phoneNumber = searchParams.get('phone') || '66809755467';

  // State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined
  );
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [includeMorningAlms, setIncludeMorningAlms] = useState(initialMorningAlms);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [needsGuide, setNeedsGuide] = useState<boolean | null>(null);
  const [usesWhatsApp, setUsesWhatsApp] = useState<boolean | null>(null);
  const [usesLine, setUsesLine] = useState<boolean | null>(null);
  const [interestedInOtherTours, setInterestedInOtherTours] = useState<boolean | null>(null);
  const [selectedOtherTours, setSelectedOtherTours] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Errors state
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    needsGuide: "",
    usesWhatsApp: "",
    usesLine: "",
    interestedInOtherTours: ""
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    needsGuide: false,
    usesWhatsApp: false,
    usesLine: false,
    interestedInOtherTours: false
  });

  // UI state
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const guests = adults + children;
  const basePrice = 1500;
  const guestsTotal = guests * basePrice;
  const morningAlmsAddon = includeMorningAlms ? 500 : 0;
  const almsOffering = includeMorningAlms ? guests * 100 : 0;
  const total = guestsTotal + morningAlmsAddon + almsOffering;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleanedPhone = phone.replace(/[\s\-\(\)\+\.]/g, '');
    const hasEnoughDigits = cleanedPhone.length >= 6;
    const isMostlyDigits = /^\d+$/.test(cleanedPhone);
    return hasEnoughDigits && isMostlyDigits;
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      date: "",
      needsGuide: "",
      usesWhatsApp: "",
      usesLine: "",
      interestedInOtherTours: ""
    };

    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 6 digits)";
      isValid = false;
    }

    if (!selectedDate) {
      newErrors.date = "Please select a tour date";
      isValid = false;
    }

    if (needsGuide === null) {
      newErrors.needsGuide = "Please select Yes or No";
      isValid = false;
    }

    if (usesWhatsApp === null) {
      newErrors.usesWhatsApp = "Please select Yes or No";
      isValid = false;
    }

    if (usesLine === null) {
      newErrors.usesLine = "Please select Yes or No";
      isValid = false;
    }

    if (interestedInOtherTours === null) {
      newErrors.interestedInOtherTours = "Please select Yes or No";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });

    const newErrors = { ...errors };

    if (field === 'fullName') {
      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      } else {
        newErrors.fullName = "";
      }
    }

    if (field === 'email') {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
    }

    if (field === 'phone') {
      if (!phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(phone)) {
        newErrors.phone = "Please enter a valid phone number (at least 6 digits)";
      } else {
        newErrors.phone = "";
      }
    }

    setErrors(newErrors);
  };

  const handleTourToggle = (tourId: string) => {
    setSelectedOtherTours(prev =>
      prev.includes(tourId)
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      needsGuide: true,
      usesWhatsApp: true,
      usesLine: true,
      interestedInOtherTours: true
    });

    if (validateForm()) {
      setIsSubmitting(true);

      const dateText = selectedDate
        ? selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : "Date not selected";

      const adultsText = adults === 1 ? "1 Adult" : `${adults} Adults`;
      const childrenText = children > 0 ? (children === 1 ? ", 1 Child" : `, ${children} Children`) : "";
      const peopleText = adultsText + childrenText;

      const selectedTourNames = selectedOtherTours.map(id => {
        const tour = otherTours.find(t => t.id === id);
        return tour?.name || id;
      });

      // Send email notification
      try {
        await fetch('/api/send-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tourName,
            fullName,
            email,
            countryCode,
            phone,
            date: dateText,
            guests: peopleText,
            includeMorningAlms,
            needsGuide,
            usesWhatsApp,
            usesLine,
            selectedOtherTours: selectedTourNames,
            additionalInfo,
            totalPrice: total.toLocaleString(),
          }),
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }

      // Send WhatsApp message if user has WhatsApp
      if (usesWhatsApp === true) {
        let message = `Hi Chet, I would like to book the ${tourName} tour.\n\n`;
        message += `*Booking Details:*\n`;
        message += `- Name: ${fullName}\n`;
        message += `- Email: ${email}\n`;
        message += `- Phone: ${countryCode} ${phone}\n`;
        message += `- Date: ${dateText}\n`;
        message += `- Guests: ${peopleText}\n`;
        if (includeMorningAlms) {
          message += `- Morning Monk Alms: Yes\n`;
        }
        message += `\n*Preferences:*\n`;
        message += `- Licensed Guide: ${needsGuide === null ? 'Not specified' : needsGuide ? 'Yes' : 'No'}\n`;
        message += `- WhatsApp: ${usesWhatsApp === null ? 'Not specified' : usesWhatsApp ? 'Yes' : 'No'}\n`;
        message += `- LINE: ${usesLine === null ? 'Not specified' : usesLine ? 'Yes' : 'No'}\n`;

        if (interestedInOtherTours === true && selectedTourNames.length > 0) {
          message += `\n*Also Interested In:*\n${selectedTourNames.join(', ')}\n`;
        }

        if (additionalInfo) {
          message += `\n*Additional Information:*\n${additionalInfo}\n`;
        }

        message += `\nPlease let me know the availability and next steps. Thank you!`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }

      setShowConfirmation(true);
      setIsSubmitting(false);
    }
  };

  // Parse tour title for display
  const getTourTitleParts = () => {
    const lastWordIndex = tourName.lastIndexOf(' ');
    const lastTwoWordsIndex = tourName.lastIndexOf(' ', lastWordIndex - 1);
    const firstPart = tourName.substring(0, lastTwoWordsIndex) || "Discover the Magic of";
    const secondPart = tourName.substring(lastTwoWordsIndex + 1) || "Doi Suthep";
    return { firstPart, secondPart };
  };

  const { firstPart, secondPart } = getTourTitleParts();

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto" style={{ height: '100dvh', minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Back button (replaces X) */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-black transition-colors z-10 group"
        style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)' }}
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
      </button>

      {/* Content */}
      {showConfirmation ? (
        /* Confirmation Screen */
        <div className="max-w-2xl mx-auto px-8 py-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className={`text-4xl md:text-5xl font-bold text-[#000000] mb-4 ${dmSerifDisplay.className}`}>
              Request Sent!
            </h2>

            <p className="text-lg text-[#000000] mb-6 leading-relaxed max-w-lg mx-auto">
              Thank you for your booking request. I've received your information and will get back to you shortly to confirm availability and discuss the details of your tour.
            </p>

            <div className="bg-amber-50 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <p className="text-sm text-[#000000] leading-relaxed">
                <strong>What happens next?</strong><br/>
                I'll review your request and contact you within 24 hours to confirm your booking and answer any questions you may have.
              </p>
            </div>

            <Button
              onClick={() => router.back()}
              className="bg-[#000000] hover:bg-[#1a1a1a] text-white px-8 py-6 rounded-xl text-lg"
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        /* Booking Form - Modal layout (two-column grid) */
        <div className="max-w-7xl mx-auto px-2 md:px-8 py-8 md:py-16" style={{ marginTop: '25px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Form */}
            <div className="order-2 lg:order-1 px-4 md:px-0">
              <h2 className="text-4xl font-bold text-[#000000] mb-4">Booking info</h2>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Please take a moment to fill out all the details below. I'll reply as soon as I can and look forward to helping plan your time in Chiang Mai & Northern Thailand.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-[#000000] font-medium mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="Enter your full name"
                    className="rounded-xl"
                  />
                  {touched.fullName && errors.fullName && (
                    <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[#000000] font-medium mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="your.email@example.com"
                    className="rounded-xl"
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-[#000000] font-medium mb-1">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-white"
                        onClick={() => setIsCountryCodeOpen(open => !open)}
                        aria-label="Select country code"
                      >
                        <span>{countryCode}</span>
                        <span className="text-xs text-gray-500">&#9660;</span>
                      </button>
                      {isCountryCodeOpen && (
                        <div className="absolute z-50 mt-2 w-56 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search country"
                              value={countrySearchQuery}
                              onChange={e => setCountrySearchQuery(e.target.value)}
                              className="w-full px-2 py-1 mb-2 border border-gray-200 rounded"
                            />
                          </div>
                          <ul>
                            {countryCodes
                              .filter(c =>
                                c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
                                c.code.includes(countrySearchQuery)
                              )
                              .map(c => (
                                <li key={c.code}>
                                  <button
                                    type="button"
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                      setCountryCode(c.code);
                                      setIsCountryCodeOpen(false);
                                      setCountrySearchQuery("");
                                    }}
                                  >
                                    {c.code} {c.name}
                                  </button>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="123456789"
                      className="flex-1 rounded-xl"
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[#000000] font-medium mb-1">
                    Tour Date *
                  </label>
                  <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                  {errors.date && (
                    <div className="text-red-500 text-xs mt-1">{errors.date}</div>
                  )}
                </div>

                {/* People */}
                <div>
                  <label className="block text-[#000000] font-medium mb-1">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPeopleDropdownOpen(open => !open)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 flex-1 text-left">
                        {adults === 1 && children === 0
                          ? "1 Adult"
                          : `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    {isPeopleDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsPeopleDropdownOpen(false)} />
                        <div className="absolute z-50 w-full mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-[#000000]">Adult</div>
                              <div className="text-xs text-gray-500">Age 13 & older</div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                disabled={adults <= 1}
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300"
                              >
                                <span className="text-lg leading-none">−</span>
                              </button>
                              <div className="w-8 text-center font-medium text-[#000000]">{adults}</div>
                              <button
                                type="button"
                                onClick={() => setAdults(Math.min(10, adults + 1))}
                                disabled={adults >= 10}
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300"
                              >
                                <span className="text-lg leading-none">+</span>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-[#000000]">Child</div>
                              <div className="text-xs text-gray-500">12 & younger</div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                disabled={children <= 0}
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300"
                              >
                                <span className="text-lg leading-none">−</span>
                              </button>
                              <div className="w-8 text-center font-medium text-[#000000]">{children}</div>
                              <button
                                type="button"
                                onClick={() => setChildren(Math.min(10, children + 1))}
                                disabled={children >= 10}
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300"
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

                {/* Morning Monk Alms */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-2 border-yellow-400 rounded-xl">
                  <label htmlFor="morning-alms" className="text-[#000000] font-medium cursor-pointer flex-1">
                    Morning Monk Alms
                  </label>
                  <input
                    id="morning-alms"
                    type="checkbox"
                    checked={includeMorningAlms}
                    onChange={e => setIncludeMorningAlms(e.target.checked)}
                    className="w-5 h-5 border-2 border-yellow-400 rounded"
                    style={{ accentColor: '#EAB308' }}
                  />
                </div>

                {/* Licensed Guide */}
                <div>
                  <label className="text-[#000000] font-medium mb-3 block">Do you need a licensed guide? *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNeedsGuide(true)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        needsGuide === true
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedsGuide(false)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        needsGuide === false
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {touched.needsGuide && errors.needsGuide && (
                    <div className="text-red-500 text-xs mt-1">{errors.needsGuide}</div>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-[#000000] font-medium mb-3 block">Do you use WhatsApp? *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUsesWhatsApp(true)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        usesWhatsApp === true
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsesWhatsApp(false)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        usesWhatsApp === false
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {touched.usesWhatsApp && errors.usesWhatsApp && (
                    <div className="text-red-500 text-xs mt-1">{errors.usesWhatsApp}</div>
                  )}
                </div>

                {/* LINE */}
                <div>
                  <label className="text-[#000000] font-medium mb-3 block">Do you use LINE Messenger? *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUsesLine(true)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        usesLine === true
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsesLine(false)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        usesLine === false
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {touched.usesLine && errors.usesLine && (
                    <div className="text-red-500 text-xs mt-1">{errors.usesLine}</div>
                  )}
                </div>

                {/* Other Tours */}
                <div>
                  <label className="text-[#000000] font-medium mb-3 block">Interested in other tours? *</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setInterestedInOtherTours(true)}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        interestedInOtherTours === true
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInterestedInOtherTours(false);
                        setSelectedOtherTours([]);
                      }}
                      className={`py-3 px-4 rounded-xl border-2 transition-colors ${
                        interestedInOtherTours === false
                          ? 'border-[#000000] bg-[#000000] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {touched.interestedInOtherTours && errors.interestedInOtherTours && (
                    <div className="text-red-500 text-xs mt-1">{errors.interestedInOtherTours}</div>
                  )}
                  {interestedInOtherTours === true && (
                    <div className="space-y-2">
                      {otherTours.map((tour) => (
                        <label
                          key={tour.id}
                          className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedOtherTours.includes(tour.id)}
                            onChange={() => handleTourToggle(tour.id)}
                            className="w-5 h-5 rounded"
                          />
                          <span className="text-[#000000]">{tour.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-[#000000] font-medium mb-1">
                    Additional Information (Optional)
                  </label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={e => setAdditionalInfo(e.target.value)}
                    placeholder="Any special requests or questions?"
                    className="rounded-xl min-h-24"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#000000] hover:bg-[#1a1a1a] text-white rounded-xl py-6 text-lg"
                >
                  {isSubmitting ? 'Sending...' : 'Send Booking Request'}
                </Button>
              </form>
            </div>

            {/* Right Column - Summary Card */}
            <div className="order-1 lg:order-2">
              <div className="bg-gray-50 rounded-2xl p-6 shadow-md sticky top-24">
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Tour</div>
                  <div className={`text-2xl font-bold text-[#000000] ${dmSerifDisplay.className}`}>
                    {tourName}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-[#000000]">
                      {selectedDate
                        ? selectedDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : <span className="text-gray-400">Not selected</span>
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-medium text-[#000000]">
                      {adults === 1 && children === 0
                        ? "1 Adult"
                        : `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Morning Monk Alms</span>
                    <span className="font-medium text-[#000000]">
                      {includeMorningAlms ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 my-6" />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-[#000000]">{total.toLocaleString()} ฿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BookingContent />
    </Suspense>
  );
}
