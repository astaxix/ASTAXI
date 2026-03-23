import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

interface TaxiCarePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaxiCarePopup: React.FC<TaxiCarePopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <img 
              src="https://i.ibb.co/TxnqKbxB/Untitled-design.png" 
              alt="TaxiCare" 
              className="w-full h-auto rounded-2xl mb-6"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col gap-4">
              <a 
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                className="bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-secondary transition-all"
              >
                <Phone size={18} /> Jetzt anrufen
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaxiCarePopup;
