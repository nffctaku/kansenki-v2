'use client';

import { useState, useEffect } from 'react';
import { LoadingAnimation } from './LoadingAnimation';

export const LoadingAnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoaded = sessionStorage.getItem('isLoaded');
    if (isLoaded) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('isLoaded', 'true');
      }, 2500); // Animation duration + delay
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {loading && <LoadingAnimation />}
      {children}
    </>
  );
};
