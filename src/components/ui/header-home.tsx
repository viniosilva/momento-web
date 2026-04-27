import React, { useState } from "react";
import { Link } from "@tanstack/react-router"
import { Button } from "./button";

export function HeaderHome() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  function handleMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowMobileMenu((v) => !v);
  }

  return (
    <header className="text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          <Link to="/momentos" className="flex-shrink-0 text-2xl text-chart-3 font-bold hover:cursor-default">
            Momento
          </Link>

          <Link to="/sign-in" className="hidden md:block" >
            <Button className="text-lg p-4 cursor-pointer">Sign In</Button>
          </Link>

          <div className="md:hidden flex items-center">
            <button className="focus:outline-none hover:cursor-pointer" onClick={handleMenuClick} aria-expanded={showMobileMenu}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <nav className="md:hidden mt-5 space-y-4">
            <Link to="/momentos" className="block text-lg hover:text-gray-300 transition-all">Home</Link>
            {/* <Link to="/services" className="block text-lg hover:text-gray-300 transition-all">Services</Link>
            <Link to="/about" className="block text-lg hover:text-gray-300 transition-all">About Us</Link>
            <Link to="/contact" className="block text-lg hover:text-gray-300 transition-all">Contact</Link> */}
          </nav>
        )}
      </div>
    </header>
  );
}
