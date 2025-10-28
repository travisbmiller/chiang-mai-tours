"use client";

import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroCollageProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  totalImageCount?: number;
  tourTitle?: string;
}

export function HeroCollage({ images, totalImageCount, tourTitle = 'Tour Gallery' }: HeroCollageProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (index: number) => {
    const encodedTitle = encodeURIComponent(tourTitle);
    router.push(`/gallery?image=${index}&tour=${encodedTitle}`);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <>
      {/* Desktop Grid Layout - 3 images */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-2 md:h-[500px]">
        {/* Large image on left - spans 2 columns */}
        <div
          className="relative overflow-hidden rounded-l-xl col-span-2 cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Two images stacked on right - 1 column */}
        <div className="grid grid-rows-2 gap-2">
          <div
            className="relative overflow-hidden rounded-tr-xl cursor-pointer"
            onClick={() => handleImageClick(1)}
          >
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div
            className="relative overflow-hidden rounded-br-xl cursor-pointer group"
            onClick={() => handleImageClick(2)}
          >
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Image Counter Button */}
            {totalImageCount && (
              <button
                className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white/80 hover:bg-white/90 text-[#000000] px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1.5 md:gap-2 transition-all duration-200 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(2);
                }}
              >
                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="font-medium text-xs md:text-sm">
                  <span className="md:hidden">{totalImageCount}</span>
                  <span className="hidden md:inline">View all {totalImageCount} photos</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Collage Layout - 3 images: 1 large on left, 2 stacked on right */}
      <div className="md:hidden">
        <div className="flex gap-1 h-[70vh] max-h-[500px]">
          {/* Large image on left */}
          <div
            className="relative w-[66%] cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Two images stacked on right */}
          <div className="flex flex-col w-[34%] gap-1">
            <div
              className="relative flex-1 cursor-pointer"
              onClick={() => handleImageClick(1)}
            >
              <img
                src={images[1].src}
                alt={images[1].alt}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div
              className="relative flex-1 cursor-pointer"
              onClick={() => handleImageClick(2)}
            >
              <img
                src={images[2].src}
                alt={images[2].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Image Counter Button on last image for mobile */}
              {totalImageCount && (
                <button
                  className="absolute bottom-3 right-3 bg-white/80 hover:bg-white/90 text-[#000000] px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 text-xs shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(2);
                  }}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="font-medium">{totalImageCount}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
