import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/AppHeader';
import Hero from '@/components/AppHero';
import About from '@/components/AppAbout';
import Services from '@/components/AppServices';
import News from '@/components/AppNews';
import Guestbook from '@/components/AppGuestbook';
import Footer from '@/components/AppFooter';
import BookingOverlay from '@/components/AppBookingOverlay';
import AdminPanel from '@/components/AppAdminPanel';
import LeistungenPage from '@/components/AppLeistungenPage';
import LegalImpressum from '@/components/LegalImpressum';
import LegalDatenschutz from '@/components/LegalDatenschutz';
import PromoPopup from '@/components/AppPromoPopup';
import TaxiCarePopup from '@/components/AppTaxiCarePopup';
import Preloader from '@/components/AppPreloader';
import { auth, signInAnonymously } from '@/firebase';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTracking } from '@/hooks/useTracking';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      // Kurze Verzögerung um sicherzustellen, dass die Seite gerendert ist
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);
  return null;
}

let hasShownTaxiCare = false;

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isDatenschutzOpen, setIsDatenschutzOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isTaxiCareOpen, setIsTaxiCareOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<string | null>(null);

  useTracking();

  useEffect(() => {
    if (hasShownTaxiCare) return;

    const timer = setTimeout(() => {
      setIsTaxiCareOpen(true);
      hasShownTaxiCare = true;
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const openBooking = (type?: string) => {
    setPreselectedType(type || null);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Preloader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <Header onOpenBooking={() => openBooking()} onOpenTaxiCare={() => setIsTaxiCareOpen(true)} />
            <Hero onOpenBooking={() => openBooking()} />
            <About />
            <Services />
            <News />
            <Guestbook />
            <Footer 
              onOpenImpressum={() => setIsImpressumOpen(true)} 
              onOpenDatenschutz={() => setIsDatenschutzOpen(true)} 
            />
          </div>
        } />
        <Route path="/leistungen" element={
          <LeistungenPage 
            onOpenBooking={(type) => openBooking(type)} 
            onOpenImpressum={() => setIsImpressumOpen(true)} 
            onOpenDatenschutz={() => setIsDatenschutzOpen(true)} 
            onOpenTaxiCare={() => setIsTaxiCareOpen(true)}
          />
        } />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      <BookingOverlay 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        preselectedType={preselectedType}
      />
      
      <LegalImpressum 
        isOpen={isImpressumOpen} 
        onClose={() => setIsImpressumOpen(false)} 
      />
      
      <LegalDatenschutz 
        isOpen={isDatenschutzOpen} 
        onClose={() => setIsDatenschutzOpen(false)} 
      />
      
      <PromoPopup 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
      />
      <TaxiCarePopup 
        isOpen={isTaxiCareOpen} 
        onClose={() => setIsTaxiCareOpen(false)} 
      />
    </>
  );
}
