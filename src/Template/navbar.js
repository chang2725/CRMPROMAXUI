import React, { useState } from 'react';

function Navbar() {
      const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); 
    
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };
  return(
    <>
    <header className="fixed top-0 z-50 w-full flex justify-center pointer-events-none">
        <div className="w-full max-w-7xl mx-4 mt-4 px-6 py-3 flex items-center justify-between pointer-events-auto">
          <div></div> 
          {/* Desktop Nav */}
          <nav className="rounded-full shadow-md bg-white px-6 py-3 hidden md:flex items-center space-x-6 font-medium text-gray-800">
            <a href="/" className="hover:text-purple-600 transition">dashboard</a>
            <a href="/Customer" className="hover:text-purple-600 transition">Customer hub</a>
            <a href="#service" className="hover:text-purple-600 transition"> Phone Recharge</a>
            <a href="#Creations" className="hover:text-purple-600 transition">Loan Tracker</a>
            <a href="#career" className="hover:text-purple-600 transition">Career</a>
          </nav> 
          {/* Mobile Toggle */}
          <div className="rounded-full shadow-md bg-white px-6 py-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-3xl focus:outline-none"
            >
              &#9776;
            </button>
          </div>
        </div> 
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[90px] w-[90%] mx-auto left-0 right-0 bg-white shadow-md rounded-xl px-6 py-4 text-center z-40 pointer-events-auto">
            <a onClick={handleMobileLinkClick} href="#home" className="block py-2 text-gray-800 hover:text-purple-600">Home</a>
            <a onClick={handleMobileLinkClick} href="#about" className="block py-2 text-gray-800 hover:text-purple-600">Who We Are</a>
            <a onClick={handleMobileLinkClick} href="#service" className="block py-2 text-gray-800 hover:text-purple-600">What We Do</a>
            <a onClick={handleMobileLinkClick} href="#Creations" className="block py-2 text-gray-800 hover:text-purple-600">Our Creations</a>
            <a onClick={handleMobileLinkClick} href="#career" className="block py-2 text-gray-800 hover:text-purple-600">Career</a>
          </div>
        )}
      </header> 
    </>
  )}

  export default Navbar;