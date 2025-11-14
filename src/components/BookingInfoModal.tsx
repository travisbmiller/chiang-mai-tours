"use client";

import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Users, ChevronDown, ChevronRight } from "lucide-react";
import { dmSans, dmSerifDisplay } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/DatePicker";

interface BookingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  adults: number;
  childrenCount: number;
  selectedDate?: Date;
  includeMorningAlms: boolean;
  onSubmit: (formData: BookingFormData) => Promise<void>;
  onDateChange: (date: Date) => void;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  onMorningAlmsChange: (included: boolean) => void;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  needsGuide: boolean | null;
  usesWhatsApp: boolean | null;
  usesLine: boolean | null;
  interestedInOtherTours: boolean | null;
  selectedOtherTours: string[];
  additionalInfo: string;
}

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

  // All other countries alphabetically
  { id: "af", code: "+93", name: "Afghanistan" },
  { id: "al", code: "+355", name: "Albania" },
  { id: "dz", code: "+213", name: "Algeria" },
  { id: "ad", code: "+376", name: "Andorra" },
  { id: "ao", code: "+244", name: "Angola" },
  { id: "ar", code: "+54", name: "Argentina" },
  { id: "am", code: "+374", name: "Armenia" },
  { id: "au", code: "+61", name: "Australia" },
  { id: "at", code: "+43", name: "Austria" },
  { id: "az", code: "+994", name: "Azerbaijan" },
  { id: "bh", code: "+973", name: "Bahrain" },
  { id: "bd", code: "+880", name: "Bangladesh" },
  { id: "by", code: "+375", name: "Belarus" },
  { id: "be", code: "+32", name: "Belgium" },
  { id: "bz", code: "+501", name: "Belize" },
  { id: "bj", code: "+229", name: "Benin" },
  { id: "bt", code: "+975", name: "Bhutan" },
  { id: "bo", code: "+591", name: "Bolivia" },
  { id: "ba", code: "+387", name: "Bosnia and Herzegovina" },
  { id: "bw", code: "+267", name: "Botswana" },
  { id: "br", code: "+55", name: "Brazil" },
  { id: "bn", code: "+673", name: "Brunei" },
  { id: "bg", code: "+359", name: "Bulgaria" },
  { id: "bf", code: "+226", name: "Burkina Faso" },
  { id: "bi", code: "+257", name: "Burundi" },
  { id: "kh", code: "+855", name: "Cambodia" },
  { id: "cm", code: "+237", name: "Cameroon" },
  { id: "ca", code: "+1", name: "Canada" },
  { id: "cv", code: "+238", name: "Cape Verde" },
  { id: "cf", code: "+236", name: "Central African Republic" },
  { id: "td", code: "+235", name: "Chad" },
  { id: "cl", code: "+56", name: "Chile" },
  { id: "co", code: "+57", name: "Colombia" },
  { id: "km", code: "+269", name: "Comoros" },
  { id: "cg", code: "+242", name: "Congo" },
  { id: "cr", code: "+506", name: "Costa Rica" },
  { id: "hr", code: "+385", name: "Croatia" },
  { id: "cu", code: "+53", name: "Cuba" },
  { id: "cy", code: "+357", name: "Cyprus" },
  { id: "cz", code: "+420", name: "Czech Republic" },
  { id: "dk", code: "+45", name: "Denmark" },
  { id: "dj", code: "+253", name: "Djibouti" },
  { id: "ec", code: "+593", name: "Ecuador" },
  { id: "eg", code: "+20", name: "Egypt" },
  { id: "sv", code: "+503", name: "El Salvador" },
  { id: "gq", code: "+240", name: "Equatorial Guinea" },
  { id: "er", code: "+291", name: "Eritrea" },
  { id: "ee", code: "+372", name: "Estonia" },
  { id: "et", code: "+251", name: "Ethiopia" },
  { id: "fj", code: "+679", name: "Fiji" },
  { id: "fi", code: "+358", name: "Finland" },
  { id: "fr", code: "+33", name: "France" },
  { id: "ga", code: "+241", name: "Gabon" },
  { id: "gm", code: "+220", name: "Gambia" },
  { id: "ge", code: "+995", name: "Georgia" },
  { id: "gh", code: "+233", name: "Ghana" },
  { id: "gr", code: "+30", name: "Greece" },
  { id: "gt", code: "+502", name: "Guatemala" },
  { id: "gn", code: "+224", name: "Guinea" },
  { id: "gw", code: "+245", name: "Guinea-Bissau" },
  { id: "gy", code: "+592", name: "Guyana" },
  { id: "ht", code: "+509", name: "Haiti" },
  { id: "hn", code: "+504", name: "Honduras" },
  { id: "hk", code: "+852", name: "Hong Kong" },
  { id: "hu", code: "+36", name: "Hungary" },
  { id: "is", code: "+354", name: "Iceland" },
  { id: "id", code: "+62", name: "Indonesia" },
  { id: "ir", code: "+98", name: "Iran" },
  { id: "iq", code: "+964", name: "Iraq" },
  { id: "ie", code: "+353", name: "Ireland" },
  { id: "il", code: "+972", name: "Israel" },
  { id: "it", code: "+39", name: "Italy" },
  { id: "ci", code: "+225", name: "Ivory Coast" },
  { id: "jo", code: "+962", name: "Jordan" },
  { id: "kz", code: "+7", name: "Kazakhstan" },
  { id: "ke", code: "+254", name: "Kenya" },
  { id: "kw", code: "+965", name: "Kuwait" },
  { id: "kg", code: "+996", name: "Kyrgyzstan" },
  { id: "la", code: "+856", name: "Laos" },
  { id: "lv", code: "+371", name: "Latvia" },
  { id: "lb", code: "+961", name: "Lebanon" },
  { id: "ls", code: "+266", name: "Lesotho" },
  { id: "lr", code: "+231", name: "Liberia" },
  { id: "ly", code: "+218", name: "Libya" },
  { id: "li", code: "+423", name: "Liechtenstein" },
  { id: "lt", code: "+370", name: "Lithuania" },
  { id: "lu", code: "+352", name: "Luxembourg" },
  { id: "mo", code: "+853", name: "Macau" },
  { id: "mk", code: "+389", name: "Macedonia" },
  { id: "mg", code: "+261", name: "Madagascar" },
  { id: "mw", code: "+265", name: "Malawi" },
  { id: "mv", code: "+960", name: "Maldives" },
  { id: "ml", code: "+223", name: "Mali" },
  { id: "mt", code: "+356", name: "Malta" },
  { id: "mr", code: "+222", name: "Mauritania" },
  { id: "mu", code: "+230", name: "Mauritius" },
  { id: "mx", code: "+52", name: "Mexico" },
  { id: "md", code: "+373", name: "Moldova" },
  { id: "mc", code: "+377", name: "Monaco" },
  { id: "mn", code: "+976", name: "Mongolia" },
  { id: "me", code: "+382", name: "Montenegro" },
  { id: "ma", code: "+212", name: "Morocco" },
  { id: "mz", code: "+258", name: "Mozambique" },
  { id: "mm", code: "+95", name: "Myanmar" },
  { id: "na", code: "+264", name: "Namibia" },
  { id: "np", code: "+977", name: "Nepal" },
  { id: "nl", code: "+31", name: "Netherlands" },
  { id: "nz", code: "+64", name: "New Zealand" },
  { id: "ni", code: "+505", name: "Nicaragua" },
  { id: "ne", code: "+227", name: "Niger" },
  { id: "ng", code: "+234", name: "Nigeria" },
  { id: "no", code: "+47", name: "Norway" },
  { id: "om", code: "+968", name: "Oman" },
  { id: "pk", code: "+92", name: "Pakistan" },
  { id: "ps", code: "+970", name: "Palestine" },
  { id: "pa", code: "+507", name: "Panama" },
  { id: "pg", code: "+675", name: "Papua New Guinea" },
  { id: "py", code: "+595", name: "Paraguay" },
  { id: "pe", code: "+51", name: "Peru" },
  { id: "ph", code: "+63", name: "Philippines" },
  { id: "pl", code: "+48", name: "Poland" },
  { id: "pt", code: "+351", name: "Portugal" },
  { id: "qa", code: "+974", name: "Qatar" },
  { id: "ro", code: "+40", name: "Romania" },
  { id: "rw", code: "+250", name: "Rwanda" },
  { id: "sa", code: "+966", name: "Saudi Arabia" },
  { id: "sn", code: "+221", name: "Senegal" },
  { id: "rs", code: "+381", name: "Serbia" },
  { id: "sc", code: "+248", name: "Seychelles" },
  { id: "sl", code: "+232", name: "Sierra Leone" },
  { id: "sk", code: "+421", name: "Slovakia" },
  { id: "si", code: "+386", name: "Slovenia" },
  { id: "so", code: "+252", name: "Somalia" },
  { id: "za", code: "+27", name: "South Africa" },
  { id: "ss", code: "+211", name: "South Sudan" },
  { id: "es", code: "+34", name: "Spain" },
  { id: "lk", code: "+94", name: "Sri Lanka" },
  { id: "sd", code: "+249", name: "Sudan" },
  { id: "sr", code: "+597", name: "Suriname" },
  { id: "sz", code: "+268", name: "Swaziland" },
  { id: "se", code: "+46", name: "Sweden" },
  { id: "ch", code: "+41", name: "Switzerland" },
  { id: "sy", code: "+963", name: "Syria" },
  { id: "tw", code: "+886", name: "Taiwan" },
  { id: "tj", code: "+992", name: "Tajikistan" },
  { id: "tz", code: "+255", name: "Tanzania" },
  { id: "th", code: "+66", name: "Thailand" },
  { id: "tg", code: "+228", name: "Togo" },
  { id: "tn", code: "+216", name: "Tunisia" },
  { id: "tr", code: "+90", name: "Turkey" },
  { id: "tm", code: "+993", name: "Turkmenistan" },
  { id: "ug", code: "+256", name: "Uganda" },
  { id: "ua", code: "+380", name: "Ukraine" },
  { id: "ae", code: "+971", name: "United Arab Emirates" },
  { id: "uy", code: "+598", name: "Uruguay" },
  { id: "uz", code: "+998", name: "Uzbekistan" },
  { id: "ve", code: "+58", name: "Venezuela" },
  { id: "vn", code: "+84", name: "Vietnam" },
  { id: "ye", code: "+967", name: "Yemen" },
  { id: "zm", code: "+260", name: "Zambia" },
  { id: "zw", code: "+263", name: "Zimbabwe" }
];

export function BookingInfoModal({
  isOpen,
  onClose,
  adults,
  childrenCount,
  selectedDate,
  includeMorningAlms,
  onSubmit,
  onDateChange,
  onAdultsChange,
  onChildrenChange,
  onMorningAlmsChange
}: BookingInfoModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    needsGuide: null,
    usesWhatsApp: null,
    usesLine: null,
    interestedInOtherTours: null,
    selectedOtherTours: [],
    additionalInfo: ""
  });

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

  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset confirmation when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const guests = adults + childrenCount;
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
    // Remove common formatting characters
    const cleanedPhone = phone.replace(/[\s\-\(\)\+\.]/g, '');
    // Check if it has at least 6 digits and consists mainly of digits
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 6 digits)";
      isValid = false;
    }

    if (!selectedDate) {
      newErrors.date = "Please select a tour date";
      isValid = false;
    }

    if (formData.needsGuide === null) {
      newErrors.needsGuide = "Please select Yes or No";
      isValid = false;
    }

    if (formData.usesWhatsApp === null) {
      newErrors.usesWhatsApp = "Please select Yes or No";
      isValid = false;
    }

    if (formData.usesLine === null) {
      newErrors.usesLine = "Please select Yes or No";
      isValid = false;
    }

    if (formData.interestedInOtherTours === null) {
      newErrors.interestedInOtherTours = "Please select Yes or No";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });

    // Validate individual field on blur
    const newErrors = { ...errors };

    if (field === 'fullName') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      } else {
        newErrors.fullName = "";
      }
    }

    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
    }

    if (field === 'phone') {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number (at least 6 digits)";
      } else {
        newErrors.phone = "";
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
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
      try {
        await onSubmit(formData);
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error submitting booking:', error);
        setIsSubmitting(false);
      }
    }
  };

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
              onClick={onClose}
              className="bg-[#000000] hover:bg-[#1a1a1a] text-white px-8 py-6 rounded-xl text-lg"
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        /* Booking Form */
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
                <label htmlFor="fullName" className="block text-[#000000] font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (touched.fullName && errors.fullName) {
                      setErrors({ ...errors, fullName: "" });
                    }
                  }}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-base ${
                    touched.fullName && errors.fullName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-black'
                  }`}
                  required
                />
                {touched.fullName && errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#000000] font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (touched.email && errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-base ${
                    touched.email && errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-black'
                  }`}
                  required
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-[#000000] font-medium mb-2">
                  Phone
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryCodeOpen(!isCountryCodeOpen)}
                      className={`px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-colors flex items-center gap-2 text-base ${
                        touched.phone && errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-black'
                      }`}
                    >
                      <span className="text-gray-700">{formData.countryCode}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {isCountryCodeOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => {
                            setIsCountryCodeOpen(false);
                            setCountrySearchQuery("");
                          }}
                        />
                        <div className="absolute z-50 w-80 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                          {/* Search input */}
                          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearchQuery}
                              onChange={(e) => setCountrySearchQuery(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          {/* Country list */}
                          <div className="max-h-60 overflow-y-auto">
                            {countryCodes
                              .filter((country) => {
                                const query = countrySearchQuery.toLowerCase();
                                return (
                                  country.name.toLowerCase().includes(query) ||
                                  country.code.toLowerCase().includes(query)
                                );
                              })
                              .map((country) => (
                                <button
                                  key={country.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, countryCode: country.code });
                                    setIsCountryCodeOpen(false);
                                    setCountrySearchQuery("");
                                  }}
                                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors ${
                                    formData.countryCode === country.code ? 'bg-gray-50 font-medium' : ''
                                  }`}
                                >
                                  <span className="text-[#000000]">{country.code} {country.name}</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (touched.phone && errors.phone) {
                        setErrors({ ...errors, phone: "" });
                      }
                    }}
                    onBlur={() => handleBlur('phone')}
                    className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-base ${
                      touched.phone && errors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-black'
                    }`}
                    required
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Licensed Guide */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[#000000] font-medium">Do you need a licensed professional guide?</div>
                    <div className="text-sm text-gray-500">This will cost an additional 1,000 to 1,500 baht.</div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">No</span>
                      <input
                        type="checkbox"
                        checked={formData.needsGuide === false}
                        onChange={() => {
                          setFormData({ ...formData, needsGuide: formData.needsGuide === false ? null : false });
                          if (touched.needsGuide && errors.needsGuide) {
                            setErrors({ ...errors, needsGuide: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">Yes</span>
                      <input
                        type="checkbox"
                        checked={formData.needsGuide === true}
                        onChange={() => {
                          setFormData({ ...formData, needsGuide: formData.needsGuide === true ? null : true });
                          if (touched.needsGuide && errors.needsGuide) {
                            setErrors({ ...errors, needsGuide: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                  </div>
                </div>
                {touched.needsGuide && errors.needsGuide && (
                  <p className="mt-1 text-sm text-red-600">{errors.needsGuide}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[#000000] font-medium">Do you use WhatsApp Messenger?</div>
                    <div className="text-sm text-gray-500">This will enable faster communications.</div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">No</span>
                      <input
                        type="checkbox"
                        checked={formData.usesWhatsApp === false}
                        onChange={() => {
                          setFormData({ ...formData, usesWhatsApp: formData.usesWhatsApp === false ? null : false });
                          if (touched.usesWhatsApp && errors.usesWhatsApp) {
                            setErrors({ ...errors, usesWhatsApp: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">Yes</span>
                      <input
                        type="checkbox"
                        checked={formData.usesWhatsApp === true}
                        onChange={() => {
                          setFormData({ ...formData, usesWhatsApp: formData.usesWhatsApp === true ? null : true });
                          if (touched.usesWhatsApp && errors.usesWhatsApp) {
                            setErrors({ ...errors, usesWhatsApp: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                  </div>
                </div>
                {touched.usesWhatsApp && errors.usesWhatsApp && (
                  <p className="mt-1 text-sm text-red-600">{errors.usesWhatsApp}</p>
                )}
              </div>

              {/* LINE */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[#000000] font-medium">Do you use LINE Messenger?</div>
                    <div className="text-sm text-gray-500">This will enable faster communications.</div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">No</span>
                      <input
                        type="checkbox"
                        checked={formData.usesLine === false}
                        onChange={() => {
                          setFormData({ ...formData, usesLine: formData.usesLine === false ? null : false });
                          if (touched.usesLine && errors.usesLine) {
                            setErrors({ ...errors, usesLine: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">Yes</span>
                      <input
                        type="checkbox"
                        checked={formData.usesLine === true}
                        onChange={() => {
                          setFormData({ ...formData, usesLine: formData.usesLine === true ? null : true });
                          if (touched.usesLine && errors.usesLine) {
                            setErrors({ ...errors, usesLine: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                  </div>
                </div>
                {touched.usesLine && errors.usesLine && (
                  <p className="mt-1 text-sm text-red-600">{errors.usesLine}</p>
                )}
              </div>

              {/* Interested in Other Tours */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[#000000] font-medium">Planning to do multiple tours during your visit?</div>
                    <div className="text-sm text-gray-500">This helps me plan the best itinerary for you</div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">No</span>
                      <input
                        type="checkbox"
                        checked={formData.interestedInOtherTours === false}
                        onChange={() => {
                          const newValue = formData.interestedInOtherTours === false ? null : false;
                          setFormData({
                            ...formData,
                            interestedInOtherTours: newValue,
                            selectedOtherTours: newValue === false ? [] : formData.selectedOtherTours
                          });
                          if (touched.interestedInOtherTours && errors.interestedInOtherTours) {
                            setErrors({ ...errors, interestedInOtherTours: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">Yes</span>
                      <input
                        type="checkbox"
                        checked={formData.interestedInOtherTours === true}
                        onChange={() => {
                          setFormData({ ...formData, interestedInOtherTours: formData.interestedInOtherTours === true ? null : true });
                          if (touched.interestedInOtherTours && errors.interestedInOtherTours) {
                            setErrors({ ...errors, interestedInOtherTours: "" });
                          }
                        }}
                        className="w-5 h-5 border-2 border-gray-300 rounded"
                        style={{ accentColor: '#000' }}
                      />
                    </label>
                  </div>
                </div>
                {touched.interestedInOtherTours && errors.interestedInOtherTours && (
                  <p className="mt-1 text-sm text-red-600">{errors.interestedInOtherTours}</p>
                )}

                {/* Tours Dropdown - Only show if interested */}
                {formData.interestedInOtherTours === true && (
                  <div className="mt-4">
                    <label className="block text-[#000000] font-medium mb-2">
                      Select tours you're interested in
                    </label>
                    <div className="space-y-2">
                      {otherTours.map((tour) => (
                        <label key={tour.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.selectedOtherTours.includes(tour.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedOtherTours: [...formData.selectedOtherTours, tour.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedOtherTours: formData.selectedOtherTours.filter(id => id !== tour.id)
                                });
                              }
                            }}
                            className="w-5 h-5 border-2 border-gray-300 rounded"
                            style={{ accentColor: '#000' }}
                          />
                          <span className="text-[#000000]">{tour.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-[#000000] font-medium mb-2">
                  Additional information
                </label>
                <textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Is there anything else you would like to share?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-base"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 py-6 text-[#000000] border-2 border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancel request
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-6 bg-[#000000] hover:bg-[#1a1a1a] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Booking Request'}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden lg:sticky lg:top-6" style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.15)' }}>
              <div style={{ paddingLeft: '25px', paddingTop: '25px', paddingRight: '25px', paddingBottom: '0' }}>
                {/* Tour Title with Image */}
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className={`text-lg text-[#000000] ${dmSans.className}`}>Discover the Magic of</div>
                    <div className={`font-bold text-[#000000] leading-tight ${dmSerifDisplay.className}`} style={{ fontSize: '2.75rem' }}>
                      Doi Suthep
                    </div>
                  </div>

                  <img
                    src="https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg"
                    alt="Doi Suthep Temple"
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                </div>

                {/* Tour Details - Full Width */}
                <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-[#000000] font-semibold">4-6 hrs</div>
                    <div className="text-[10px] md:text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-gray-300 text-xs md:text-sm">|</div>
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-[#000000] font-semibold">5 Stops</div>
                    <div className="text-[10px] md:text-xs text-gray-500">Stops</div>
                  </div>
                  <div className="text-gray-300 text-xs md:text-sm">|</div>
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-[#000000] font-semibold">Private</div>
                    <div className="text-[10px] md:text-xs text-gray-500">Tour Type</div>
                  </div>
                  <div className="text-gray-300 text-xs md:text-sm">|</div>
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-[#000000] font-semibold">Chiang Mai</div>
                    <div className="text-[10px] md:text-xs text-gray-500">Depart / Return</div>
                  </div>
                  <div className="text-gray-300 text-xs md:text-sm">|</div>
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-[#000000] font-semibold">English</div>
                    <div className="text-[10px] md:text-xs text-gray-500">Language</div>
                  </div>
                </div>

                {/* Date and People Selectors */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row gap-3 mb-3">
                    {/* Date Picker */}
                    <div className={`flex-1 border-2 rounded-xl transition-colors ${
                      errors.date ? 'border-red-500' : 'border-transparent'
                    }`}>
                      <DatePicker
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                          onDateChange(date);
                          if (errors.date) {
                            setErrors({ ...errors, date: "" });
                          }
                        }}
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
                                className="w-7 h-7 rounded-full border-2 border-[#433D3F] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#433D3F] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                              >
                                <span className="text-lg leading-none">−</span>
                              </button>
                              <div className="w-8 text-center font-medium text-[#000000]">{adults}</div>
                              <button
                                type="button"
                                onClick={() => onAdultsChange(Math.min(10, adults + 1))}
                                disabled={adults >= 10}
                                className="w-7 h-7 rounded-full border-2 border-[#433D3F] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#433D3F] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
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
                                className="w-7 h-7 rounded-full border-2 border-[#433D3F] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#433D3F] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                              >
                                <span className="text-lg leading-none">−</span>
                              </button>
                              <div className="w-8 text-center font-medium text-[#000000]">{childrenCount}</div>
                              <button
                                type="button"
                                onClick={() => onChildrenChange(Math.min(10, childrenCount + 1))}
                                disabled={childrenCount >= 10}
                                className="w-7 h-7 rounded-full border-2 border-[#433D3F] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#433D3F] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
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
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date}</p>
                  )}

                  {/* Add Morning Monk Alms */}
                  <div>
                    <div className="text-xs text-gray-600 font-bold mb-2">Tour add-on</div>
                    <div className="flex items-center justify-between px-4 py-3 border-2 border-yellow-400 rounded-xl">
                      <label htmlFor="morning-alms-sidebar" className="text-[#000000] font-medium cursor-pointer flex-1">
                        Morning Monk Alms
                      </label>
                      <input
                        id="morning-alms-sidebar"
                        type="checkbox"
                        checked={includeMorningAlms}
                        onChange={(e) => onMorningAlmsChange(e.target.checked)}
                        className="w-5 h-5 border-2 border-yellow-400 rounded cursor-pointer"
                        style={{ accentColor: '#EAB308' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#000000] mb-3">Price details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[#000000] font-medium">Guests x {guests}</span>
                        <span className="text-gray-500 text-xs ml-2">/ {basePrice.toLocaleString()} Baht per guest</span>
                      </div>
                      <span className="text-[#000000] font-bold text-lg">{guestsTotal.toLocaleString()}</span>
                    </div>

                    {includeMorningAlms && (
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[#000000] font-medium">Morning Monk Alms</span>
                            <span className="text-gray-500 text-xs ml-2">/ Tour Add-on</span>
                          </div>
                          <span className="text-[#000000] font-bold text-lg">{morningAlmsAddon}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[#000000] font-medium">Monk Alms Offering</span>
                            <span className="text-gray-500 text-xs ml-2">/ 100 Baht per guest</span>
                          </div>
                          <span className="text-[#000000] font-bold text-lg">{almsOffering}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200 mb-6">
                  <div className="text-xl font-bold text-[#000000]">
                    Total <span className="text-sm font-normal text-gray-500">/ Baht</span>
                  </div>
                  <div className="text-3xl font-bold text-[#000000]">{total.toLocaleString()}</div>
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
      </div>
      )}
    </div>
  );
}
