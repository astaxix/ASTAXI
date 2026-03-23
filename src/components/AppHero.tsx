
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from '@/components/AppButton';
import { Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import { storage, ref, getDownloadURL } from '@/firebase';
import heroLocal from '@/components/hero-taxi.png';

interface HeroProps {
    onOpenBooking?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  // Wir starten mit dem lokalen Bild für optimalen LCP
  const [imageUrl, setImageUrl] = useState<string>(heroLocal);

  useEffect(() => {
    const fetchImageUrl = async () => {
      // Wir versuchen trotzdem, ein aktuelleres Bild aus Firebase zu laden, 
      // aber das lokale Bild ist bereits da (LCP-Optimierung)
      try {
        const storageRef = ref(storage, 'BUCHEN.png');
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        // Fallback bleibt das lokale Bild
      }
    };

    fetchImageUrl();
  }, []);

  return (
    <section id="home" className="relative overflow-visible">
      {/* Hero Section with Background */}
      <div className="relative w-full flex flex-col items-center">
        {/* Background Image - Covers only the hero content part */}
        <div className="absolute top-0 left-0 w-full h-full z-0 bg-gray-900">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="AS Taxi Hero" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => {
                // Falls das Bild nicht lädt, zeigen wir einfach den dunklen Hintergrund
                console.log("Bild konnte nicht geladen werden.");
                setImageUrl("");
              }}
            />
          )}
          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>

        {/* Main Hero Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-full min-h-[75vh] md:min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center text-white"
        >
          <h2 className="text-secondary font-bold text-xs md:text-sm tracking-[0.3em] uppercase mb-6 md:mb-8">
            Ihr Taxi Service
          </h2>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8 md:mb-10 font-sans uppercase">
            AS Taxi und <br className="hidden sm:block" />
            Mietwagen Service
          </h1>
          
          <div className="mb-10 md:mb-14">
              <span className="text-lg md:text-3xl font-light block">aus Bingen am Rhein –</span>
              <span className="text-lg md:text-3xl font-bold block text-secondary uppercase tracking-widest mt-2">Zentrale am Stadtbahnhof</span>
          </div>
          
          <p className="max-w-3xl mx-auto text-gray-200 text-sm md:text-base leading-relaxed mb-10 md:mb-14 hidden sm:block font-light">
            Herzlich willkommen auf unserer Internetpräsenz von AS Taxi und Mietwagen Service in Bingen am Rhein. 
            Ihr Alternative zum Taxi für eine angenehme Fahrt. Wir hoffen, unsere Seite gefällt Ihnen.
          </p>

          <div className="flex flex-row flex-wrap justify-center items-center gap-4 md:gap-6">
            <Link to="/#news" className="inline-block">
              <Button className="bg-secondary hover:bg-[#d17a1a] text-white font-bold uppercase tracking-wider border-none px-5 md:px-10 py-3 md:py-4 text-[10px] md:text-sm shadow-xl">
                Was gibts neues?
              </Button>
            </Link>
            <Link to="/#guestbook" className="inline-block">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider px-5 md:px-10 py-3 md:py-4 text-[10px] md:text-sm shadow-xl"
              >
                Was sagen die Gäste?
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Contact & Booking Options Area - On Light Gray Background */}
      <div className="relative z-10 w-full bg-[#f8f9fa] pt-12 md:pt-16 pb-8 md:pb-10 px-6">
          <div className="container mx-auto max-w-6xl bg-white p-8 md:p-12 rounded-sm shadow-2xl border border-gray-100">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter mb-2">Sie brauchen ein Taxi?</h3>
              <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Wählen Sie Ihre bevorzugte Option</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Online Buchen */}
              <button 
                onClick={onOpenBooking}
                className="bg-secondary w-full p-5 rounded-sm text-center group transition-all duration-300 hover:bg-[#d17a1a] shadow-md flex items-center justify-between px-8"
              >
                <div className="flex items-center gap-4">
                  <Calendar size={20} className="text-white" />
                  <span className="text-white font-black text-sm uppercase tracking-widest">Online Buchen</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-secondary transition-all">
                  <span className="text-lg">→</span>
                </div>
              </button>

              {/* 2. Anruf */}
              <a 
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                className="bg-black w-full p-5 rounded-sm text-center group transition-all duration-300 hover:bg-gray-900 shadow-md flex items-center justify-between px-8"
              >
                <div className="flex items-center gap-4">
                  <Phone size={20} className="text-white" />
                  <span className="text-white font-black text-sm uppercase tracking-widest">Anrufen</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-secondary transition-all">
                  <span className="text-lg">→</span>
                </div>
              </a>

              {/* 3. WhatsApp */}
              <a 
                href={`https://wa.me/${CONTACT_INFO.mobile.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] w-full p-5 rounded-sm text-center group transition-all duration-300 hover:bg-[#1eb954] shadow-md flex items-center justify-between px-8"
              >
                <div className="flex items-center gap-4">
                  <MessageCircle size={20} className="text-white" />
                  <span className="text-white font-black text-sm uppercase tracking-widest">WhatsApp Chat</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#25D366] transition-all">
                  <span className="text-lg">→</span>
                </div>
              </a>

              {/* 4. Email */}
              <a 
                href={`mailto:${CONTACT_INFO.email}?subject=Anfrage%20über%20Website`}
                className="bg-gray-100 w-full p-5 rounded-sm text-center group transition-all duration-300 hover:bg-gray-200 shadow-sm flex items-center justify-between px-8 border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <Mail size={20} className="text-black" />
                  <span className="text-black font-black text-sm uppercase tracking-widest">Email schreiben</span>
                </div>
                <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                  <span className="text-lg">→</span>
                </div>
              </a>

            </div>
          </div>
        </div>
    </section>
  );
};

export default Hero;
