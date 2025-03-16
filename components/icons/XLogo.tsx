import React from 'react';

interface XLogoProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const XLogo: React.FC<XLogoProps> = ({ 
  size = 24, 
  className = "", 
  strokeWidth = 2 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`lucide lucide-x-logo ${className}`}
    >
      {/* Custom X logo (formerly Twitter) path - designed to match Lucide style */}
      <path d="M4 4l7.2 8.5L4 20h2.1l5.7-6.5L16.5 20h3.5l-7.6-9L19 4h-2.1l-5.3 6l-4.1-6z" />
    </svg>
  );
};

export default XLogo; 