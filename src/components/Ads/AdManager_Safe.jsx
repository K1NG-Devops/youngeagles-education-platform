import React from 'react';

// Safe fallback components to prevent conflicts with main AdManager
export const GoogleAd = ({ 
  slot, 
  format = 'auto', 
  style = { display: 'block', width: '100%', height: '250px' },
  className = ''
}) => {
  // Return placeholder in development, nothing in production to avoid conflicts
  if (import.meta.env.DEV) {
    return (
      <div className={`ad-placeholder ${className}`} style={{
        backgroundColor: '#f8f9fa',
        border: '2px dashed #dee2e6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d',
        fontSize: '14px',
        ...style
      }}>
        Google Ad Placeholder (Dev Mode)
      </div>
    );
  }
  return null; // Don't render anything in production to avoid conflicts
};

// Banner Ad Component for Educational Content
export const EducationalBanner = ({ 
  title = "Educational Content",
  description = "Discover educational resources",
  buttonText = "Learn More",
  style = {},
  className = ''
}) => {
  if (import.meta.env.DEV) {
    return (
      <div className={`educational-banner ${className}`} style={{
        backgroundColor: '#e3f2fd',
        border: '2px dashed #2196f3',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#1976d2',
        ...style
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{title}</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>{description}</p>
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          {buttonText}
        </button>
        <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
          Educational Banner Placeholder (Dev Mode)
        </div>
      </div>
    );
  }
  return null; // Don't render anything in production to avoid conflicts
};

// Sidebar Ad Component
export const SidebarAd = ({ 
  type = 'general',
  style = {},
  className = ''
}) => {
  if (import.meta.env.DEV) {
    return (
      <div className={`sidebar-ad ${className}`} style={{
        backgroundColor: '#f3e5f5',
        border: '2px dashed #9c27b0',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#7b1fa2',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style
      }}>
        <div style={{ fontSize: '16px', marginBottom: '10px' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Sidebar Ad
        </div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          Placeholder (Dev Mode)
        </div>
      </div>
    );
  }
  return null; // Don't render anything in production to avoid conflicts
};

export default { GoogleAd, EducationalBanner, SidebarAd };
