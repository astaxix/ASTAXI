import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '@/constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-[#f8f9fa]">
      <div className="container mx-auto px-6">
        
        {/* Intro */}
        <div className="text-center mb-20">
          <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Leistungen</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-8 max-w-4xl mx-auto leading-tight">
            Unser Leistungsspektrum im Überblick <br/> 
            <span className="text-2xl font-light text-gray-600">außer die klassischen Taxifahrten sind</span>
          </h3>
          <div className="w-16 h-1 bg-black mx-auto"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-8 rounded shadow-lg border-t-[6px] border-black hover:border-secondary transition-all duration-300 flex flex-col items-center text-center group h-full hover:-translate-y-2"
              >
                <div className="mb-6 text-black group-hover:text-secondary transition-colors duration-300">
                  <Icon size={48} strokeWidth={1} />
                </div>
                <h4 className="text-lg font-bold text-black mb-6 min-h-[50px] flex items-center justify-center uppercase tracking-wide">
                  {service.title}
                </h4>
                <div className="mt-auto pt-6 w-full">
                  <Link 
                    to={`/leistungen#${service.id}`} 
                    className="block w-full border-2 border-black text-black text-[11px] font-bold uppercase px-6 py-3 hover:bg-black hover:text-white transition-colors rounded-sm tracking-widest text-center"
                  >
                    Mehr Erfahren
                  </Link>
                </div>
              </div>
            );
          })}
          
          {/* Last Card - Special CTA */}
          <div className="bg-secondary p-8 rounded shadow-lg border-t-[6px] border-[#c4771e] flex flex-col items-center justify-center text-center h-full hover:-translate-y-2 transition-transform">
            <h4 className="text-2xl font-bold text-white mb-8">
              Sie haben Fragen?
            </h4>
            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center text-white font-serif text-3xl italic mb-8 hover:bg-white hover:text-secondary transition-colors cursor-pointer">
              ?
            </div>
            <a href="#contact" className="w-full bg-white text-secondary text-[11px] font-bold uppercase px-6 py-4 hover:bg-black hover:text-white transition-colors rounded-sm tracking-widest">
              Zum Kontakt
            </a>
          </div>

        </div>

        <p className="text-center text-gray-500 mt-16 text-sm max-w-3xl mx-auto italic">
          "Es gibt viele weitere Varianten für einen denkbaren Auftrag an uns als vertrauensvolles Unternehmen in Ihren Diensten. Fragen Sie uns einfach an!"
        </p>
      </div>
    </section>
  );
};

export default Services;