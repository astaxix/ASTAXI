
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShoppingBag, Plane, FileText, Heart, GraduationCap, Users, Stethoscope, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/AppHeader';
import Footer from '@/components/AppFooter';
import Button from '@/components/AppButton';

interface LeistungenPageProps {
  onOpenBooking: (type?: string) => void;
  onOpenImpressum: () => void;
  onOpenDatenschutz: () => void;
  onOpenTaxiCare?: () => void;
}

const LEISTUNGEN_DATA = [
  {
    id: 'shopping',
    title: 'Einkaufsfahrten',
    icon: ShoppingBag,
    description: 'Wir helfen Ihnen gerne bei Ihren Erledigungen und bringen Sie und Ihre Einkäufe sicher nach Hause.',
    details: [
      {
        title: 'Begleiteter Einkauf',
        text: 'Wir holen Sie zu Hause ab, begleiten Sie beim Einkauf (tragen der Taschen, Hilfe beim Einladen) und bringen Sie wieder sicher zurück. Ideal für Senioren oder Menschen mit eingeschränkter Mobilität.'
      },
      {
        title: 'Einkaufsservice / Besorgungsfahrten',
        text: 'Sie geben uns Ihre Einkaufsliste und wir erledigen den Einkauf für Sie und liefern ihn direkt an Ihre Haustür. Wir übernehmen auch Besorgungen aus der Apotheke oder von der Post.'
      },
      {
        title: 'Abholservice',
        text: 'Sie bestellen online oder telefonisch bei Ihrem Händler (Click & Collect) und wir holen die Ware für Sie ab und liefern sie zeitnah zu Ihnen nach Hause.'
      }
    ]
  },
  {
    id: 'airport',
    title: 'Flughafenfahrten / Transfer',
    icon: Plane,
    description: 'Starten Sie entspannt in den Urlaub oder Ihre Geschäftsreise. Wir bringen Sie pünktlich zum Flughafen Ihrer Wahl.',
    details: [
      {
        title: 'Pünktlichkeit & Zuverlässigkeit',
        text: 'Wir planen Ihre Fahrt großzügig, damit Sie stressfrei am Terminal ankommen. Wir bedienen alle großen Flughäfen wie Frankfurt (FRA), Hahn (HHN) oder Stuttgart (STR).'
      },
      {
        title: 'Gepäckservice & Abholung',
        text: 'Wir helfen Ihnen beim Verladen Ihres Gepäcks. Auf Wunsch holen wir Sie bei Ihrer Rückkehr auch direkt am Meeting-Point wieder ab.'
      }
    ]
  },
  {
    id: 'courier',
    title: 'Kurierfahrten / Eiltransporte',
    icon: FileText,
    description: 'Schnelle und zuverlässige Zustellung Ihrer Dokumente, Pakete oder Ersatzteile.',
    details: [
      {
        title: 'Direktfahrten ohne Umwege',
        text: 'Ihre Sendung wird ohne Zwischenstopps direkt vom Absender zum Empfänger transportiert. Ideal für zeitkritische Lieferungen.'
      },
      {
        title: 'Sicherer Dokumententransport',
        text: 'Vertrauliche Unterlagen werden von uns diskret und sicher an den Empfänger übergeben.'
      }
    ]
  },
  {
    id: 'medical',
    title: 'Krankenfahrten (Sitzend)',
    icon: Heart,
    description: 'Sitzendbeförderung zu Arztterminen, Dialyse, Chemo- oder Strahlentherapie. Zulassung bei allen Krankenkassen.',
    details: [
      {
        title: 'Direktabrechnung mit Krankenkassen',
        text: 'Bei Vorliegen einer ärztlichen Verordnung (Transportschein) und Genehmigung rechnen wir die Fahrtkosten direkt mit Ihrer Krankenkasse ab.'
      },
      {
        title: 'Begleitung bis zur Praxis',
        text: 'Unsere freundlichen Fahrer unterstützen Sie beim Ein- und Aussteigen und begleiten Sie auf Wunsch bis in die Arztpraxis.'
      }
    ]
  },
  {
    id: 'school',
    title: 'Schülerfahrten & Kindertransporte',
    icon: GraduationCap,
    description: 'Sicherer Schulweg für Ihre Kinder. Wir sorgen für eine verantwortungsvolle und pünktliche Beförderung.',
    details: [
      {
        title: 'Zuverlässiger Schulweg',
        text: 'Wir bringen Ihre Kinder sicher zur Schule, zum Kindergarten oder zu Freizeitaktivitäten und holen sie pünktlich wieder ab.'
      },
      {
        title: 'Verantwortungsvolle Fahrer',
        text: 'Unsere Fahrer sind im Umgang mit Kindern erfahren und sorgen für eine ruhige und sichere Fahrt.'
      }
    ]
  },
  {
    id: 'bus',
    title: 'Großraumbus (bis 8 Personen)',
    icon: Users,
    description: 'Viel Platz für Gruppen, Familien und Gepäck. Ideal für Ausflüge, Feiern oder Shuttle-Services.',
    details: [
      {
        title: 'Gruppenreisen & Events',
        text: 'Ob Hochzeitsgesellschaft, Betriebsausflug oder Kegeltour – wir bringen Ihre Gruppe gemeinsam ans Ziel.'
      },
      {
        title: 'Viel Stauraum für Equipment',
        text: 'Unsere Großraumfahrzeuge bieten ausreichend Platz für viel Gepäck, Sportgeräte oder Kinderwagen.'
      },
      {
        title: 'Anhänger-Option verfügbar',
        text: 'Für den Transport von Fahrrädern, Rollern oder sperrigem Equipment bieten wir optional einen Anhänger an (+15€ Aufschlag).'
      }
    ]
  },
  {
    id: 'taxicare',
    title: 'TaxiCare Service',
    icon: Stethoscope,
    description: 'Professionelle Unterstützung und Starthilfe-Service für Ihr Fahrzeug.',
    details: [
      {
        title: 'Schnelle Starthilfe',
        text: 'Ihre Batterie ist leer? Wir kommen sofort und geben Ihnen Starthilfe, damit Sie Ihre Fahrt fortsetzen können.'
      },
      {
        title: 'TaxiCare-Service',
        text: 'Unterstützung bei technischen Problemen und Koordination von Hilfeleistungen rund um Ihre Mobilität.'
      }
    ]
  }
];

const LeistungenPage: React.FC<LeistungenPageProps> = ({ onOpenBooking, onOpenImpressum, onOpenDatenschutz, onOpenTaxiCare }) => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header onOpenBooking={onOpenBooking} onOpenTaxiCare={onOpenTaxiCare} />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <div className="bg-black py-20 mb-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Unser Angebot</h2>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tighter">Leistungen</h1>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {LEISTUNGEN_DATA.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col lg:flex-row gap-12 mb-32 scroll-mt-32 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Icon & Title Side */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 p-10 rounded-sm border-t-4 border-secondary shadow-sm h-full flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                      <service.icon size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">{service.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">{service.description}</p>
                    <Button 
                      onClick={() => service.id === 'taxicare' ? (onOpenTaxiCare ? onOpenTaxiCare() : null) : onOpenBooking(service.id)}
                      className="mt-auto w-full bg-secondary hover:bg-[#d17a1a] text-white font-black uppercase tracking-widest text-[10px] py-4"
                    >
                      {service.id === 'taxicare' ? 'Mehr Infos' : 'Jetzt Buchen'}
                    </Button>
                  </div>
                </div>

                {/* Details Side */}
                <div className="lg:w-2/3">
                  <div className="space-y-8">
                    {service.details.map((detail, dIndex) => (
                      <div key={dIndex} className="group">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="mt-1 text-secondary">
                            <CheckCircle size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-black uppercase tracking-tight group-hover:text-secondary transition-colors">
                            {detail.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed pl-9 border-l-2 border-gray-100 group-hover:border-secondary transition-colors">
                          {detail.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {service.id === 'shopping' && (
                    <div className="mt-12 p-8 bg-black text-white rounded-sm shadow-xl">
                      <h4 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                        <ShoppingBag className="text-secondary" />
                        Besonderer Service
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed italic">
                        "Wir sind mehr als nur ein Taxi. Wir sind Ihr Partner im Alltag. Ob schwere Taschen oder Hilfe an der Haustür – wir sind für Sie da."
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 mt-20">
          <div className="bg-gray-50 rounded-sm p-12 md:p-20 text-center border border-gray-100">
            <h3 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter mb-6">Sie haben einen speziellen Wunsch?</h3>
            <p className="text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Es gibt viele weitere Varianten für einen denkbaren Auftrag an uns als vertrauensvolles Unternehmen in Ihren Diensten. Fragen Sie uns einfach an!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/#contact">
                <Button className="bg-black text-white px-10 py-4 uppercase font-black tracking-widest text-xs">Zum Kontakt</Button>
              </Link>
              <Button 
                onClick={() => onOpenBooking()}
                variant="outline" 
                className="border-black text-black px-10 py-4 uppercase font-black tracking-widest text-xs"
              >
                Individuelle Anfrage
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenImpressum={onOpenImpressum} onOpenDatenschutz={onOpenDatenschutz} />
    </div>
  );
};

export default LeistungenPage;
