import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  if (location.pathname !== '/') return null;

  return (
    <footer className="border-t border-hairline py-8 px-6 mt-24 hidden sm:block">
      <div className="max-w-4xl mx-auto flex justify-center text-caption-sm text-body">
        © {new Date().getFullYear()} Pillai University Management System
      </div>
    </footer>
  );
};

export default Footer;
