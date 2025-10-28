"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { dmSerifDisplay, dmSans } from "@/lib/fonts";

// All tour images in order - matching main page exactly
const tourImages = [
  // Hero/Overview section (0-2)
  { src: "https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg", alt: "Wat Phra That Doi Suthep Golden Temple", section: "Tour Overview" },
  { src: "https://shippedaway.com/wp-content/uploads/2024/01/Wat-Phra-That-Doi-Suthep-Chiang-Mai-Thailand-11.jpg", alt: "Golden Temple Details and Statues", section: "Tour Overview" },
  { src: "https://adventuresofagoodman.com/wp-content/uploads/2009/07/Wat_Doi_Suthep-Chiang_Mai_Thailand-Greg_Goodman-AdventuresofaGoodMan-177-min.jpg", alt: "Doi Suthep Temple with Golden Pagoda", section: "Tour Overview" },

  // Wat Phra That Doi Suthep section (3-5)
  { src: "https://ext.same-assets.com/1724479225/546619074.jpeg", alt: "Wat Phra That Doi Suthep Golden Temple", section: "Wat Phra That Doi Suthep" },
  { src: "https://ext.same-assets.com/1724479225/1079670815.jpeg", alt: "Interior of Doi Suthep Temple", section: "Wat Phra That Doi Suthep" },
  { src: "https://ext.same-assets.com/1724479225/3581731489.jpeg", alt: "Temple Complex and Buddha Statues", section: "Wat Phra That Doi Suthep" },

  // Doi Suthep Viewpoints section (6-7)
  { src: "https://ext.same-assets.com/1724479225/2052331963.jpeg", alt: "Panoramic view from Doi Suthep", section: "Doi Suthep Viewpoints" },
  { src: "https://ext.same-assets.com/1724479225/3744876550.jpeg", alt: "Observatory deck viewpoint", section: "Doi Suthep Viewpoints" },

  // Bhubing Palace section (8-9)
  { src: "https://ext.same-assets.com/1724479225/2001921226.jpeg", alt: "Bhubing Palace gardens", section: "Bhubing Palace" },
  { src: "https://ext.same-assets.com/1724479225/412938749.jpeg", alt: "Suan Suwaree rose garden", section: "Bhubing Palace" },

  // Phalat Temple section (10-12)
  { src: "https://ext.same-assets.com/1724479225/3395174220.jpeg", alt: "Phalat Temple hidden in jungle", section: "Phalat Temple (The Secret Temple)" },
  { src: "https://ext.same-assets.com/1724479225/4044248315.jpeg", alt: "Jungle temple architecture", section: "Phalat Temple (The Secret Temple)" },
  { src: "https://ext.same-assets.com/1724479225/3011592610.jpeg", alt: "Secret temple meditation area", section: "Phalat Temple (The Secret Temple)" },

  // Hmong Village section (13-15)
  { src: "https://ext.same-assets.com/1724479225/2471215108.jpeg", alt: "Hmong village traditional life", section: "Hmong Village" },
  { src: "https://ext.same-assets.com/1724479225/1494839615.jpeg", alt: "Children in traditional Hmong clothing", section: "Hmong Village" },
  { src: "https://ext.same-assets.com/1724479225/1727090647.jpeg", alt: "Hmong village flower gardens", section: "Hmong Village" },
];

// Group images by section for rendering
const sections = [
  { name: "Tour Overview", startIndex: 0, count: 3 },
  { name: "Wat Phra That Doi Suthep", startIndex: 3, count: 3 },
  { name: "Doi Suthep Viewpoints", startIndex: 6, count: 2 },
  { name: "Bhubing Palace", startIndex: 8, count: 2 },
  { name: "Phalat Temple (The Secret Temple)", startIndex: 10, count: 3 },
  { name: "Hmong Village", startIndex: 13, count: 3 },
];

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initialIndex = parseInt(searchParams.get('image') || '0', 10);
  const tourTitle = searchParams.get('tour') || 'Tour Gallery';

  // Aggressive multi-attempt scroll for reliability
  useEffect(() => {
    if (initialIndex === 0) return;

    const scrollToImage = () => {
      const element = imageRefs.current[initialIndex];
      if (!element) return;

      const elementTop = element.offsetTop;

      // Check if this is the first image in a section (excluding "Tour Overview")
      const isFirstInSection = sections.some(section =>
        section.startIndex === initialIndex && section.name !== "Tour Overview"
      );

      // Determine if we're on desktop/web (768px and above)
      const isDesktop = window.innerWidth >= 768;

      // Desktop: First image of non-hero sections needs 90px offset for section header (results in ~95px visual), others need 45px
      // Mobile: First hero image (index 0) needs 0px, first image of non-hero sections needs 70px offset, others need 20px
      let offset;
      if (isDesktop) {
        offset = isFirstInSection ? 90 : 45;
      } else {
        // Mobile
        if (initialIndex === 0) {
          offset = 0; // First hero image has no offset
        } else if (isFirstInSection) {
          offset = 70; // First image of non-hero sections
        } else {
          offset = 20; // All other images
        }
      }

      const targetScroll = Math.max(0, elementTop - offset);

      window.scrollTo({
        top: targetScroll,
        behavior: 'instant' as ScrollBehavior,
      });
    };

    // Multiple attempts to handle loading and rendering delays
    const timers = [
      setTimeout(scrollToImage, 50),
      setTimeout(scrollToImage, 150),
      setTimeout(scrollToImage, 300),
      setTimeout(scrollToImage, 500),
    ];

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [initialIndex]);

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-black transition-colors z-10 group animate-slide-in-left"
        style={{
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)',
          top: 'calc(24px + env(safe-area-inset-top, 0px))',
          left: 'calc(24px + env(safe-area-inset-left, 0px))',
        }}
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
      </button>

      {/* Gallery content */}
      <div
        ref={containerRef}
        className="w-full"
        style={{
          paddingTop: 'max(80px, calc(60px + env(safe-area-inset-top, 0px)))',
          paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="mx-auto px-4" style={{ maxWidth: '1190px' }}>
          {/* Tour Title */}
          <h1 className="mb-8 md:mb-12 text-center">
            <div className={`text-lg md:text-3xl text-[#000000] font-semibold ${dmSans.className}`} style={{lineHeight: 0, fontWeight: 600}}>
              {(() => {
                // Split the tour title intelligently
                const lastWordIndex = tourTitle.lastIndexOf(' ');
                const lastTwoWordsIndex = tourTitle.lastIndexOf(' ', lastWordIndex - 1);
                const firstPart = tourTitle.substring(0, lastTwoWordsIndex);
                const secondPart = tourTitle.substring(lastTwoWordsIndex + 1);
                return firstPart || "Discover the Magic of";
              })()}
            </div>
            <div className={`text-6xl md:text-[5.25rem] font-bold text-[#000000] ${dmSerifDisplay.className}`} style={{marginBottom: 0, lineHeight: 1.3}}>
              {(() => {
                const lastWordIndex = tourTitle.lastIndexOf(' ');
                const lastTwoWordsIndex = tourTitle.lastIndexOf(' ', lastWordIndex - 1);
                const secondPart = tourTitle.substring(lastTwoWordsIndex + 1);
                return secondPart || "Doi Suthep";
              })()}
            </div>
          </h1>

          {sections.map((section, sectionIdx) => {
            const sectionImages = tourImages.slice(section.startIndex, section.startIndex + section.count);

            return (
              <div key={sectionIdx}>
                {/* Section Header - hide for "Tour Overview" */}
                {section.name !== "Tour Overview" && (
                  <h2 className="text-2xl font-bold text-[#433D3F] mb-6 md:mb-8 text-center">
                    {section.name}
                  </h2>
                )}

                {/* Section Images */}
                <div
                  className={`flex flex-col gap-[25px] md:gap-[50px] ${sectionIdx < sections.length - 1 ? 'mb-[40px] md:mb-[80px]' : ''}`}
                >
                  {sectionImages.map((image, imageIdx) => {
                    const globalIndex = section.startIndex + imageIdx;
                    return (
                      <div
                        key={globalIndex}
                        className="w-full"
                        ref={(el) => { imageRefs.current[globalIndex] = el; }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto block"
                          style={{ maxWidth: '1190px' }}
                          loading={globalIndex === initialIndex ? "eager" : "lazy"}
                          crossOrigin="anonymous"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <GalleryContent />
    </Suspense>
  );
}
