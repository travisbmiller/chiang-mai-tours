"use client";

import { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInSection({ children, className = "", delay = 0 }: FadeInSectionProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isInView
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
