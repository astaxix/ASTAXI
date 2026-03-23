
import React from 'react';
import { X } from 'lucide-react';
import Logo from '@/components/AppLogo';
import { CONTACT_INFO } from '@/constants';

interface ImpressumProps {
  isOpen: boolean;
  onClose: () => void;
}

const Impressum: React.FC<ImpressumProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full h-full md:h-[80vh] md:max-w-4xl bg-white md:rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-slideUp">
        
        <div className="px-8 pt-10 pb-6 bg-white sticky top-0 z-30 border-b border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <Logo className="h-10 w-auto" variant="dark" />
            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          <h2 className="text-3xl font-[900] text-black tracking-tighter">Impressum</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar space-y-8">
          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Angaben gemäß § 5 TMG</h3>
            <p className="text-lg font-bold text-black leading-tight">
              AS Mietwagen Service<br />
              Semiya Atalay<br />
              Espenschiedstr 1<br />
              55411 Bingen am Rhein
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Kontakt</h3>
            <p className="text-lg font-bold text-black leading-tight">
              Telefon: 06721-681 08 08<br />
              Telefax: 06721-201 6381<br />
              E-Mail: Info@as-mietwagen-service.de
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Umsatzsteuer-ID</h3>
            <p className="text-lg font-bold text-black leading-tight">
              Umsatzsteuer-ID: 84 690 719 236<br />
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Aufsichtsbehörde</h3>
            <p className="text-lg font-bold text-black leading-tight">
              Bingen am Rhein
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Haftungsausschluss (Disclaimer)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Haftung für Inhalte<br />
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              Haftung für Links<br />
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              Urheberrecht<br />
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Datenschutzerklärung</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              (Hinweis: Weitere Details zu Facebook, Google Analytics und Twitter finden Sie in der vollständigen Datenschutzerklärung in unserem Impressum-Bereich.)
            </p>
          </section>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-black text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-dark transition-all transform active:scale-95"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
