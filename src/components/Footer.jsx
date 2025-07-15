import React from 'react';

const Footer = () => (
  < footer className = "bg-gray-800 text-white py-4 text-center" >
   <p>&copy; {new Date().getFullYear()} Young Eagles Day Care. All rights reserved.</p>
   <p className="text-sm">
     Website by <a href="https://www.youngeagles.org.za" className="text-blue-400">Young Eagles</a>
   </p>
 </footer >
);

export default Footer;