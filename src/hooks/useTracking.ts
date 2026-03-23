
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db, collection, addDoc } from '@/firebase';

export const useTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitData = {
          path: location.pathname + location.hash,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
        };
        
        await addDoc(collection(db, 'visits'), visitData);
      } catch (error) {
        // Silent fail for tracking
        console.warn('Tracking failed:', error);
      }
    };

    trackVisit();
  }, [location.pathname, location.hash]);
};
