import React from 'react';
import ResponsiveAd from './ResponsiveAd';
import ErrorBoundary from './ErrorBoundary';

const AdManager = ({ placement = 'content', className = '', style = {} }) => {
  const adConfigs = {
    header: {
      slot: import.meta.env.VITE_ADSENSE_HEADER_BANNER,
      format: 'auto',
      className: 'w-full h-auto max-w-full',
      style: { minHeight: '90px' }
    },
    sidebar: {
      slot: import.meta.env.VITE_ADSENSE_SIDEBAR_SKYSCRAPER,
      format: 'auto',
      className: 'w-full h-auto',
      style: { minHeight: '600px', maxWidth: '300px' }
    },
    content: {
      slot: import.meta.env.VITE_ADSENSE_CONTENT_RECTANGLE,
      format: 'rectangle',
      className: 'w-full h-auto mx-auto',
      style: { minHeight: '250px', maxWidth: '336px' }
    },
    footer: {
      slot: import.meta.env.VITE_ADSENSE_FOOTER_BANNER,
      format: 'auto',
      className: 'w-full h-auto',
      style: { minHeight: '90px' }
    },
    mobile: {
      slot: import.meta.env.VITE_ADSENSE_MOBILE_BANNER,
      format: 'auto',
      className: 'w-full h-auto md:hidden',
      style: { minHeight: '50px' }
    },
    'in-feed': {
      slot: import.meta.env.VITE_ADSENSE_IN_FEED_NATIVE,
      format: 'fluid',
      layoutKey: '-fb+5w+4e-db+86',
      className: 'w-full',
      style: { minHeight: '300px' }
    },
    'in-article': {
      slot: import.meta.env.VITE_ADSENSE_IN_ARTICLE_NATIVE,
      format: 'fluid',
      layoutKey: '-6t+ed+2i-1n-4w',
      className: 'w-full my-4',
      style: { minHeight: '400px' }
    }
  };

  const config = adConfigs[placement];
  
  if (!config || !config.slot) {
    return null;
  }

  return (
    <ErrorBoundary fallbackMessage="Ad content temporarily unavailable">
      <div className={`ad-container ${className}`} style={style}>
        <ResponsiveAd
          slot={config.slot}
          format={config.format}
          className={config.className}
          style={{ ...config.style, ...style }}
          layoutKey={config.layoutKey}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AdManager;
