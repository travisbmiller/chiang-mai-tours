"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TourHighlightCollageProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  startIndex: number; // Starting index in the full gallery
  tourTitle?: string;
}

export function TourHighlightCollage({ images, startIndex, tourTitle = 'Tour Gallery' }: TourHighlightCollageProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (imageIndex: number) => {
    const encodedTitle = encodeURIComponent(tourTitle);
    router.push(`/gallery?image=${startIndex + imageIndex}&tour=${encodedTitle}`);
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

  // For 2 images layout
  if (images.length === 2) {
    return (
      <>
        {/* Desktop Grid Layout - 2 images */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-2 md:h-[400px]">
          <div
            className="relative overflow-hidden rounded-l-xl h-[400px] cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            className="relative overflow-hidden rounded-r-xl h-[400px] cursor-pointer"
            onClick={() => handleImageClick(1)}
          >
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Mobile Collage Layout - 2 images stacked vertically */}
        <div className="md:hidden -mx-4 sm:-mx-6">
          <div className="flex flex-col gap-1">
            <div
              className="relative w-full aspect-[16/9] cursor-pointer"
              onClick={() => handleImageClick(0)}
            >
              <img
                src={images[0].src}
                alt={images[0].alt}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div
              className="relative w-full aspect-[16/9] cursor-pointer"
              onClick={() => handleImageClick(1)}
            >
              <img
                src={images[1].src}
                alt={images[1].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // For 3+ images layout (similar to HeroCollage)
  return (
    <>
      {/* Desktop Grid Layout - 3 images */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-2 md:h-[400px]">
        {/* Large image on left - spans 2 columns */}
        <div
          className="relative overflow-hidden rounded-l-xl col-span-2 h-[400px] cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Two images stacked on right - 1 column */}
        <div className="grid grid-rows-2 gap-2 h-[400px]">
          <div
            className="relative overflow-hidden rounded-tr-xl min-h-0 cursor-pointer"
            onClick={() => handleImageClick(1)}
          >
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            className="relative overflow-hidden rounded-br-xl min-h-0 cursor-pointer"
            onClick={() => handleImageClick(2)}
          >
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Mobile Collage Layout - 3 images: 1 horizontal on top, 2 side by side below */}
      <div className="md:hidden -mx-4 sm:-mx-6">
        <div className="flex flex-col gap-1">
          {/* Horizontal image on top */}
          <div
            className="relative w-full aspect-[16/9] cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Two images side by side below */}
          <div className="flex gap-1">
            <div
              className="relative flex-1 aspect-square cursor-pointer"
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
              className="relative flex-1 aspect-square cursor-pointer"
              onClick={() => handleImageClick(2)}
            >
              <img
                src={images[2].src}
                alt={images[2].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
