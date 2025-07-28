import React, { useEffect, useRef, useState } from 'react';

const ResponsiveAd = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style = {},
  layoutKey = '-6t+ed+2i-1n-4w'
}) => {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;
  const adRef = useRef(null);
  const containerRef = useRef(null);
  const isLoaded = useRef(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Don't load if already loaded or missing required data
    if (isLoaded.current || !publisherId || !slot) {
      return;
    }
    
    // Check if we're in development mode
    const isDev = import.meta.env.DEV || 
                  import.meta.env.MODE === 'development' ||
                  window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('localhost');
    
    // Skip in development mode
    if (isDev) {
      return;
    }

    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          // Check if this specific ad slot is already loaded
          const existingAds = document.querySelectorAll(`ins[data-ad-slot="${slot}"]`);
          if (existingAds.length > 1) {
            console.warn(`Duplicate AdSense ad found for slot ${slot}`);
            return;
          }

          // Check if the current ad element already has content
          if (adRef.current.innerHTML.trim() !== '') {
            console.warn(`AdSense ad already loaded for slot ${slot}`);
            return;
          }

          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        }
      } catch (err) {
        console.warn('AdSense loading skipped:', err.message);
        setShouldHide(true);
      }
    };

    // Delay loading to prevent duplicate requests
    const timer = setTimeout(loadAd, 1000);
    return () => clearTimeout(timer);
  }, [publisherId, slot]);

  // Check if ad loaded successfully after attempting to load
  useEffect(() => {
    if (!isLoaded.current || !adRef.current) return;

    const checkAdLoad = () => {
      const adElement = adRef.current;
      if (!adElement) {
        setShouldHide(true);
        return;
      }

      // Check if ad has loaded content
      const hasContent = adElement.innerHTML.trim() !== '';
      const hasChildren = adElement.children.length > 0;
      const hasHeight = adElement.offsetHeight > 0;
      
      if (hasContent || hasChildren || hasHeight) {
        setAdLoaded(true);
      } else {
        // Ad failed to load, hide the container
        setShouldHide(true);
      }
    };

    // Check immediately and then after a delay
    const immediateCheck = setTimeout(checkAdLoad, 100);
    const delayedCheck = setTimeout(checkAdLoad, 3000);

    return () => {
      clearTimeout(immediateCheck);
      clearTimeout(delayedCheck);
    };
  }, [isLoaded.current]);

  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || 
                       import.meta.env.MODE === 'development' ||
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');

  // Don't render ads in development mode or if missing required props
  if (!publisherId || !slot || isDevelopment) {
    // In production, return null to collapse the container instead of showing placeholder
    if (!isDevelopment && (!publisherId || !slot)) {
      return null;
    }
    
    // Only show placeholder in development
    return (
      <div className={`adsense-placeholder ${className}`} style={{ 
        backgroundColor: '#f0f0f0', 
        border: '2px dashed #ccc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100px',
        color: '#666',
        fontSize: '14px',
        ...style 
      }}>
        AdSense Placeholder (Dev Mode)
      </div>
    );
  }

  // Hide the ad container if it should be hidden due to failed load
  if (shouldHide) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`adsense-container ${className}`} 
      style={{
        ...style,
        // Ensure container collapses properly when empty
        minHeight: adLoaded ? 'auto' : '0px',
        overflow: 'hidden'
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        data-ad-layout-key={layoutKey}
        key={`ad-${slot}-${Date.now()}`}
      />
    </div>
  );
};

export default ResponsiveAd;
