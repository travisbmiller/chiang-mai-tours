"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, ChevronDown, ChevronRight } from "lucide-react";
import { dmSans, dmSerifDisplay } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/DatePicker";

interface BookingFormData {
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

