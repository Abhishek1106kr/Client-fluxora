import React from "react";
import Navbar from "./Navbar";
import Footer_last from "./Footer_last";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-inter antialiased">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <Footer_last />
    </div>
  );
};

export default Layout;
