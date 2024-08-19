import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-lg font-semibold">
          <a href="/" className="hover:underline">LiveEvents</a>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/" className="hover:underline">About</a>
          <a href="/" className="hover:underline">Contact</a>
        </div>
        <div className="md:hidden">
          <button className="text-white focus:outline-none focus:ring-2 focus:ring-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
