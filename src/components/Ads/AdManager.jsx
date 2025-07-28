import React, { useEffect, useState } from 'react';

// Google AdSense Display Ad Component
export const GoogleAd = ({ 
  slot, 
  format = 'auto', 
  style = { display: 'block', width: '100%', height: '250px' },
  className = ''
}) => {
  useEffect(() => {
    if (window.adsbygoogle && window.adsbygoogle.loaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-5506438806314781"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

// Banner Ad Component for Educational Content
export const EducationalBanner = ({ 
  title = "Educational Partners", 
  description = "Discover trusted educational resources and tools",
  buttonText = "Learn More",
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-md ${className}`}>
      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Sponsored Content</p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Sidebar Ad Component
export const SidebarAd = ({ type = "educational" }) => {
  const ads = {
    educational: {
      title: "STEM Learning Tools",
      description: "Interactive educational games for young learners",
      color: "from-green-50 to-emerald-50",
      border: "border-green-200"
    },
    parenting: {
      title: "Parenting Resources",
      description: "Expert tips and guides for modern parents",
      color: "from-purple-50 to-violet-50",
      border: "border-purple-200"
    },
    childcare: {
      title: "Child Development",
      description: "Professional development programs for educators",
      color: "from-orange-50 to-amber-50",
      border: "border-orange-200"
    }
  };

  const ad = ads[type] || ads.educational;

  return (
    <div className={`bg-gradient-to-br ${ad.color} rounded-lg p-4 border ${ad.border} shadow-sm`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Featured</p>
      <h4 className="font-bold text-gray-900 mb-2">{ad.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
      <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded transition-colors duration-200">
        Explore
      </button>
    </div>
  );
};

// Native Ad Component
export const NativeAd = ({ 
  image = "/api/placeholder/300/200",
  title = "Educational Technology Solutions",
  description = "Discover cutting-edge tools that enhance learning experiences",
  sponsor = "Educational Partner",
  link = "#"
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Sponsored by {sponsor}</p>
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <a 
          href={link} 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors duration-200"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

// Ad Analytics Component
export const AdAnalytics = () => {
  const [adMetrics, setAdMetrics] = useState({
    impressions: 0,
    clicks: 0,
    revenue: 0
  });

  useEffect(() => {
    // Simulated ad metrics - replace with real analytics
    setAdMetrics({
      impressions: Math.floor(Math.random() * 10000) + 5000,
      clicks: Math.floor(Math.random() * 500) + 100,
      revenue: (Math.random() * 100 + 50).toFixed(2)
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{adMetrics.impressions.toLocaleString()}</div>
        <div className="text-sm text-gray-600">Impressions</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{adMetrics.clicks}</div>
        <div className="text-sm text-gray-600">Clicks</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">${adMetrics.revenue}</div>
        <div className="text-sm text-gray-600">Revenue</div>
      </div>
    </div>
  );
};

// Main Ad Manager Component
const AdManager = ({ children, showAnalytics = false }) => {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    // Detect ad blockers
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setAdBlockDetected(true);
      }
      document.body.removeChild(testAd);
    }, 100);
  }, []);

  if (adBlockDetected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          We notice you're using an ad blocker. Our educational content is supported by relevant, 
          family-friendly advertisements. Please consider whitelisting our site to support free educational resources.
        </p>
      </div>
    );
  }

  return (
    <div className="ad-manager">
      {showAnalytics && <AdAnalytics />}
      {children}
    </div>
  );
};

export default AdManager;
