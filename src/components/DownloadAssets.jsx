import React from 'react';

const DownloadAssets = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="/young-eagles-app-assets.zip"
        download="young-eagles-app-assets.zip"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        title="Download App Assets Package"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="hidden sm:inline">Download App Assets</span>
        <span className="sm:hidden">Assets</span>
      </a>
    </div>
  );
};

export default DownloadAssets;

