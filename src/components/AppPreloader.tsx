
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import Logo from '@/components/AppLogo';
import { db, doc, getDoc } from '@/firebase';

interface PreloaderProps {
  onComplete?: () => void;
}

let hasShownPreloader = false;

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(!hasShownPreloader);
  const [stats, setStats] = useState({ rating: 5.0, count: 258 });

  useEffect(() => {
    if (hasShownPreloader) {
      if (onComplete) onComplete();
      return;
    }

    const fetchStats = async () => {
      try {
        const statsDoc = await getDoc(doc(db, 'settings', 'google-stats'));
        if (statsDoc.exists()) {
          setStats(statsDoc.data() as any);
        }
      } catch (error) {
        console.error('Error fetching google stats:', error);
      }
    };
    fetchStats();

    const timer = setTimeout(() => {
      setIsVisible(false);
      hasShownPreloader = true;
      // We call onComplete slightly after the exit starts to ensure smooth transition
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12 relative"
            >
              <Logo className="h-24 md:h-32 w-auto relative z-10" variant="light" />
            </motion.div>

            {/* Google Reviews Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                  alt="Google" 
                  className="h-6 w-auto brightness-0 invert" 
                />
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex text-secondary">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-white font-black text-2xl md:text-3xl tracking-tighter">{(stats.rating || 0).toFixed(1)} Sterne</span>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                  Über {stats.count} Google Bewertungen
                </p>
              </div>
            </motion.div>
          </div>

          {/* Loading Bar */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 h-1 bg-secondary"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
