import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOManager = ({ 
  title = "Young Eagles Education Platform",
  description = "Premium daycare and early learning center with Society 5.0 integration",
  keywords = "daycare, early learning, child development, STEM education",
  image = "/app-icons/og-image.png",
  url = "https://youngeagles.edu",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOManager;
