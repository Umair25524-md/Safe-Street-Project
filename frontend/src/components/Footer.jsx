import React from 'react';

const Footer = () => {
  return (
    <div className="bg-zinc-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg">© 2025 SafeStreet. All rights reserved.</p>
        <p className="text-sm mt-2">Your Road Safety Partner</p>
        <div className="mt-4">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 mx-3">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 mx-3">GitHub</a>
          <a href="mailto:support@safestreet.com" className="text-gray-400 mx-3">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
