"use client";

import { useState, useRef, useEffect } from "react";

interface ImageSliderProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  className?: string;
}

export function ImageSlider({ images, className = "" }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Start with first image loaded

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoPlayDuration = 4000; // 4 seconds

  // Intersection Observer to detect when slider is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isVisible || images.length <= 1) {
      stopAutoPlay();
      return;
    }

    // Small delay to ensure clean state transitions
    const timer = setTimeout(() => {
      startAutoPlay();
    }, 50);

    return () => {
      clearTimeout(timer);
      stopAutoPlay();
    };
  }, [isVisible, currentIndex, images.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lazy loading: preload current and adjacent images
  useEffect(() => {
    const imagesToLoad = new Set<number>();

    // Always load current image
    imagesToLoad.add(currentIndex);

    // Load adjacent images for smooth transitions
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const nextIndex = (currentIndex + 1) % images.length;

    imagesToLoad.add(prevIndex);
    imagesToLoad.add(nextIndex);

    // If we have more than 3 images, also preload the next-next for auto-play
    if (images.length > 3) {
      const nextNextIndex = (currentIndex + 2) % images.length;
      imagesToLoad.add(nextNextIndex);
    }

    setLoadedImages(prev => {
      const newSet = new Set(prev);
      imagesToLoad.forEach(index => newSet.add(index));
      return newSet;
    });
  }, [currentIndex, images.length]);

  // Handle window resizing with debouncing
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (sliderRef.current) {
          // Recalculate position after resize
          const realIndex = currentIndex + 1;
          sliderRef.current.style.transform = `translateX(-${realIndex * 100}%)`;
        }
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const realIndex = currentIndex + 1; // Account for the duplicate image at start

    // Set the correct position
    slider.style.transform = `translateX(-${realIndex * 100}%)`;

    // Handle edge cases for smooth infinite loop
    const handleTransitionEnd = () => {
      if (realIndex === 0) {
        // We're showing the duplicate last image, jump to the real last image
        slider.style.transition = 'none';
        slider.style.transform = `translateX(-${images.length * 100}%)`;
        setTimeout(() => {
          slider.style.transition = 'transform 500ms ease-out';
        }, 50);
      } else if (realIndex === images.length + 1) {
        // We're showing the duplicate first image, jump to the real first image
        slider.style.transition = 'none';
        slider.style.transform = `translateX(-${1 * 100}%)`;
        setTimeout(() => {
          slider.style.transition = 'transform 500ms ease-out';
        }, 50);
      }
    };

    slider.addEventListener('transitionend', handleTransitionEnd);
    return () => slider.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, images.length]);

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = null;
    }
    setAutoPlayProgress(0);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    setAutoPlayProgress(0);

    // Progress animation (updates every 50ms)
    const progressStep = 50;
    const totalSteps = autoPlayDuration / progressStep;
    let step = 0;

    progressTimerRef.current = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      setAutoPlayProgress(progress);

      if (progress >= 1) {
        stopAutoPlay();
        // Use setState callback to get the latest currentIndex
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % images.length;
          return nextIndex;
        });
      }
    }, progressStep);
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;

    // Stop current auto-play and restart from new position
    stopAutoPlay();

    // Set new current index - this will trigger useEffect to restart auto-play
    setCurrentIndex(index);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoPlay();
    };
  }, []);

  // Arrow click handlers
  const handleLeftClick = () => {
    goToPrevious();
  };

  const handleRightClick = () => {
    goToNext();
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    // DON'T stop auto-play - let it continue running during touch
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    // Minimum swipe distance of 50px
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToNext(); // Swipe left -> next image
      } else {
        goToPrevious(); // Swipe right -> previous image
      }
      // Auto-play continues running - no need to restart
    }
    // Auto-play was never stopped, so no need to restart
  };

  if (images.length === 0) return null;

  // Extract height class
  const sizeClass = className.includes('aspect-')
    ? className.split(' ').find(cls => cls.startsWith('aspect-')) || 'h-64'
    : className.includes('h-')
    ? className.split(' ').find(cls => cls.startsWith('h-')) || 'h-64'
    : 'h-64';

  const otherClasses = className.replace(/(h-\w+|aspect-\[[\d\/]+\])/, '').trim();

  return (
    <div ref={containerRef} className={`relative w-full ${otherClasses}`}>
      {/* Main slider container */}
      <div
        className={`relative ${sizeClass} overflow-hidden bg-gray-100 select-none rounded-xl group`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image slider */}
        <div
          ref={sliderRef}
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(currentIndex + 1) * 100}%)`
          }}
        >
          {/* Render extended array for infinite loop */}
          {[
            images[images.length - 1], // Last image at start for infinite loop
            ...images, // All original images
            images[0] // First image at end for infinite loop
          ].map((image, index) => {
            // Calculate original image index for lazy loading
            let originalIndex: number;
            if (index === 0) {
              originalIndex = images.length - 1; // Last image
            } else if (index === images.length + 1) {
              originalIndex = 0; // First image
            } else {
              originalIndex = index - 1; // Regular images
            }

            const shouldLoad = loadedImages.has(originalIndex);

            return (
              <div
                key={`${index}-${image.src}`}
                className="w-full h-full flex-shrink-0"
              >
                {shouldLoad ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading={originalIndex === currentIndex ? "eager" : "lazy"}
                    onError={(e) => {
                      // Fallback for broken images
                      (e.target as HTMLImageElement).style.backgroundColor = '#f3f4f6';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Click zones - invisible left/right halves for navigation */}
        {images.length > 1 && (
          <>
            {/* Left half click zone */}
            <button
              onClick={handleLeftClick}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-transparent cursor-pointer z-10"
              aria-label="Previous image"
            />

            {/* Right half click zone */}
            <button
              onClick={handleRightClick}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-transparent cursor-pointer z-10"
              aria-label="Next image"
            />
          </>
        )}

        {/* Navigation arrows - desktop only, slide in on hover */}
        {images.length > 1 && (
          <>
            {/* Left arrow */}
            <button
              onClick={handleLeftClick}
              className="hidden md:flex absolute left-0 top-0 bottom-0 w-1/5 items-center justify-start pl-4 bg-transparent opacity-0 group-hover:opacity-100 transition-all group-hover:duration-300 group-hover:ease-out duration-500 ease-in delay-500 group-hover:delay-0 transform -translate-x-full group-hover:translate-x-0 z-20 pointer-events-none group-hover:pointer-events-auto"
              aria-label="Previous image"
            >
              <div className="w-8 h-8 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-all duration-200 shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>

            {/* Right arrow */}
            <button
              onClick={handleRightClick}
              className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/5 items-center justify-end pr-4 bg-transparent opacity-0 group-hover:opacity-100 transition-all group-hover:duration-300 group-hover:ease-out duration-500 ease-in delay-500 group-hover:delay-0 transform translate-x-full group-hover:translate-x-0 z-20 pointer-events-none group-hover:pointer-events-auto"
              aria-label="Next image"
            >
              <div className="w-8 h-8 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-all duration-200 shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </>
        )}

        {/* Progress indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-4 right-4 h-1 z-30">
            <div className="flex h-full space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className="flex-1 bg-white/30 rounded-full overflow-hidden relative cursor-pointer hover:bg-white/40 transition-colors"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to image ${index + 1}`}
                >
                  {/* Progress fill ONLY for current image */}
                  {index === currentIndex && isVisible && (
                    <div
                      className="h-full bg-white transition-all duration-75 ease-linear"
                      style={{ width: `${autoPlayProgress * 100}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}


      </div>


    </div>
  );
}
