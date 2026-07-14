import React, { useContext } from "react";
import Navbar from "./Navbar";
import Footer_last from "./Footer_last";
import { AppContext } from "../context/AppContext";
import Chatbot from "./Chatbot";

const Layout = ({ children }) => {
  const { theme } = useContext(AppContext);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-inter antialiased transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <Footer_last />

      {/* Floating Career Assistant Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;

