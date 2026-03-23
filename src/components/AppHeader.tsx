import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { NAV_ITEMS, CONTACT_INFO } from '@/constants';
import Button from '@/components/AppButton';
import Logo from '@/components/AppLogo';

interface HeaderProps {
  onOpenBooking?: () => void;
  onOpenTaxiCare?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenBooking, onOpenTaxiCare }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header anzeigen wenn wir ganz oben sind (weniger als 50px gescrollt)
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Verstecken wenn wir nach unten scrollen
        setIsVisible(false);
      } else {
        // Anzeigen wenn wir nach oben scrollen
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.label === 'JETZT BUCHEN') {
      e.preventDefault();
      if (onOpenBooking) onOpenBooking();
      return;
    }

    if (item.href.startsWith('/#') || item.href.startsWith('#')) {
      const id = item.href.split('#')[1];
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-700 py-4 md:py-6 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        background: isVisible ? 'black' : 'transparent'
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Component - Matches uploaded SVG */}
        <Link to="/" className="flex items-center group relative">
            <Logo className="h-12 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105" variant="light" />
        </Link>

        {/* Desktop Nav */}
        <div className="flex items-center">
            <nav className="hidden lg:flex space-x-6 items-center">
            <button 
                onClick={onOpenTaxiCare}
                className="font-bold text-[12px] uppercase tracking-[0.1em] text-white hover:text-secondary transition-colors py-2"
            >
                TaxiCare
            </button>
            {NAV_ITEMS.map((item) => (
                <Link 
                key={item.label} 
                to={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`font-bold text-[12px] uppercase tracking-[0.1em] transition-colors relative group py-2 ${
                    item.label === 'JETZT BUCHEN' 
                    ? 'bg-secondary text-white px-4 py-2 rounded-sm hover:bg-white hover:text-secondary' 
                    : 'text-white hover:text-secondary'
                }`}
                >
                {item.label}
                {item.label !== 'JETZT BUCHEN' && (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
                )}
                </Link>
            ))}
            </nav>
        </div>

        {/* Mobile Action Buttons & Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <button 
            onClick={onOpenBooking}
            className="flex items-center justify-center px-4 h-10 bg-secondary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-secondary transition-all"
          >
            Buchen
          </button>
          <button 
            className="flex items-center justify-center w-10 h-10 text-white hover:text-secondary transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-gray-900 shadow-2xl h-screen overflow-y-auto">
          <div className="flex flex-col py-2">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenTaxiCare) onOpenTaxiCare();
              }}
              className="px-8 py-4 text-white text-left hover:text-secondary hover:bg-gray-900 font-bold uppercase tracking-wider border-b border-gray-800 transition-colors text-sm"
            >
              TaxiCare
            </button>
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.label}
                to={item.href}
                className={`px-8 py-4 text-white hover:text-secondary hover:bg-gray-900 font-bold uppercase tracking-wider border-b border-gray-800 last:border-0 transition-colors text-sm ${
                    item.label === 'JETZT BUCHEN' ? 'text-secondary' : ''
                }`}
                onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(e, item);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;