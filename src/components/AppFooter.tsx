
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '@/constants';
import { Facebook, Instagram, Phone, MapPin, Mail, Clock } from 'lucide-react';
import Logo from '@/components/AppLogo';

interface FooterProps {
  onOpenImpressum: () => void;
  onOpenDatenschutz: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenImpressum, onOpenDatenschutz }) => {
  return (
    <footer className="w-full">
      {/* Orange Contact Strip */}
      <div className="bg-secondary text-white py-24 relative z-10" id="contact">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.4em] mb-10 text-white/90">Kontakt</h3>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-3xl md:text-5xl lg:text-7xl font-bold mb-12 font-sans tracking-tighter">
            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="hover:opacity-80 transition-opacity">
              {CONTACT_INFO.phone}
            </a>
            <span className="text-2xl font-light opacity-50 mx-4 hidden md:inline">oder</span>
            <span className="text-2xl font-light opacity-50 my-2 md:hidden">oder</span>
            <a href={`tel:${CONTACT_INFO.mobile.replace(/\s/g, '')}`} className="hover:opacity-80 transition-opacity">
              {CONTACT_INFO.mobile}
            </a>
          </div>
          
          <div className="text-center mb-16">
            <p className="text-xl md:text-2xl font-light uppercase tracking-wide">
                {CONTACT_INFO.location} <br/>
                <span className="font-extrabold">{CONTACT_INFO.address}, {CONTACT_INFO.city}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto border-t border-white/30 pt-16">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-4 border border-white/20">
                <Clock size={32} />
              </div>
              <span className="font-bold text-lg uppercase tracking-widest">Öffnungszeiten</span>
              <div className="text-sm font-light mt-2 text-center">
                <p>Mo-Do: 06:00 - 20:00 Uhr</p>
                <p>Fr-Sa: 24 Stunden</p>
                <p>So: Ruhetag</p>
                <p className="text-xs mt-2 italic">Außerhalb: Vorbestellung</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-4 border border-white/20">
                <MapPin size={32} />
              </div>
              <span className="font-bold text-lg uppercase tracking-widest">{CONTACT_INFO.city}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-4 border border-white/20">
                <Mail size={32} />
              </div>
              <a href={`mailto:${CONTACT_INFO.email}?subject=Anfrage%20über%20Website`} className="font-bold text-lg hover:underline uppercase tracking-widest break-all">
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#0a0a0a] text-gray-500 py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20">
          
          {/* Column 1 */}
          <div>
             <div className="mb-10">
                <Logo className="h-14 w-auto" variant="light" />
            </div>
            <p className="text-sm leading-relaxed mb-10 text-justify font-light">
              Wir sind Ihr professioneller Taxi und Mietwagen Service in Bingen am Rhein und Umgebung. 
              Zu unserem Service gehören u.a. Kurierfahrten, Einkaufsfahrten, Schüler- und Kindertransporte, 
              Krankenfahrten und Flughafentransfer.
            </p>
            <div className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} | AS Taxi und Mietwagen Service
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.3em] text-xs mb-10 relative inline-block">
                Kontakt
                <span className="absolute -bottom-3 left-0 w-8 h-0.5 bg-secondary"></span>
            </h4>
            <ul className="space-y-5 text-sm font-light">
              <li className="font-bold text-white text-base uppercase">AS Taxi und Mietwagen Service</li>
              <li className="flex items-start"><MapPin size={16} className="mr-4 text-secondary mt-1 flex-shrink-0"/> {CONTACT_INFO.location}<br/>{CONTACT_INFO.address}<br/>{CONTACT_INFO.city}</li>
              <li className="flex items-center"><Phone size={16} className="mr-4 text-secondary flex-shrink-0"/> <span className="text-white font-bold">{CONTACT_INFO.phone}</span></li>
              <li className="pl-8 flex items-center">Mobil: <span className="text-white font-bold ml-2">{CONTACT_INFO.mobile}</span></li>
              <li className="flex items-center"><Mail size={16} className="mr-4 text-secondary flex-shrink-0"/> <a href={`mailto:${CONTACT_INFO.email}?subject=Anfrage%20über%20Website`} className="hover:text-white transition-colors cursor-pointer">{CONTACT_INFO.email}</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.3em] text-xs mb-10 relative inline-block">
                Social Media
                <span className="absolute -bottom-3 left-0 w-8 h-0.5 bg-secondary"></span>
            </h4>
            <p className="text-sm mb-8 font-light leading-relaxed">
              Besuchen Sie unsere Social-Media-Kanäle und erfahren Sie mehr über unser Unternehmen. Wir freuen uns auf Sie.
            </p>
            <div className="flex space-x-3 mb-12">
              <a href="https://www.facebook.com/asmietwagenservice/" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] w-12 h-12 flex items-center justify-center rounded-sm hover:bg-secondary hover:text-white transition-all"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/as_mietwagen_service/" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] w-12 h-12 flex items-center justify-center rounded-sm hover:bg-secondary hover:text-white transition-all"><Instagram size={20} /></a>
            </div>

            <h5 className="text-white font-bold uppercase text-[10px] mb-4 tracking-[0.2em]">Zahlungsmethoden:</h5>
            <p className="text-[11px] leading-relaxed font-light">
              Barzahlung, EC-Karte, Mastercard, American Express, PayPal oder auf Rechnung (Firmen).
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-8 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-700 flex flex-wrap justify-center gap-8">
            <Link to="/#home" className="hover:text-white transition-colors">Start</Link>
            <a href="https://www.google.com/search?q=AS+MIETWAGEN+Bingen+Bewertungen" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Google Bewertungen</a>
            <Link to="/#contact" className="hover:text-white transition-colors">Kontakt</Link>
            <button onClick={onOpenImpressum} className="hover:text-white transition-colors uppercase">Impressum</button>
            <button onClick={onOpenDatenschutz} className="hover:text-white transition-colors uppercase">Datenschutz</button>
          </div>
          <div className="text-[9px] uppercase tracking-widest text-gray-800 relative">
            Replicated with precision
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
