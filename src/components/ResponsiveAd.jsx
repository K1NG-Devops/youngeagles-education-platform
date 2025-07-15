import React, { useEffect } from 'react';

const ResponsiveAd = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style = {},
  layoutKey = '-6t+ed+2i-1n-4w'
}) => {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    try {
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);

  if (!publisherId || !slot) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
};

export default ResponsiveAd;
