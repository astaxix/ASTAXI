
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ArrowLeft, ShieldCheck, Zap, Heart, Clock, CheckCircle } from 'lucide-react';
import Header from '@/components/AppHeader';
import Footer from '@/components/AppFooter';
import { CONTACT_INFO } from '@/constants';

interface TaxiCareInfoProps {
  onOpenBooking: (type?: string) => void;
  onOpenImpressum: () => void;
  onOpenDatenschutz: () => void;
}

const TaxiCareInfo: React.FC<TaxiCareInfoProps> = ({ onOpenBooking, onOpenImpressum, onOpenDatenschutz }) => {
  const dialNumber = CONTACT_INFO.mobile.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header onOpenBooking={onOpenBooking} />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <div className="bg-black py-20 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://i.ibb.co/TxnqKbxB/Untitled-design.png" 
              alt="TaxiCare Background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-[10px] mb-8 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={14} /> Zurück zur Startseite
            </Link>
            <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Exklusiver Service</h2>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tighter">TaxiCare Service & Preise</h1>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Pricing */}
            <div className="bg-black text-white rounded-[40px] p-10 mb-16">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Preise</h3>
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-6">
                  <h4 className="font-black text-secondary uppercase tracking-widest mb-2">Allgemein</h4>
                  <p className="text-sm">
                    (Entfernung von Espenscheidstr, 55411 Bingen + Entfernung zum Ziel) × 2,50€ + 3,70€ Grundgebühr
                  </p>
                </div>
                <div>
                  <h4 className="font-black text-secondary uppercase tracking-widest mb-2">Großraumbus</h4>
                  <p className="text-sm">
                    5,90€ Großraumzuschlag + 3,70€ Grundgebühr
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="bg-gray-50 rounded-[50px] p-10 md:p-16 border border-gray-100 text-center mb-20 shadow-sm">
              <h3 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter mb-4">Jetzt Hilfe anfordern</h3>
              <p className="text-gray-500 max-w-xl mx-auto mb-12 font-medium">
                Warten Sie nicht länger. Unsere Zentrale koordiniert sofort ein Fahrzeug in Ihrer Nähe.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a 
                  href={`tel:${dialNumber}`}
                  className="flex-1 bg-black text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-secondary transition-all transform hover:scale-105 active:scale-95"
                >
                  <Phone size={20} fill="currentColor" />
                  Jetzt anrufen
                </a>
                <a 
                  href={`https://wa.me/${CONTACT_INFO.mobile.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-[#1eb954] transition-all transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle size={20} fill="currentColor" />
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenImpressum={onOpenImpressum} onOpenDatenschutz={onOpenDatenschutz} />
    </div>
  );
};

export default TaxiCareInfo;
