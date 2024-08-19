import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>© 2024 LiveEvents. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/" className="hover:underline">Privacy Policy</a>
          <a href="/" className="hover:underline">Terms of Service</a>
          <a href="/" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
