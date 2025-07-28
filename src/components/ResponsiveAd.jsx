import React, { useEffect, useRef } from 'react';

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
  const isLoaded = useRef(false);

  useEffect(() => {
    // Don't load if already loaded or in development mode
    if (isLoaded.current || !publisherId || !slot || import.meta.env.DEV) {
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
      }
    };

    // Delay loading to prevent duplicate requests
    const timer = setTimeout(loadAd, 1000);
    return () => clearTimeout(timer);
  }, [publisherId, slot]);

  // Don't render ads in development mode or if missing required props
  if (!publisherId || !slot || import.meta.env.DEV || window.location.hostname === 'localhost') {
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

  return (
    <div className={`adsense-container ${className}`} style={style}>
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
