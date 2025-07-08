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
            <a href="/" className="hover:text-purple-600 transition">Dashboard</a>
            <a href="/Customer" className="hover:text-purple-600 transition">Customer hub</a>
            <a href="/phonerecharge" className="hover:text-purple-600 transition"> Phone Recharge</a>
            <a href="/vendor" className="hover:text-purple-600 transition">Vendor</a>
            <a href="/cashflowdashboard" className="hover:text-purple-600 transition">Cashflow Dashboard</a>
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
            <a onClick={handleMobileLinkClick} href="/" className="block py-2 text-gray-800 hover:text-purple-600">Dashboard</a>
            <a onClick={handleMobileLinkClick} href="/Customer" className="block py-2 text-gray-800 hover:text-purple-600">Customer hub</a>
            <a onClick={handleMobileLinkClick} href="/phonerecharge" className="block py-2 text-gray-800 hover:text-purple-600">Phone Recharge</a>
            <a onClick={handleMobileLinkClick} href="/vendor" className="block py-2 text-gray-800 hover:text-purple-600">Vendor</a>
            <a onClick={handleMobileLinkClick} href="/career" className="block py-2 text-gray-800 hover:text-purple-600">Cashflow Dashboard</a>
          </div>
        )}
      </header> 
    </>
  )}

  export default Navbar;