"use client";

import { useEffect, useRef } from "react";
import { Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { X } from "lucide-react";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    src: string;
    alt: string;
  }>;
  initialIndex?: number;
  sections?: Array<{
    name: string;
    startIndex: number;
    count: number;
  }>;
}

export function ImageGalleryModal({ isOpen, onClose, images, initialIndex = 0, sections }: ImageGalleryModalProps) {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Aggressive multi-attempt scroll for iOS
  useEffect(() => {
    if (!isOpen || initialIndex === 0) return;

    const scrollToImage = () => {
      const element = imageRefs.current[initialIndex];
      const container = modalContainerRef.current;

      if (!element || !container) return;

      const elementTop = element.offsetTop;
      const offset = window.innerWidth < 768 ? 20 : 50;
      const targetScroll = Math.max(0, elementTop - offset);

      container.scrollTop = targetScroll;
    };

    // Try scrolling at multiple intervals - iOS needs this redundancy
    const timers = [
      setTimeout(scrollToImage, 50),
      setTimeout(scrollToImage, 150),
      setTimeout(scrollToImage, 300),
      setTimeout(scrollToImage, 500),
      setTimeout(scrollToImage, 800),
    ];

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isOpen, initialIndex]);

  // Group images by sections
  const renderContent = () => {
    if (!sections || sections.length === 0) {
      // No sections, render all images without headers
      return images.map((image, index) => (
        <div
          key={index}
          className="w-full"
          ref={(el) => { imageRefs.current[index] = el; }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto block"
            style={{ maxWidth: '1190px' }}
          />
        </div>
      ));
    }

    // Render images grouped by sections with headers
    return sections.map((section, sectionIdx) => {
      const sectionImages = images.slice(section.startIndex, section.startIndex + section.count);

      return (
        <div key={sectionIdx}>
          {/* Section Header - hide for "Tour Overview" */}
          {section.name !== "Tour Overview" && (
            <h2 className="text-2xl font-bold text-[#433D3F] mb-6 md:mb-8">
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
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {/* Close button - rendered outside Modal to avoid z-index stacking context issues */}
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-black transition-colors group"
          style={{
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)',
            top: isMobile ? 'max(70px, calc(24px + env(safe-area-inset-top, 0px)))' : '24px',
            right: isMobile ? 'calc(24px + env(safe-area-inset-right, 0px))' : '24px',
            zIndex: 10001,
            pointerEvents: 'auto',
            position: 'fixed',
          }}
          aria-label="Close gallery"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
        </button>
      )}

      <Modal
        opened={isOpen}
        onClose={onClose}
        fullScreen={isMobile}
        size="100%"
        padding={0}
        withCloseButton={false}
        styles={{
          body: {
            padding: 0,
            height: '100%',
          },
          content: {
            borderRadius: 0,
          },
          inner: {
            padding: 0,
          },
        }}
      >
        {/* Scrollable content */}
        <div
          ref={modalContainerRef}
          className="w-full h-full overflow-y-auto"
          style={{
            paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : 0,
            paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : 0,
            paddingLeft: isMobile ? 'env(safe-area-inset-left, 0px)' : 0,
            paddingRight: isMobile ? 'env(safe-area-inset-right, 0px)' : 0,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="mx-auto px-4 py-8 md:py-12" style={{ maxWidth: '1190px' }}>
            {renderContent()}
          </div>
        </div>
      </Modal>
    </>
  );
}
