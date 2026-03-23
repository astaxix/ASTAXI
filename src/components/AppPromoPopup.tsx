
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose }) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShouldShow(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // iPhone-friendly number: no spaces, no (0), just digits and +
  const dialNumber = CONTACT_INFO.mobile.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');

  return (
    <AnimatePresence>
      {shouldShow && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-sm overflow-hidden shadow-2xl"
          >
            {/* Close Button - Larger for iPad/Touch */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-20 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-colors shadow-lg"
              aria-label="Schließen"
            >
              <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative">
              <img
                src="https://i.ibb.co/TxnqKbxB/Untitled-design.png"
                alt="Starthilfe & Service"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Call Button - Positioned over the visual button in the image */}
              <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[85%] h-[15%]">
                <a
                  href={`tel:${dialNumber}`}
                  className="w-full h-full bg-transparent cursor-pointer flex items-center justify-center group"
                  aria-label="Anrufen"
                >
                  <div className="opacity-0 group-hover:opacity-10 bg-black/10 w-full h-full rounded-full transition-opacity"></div>
                </a>
              </div>
            </div>

            {/* Text Call Button (Alternative for accessibility and clarity) */}
            <div className="p-3 bg-black">
              <a
                href={`tel:${dialNumber}`}
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-sm font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone size={16} fill="currentColor" />
                Jetzt Hilfe rufen
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;
