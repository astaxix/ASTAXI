
import React from 'react';
import Button from '@/components/AppButton';
import { CONTACT_INFO } from '@/constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header centered */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Über Uns</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight font-sans uppercase">
            AS Taxi und Mietwagen Service <br/>
            <span className="text-gray-400 font-medium text-2xl md:text-3xl mt-2 block lowercase italic">das etwas andere Taxi für Bingen</span>
          </h3>
          <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>
          <p className="text-black font-bold text-lg tracking-wide uppercase">
            Pünktlich, zügig, freundlich & zuverlässig für Sie unterwegs
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded shadow-2xl overflow-hidden group max-w-md mx-auto lg:mx-0">
              <img 
                src="https://i.ibb.co/3m71vkyr/IMG-1201.jpg" 
                alt="IMG-1201" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[15px] border-white/20 pointer-events-none"></div>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2">
            <h4 className="text-2xl font-bold mb-8 text-black leading-snug uppercase">
              Sind Sie auf der Suche nach einem Taxi, welches Sie schnell und sicher von A nach B bringt? <br/>
              <span className="text-secondary">Dann sind Sie bei uns genau richtig!</span>
            </h4>
            
            <p className="text-gray-600 mb-6 leading-relaxed text-base font-light">
              Egal, ob Sie geschäftlich unterwegs sind, zum Arzt oder zum Flughafen müssen. Wir sorgen dafür, 
              dass Sie komfortabel und pünktlich an Ihr Ziel gelangen. Auch Kurierfahrten sowie Chauffeurdienste 
              gehören zu unseren Leistungen. <span className="font-bold text-black">Bezahlung: in Bar, mit EC-Karte oder auf Rechnung.</span>
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed text-base font-light">
              AS Taxi und Mietwagen Service ist Ihr Fahrservice in Sachen Personenbeförderung in Bingen am Rhein 
              und Umgebung. Gerne nehmen wir auch außerhalb unseres Bezirkes Fahrten an. Für uns ist es nicht nur 
              die Fahrt von einem Ort zum anderen, sondern wir sehen Sie als Gast in unserem Fahrzeug.
            </p>

            <p className="text-black font-bold italic mb-10 border-l-4 border-secondary pl-6 py-4 bg-gray-50 text-lg">
              "Egal von wo Sie uns anrufen: Ihr Taxi und Mietwagen, kommt schnell zu Ihnen und holt Sie am gewünschten Ort ab."
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#services">
                <Button className="bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-sm">
                  Unsere Leistungen
                </Button>
              </a>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                <Button className="bg-secondary hover:bg-[#d17a1a] text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-sm">
                  Jetzt Anrufen
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
