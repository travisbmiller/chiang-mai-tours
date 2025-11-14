"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Star, Users, Clock, MapPin, Check, Globe, Car, User, Phone, ChevronLeft, ChevronRight, ChevronDown, HelpCircle, Menu, X, CheckCircle2, XCircle, AlertCircle, Info, PlusCircle, Building2, Coins } from "lucide-react";
import { ImageSlider } from "@/components/ImageSlider";
import { DatePicker } from "@/components/DatePicker";
import { HeroCollage } from "@/components/HeroCollage";
import { TourHighlightCollage } from "@/components/TourHighlightCollage";
import { PriceDetailModal } from "@/components/PriceDetailModal";
import { dmSerifDisplay, dmSans } from "@/lib/fonts";
import useDetectScroll from '@smakss/react-scroll-direction';

// Gallery image type definition
type GalleryImage = {
  src: string;
  alt: string;
  aspect: 'portrait' | 'landscape' | 'square';
};

// Gallery images array - Happy travelers from Chiang Mai tours
const galleryImages: GalleryImage[] = [
  { src: "https://images.pexels.com/photos/2133989/pexels-photo-2133989.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Happy travelers exploring Thailand", aspect: "landscape" },
  { src: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Tourists at temple", aspect: "portrait" },
  { src: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Group of friends traveling", aspect: "square" },
  { src: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Comfortable van interior", aspect: "square" },
  { src: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Mountain views and dining", aspect: "square" },
  { src: "https://images.pexels.com/photos/2412606/pexels-photo-2412606.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Family tour group", aspect: "landscape" },
  { src: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Happy travelers at destination", aspect: "portrait" },
  { src: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Tour pickup service", aspect: "portrait" },
  { src: "https://images.pexels.com/photos/2033343/pexels-photo-2033343.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Travel group photo", aspect: "landscape" },
  { src: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Travelers at airport", aspect: "portrait" },
  { src: "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Enjoying local cuisine", aspect: "landscape" },
  { src: "https://images.pexels.com/photos/2102934/pexels-photo-2102934.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Temple visit memories", aspect: "portrait" },
  { src: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Adventure with guide", aspect: "portrait" }
];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [includeMorningAlms, setIncludeMorningAlms] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("overview");
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [tourCardsAnimated, setTourCardsAnimated] = useState(false);
  const [loadedTourCards, setLoadedTourCards] = useState<Set<string>>(new Set());
  const mobileBookingCardRef = useRef<HTMLDivElement>(null);
  const [isPriceDetailOpen, setIsPriceDetailOpen] = useState(false);
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(true);
  const [isEnhanceExpanded, setIsEnhanceExpanded] = useState(false);
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [isFAQExpanded, setIsFAQExpanded] = useState(false);
  const [openFAQSections, setOpenFAQSections] = useState<Set<string>>(new Set());
  const [isTourPricingExpanded, setIsTourPricingExpanded] = useState(false);
  const [isImportantToKnowExpanded, setIsImportantToKnowExpanded] = useState(false);
  const [isGoodToKnowExpanded, setIsGoodToKnowExpanded] = useState(false);
  const [isAdditionalInfoExpanded, setIsAdditionalInfoExpanded] = useState(false);
  const [hasScrolledPastBookingCard, setHasScrolledPastBookingCard] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use scroll direction detection library
  const { scrollDir } = useDetectScroll();
  const ourToursRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const morningAlmsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const goodToKnowRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const tourName = "Discover the Magic of Doi Suthep";
  const phoneNumber = "66809755467"; // WhatsApp number from original website

  // Breadcrumb mapping based on current section
  const breadcrumbMap = {
    overview: ["Tours", "Doi Suthep"],
    highlights: ["Tours", "Doi Suthep", "What you can expect"],
    plan: ["Tours", "Doi Suthep", "Itinerary"],
    goodToKnow: ["Tours", "Doi Suthep", "Information"],
    ourTours: ["Tours", "All Tours"],
    gallery: ["Tours", "Doi Suthep", "Gallery"]
  };

  // Hero image array
  const heroImages = [
    {
      src: "https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg",
      alt: "Wat Phra That Doi Suthep Golden Temple"
    },
    {
      src: "https://shippedaway.com/wp-content/uploads/2024/01/Wat-Phra-That-Doi-Suthep-Chiang-Mai-Thailand-11.jpg",
      alt: "Golden Temple Details and Statues"
    },
    {
      src: "https://adventuresofagoodman.com/wp-content/uploads/2009/07/Wat_Doi_Suthep-Chiang_Mai_Thailand-Greg_Goodman-AdventuresofaGoodMan-177-min.jpg",
      alt: "Doi Suthep Temple with Golden Pagoda"
    }
  ];

  // Tour highlight image arrays
  const doiSuthepImages = [
    { src: "https://ext.same-assets.com/1724479225/546619074.jpeg", alt: "Wat Phra That Doi Suthep Golden Temple" },
    { src: "https://ext.same-assets.com/1724479225/1079670815.jpeg", alt: "Interior of Doi Suthep Temple" },
    { src: "https://ext.same-assets.com/1724479225/3581731489.jpeg", alt: "Temple Complex and Buddha Statues" }
  ];

  const viewpointsImages = [
    { src: "https://ext.same-assets.com/1724479225/2052331963.jpeg", alt: "Panoramic view from Doi Suthep" },
    { src: "https://ext.same-assets.com/1724479225/3744876550.jpeg", alt: "Observatory deck viewpoint" }
  ];

  const bhubingPalaceImages = [
    { src: "https://ext.same-assets.com/1724479225/2001921226.jpeg", alt: "Bhubing Palace gardens" },
    { src: "https://ext.same-assets.com/1724479225/412938749.jpeg", alt: "Suan Suwaree rose garden" }
  ];

  const phalatTempleImages = [
    { src: "https://ext.same-assets.com/1724479225/3395174220.jpeg", alt: "Phalat Temple hidden in jungle" },
    { src: "https://ext.same-assets.com/1724479225/4044248315.jpeg", alt: "Jungle temple architecture" },
    { src: "https://ext.same-assets.com/1724479225/3011592610.jpeg", alt: "Secret temple meditation area" }
  ];

  const hmongVillageImages = [
    { src: "https://ext.same-assets.com/1724479225/2471215108.jpeg", alt: "Hmong village traditional life" },
    { src: "https://ext.same-assets.com/1724479225/1494839615.jpeg", alt: "Children in traditional Hmong clothing" },
    { src: "https://ext.same-assets.com/1724479225/1727090647.jpeg", alt: "Hmong village flower gardens" }
  ];

  const morningAlmsImages = [
    { src: "https://ext.same-assets.com/1724479225/3960511834.jpeg", alt: "Morning monk alms ceremony" },
    { src: "https://ext.same-assets.com/1724479225/489226038.jpeg", alt: "Offering food to monks" },
    { src: "https://ext.same-assets.com/1724479225/2224682422.jpeg", alt: "Traditional alms giving" }
  ];

  // Combine all tour images in order: hero -> doi suthep -> viewpoints -> bhubing -> phalat -> hmong -> morning alms
  const allTourImages = [
    ...heroImages,
    ...doiSuthepImages,
    ...viewpointsImages,
    ...bhubingPalaceImages,
    ...phalatTempleImages,
    ...hmongVillageImages,
    ...morningAlmsImages
  ];

  // Calculate starting indices for each section
  const heroStartIndex = 0;
  const doiSuthepStartIndex = heroImages.length;
  const viewpointsStartIndex = doiSuthepStartIndex + doiSuthepImages.length;
  const bhubingPalaceStartIndex = viewpointsStartIndex + viewpointsImages.length;
  const phalatTempleStartIndex = bhubingPalaceStartIndex + bhubingPalaceImages.length;
  const hmongVillageStartIndex = phalatTempleStartIndex + phalatTempleImages.length;
  const morningAlmsStartIndex = hmongVillageStartIndex + hmongVillageImages.length;

  // Define sections for the gallery
  const gallerySections = [
    { name: "Tour Overview", startIndex: heroStartIndex, count: heroImages.length },
    { name: "Wat Phra That Doi Suthep", startIndex: doiSuthepStartIndex, count: doiSuthepImages.length },
    { name: "Doi Suthep Viewpoints", startIndex: viewpointsStartIndex, count: viewpointsImages.length },
    { name: "Bhubing Palace", startIndex: bhubingPalaceStartIndex, count: bhubingPalaceImages.length },
    { name: "Phalat Temple (The Secret Temple)", startIndex: phalatTempleStartIndex, count: phalatTempleImages.length },
    { name: "Hmong Village", startIndex: hmongVillageStartIndex, count: hmongVillageImages.length },
    { name: "Morning Monk Alms", startIndex: morningAlmsStartIndex, count: morningAlmsImages.length }
  ];

  // Dynamic column distribution utility
  const distributeImagesIntoColumns = (images: GalleryImage[], numberOfColumns: number) => {
    const columns: Array<GalleryImage[]> = Array.from({ length: numberOfColumns }, () => []);
    const columnHeights = Array(numberOfColumns).fill(0);

    images.forEach((image) => {
      let estimatedHeight = 300;
      if (image.aspect === 'portrait') {
        estimatedHeight = 400;
      } else if (image.aspect === 'landscape') {
        estimatedHeight = 250;
      } else if (image.aspect === 'square') {
        estimatedHeight = 300;
      }
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[shortestColumnIndex].push(image);
      columnHeights[shortestColumnIndex] += estimatedHeight + 24;
    });

    return columns;
  };

  const distributeImagesAcrossColumns = (images: GalleryImage[], screenSize: 'mobile' | 'sm' | 'md' | 'lg' | 'xl') => {
    const columnCounts = {
      mobile: 2,
      sm: 3,
      md: 4,
      lg: 4,
      xl: 5
    };

    const numColumns = columnCounts[screenSize];
    const columns: Array<GalleryImage[]> = Array.from({ length: numColumns }, () => []);
    const columnHeights = Array(numColumns).fill(0);

    images.forEach((image) => {
      let estimatedHeight = 300;
      switch (image.aspect) {
        case 'portrait':
          estimatedHeight = 400;
          break;
        case 'landscape':
          estimatedHeight = 250;
          break;
        case 'square':
          estimatedHeight = 300;
          break;
        default:
          estimatedHeight = 300;
      }
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[shortestColumnIndex].push(image);
      columnHeights[shortestColumnIndex] += estimatedHeight + 24;
    });

    return columns;
  };

  const getCurrentScreenSize = () => {
    if (typeof window === 'undefined') return 'lg';
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    return 'xl';
  };

  const [imageColumns, setImageColumns] = useState<Array<GalleryImage[]>>([]);

  useEffect(() => {
    const handleResize = () => {
      const screenSize = getCurrentScreenSize();
      setImageColumns(distributeImagesAcrossColumns(galleryImages, screenSize));
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => new Set(prev).add(imageSrc));
  };

  const handleBookingClick = () => {
    const params = new URLSearchParams({
      tour: tourName,
      adults: adults.toString(),
      children: children.toString(),
      morningAlms: includeMorningAlms.toString(),
      phone: phoneNumber,
    });

    if (selectedDate) {
      params.append('date', selectedDate.toISOString());
    }

    window.location.href = `/booking?${params.toString()}`;
  };

  const tourCards = useMemo(() => [
    {
      title: "The Best of Pai",
      image: "https://ext.same-assets.com/1724479225/1107748643.jpeg",
      slug: "best-of-pai",
      description: "Explore the charming mountain town of Pai with its stunning viewpoints and relaxed atmosphere."
    },
    {
      title: "Explore Doi Inthanon",
      image: "https://ext.same-assets.com/1724479225/1824608977.jpeg",
      slug: "doi-inthanon",
      description: "Visit Thailand's highest peak with beautiful waterfalls and hill tribe villages."
    },
    {
      title: "Chiang Rai & Golden Triangle",
      image: "https://ext.same-assets.com/1724479225/1045343540.jpeg",
      slug: "chiang-rai-golden-triangle",
      description: "Discover the cultural treasures of northern Thailand and the historic Golden Triangle."
    },
    {
      title: "Sukhothai Adventure",
      image: "https://ext.same-assets.com/1724479225/3417072831.jpeg",
      slug: "sukhothai-adventure",
      description: "Journey through the ancient ruins of Thailand's first capital city."
    }
  ], []);

  const handleTourCardClick = useCallback((tour: typeof tourCards[0]) => {
    alert(`Navigating to ${tour.title} tour page...\n\n${tour.description}\n\nIn a real implementation, this would route to: /tours/${tour.slug}`);
  }, []);

  const renderTourCard = (tour: typeof tourCards[0], index: string | number) => {
    const cardId = `${tour.slug}-${index}`;
    const isLoaded = loadedTourCards.has(cardId);
    const shouldEagerLoad = true;
    const isHighPriority = typeof index === 'string' && index === 'original-0';

    return (
    <div
      key={index}
      className="group relative rounded-xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      style={{
        width: '300px',
        height: '200px',
        willChange: 'transform',
        contain: 'layout style paint'
      }}
      onClick={() => handleTourCardClick(tour)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTourCardClick(tour);
        }
      }}
      aria-label={`View ${tour.title} tour details`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-400/50 rounded-full"></div>
            <div className="w-24 h-3 bg-gray-400/50 rounded"></div>
          </div>
        </div>
      )}
      <img
        src={tour.image}
        alt={tour.title}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={shouldEagerLoad ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isHighPriority ? "high" : "auto"}
        onLoad={(e) => {
          setLoadedTourCards(prev => new Set(prev).add(cardId));
          const target = e.target as HTMLImageElement;
          target.style.opacity = '1';
        }}
        onError={(e) => {
          setLoadedTourCards(prev => new Set(prev).add(cardId));
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-sm text-gray-200 mb-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Click to explore →
        </p>
        <h3 className="text-lg font-bold text-white group-hover:text-yellow-200 transition-colors duration-200">{tour.title}</h3>
      </div>
    </div>
    );
  };

  const cardWidth = 324;
  const totalCards = 4;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const startOffset = cardWidth * totalCards - 10;
    container.scrollLeft = startOffset;

    let isResetting = false;

    const handleScroll = () => {
      if (isResetting) return;

      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (scrollLeft <= 0) {
        isResetting = true;
        const originalBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = cardWidth * totalCards * 2 - cardWidth - 10;
        setTimeout(() => {
          container.style.scrollBehavior = originalBehavior;
          isResetting = false;
        }, 50);
      }
      else if (scrollLeft >= maxScroll - 10) {
        isResetting = true;
        const originalBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = startOffset;
        setTimeout(() => {
          container.style.scrollBehavior = originalBehavior;
          isResetting = false;
        }, 50);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [cardWidth, totalCards]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const preloadedUrls = new Set<string>();

    const preloadImages = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      const startIndex = Math.floor(scrollLeft / cardWidth);
      const visibleCount = Math.ceil(containerWidth / cardWidth);

      const cardsToLoad: typeof tourCards = [];
      for (let i = startIndex - 2; i < startIndex + visibleCount + 2; i++) {
        const cardIndex = i % totalCards;
        if (cardIndex >= 0 && cardIndex < tourCards.length) {
          const tour = tourCards[cardIndex];
          if (!preloadedUrls.has(tour.image)) {
            cardsToLoad.push(tour);
          }
        }
      }

      if (cardsToLoad.length > 0) {
        const preloadTask = () => {
          cardsToLoad.forEach((tour) => {
            const img = new Image();
            img.src = tour.image;
            preloadedUrls.add(tour.image);
          });
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(preloadTask, { timeout: 2000 });
        } else {
          setTimeout(preloadTask, 0);
        }
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    let lastScrollTime = 0;
    const throttleDelay = 200;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          lastScrollTime = Date.now();
          preloadImages();
        }, throttleDelay);
        return;
      }

      lastScrollTime = now;
      preloadImages();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    setTimeout(preloadImages, 500);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [cardWidth, totalCards, tourCards]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || tourCardsAnimated) return;

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const easeOutSilky = (t: number): number => {
      const expo = easeOutExpo(t);
      const cubic = easeOutCubic(t);
      return expo * 0.7 + cubic * 0.3;
    };

    const animateScroll = (
      from: number,
      to: number,
      duration: number,
      onComplete?: () => void
    ) => {
      const startTime = performance.now();
      const distance = to - from;

      const scroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easeOutSilky(progress);
        const scrollPosition = from + (distance * easedProgress);

        container.scrollLeft = scrollPosition;

        if (progress < 1) {
          requestAnimationFrame(scroll);
        } else if (onComplete) {
          onComplete();
        }
      };

      requestAnimationFrame(scroll);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !tourCardsAnimated) {
            setTourCardsAnimated(true);

            container.style.scrollBehavior = 'auto';
            const finalPosition = cardWidth * totalCards - 10;
            const startPosition = finalPosition - (cardWidth * 0.8);
            container.scrollLeft = startPosition;

            setTimeout(() => {
              animateScroll(startPosition, finalPosition, 1600, () => {
                container.style.scrollBehavior = 'auto';
              });
            }, 300);
          }
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -10% 0px' }
    );

    if (ourToursRef.current) {
      observer.observe(ourToursRef.current);
    }

    return () => observer.disconnect();
  }, [tourCardsAnimated, cardWidth, totalCards]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavOpen) {
        setIsNavOpen(false);
      }
    };

    if (isNavOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isNavOpen]);

  // Fix mobile viewport height issues for iOS Safari and Chrome
  useEffect(() => {
    // Function to set the viewport height custom property
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on mount
    setVh();

    // Update on resize (throttled to avoid too many repaints)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setVh, 150);
    };

    window.addEventListener('resize', handleResize);

    // Also listen to orientationchange for mobile devices
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', setVh);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Track if user has scrolled past the booking card
  useEffect(() => {
    const checkScrollPosition = () => {
      if (mobileBookingCardRef.current) {
        const cardBottom = mobileBookingCardRef.current.getBoundingClientRect().bottom;
        const scrolledPast = cardBottom < 0;
        setHasScrolledPastBookingCard(scrolledPast);
      }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition(); // Initial check

    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setCurrentSection(sectionId);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    const sections = [
      { ref: heroImageRef, id: 'overview' },
      { ref: highlightsRef, id: 'highlights' },
      { ref: planRef, id: 'plan' },
      { ref: goodToKnowRef, id: 'goodToKnow' },
      { ref: ourToursRef, id: 'ourTours' },
      { ref: galleryRef, id: 'gallery' }
    ];

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute('data-section', id);
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const toggleFAQSection = (section: string) => {
    setOpenFAQSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1120px'}}>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">CM</span>
              </div>
              <span className="text-xl font-bold text-[#000000]">Chiang Mai Private Tours</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNavOpen(true)}
                className="p-2 text-gray-600 hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-md"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 w-80 sm:w-96 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isNavOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">CM</span>
              </div>
              <span className="text-lg font-bold text-[#000000]">Menu</span>
            </div>
            <button
              onClick={() => setIsNavOpen(false)}
              className="p-2 text-gray-600 hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-md"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-[#000000] mb-4">Private Tours</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="block text-[#000000] hover:text-rose-600 hover:bg-gray-100 transition-all duration-300 py-2 px-3 -mx-3 rounded-xl"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <div>
                        <div>Doi Suthep</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: 4-6 Hours • 5 Stops
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-[#000000] hover:text-rose-600 hover:bg-gray-100 transition-all duration-300 py-2 px-3 -mx-3 rounded-xl"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <div>
                        <div>Doi Inthanon</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: Full Day • 8 Stops
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-[#000000] hover:text-rose-600 hover:bg-gray-100 transition-all duration-300 py-2 px-3 -mx-3 rounded-xl"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <div>
                        <div>Best of Pai</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: Full Day • 6 Stops
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-[#000000] hover:text-rose-600 hover:bg-gray-100 transition-all duration-300 py-2 px-3 -mx-3 rounded-xl"
                      onClick={() => setIsNavOpen(false)}
                    >
                      <div>
                        <div>Chiang Rai & Golden Triangle</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: Full Day • 5 Stops
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-[#000000] hover:text-rose-600 hover:bg-gray-100 transition-all duration-300 py-2 px-3 -mx-3 rounded-xl"
                      onClick={() => setIsNavOpen(false)}
                    >
                      Sukhothai
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000000] mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="block text-[#000000] hover:text-rose-600 hover:bg-gray-100 transition-all duration-300 py-2 px-3 -mx-3 rounded-xl"
                      onClick={() => setIsNavOpen(false)}
                    >
                      About Us
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#000000] mb-4">Contact Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <Phone className="w-5 h-5 text-rose-600" />
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-[#000000] hover:text-rose-600 transition-colors duration-150"
                    >
                      +66 809 755 467
                    </a>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setIsNavOpen(false);
                        handleBookingClick();
                      }}
                      className="w-full bg-[#000000] hover:bg-[#1a1a1a] text-white mt-4 rounded-xl transition-colors duration-150 ease-out"
                    >
                      Request Booking
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fade Up Animation */}
      <div className="animate-fade-up">
      <div className="hidden bg-gray-50 py-2">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1120px'}}>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbMap[currentSection as keyof typeof breadcrumbMap]?.map((crumb, index, arr) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className={`transition-colors duration-200 ${
                    index === arr.length - 1
                      ? 'text-[#000000] font-medium'
                      : 'text-gray-500 hover:text-[#000000]'
                  }`}
                >
                  {crumb}
                </span>
                {index < arr.length - 1 && (
                  <span className="text-gray-400">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2" style={{maxWidth: '1120px'}}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <h1 className="text-center lg:text-left">
            <div className={`text-lg md:text-3xl text-[#000000] font-semibold ${dmSans.className}`} style={{lineHeight: 0, fontWeight: 600}}>Discover the Magic of</div>
            <div className={`text-6xl md:text-[5.25rem] font-bold text-[#000000] ${dmSerifDisplay.className}`} style={{marginBottom: 0, lineHeight: 1.3}}>Doi Suthep</div>
          </h1>

          <div className="flex items-center gap-4 justify-center mb-4 lg:mb-0">
            <div className="text-center">
              <div className="text-xs md:text-lg font-bold text-[#000000]">4-6 hrs</div>
              <div className="text-[10px] md:text-xs text-gray-500">Duration</div>
            </div>
            <div className="border-l border-gray-300 h-8"></div>
            <div className="text-center">
              <div className="text-xs md:text-lg font-bold text-[#000000]">5</div>
              <div className="text-[10px] md:text-xs text-gray-500">Stops</div>
            </div>
            <div className="border-l border-gray-300 h-8"></div>
            <div className="text-center">
              <div className="text-xs md:text-lg font-bold text-[#000000]">Private</div>
              <div className="text-[10px] md:text-xs text-gray-500">Tour Type</div>
            </div>
            <div className="border-l border-gray-300 h-8"></div>
            <div className="text-center">
              <div className="text-xs md:text-lg font-bold text-[#000000]">Chiang Mai</div>
              <div className="text-[10px] md:text-xs text-gray-500">Depart / Return</div>
            </div>
            <div className="border-l border-gray-300 h-8"></div>
            <div className="text-center">
              <div className="text-xs md:text-lg font-bold text-[#000000]">English</div>
              <div className="text-[10px] md:text-xs text-gray-500">Language</div>
            </div>
          </div>
        </div>
      </div>

      <div ref={heroImageRef} className="w-full mx-auto px-0 md:px-4 md:sm:px-6 md:lg:px-8 md:mt-2" style={{maxWidth: '1120px'}}>
        <HeroCollage
          images={heroImages}
          totalImageCount={allTourImages.length}
          tourTitle={tourName}
        />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 relative" style={{maxWidth: '1120px'}}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Description</h2>
              <div className="prose max-w-none">
                <p className="text-[#000000] leading-relaxed">
                  If you're visiting Chiang Mai, Doi Suthep (Wat Phratat Doi Suthep) is a must-see temple. I've designed this tour so you won't miss any of the fantastic highlights that Doi Suthep has to offer.
                </p>
                <p className="text-[#000000] leading-relaxed mt-4">
                  We'll start with the amazing Wat Phratat Doi Suthep (The Golden Temple), take in views from multiple viewpoints, have an unforgettable experience with the children of the Hmong Tribe, visit a royal palace, and explore Phalat Temple surrounded by jungle. Doi Suthep is about 15 km from Chiang Mai city.
                </p>
              </div>
            </div>

            {/* Mobile Booking Card - Only visible on mobile */}
            <div ref={mobileBookingCardRef} className="lg:hidden pb-8">
              <div className="bg-white p-6 rounded-xl relative z-10" style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.15)' }}>
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className={`text-base text-[#000000] ${dmSans.className}`}>Discover the Magic of</div>
                      <div className={`text-4xl font-bold text-[#000000] ${dmSerifDisplay.className}`}>Doi Suthep</div>
                    </div>
                    <img
                      src="https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg"
                      alt="Doi Suthep Temple"
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  </div>

                  <div className="space-y-2">
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 flex-1 text-left">
                        {adults === 1 && children === 0 ? "1 Adult" : `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`}
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
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                              >
                                <span className="text-lg leading-none">−</span>
                              </button>
                              <div className="w-8 text-center font-medium text-[#000000]">{adults}</div>
                              <button
                                type="button"
                                onClick={() => setAdults(Math.min(10, adults + 1))}
                                disabled={adults >= 10}
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
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
                                className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                              >
                                <span className="text-lg leading-none">−</span>
                              </button>
                              <div className="w-8 text-center font-medium text-[#000000]">{children}</div>
                              <button
                                type="button"
                                onClick={() => setChildren(Math.min(10, children + 1))}
                                disabled={children >= 10}
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

                  <div>
                    <div className="text-xs text-gray-600 font-bold mb-2">Tour add-on</div>
                    <div className="flex items-center justify-between px-4 py-3 border-2 border-yellow-400 rounded-xl">
                      <label htmlFor="morning-alms-mobile" className="text-[#000000] font-medium cursor-pointer flex-1">
                        Morning Monk Alms
                      </label>
                      <input
                        id="morning-alms-mobile"
                        type="checkbox"
                        checked={includeMorningAlms}
                        onChange={(e) => setIncludeMorningAlms(e.target.checked)}
                        className="w-5 h-5 border-2 border-yellow-400 rounded"
                        style={{ accentColor: '#EAB308' }}
                      />
                    </div>
                  </div>
                  </div>

                  <div className="flex items-end justify-between pt-6">
                    <div>
                      <div className="text-xl font-bold text-[#000000]">
                        Total <span className="text-xs font-normal text-gray-500">/ Baht</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#000000] leading-none" style={{ marginBottom: '-6px' }}>
                        {(() => {
                          const guests = adults + children;
                          const basePrice = 1500;
                          const guestsTotal = guests * basePrice;
                          const morningAlmsAddon = includeMorningAlms ? 500 : 0;
                          const almsOffering = includeMorningAlms ? guests * 100 : 0;
                          return (guestsTotal + morningAlmsAddon + almsOffering).toLocaleString();
                        })()}
                      </div>
                      <button
                        onClick={() => setIsPriceDetailOpen(true)}
                        className="text-xs text-gray-600 underline hover:text-[#000000]"
                      >
                        Price detail
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full py-6 bg-[#000000] hover:bg-[#1a1a1a] text-white text-lg rounded-full transition-colors duration-150 ease-out mt-5"
                    onClick={handleBookingClick}
                  >
                    Request Booking
                  </Button>
                </div>
              </div>
            </div>

            {/* Meet Chet Section */}
            <div className="pb-8">
              <div className="border border-gray-200 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Photo - Left side */}
                  <div className="flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="Chet, your guide"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>

                  {/* Content - Right side */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#000000] mb-3">
                      Meet Chet, Your Driver
                    </h3>

                    <p className="text-[#000000] leading-relaxed mb-4 italic">
                      "Hello! I'm Chet. For over ten years I've driven travelers up Doi Suthep, but sunrise never loses its beauty. Watching the golden temple glow in the morning light is always unforgettable. I'll show you quiet corners and stories that reveal the true spirit of this sacred mountain."
                    </p>

                    <a
                      href="/about"
                      className="text-[#000000] hover:text-[#1a1a1a] font-medium text-sm inline-flex items-center gap-1 transition-colors"
                    >
                      More about Chet & his family
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* What you can expect */}
            <div ref={highlightsRef} className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsHighlightsExpanded(!isHighlightsExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">Tour highlights</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isHighlightsExpanded ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ${isHighlightsExpanded ? 'max-h-[10000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-16">
                  {/* Wat Phra That Doi Suthep */}
                  <div className="space-y-6">
                    <TourHighlightCollage
                      images={doiSuthepImages}
                      startIndex={doiSuthepStartIndex}
                      tourTitle={tourName}
                    />
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-[#000000]">Wat Phra That Doi Suthep</h3>
                      <p className="text-[#000000] leading-relaxed">
                        The holiest shrine in Northern Thailand, Wat Phra That Doi Suthep first began construction in 1386 under King Kuena and was completed within a few years. The building was an incredible task, with workers having to carry supplies through the thick jungle.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        It's 15 kilometers from the city of Chiang Mai and sits at an elevation of 1,073 meters, with 306 steps to reach the golden temple. The temple contains a relic of Buddha's shoulder bone. This golden temple is known for its picturesque sunrise and sunset views over the city.
                      </p>
                      <p className="text-sm text-gray-600 mt-4">
                        <strong>Optional Additional Costs:</strong> Cable car to temple - THB 50
                      </p>
                    </div>
                  </div>

                  {/* Doi Suthep Viewpoints */}
                  <div className="space-y-6">
                    <TourHighlightCollage
                      images={viewpointsImages}
                      startIndex={viewpointsStartIndex}
                      tourTitle={tourName}
                    />
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-[#000000]">Doi Suthep Viewpoints</h3>
                      <p className="text-[#000000] leading-relaxed">
                        The incredible viewpoints of Doi Suthep reveal the abundant jungle surrounding the ever-changing city of Chiang Mai below. The first viewpoint you stop at on the way to Doi Suthep is a well-needed resting point for bikers and runners to take in the magnificent view.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        The observatory deck's open area is perfect for taking in and capturing the incredible natural environment over Chiang Mai. Once you get to Doi Suthep temple, the 2nd viewpoint is around the backside of the temple, giving you another impressive angle of the enormous city below.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        If you are open to an early morning, both these viewpoints are spectacular for sunrise photography and capturing memorable moments.
                      </p>
                    </div>
                  </div>

                  {/* Bhubing Palace */}
                  <div className="space-y-6">
                    <TourHighlightCollage
                      images={bhubingPalaceImages}
                      startIndex={bhubingPalaceStartIndex}
                      tourTitle={tourName}
                    />
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-[#000000]">Bhubing Palace</h3>
                      <p className="text-[#000000] leading-relaxed">
                        The palace is officially named Phra Tamnak Phu Phing, and more commonly goes by Bhubing Palace. It was built in 1961 to house the royal family during state visits to Chiang Mai, located in the mountains overlooking Chiang Mai to take advantage of the crisp mountain air.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        The palace grounds are open to the public except when the royal family comes to visit. The serene area around the palace is covered in beautiful vegetation and peaceful paths. One of the main attractions is the enchanting rose garden named Suan Suwaree.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        The mountain's cool climate allows these exotic species to grow with vibrant colors and intoxicating smells.
                      </p>
                    </div>
                  </div>

                  {/* Phalat Temple */}
                  <div className="space-y-6">
                    <TourHighlightCollage
                      images={phalatTempleImages}
                      startIndex={phalatTempleStartIndex}
                      tourTitle={tourName}
                    />
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-[#000000]">Phalat Temple (The Secret Temple)</h3>
                      <p className="text-[#000000] leading-relaxed">
                        Wat Phra Lat was constructed in 1355 after King Kuena's white elephant died at the site of Wat Doi Suthep, and he ordered the construction of temples where it perished and where it took breaks to rest. People call it the magical secret temple of Chiang Mai.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        The reason behind this is because it's been lost in the lush jungle surrounding it. The temple was originally used as a resting place for people on their journey up the mountain to worship at Wat Phra That Doi Suthep.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        Later on, the location became a meditation retreat and a residence for monks. Wat Phra Lat has a uniqueness that other temples do not provide due to the jungle overtaking it - it's a must-see temple.
                      </p>
                    </div>
                  </div>

                  {/* Hmong Village */}
                  <div className="space-y-6">
                    <TourHighlightCollage
                      images={hmongVillageImages}
                      startIndex={hmongVillageStartIndex}
                      tourTitle={tourName}
                    />
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-[#000000]">Hmong Village</h3>
                      <p className="text-[#000000] leading-relaxed">
                        This village is located at the top of Doi Suthep and is home to the Hmong hill tribe, which is one of the six hill tribes in Thailand. The village has a beautiful flower garden and a small bamboo forest you can explore.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        The tribal people of this village are trying to maintain their culture, and they wear their tribal clothes, including the children. You can watch the school kids play a traditional game with a spinning ball and hand out snacks to them.
                      </p>
                      <p className="text-[#000000] leading-relaxed">
                        This authentic cultural experience provides insight into traditional hill tribe life and their efforts to preserve their heritage in the modern world.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Morning Monk Alms - Additional Highlight */}
            <div ref={morningAlmsRef} className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsEnhanceExpanded(!isEnhanceExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl font-bold text-[#000000]">Optional tour add-on</h3>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isEnhanceExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isEnhanceExpanded ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div>
                  <div className="mb-8">
                    <div className={`text-2xl text-gray-600 -mb-[2px] ${dmSans.className}`}>Experience morning</div>
                    <h3 className={`text-5xl font-bold text-[#000000] ${dmSerifDisplay.className}`}>Monk Alms</h3>
                  </div>

                  {/* Image Collage */}
                  <div className="w-full mb-8">
                    <TourHighlightCollage
                      images={morningAlmsImages}
                      startIndex={morningAlmsStartIndex}
                      tourTitle={tourName}
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[#000000] leading-relaxed">
                      Begin your day with an ancient tradition. As dawn breaks over Chiang Mai and the city still rests in soft silence, you'll step into one of Thailand's most spiritual and timeless ceremonies, the Morning Monk Alms, known as "Tak Bat."
                    </p>
                    <p className="text-[#000000] leading-relaxed">
                      I'll take you to a local morning market, where you'll select offerings such as fresh fruit, sticky rice, or simple essentials that monks rely on for their daily sustenance. The gentle rhythm of early morning life unfolds around you: the aroma of steaming rice, locals arranging flowers, and the sound of temple bells echoing faintly in the distance.
                    </p>
                    <p className="text-[#000000] leading-relaxed">
                      From there, we'll make our way to a quiet roadside where orange-robed monks walk in single file, barefoot and serene, carrying alms bowls. As the golden light of sunrise touches the streets, I'll show you the proper way to give your offering, bowing in gratitude as you place food into each monk's bowl.
                    </p>
                    <p className="text-[#000000] leading-relaxed">
                      This tradition dates back to the 14th century and remains an essential act of merit-making in Thai Buddhism. Locals wake before sunrise to prepare their gifts, not out of obligation, but from devotion and joy. Participating in this ceremony offers a rare glimpse into the heart of Thai spirituality, a quiet moment of humility, mindfulness, and connection.
                    </p>

                    <div className="pt-4 space-y-2">
                      <p className="text-[#000000]">
                        <strong>Additional Cost:</strong> 100 Baht per person for offerings
                      </p>
                      <p className="text-[#000000]">
                        <strong>Tour Surcharge:</strong> 500 Baht added to tour price
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsPlanExpanded(!isPlanExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">Itinerary</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isPlanExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isPlanExpanded ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="text-base text-gray-600 mb-6 space-y-4">
                <p>
                  Your journey begins with a warm welcome from me, I'll pick you up directly from your hotel in a comfortable, air-conditioned vehicle.
                </p>
                <p>
                  As we wind our way through mountain roads and sacred landscapes, I'll share local stories, cultural insights, and even help you learn a few Thai phrases along the way. This <strong>private tour</strong> is all about comfort, connection, and discovery, giving you the freedom to truly absorb the beauty of each temple, royal garden, and breathtaking viewpoint that make Doi Suthep one of Chiang Mai's most meaningful experiences.
                </p>
                <p>
                  Below is how our journey will unfold, each stop revealing another layer of Chiang Mai's spirit, from its golden temples to its quiet mountain air.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#000000] mb-2">Flexible Starting Time</h3>
                    <p className="text-[#000000]">
                      If you'd like to experience the beauty of sunrise at Doi Suthep, just let me know when booking. It will require an early morning departure, but it's truly unforgettable.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#000000] mb-2">Hotel Pickup</h3>
                    <p className="text-[#000000]">
                      I'll pick you up anywhere in <strong>Chiang Mai</strong>. I'll confirm your exact pickup time and location when you book. If you're staying outside the city center (more than 10km from Old City), please contact me to confirm pickup availability.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 border border-amber-200 rounded-xl bg-amber-50/50 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <PlusCircle className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-semibold text-[#000000]">Morning Monk Alms</h3>
                      <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">Additional Cost</span>
                    </div>
                    <p className="text-[#000000]">
                      Join a sacred Thai tradition at sunrise. Visit a local market, prepare offerings, and give alms to Buddhist monks as they walk their morning route.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#000000] mb-2">Wat Phra That Doi Suthep - The Golden Temple</h3>
                    <p className="text-[#000000]">
                      Visit the most sacred temple in Northern Thailand, perched high on Doi Suthep Mountain about 15 km from Chiang Mai, roughly a 45-minute drive from the city.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#000000] mb-2">Spectacular Viewpoints</h3>
                    <p className="text-[#000000]">
                      Stop at incredible viewpoints revealing abundant jungle surrounding Chiang Mai below. Perfect for sunrise photography and capturing memorable moments of your mountain journey.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#000000] mb-2">Royal Palace & Gardens</h3>
                    <p className="text-[#000000]">
                      Visit Bhubing Palace with its enchanting rose garden Suan Suwaree, where exotic species grow in the cool mountain climate with vibrant colors and intoxicating smells.
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* What's included */}
            <div ref={goodToKnowRef} className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsGoodToKnowExpanded(!isGoodToKnowExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">What's included</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isGoodToKnowExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isGoodToKnowExpanded ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-8">
                  {/* Included Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#000000] mb-3">Included in your tour</h3>
                    <div className="space-y-2">
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">English Speaking Driver</div>
                        <p className="text-xs text-gray-600 mt-0.5">I can help you learn Thai if you wish</p>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Hotel Pick Up & Drop Off</div>
                        <p className="text-xs text-gray-600 mt-0.5">I'll pick you up and drop you off right at your hotel</p>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Entrance Fees</div>
                        <p className="text-xs text-gray-600 mt-0.5">Entrance fees for <strong>Wat Phra That Doi Suthep</strong> and <strong>Bhubing Palace</strong> are included in the tour price.</p>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Private Transportation</div>
                        <p className="text-xs text-gray-600 mt-0.5">You'll have a comfortable air-conditioned car or van just for your group</p>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">No Rushing</div>
                        <p className="text-xs text-gray-600 mt-0.5">Take your time at the places you love—this is your tour</p>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">No Additional Transportation Fees</div>
                        <p className="text-xs text-gray-600 mt-0.5">Fuel & Mileage included in cost</p>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50/50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Drinking Water</div>
                        <p className="text-xs text-gray-600 mt-0.5">I'll keep you hydrated—Thailand can get hot!</p>
                      </div>
                    </div>
                  </div>

                  {/* Not Included Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#000000] mb-3">Not included</h3>
                    <div className="space-y-2">
                      <div className="border-l-4 border-gray-400 bg-gray-50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Meals & Snacks</div>
                        <p className="text-xs text-gray-600 mt-0.5">Meals aren't included, but I'm happy to stop anytime for local food or refreshments. Expect to spend around 100–200 baht per person.</p>
                      </div>
                      <div className="border-l-4 border-gray-400 bg-gray-50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Licensed Guide</div>
                        <p className="text-xs text-gray-600 mt-0.5">If you'd like a licensed professional guide, I can arrange that for 1,000 to 1,500 Baht.</p>
                      </div>
                      <div className="border-l-4 border-gray-400 bg-gray-50 pl-3 py-2 rounded-lg">
                        <div className="text-sm font-medium text-[#000000]">Temple Wear</div>
                        <p className="text-xs text-gray-600 mt-0.5">Please bring appropriate clothing for temple entrance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour pricing */}
            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsTourPricingExpanded(!isTourPricingExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">Tour pricing</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isTourPricingExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isTourPricingExpanded ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Base Tour Price</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#000000]">Price per person</span>
                      <span className="text-2xl font-bold text-[#000000]">฿1,500</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      All-inclusive private tour with English-speaking driver, hotel pickup & drop-off, entrance fees to Doi Suthep Temple and Bhubing Palace, bottled water, and transportation.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Optional Add-ons</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-[#000000]">Morning Monk Alms Experience</span>
                        <span className="text-lg font-bold text-[#000000]">฿500 + ฿100/person</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Tour surcharge of ฿500 plus ฿100 per person for offerings
                      </p>
                    </div>

                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-[#000000]">Licensed Professional Guide</span>
                        <span className="text-lg font-bold text-[#000000]">฿1,000 - ฿1,500</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Optional upgrade for in-depth historical and cultural commentary
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Additional Costs (Pay Directly)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#000000]">Cable car at Doi Suthep (optional)</span>
                      <span className="font-semibold text-[#000000]">฿50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#000000]">Meals & snacks</span>
                      <span className="font-semibold text-[#000000]">฿100 - ฿200/person</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#000000] mb-2">Example Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#000000]">2 Adults × ฿1,500</span>
                      <span className="text-[#000000]">฿3,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#000000]">Morning Monk Alms (tour surcharge)</span>
                      <span className="text-[#000000]">฿500</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#000000]">Alms offerings (2 × ฿100)</span>
                      <span className="text-[#000000]">฿200</span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 mt-2 flex justify-between items-center">
                      <span className="font-bold text-[#000000]">Total</span>
                      <span className="text-2xl font-bold text-[#000000]">฿3,700</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Important to know */}
            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsImportantToKnowExpanded(!isImportantToKnowExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">Important to know</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isImportantToKnowExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isImportantToKnowExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4">
                  <p className="text-[#000000] leading-relaxed">
                    When visiting temples, palaces and royal sites in Thailand, modest clothing is <strong>required</strong> as a sign of respect. Shoulders and knees must be covered before entering. If you plan to wear shorts or a sleeveless top, you will need to bring a light sarong or scarf to use as a cover.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsFAQExpanded(!isFAQExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">Frequently asked questions</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isFAQExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isFAQExpanded ? 'max-h-[20000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-8">
                {/* Category 1: Booking & Scheduling */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Booking & Scheduling</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 1 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq1')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What time does the tour start?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq1') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq1') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          The tour is completely flexible and can start at any time that works for you. Most guests prefer to start early in the morning (around 8-9 AM) to avoid the midday heat and crowds. However, I'm happy to accommodate your schedule. If you'd like to experience the beauty of sunrise at Doi Suthep, just let me know when booking and we can arrange an early morning departure. Just tell me your preferred pickup time when booking.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 2 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq2')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Where do you pick me up?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq2') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq2') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          I'll pick you up anywhere in Chiang Mai. Most guests are picked up from their hotel, guesthouse, or Airbnb. I'll confirm your exact pickup time and location when you book. If you're staying outside the city center (more than 10km from Old City), please contact me to confirm pickup availability. I'll meet you right at your accommodation, so you don't have to worry about finding a meeting point.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 3 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq3')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">How long is the tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq3') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq3') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          The typical tour duration is 4-6 hours, depending on how much time you'd like to spend at each location. Because this is a private tour, we can adjust the pace to match your preferences. If you want to spend more time at Doi Suthep taking photos or exploring Bhubing Palace gardens, that's completely fine! If you add the Morning Monk Alms experience, the tour will start earlier and be slightly longer to accommodate the ceremony.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 4 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq4')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Do I need to pay a deposit?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq4') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq4') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          No deposit is required to reserve your tour. I operate on trust and understand that travelers prefer flexibility. You can pay the full amount in cash at the end of your tour, or we can arrange online payment if you prefer. I accept Thai Baht, US Dollars, and digital payment methods like bank transfer or mobile banking apps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 2: Tour Details */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Tour Details</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 5 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq5')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Is this really a private tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq5') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq5') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes! This tour is 100% private, meaning it's just you, your travel companions, and me as your driver. You won't be joined by strangers or other tourists. You'll have a dedicated vehicle (car or van depending on your group size) all to yourself. This gives you complete freedom to customize the itinerary, take as much time as you want at each stop, and enjoy a personal, intimate experience of Doi Suthep.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 6 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq6')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What's the difference between a driver and a licensed guide?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq6') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq6') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          I'm an English-speaking driver who knows Doi Suthep intimately—I've been driving this route for over ten years. I'll share local stories, cultural insights, and help you navigate the temples. However, I'm not a licensed professional tour guide. If you want in-depth historical commentary and detailed explanations at every site, I can arrange for a licensed guide to join us for an additional 1,000-1,500 baht. Most guests find that my local knowledge and personal insights are more than enough for a wonderful experience.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 7 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq7')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">How many steps are there at Doi Suthep?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq7') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq7') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          There are 306 steps to reach the golden temple at Wat Phra That Doi Suthep. The staircase is beautiful, lined with intricate Naga serpent railings, but it can be challenging for some visitors. If you prefer not to climb the steps, there's an optional cable car (funicular) available for 50 baht per person that takes you directly to the temple entrance. I'll let you know about this option when we arrive, and you can decide what works best for you.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 8 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq8')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Is this tour suitable for elderly people or people with mobility issues?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq8') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq8') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes, the tour can be adapted for elderly guests or those with mobility issues. The cable car at Doi Suthep eliminates the need to climb 306 steps. At Bhubing Palace, the gardens have paved paths, though there are some gentle slopes. I can adjust our pace and provide as many rest stops as needed. If you have specific mobility concerns, please let me know when booking so I can plan the best route and stops for your comfort. The tour is not wheelchair accessible, but strollers are allowed.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 9 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq9')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Can children join this tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq9') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq9') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Absolutely! Children are very welcome on the tour. This is a family-friendly experience with stops that kids typically enjoy—the golden temple, meeting Hmong village children, exploring gardens, and scenic viewpoints. Children under 12 are charged the same rate as adults (1,500 baht per person). I can adjust the pace and activities to suit families with young children. Car seats and booster seats can be provided upon request at no extra charge—just let me know when booking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 3: What to Bring & Wear */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">What to Bring & Wear</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 10 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq10')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What should I wear?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq10') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq10') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          When visiting temples and royal sites in Thailand, modest clothing is required as a sign of respect. Your shoulders and knees must be covered. I recommend wearing lightweight, breathable clothing like loose pants or a long skirt, and a t-shirt or blouse that covers your shoulders. Comfortable walking shoes are important. If you want to wear shorts or a tank top for the journey, just bring a sarong or scarf to cover up when entering the temples. You'll need to remove your shoes before entering temple buildings, so slip-on shoes are convenient.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 11 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq11')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What should I bring on the tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq11') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq11') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Here's what I recommend bringing: sunscreen (the mountain sun can be strong), a hat or sunglasses, a light jacket or sweater (it's cooler at higher elevations), your camera or smartphone for photos, and any personal medications. I'll provide bottled water throughout the day. If you're doing the Morning Monk Alms, wear comfortable clothes you can easily kneel in. Bring some cash for optional expenses like the cable car (50 baht), meals, or souvenirs at the Hmong village.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 12 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq12')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Will I need cash during the tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq12') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq12') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes, bring some Thai Baht for personal expenses. Entrance fees to Doi Suthep and Bhubing Palace are included in your tour price, but you may want cash for: the optional cable car (50 baht), meals or snacks (100-200 baht per person), souvenirs or handicrafts at the Hmong village, small temple donations if you wish, and payment for the tour itself at the end (unless we've arranged online payment). I recommend bringing at least 500-1,000 baht per person for the day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 4: Weather & Best Time */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Weather & Best Time</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 13 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq13')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What if it rains on my tour day?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq13') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq13') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          The tour runs rain or shine! Light rain can actually make the jungle and temples even more beautiful, and I'll provide umbrellas if needed. If there's heavy rain or unsafe weather conditions, I'll contact you in advance to discuss rescheduling or adjusting the itinerary. You can also reschedule up to 24 hours before the tour if the weather forecast looks unfavorable. The mountains can be unpredictable, so I always check conditions and prioritize your safety and comfort.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 14 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq14')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What's the best time of day/year to visit Doi Suthep?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq14') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq14') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          The best time of year is November to February during the cool season—clear skies, comfortable temperatures, and stunning views. March to May is hot season (but beautiful), and June to October is rainy season (lush and green but occasional rain). As for time of day, early morning (7-9 AM) offers cooler temperatures, fewer crowds, and the possibility of seeing sunrise. Late afternoon can also be beautiful for sunset views. I've been driving this route for over ten years, and honestly, Doi Suthep is magical at any time of day or year!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 5: Temple Etiquette & Culture */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Temple Etiquette & Culture</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 15 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq15')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What's the proper etiquette at Buddhist temples?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq15') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq15') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          I'll guide you through everything, but here are the basics: Remove your shoes before entering temple buildings. Dress modestly with shoulders and knees covered. Speak quietly and move calmly. Don't point your feet toward Buddha images (sit with legs to the side or crossed). Women should not touch monks or hand items directly to them. You can make offerings or donations if you wish, but it's not required. Photography is usually allowed, but I'll let you know if certain areas are restricted. Most importantly, show respect—these are active places of worship.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 16 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq16')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Can women participate in the Morning Monk Alms?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq16') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq16') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes, absolutely! Women can and do participate in the Morning Monk Alms ceremony. The only rule is that women should not touch the monks or their robes. When giving offerings, you'll kneel or stand to the side, and the monk will lower his alms bowl slightly so you can place food inside without physical contact. I'll show you exactly how to do this respectfully. This ancient tradition welcomes everyone regardless of gender, and it's a beautiful spiritual experience for all participants.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 6: Food & Meals */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Food & Meals</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 17 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq17')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Is lunch included?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq17') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq17') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Meals are not included in the tour price, but I'm happy to recommend great local restaurants or stop anywhere you'd like to eat. Expect to spend around 100-200 baht per person for a delicious Thai meal. I know all the best spots for authentic Northern Thai cuisine—from family-run restaurants near the temples to hidden gems that serve amazing khao soi (curry noodles), som tam (papaya salad), and other regional specialties. If you have dietary restrictions or preferences (vegetarian, halal, etc.), just let me know and I'll recommend suitable places.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 18 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq18')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Will there be bathroom stops?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq18') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq18') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes, there are clean bathroom facilities at most stops on the tour. Doi Suthep Temple, Bhubing Palace, and the Hmong Village all have restrooms available. If you need a bathroom break at any other time during the tour, just let me know and I can stop at a restaurant, café, or gas station along the way. Your comfort is my priority, so never hesitate to ask for a stop whenever you need one.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 7: Photography */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Photography</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 19 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq19')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Can I take photos at the temples?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq19') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq19') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes! Photography is generally allowed and encouraged at all the temples and sites we visit. The golden temple at Doi Suthep is absolutely stunning and perfect for photos. However, there may be certain areas inside temple buildings where photography is restricted—I'll point these out to you. When photographing monks, it's polite to ask permission first. During the Morning Monk Alms ceremony, you can take photos but should do so quietly and respectfully without interrupting the ceremony. I'm happy to help you find the best photo spots and angles!
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 20 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq20')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Will the driver take photos of us?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq20') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq20') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Absolutely! I'm happy to take as many photos of you and your group as you'd like throughout the tour. I know all the best spots for stunning photos—the golden pagoda, the viewpoints overlooking Chiang Mai, the beautiful gardens at Bhubing Palace, and more. Just hand me your camera or phone and I'll capture your memories. After doing this for over ten years, I've gotten pretty good at finding the perfect angles and lighting!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 8: Morning Monk Alms Add-On */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Morning Monk Alms Add-On</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 21 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq21')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What exactly is the Morning Monk Alms ceremony?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq21') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq21') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          The Morning Monk Alms, called "Tak Bat" in Thai, is a sacred Buddhist tradition dating back to the 14th century. Each morning at dawn, monks walk barefoot in single file carrying alms bowls, and local people kneel to offer food and essentials. It's an act of merit-making and spiritual connection. If you choose this add-on, I'll take you to a local morning market where you'll select offerings (sticky rice, fruit, simple foods), then we'll go to a quiet roadside where monks walk their route. I'll show you the proper way to give offerings respectfully. It's a truly moving, authentic cultural experience.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 22 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq22')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Is the Morning Monk Alms ceremony just for tourists?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq22') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq22') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          No, this is a completely authentic ceremony that local Thai Buddhists participate in every single morning as part of their spiritual practice. It's not staged or created for tourists. When you participate, you'll be joining local people who wake before sunrise to prepare offerings out of devotion and joy. I take you to areas where locals practice this tradition, not tourist-heavy zones. However, it's important to be respectful—this is their sacred ritual, and we're privileged guests. By participating properly with my guidance, you're honoring Thai Buddhist culture in a meaningful way.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 9: Comparison Questions */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Comparison Questions</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 23 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq23')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What's the difference between this tour and a group tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq23') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq23') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          With a group tour, you're on a fixed schedule with 10-20 strangers, rushing through each stop to stay on time. With my private tour, it's just you and your companions with complete flexibility. Want to spend an extra 30 minutes at the golden temple taking photos? No problem. Need a bathroom break or want to skip a location? Your choice. You can customize the itinerary, start time, and pace. Plus, you get personal attention, local insights, and the freedom to have private conversations and make spontaneous stops. It's a completely different, much more intimate experience.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 24 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq24')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Can I just take a Grab/taxi to Doi Suthep myself?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq24') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq24') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Yes, you could take a Grab or taxi to just Doi Suthep temple itself, but you'd miss out on so much! My tour shows you five incredible stops that most visitors never see: the secret Phalat Temple hidden in jungle, Bhubing Palace gardens, multiple breathtaking viewpoints, and the authentic Hmong village experience. You'd also need to arrange separate transportation for each location. With my tour, you get a local expert who knows the best times to visit each site, hidden photo spots, cultural context, and stories that bring everything to life. Plus, it's often similar in price when you factor in multiple taxi rides.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 10: Miscellaneous */}
                <div>
                  <h3 className="text-xl font-bold text-[#000000] mb-4">Miscellaneous</h3>
                  <div className="space-y-4">
                    {/* FAQ Item 25 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq25')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Do I need to book in advance?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq25') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq25') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          While I try to accommodate last-minute bookings, I highly recommend booking at least 2-3 days in advance, especially during peak tourist season (November to February). This ensures I'm available on your preferred date and can plan the best experience for you. If you need a tour on short notice, contact me anyway—I'll do my best to make it work! Booking early also gives us time to discuss any special requests, dietary needs, or customizations you'd like.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 26 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq26')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What if I'm traveling solo?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq26') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq26') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Solo travelers are absolutely welcome! Many of my guests travel alone and enjoy having a private tour with personal attention. The price is still 1,500 baht per person (so 1,500 baht total for one person), which is a great value for a completely private 4-6 hour tour with door-to-door transportation. Traveling solo means you have even more flexibility to customize the tour exactly how you want it, and I'm happy to share stories and conversation during the drive.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 27 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq27')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">Is tipping expected?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq27') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq27') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          Tipping is not required or expected, but it's always appreciated if you feel I provided great service. In Thailand, tipping tour drivers is not as common as in some Western countries, so there's absolutely no obligation. If you enjoyed your tour and want to leave a tip, a typical amount would be 200-500 baht, but again, this is completely optional. Your kind reviews and recommendations to other travelers mean just as much to me!
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 28 */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq28')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">What if someone in our group doesn't want to do the full tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq28') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq28') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          No problem at all! Since this is a private tour, we can be completely flexible. If someone in your group prefers to wait in the vehicle at certain stops, stay at a café while others explore, or skip certain locations entirely, that's perfectly fine. For example, if climbing the temple steps is too challenging for someone, they can wait comfortably in the air-conditioned vehicle or take the cable car while others climb. I'm here to make sure everyone in your group has the experience they want.
                        </p>
                      </div>
                    </div>

                    {/* FAQ Item 29 */}
                    <div className="pb-4">
                      <button
                        onClick={() => toggleFAQSection('faq29')}
                        className="w-full flex items-start justify-between text-left group"
                      >
                        <h4 className="text-base font-semibold text-[#000000] pr-4">How do I communicate with you before/during the tour?</h4>
                        <ChevronDown className={`w-5 h-5 text-[#000000] flex-shrink-0 mt-1 transition-transform duration-300 ${openFAQSections.has('faq29') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFAQSections.has('faq29') ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-700 leading-relaxed">
                          After you submit a booking request, I'll contact you via WhatsApp, email, or LINE messenger (whichever you prefer) to confirm your booking and answer any questions. WhatsApp is usually the easiest for quick communication. I speak English well, so you can message me anytime before your tour with questions or special requests. On the day of your tour, you'll have my phone number and can call or message me directly. I'm very responsive and want to make sure you feel comfortable and informed every step of the way.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Additional information */}
            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setIsAdditionalInfoExpanded(!isAdditionalInfoExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold text-[#000000]">Additional information</h2>
                <ChevronDown className={`w-6 h-6 text-[#000000] transition-transform duration-300 ${isAdditionalInfoExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${isAdditionalInfoExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4">
                  <ul className="space-y-3 text-[#000000] list-disc list-inside">
                    <li>Booking confirmation will be sent via email, WhatsApp Messenger, or LINE Messenger</li>
                    <li>Most travelers can participate</li>
                    <li>Children must be accompanied by an adult</li>
                    <li>Please wear comfortable walking shoes</li>
                    <li>This tour is completely private. Your group will have a dedicated vehicle, ensuring a personal and flexible experience.</li>
                  </ul>

                  <div className="mt-6">
                    <h3 className="font-bold text-[#000000] mb-3">Accessibility</h3>
                    <ul className="space-y-3 text-[#000000] list-disc list-inside">
                      <li>Not wheelchair accessible</li>
                      <li>Stroller accessible</li>
                      <li>Infants must sit on laps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24" id="booking-section">
                <div className="bg-white p-6 rounded-xl relative z-10" style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.15)' }}>
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className={`text-base text-[#000000] ${dmSans.className}`}>Discover the Magic of</div>
                        <div className={`text-4xl font-bold text-[#000000] ${dmSerifDisplay.className}`}>Doi Suthep</div>
                      </div>
                      <img
                        src="https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg"
                        alt="Doi Suthep Temple"
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    </div>

                    <div className="space-y-2">
                    <DatePicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                    />

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <Users className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 flex-1 text-left">
                          {adults === 1 && children === 0 ? "1 Adult" : `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`}
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
                                  className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                                >
                                  <span className="text-lg leading-none">−</span>
                                </button>
                                <div className="w-8 text-center font-medium text-[#000000]">{adults}</div>
                                <button
                                  type="button"
                                  onClick={() => setAdults(Math.min(10, adults + 1))}
                                  disabled={adults >= 10}
                                  className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
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
                                  className="w-7 h-7 rounded-full border-2 border-[#000000] flex items-center justify-center text-[#000000] disabled:border-gray-300 disabled:text-gray-300 hover:bg-[#000000] hover:text-white disabled:hover:bg-transparent disabled:hover:text-gray-300"
                                >
                                  <span className="text-lg leading-none">−</span>
                                </button>
                                <div className="w-8 text-center font-medium text-[#000000]">{children}</div>
                                <button
                                  type="button"
                                  onClick={() => setChildren(Math.min(10, children + 1))}
                                  disabled={children >= 10}
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

                    <div>
                      <div className="text-xs text-gray-600 font-bold mb-2">Tour add-on</div>
                      <div className="flex items-center justify-between px-4 py-3 border-2 border-yellow-400 rounded-xl">
                        <label htmlFor="morning-alms-new" className="text-[#000000] font-medium cursor-pointer flex-1">
                          Morning Monk Alms
                        </label>
                        <input
                          id="morning-alms-new"
                          type="checkbox"
                          checked={includeMorningAlms}
                          onChange={(e) => setIncludeMorningAlms(e.target.checked)}
                          className="w-5 h-5 border-2 border-yellow-400 rounded"
                          style={{ accentColor: '#EAB308' }}
                        />
                      </div>
                    </div>
                    </div>

                    <div className="flex items-end justify-between pt-6">
                      <div>
                        <div className="text-xl font-bold text-[#000000]">
                          Total <span className="text-xs font-normal text-gray-500">/ Baht</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#000000] leading-none" style={{ marginBottom: '-6px' }}>
                          {(() => {
                            const guests = adults + children;
                            const basePrice = 1500;
                            const guestsTotal = guests * basePrice;
                            const morningAlmsAddon = includeMorningAlms ? 500 : 0;
                            const almsOffering = includeMorningAlms ? guests * 100 : 0;
                            return (guestsTotal + morningAlmsAddon + almsOffering).toLocaleString();
                          })()}
                        </div>
                        <button
                          onClick={() => setIsPriceDetailOpen(true)}
                          className="text-xs text-gray-600 underline hover:text-[#000000]"
                        >
                          Price detail
                        </button>
                      </div>
                    </div>

                    <Button
                      className="w-full py-6 bg-[#000000] hover:bg-[#1a1a1a] text-white text-lg rounded-xl transition-colors duration-150 ease-out mt-5"
                      onClick={handleBookingClick}
                    >
                      Request Booking
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <div ref={ourToursRef} className="relative w-full">
        <div className="bg-gray-100 py-16">
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1120px'}}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-bold text-[#000000] mb-6">Our tours</h2>
                      <p className="text-base text-[#000000] max-w-md">
                        Discover amazing destinations and authentic experiences throughout Northern Thailand with our private tours.
                      </p>
                    </div>
                    <Button variant="outline" className="bg-transparent border-gray-300 text-[#000000] hover:bg-gray-900 hover:text-white">
                      View All Tours
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative -mt-20 pb-12">
                <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide overflow-y-visible scroll-smooth">
                  <div className="flex space-x-6 py-6 px-4" style={{width: 'max-content'}}>
                    {tourCards.map((tour, index) => renderTourCard(tour, `end-${index}`))}
                    {tourCards.map((tour, index) => renderTourCard(tour, `original-${index}`))}
                    {tourCards.map((tour, index) => renderTourCard(tour, `start-${index}`))}
                  </div>
                </div>

                <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1120px'}}>
                  <div className="flex justify-center items-center mt-4 space-x-4">
                    <button
                      onClick={scrollLeft}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <button
                      onClick={scrollRight}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

      <div ref={galleryRef} className="mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-16" style={{maxWidth: '1120px'}}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#000000] mb-6">Happy travelers</h2>
        </div>

        <div className="flex gap-6">
          {imageColumns.map((columnImages, columnIndex) => {
            let visibilityClass = "";
            if (columnIndex >= 2) visibilityClass = "hidden sm:flex";
            if (columnIndex >= 3) visibilityClass = "hidden md:flex";
            if (columnIndex >= 4) visibilityClass = "hidden xl:flex";

            return (
              <div
                key={`column-${columnIndex}`}
                className={`flex-1 flex-col space-y-6 ${visibilityClass || 'flex'}`}
              >
                {columnImages.map((image, imageIndex) => {
                  const isLoaded = loadedImages.has(image.src);
                  return (
                    <div key={`col${columnIndex}-img${imageIndex}`} className="relative">
                      {!isLoaded && (
                        <div className="w-full h-40 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                      )}
                      <img
                        src={image.src}
                        alt={image.alt}
                        className={`w-full rounded-xl transition-opacity duration-300 ${
                          isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                        }`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => handleImageLoad(image.src)}
                        onError={() => handleImageLoad(image.src)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="bg-gray-100 text-[#000000] border-t border-gray-200 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{maxWidth: '1120px'}}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#000000]">Private Tours</h3>
              <ul className="space-y-2 text-sm text-[#000000]">
                <li><a href="#" className="hover:text-[#000000]">Doi Suthep</a></li>
                <li><a href="#" className="hover:text-[#000000]">Doi Inthanon</a></li>
                <li><a href="#" className="hover:text-[#000000]">Best of Pai</a></li>
                <li><a href="#" className="hover:text-[#000000]">Chiang Rai & Golden Triangle</a></li>
                <li><a href="#" className="hover:text-[#000000]">Sukhothai</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#000000]">Company</h3>
              <ul className="space-y-2 text-sm text-[#000000]">
                <li><a href="#" className="hover:text-[#000000]">About Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#000000]">Contact Us</h3>
              <ul className="space-y-2 text-sm text-[#000000]">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+66 809 755 467</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Chiang Mai Private Tours. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
      {/* End Main Content Animation */}

      {/* Mobile Sticky Button - Shows when scrolling UP after passing booking card */}
      <div
        className={`md:hidden fixed left-4 right-4 z-50 transition-transform duration-300 ease-out ${
          scrollDir === 'up' && hasScrolledPastBookingCard ? 'translate-y-0' : 'translate-y-32'
        }`}
        style={{
          bottom: 'calc(15px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <Button
          className="w-full py-3 bg-[#000000] hover:bg-[#1a1a1a] text-white text-base font-semibold rounded-full shadow-lg transition-colors duration-150 ease-out"
          onClick={handleBookingClick}
        >
          Request Booking
        </Button>
      </div>

      <PriceDetailModal
        isOpen={isPriceDetailOpen}
        onClose={() => setIsPriceDetailOpen(false)}
        adults={adults}
        childrenCount={children}
        includeMorningAlms={includeMorningAlms}
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
        onAdultsChange={(count) => setAdults(count)}
        onChildrenChange={(count) => setChildren(count)}
        onMorningAlmsChange={(included) => setIncludeMorningAlms(included)}
      />


    </div>
  );
}
