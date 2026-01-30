import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};
