
import React from 'react';
import { LOGO_URL } from '@/constants';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  src?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'light', src }) => {
  const finalSrc = src || LOGO_URL;
  
  return (
    <div className={`flex items-center justify-center transition-all duration-300`}>
      <div className={className}>
        <img 
          src={finalSrc} 
          alt="AS TAXI UND MIETWAGEN SERVICE Logo" 
          className="h-full w-auto object-contain"
          style={{ 
            imageRendering: 'auto'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallbackText = document.createElement('span');
            fallbackText.className = `font-black text-xl tracking-tighter ${variant === 'light' ? 'text-white' : 'text-black'}`;
            fallbackText.innerText = 'AS MIETWAGEN';
            e.currentTarget.parentElement!.appendChild(fallbackText);
          }}
        />
      </div>
    </div>
  );
};

export default Logo;
