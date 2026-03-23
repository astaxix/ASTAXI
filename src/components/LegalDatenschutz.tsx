
import React from 'react';
import { X, Shield } from 'lucide-react';
import Logo from '@/components/AppLogo';

interface DatenschutzProps {
  isOpen: boolean;
  onClose: () => void;
}

const Datenschutz: React.FC<DatenschutzProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-3xl font-[900] text-black tracking-tighter">Datenschutzerklärung</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar space-y-8">
          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Shield size={14} /> 1. Datenschutz auf einen Blick
            </h3>
            <h4 className="font-bold text-black mb-2">Allgemeine Hinweise</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">2. Datenerfassung auf dieser Website</h3>
            <h4 className="font-bold text-black mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
            <h4 className="font-bold text-black mt-4 mb-2">Wie erfassen wir Ihre Daten?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">3. Buchungssystem & Datenspeicherung</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Wenn Sie unser Buchungssystem nutzen, werden die von Ihnen eingegebenen Daten (Name, Telefonnummer, E-Mail, Abhol- und Zielort, Datum, Uhrzeit) zur Bearbeitung Ihrer Anfrage verarbeitet. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
            </p>
            <h4 className="font-bold text-black mb-2">Google Firebase & Firestore</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wir nutzen Google Firebase (ein Dienst der Google Ireland Limited) zur Speicherung und Verwaltung Ihrer Buchungsdaten in Echtzeit (Cloud Firestore). Die Daten werden auf Servern von Google verarbeitet, wobei ein angemessenes Datenschutzniveau durch Standardvertragsklauseln gewährleistet wird. Ihre Daten werden verschlüsselt übertragen und gespeichert.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">4. Datensicherheit</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Buchungsanfragen, eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">5. Ihre Rechte</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen.
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

export default Datenschutz;
