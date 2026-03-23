
import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Calendar, Clock, ArrowRight, CheckCircle, ShoppingBag, Plane, Package, Heart, GraduationCap, Bus, Accessibility, ArrowUpDown, CreditCard, Wallet, Landmark, Search, ShieldCheck, Loader2, MailCheck, AlertCircle, Phone, LocateFixed } from 'lucide-react';
import Button from '@/components/AppButton';
import LiveMap from '@/components/AppLiveMap';
import Logo from '@/components/AppLogo';
import { BookingDetails, BookingServiceOption, PaymentMethod } from '@/types';
import { fetchPlaceSuggestions } from '@/services/locationService';
import { sendBookingEmailToOwner, sendBookingEmailToCustomer } from '@/services/emailService';
import { calculateFullTripMetrics, checkAvailability, saveBooking, calculateRoute, calculatePrice } from '@/services/bookingService';

interface BookingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedType?: string | null;
}

const SERVICE_OPTIONS: BookingServiceOption[] = [
  { id: 'standard', name: 'Normale Fahrt', description: 'Standard Personenbeförderung', basePrice: 3.70, pricePerKm: 2.50, icon: Navigation, capacity: 4, eta: 5 },
  { id: 'shopping', name: 'Einkaufsfahrten', description: 'Hilfe bei Besorgungen', basePrice: 3.70, pricePerKm: 2.50, icon: ShoppingBag, capacity: 4, eta: 5 },
  { id: 'airport', name: 'Flughafentransfer', description: 'Bingen ↔ Region', basePrice: 3.70, pricePerKm: 2.50, icon: Plane, capacity: 4, eta: 15 },
  { id: 'courier', name: 'Kurierfahrten', description: 'Pakete & Dokumente', basePrice: 3.70, pricePerKm: 2.50, icon: Package, capacity: 0, eta: 8 },
  { id: 'medical', name: 'Krankenfahrten', description: 'Sitzendbeförderung', basePrice: 3.70, pricePerKm: 2.50, icon: Heart, capacity: 1, eta: 10 },
  { id: 'school', name: 'Schülerfahrten', description: 'Sicherer Schulweg', basePrice: 3.70, pricePerKm: 2.50, icon: GraduationCap, capacity: 4, eta: 12 },
  { id: 'bus', name: 'Großraumbus', description: 'Bis 8 Personen', basePrice: 3.70, pricePerKm: 2.50, icon: Bus, capacity: 8, eta: 20 },
];

const BookingOverlay: React.FC<BookingOverlayProps> = ({ isOpen, onClose, preselectedType }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeInput, setActiveInput] = useState<'pickup' | 'destination' | null>(null);
  const [suggestions, setSuggestions] = useState<{label: string, lat: number, lon: number}[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [assignedVehicleId, setAssignedVehicleId] = useState<string | null>(null);
  const [tripMetrics, setTripMetrics] = useState<{arrivalDistanceKm: number, rideDistanceKm: number, durationMin: number} | null>(null);
  const [tripTimes, setTripTimes] = useState<{start: Date, end: Date} | null>(null);
  const [alternativeTimes, setAlternativeTimes] = useState<string[]>([]);
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const [pickupCoords, setPickupCoords] = useState<{lat: number, lon: number} | null>(null);
  const [destCoords, setDestCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if (pickupCoords && destCoords) {
      setIsCalculatingRoute(true);
      
      // Calculate full trip metrics for pricing (Home -> Pickup -> Destination)
      const p1 = calculateFullTripMetrics(pickupCoords, destCoords).then(metrics => {
        setTripMetrics(metrics);
      });

      // Calculate direct route metrics for display (Pickup -> Destination)
      const p2 = calculateRoute([
        { lat: pickupCoords.lat, lon: pickupCoords.lon },
        { lat: destCoords.lat, lon: destCoords.lon }
      ]).then(metrics => {
        setRouteDistance(metrics.distanceKm);
        setRouteDuration(metrics.durationMin);
      });

      Promise.all([p1, p2])
        .catch(console.error)
        .finally(() => setIsCalculatingRoute(false));
    }
  }, [pickupCoords, destCoords]);

  const [details, setDetails] = useState<BookingDetails>({
    pickup: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    vehicleType: 'standard',
    passengers: 1,
    name: '',
    phone: '',
    email: '',
    notes: '',
    paymentMethod: 'Bar',
    hasTrailer: false
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPickupCoords(null);
      setDestCoords(null);
      setRouteDistance(null);
      setRouteDuration(null);
      setProcessingStatus('');
      
      setDetails(prev => ({ ...prev, hasTrailer: false }));
      
      if (preselectedType) {
        setDetails(prev => ({ ...prev, vehicleType: preselectedType, hasTrailer: false }));
      }
    }
  }, [isOpen, preselectedType]);

  useEffect(() => {
    const term = activeInput === 'pickup' ? details.pickup : details.destination;
    if (term && term.length >= 2) {
      const delay = setTimeout(async () => {
        setIsLoadingSuggestions(true);
        const results = await fetchPlaceSuggestions(term);
        setSuggestions(results);
        setIsLoadingSuggestions(false);
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSuggestions([]);
    }
  }, [details.pickup, details.destination, activeInput]);

  const updateField = (field: keyof BookingDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectSuggestion = (suggestion: {label: string, lat: number, lon: number}) => {
    if (activeInput === 'pickup') {
      updateField('pickup', suggestion.label);
      setPickupCoords({ lat: suggestion.lat, lon: suggestion.lon });
    } else if (activeInput === 'destination') {
      updateField('destination', suggestion.label);
      setDestCoords({ lat: suggestion.lat, lon: suggestion.lon });
    }
    setActiveInput(null);
    setSuggestions([]);
  };

  const handleFinalSubmit = async () => {
    if (!pickupCoords || !destCoords || !assignedVehicleId || !tripMetrics || !tripTimes) return;
    
    setIsProcessing(true);
    setProcessingStatus('Übermittle Daten an Zentrale...');
    
    try {
      const selectedService = SERVICE_OPTIONS.find(s => s.id === details.vehicleType)!;
      const priceStr = getPrice(selectedService).total.replace(',', '.');
      const price = parseFloat(priceStr) || 0;

      const finalDetails = { ...details, price };

      console.log('Attempting to save booking with data:', {
        details: finalDetails,
        pickupCoords,
        destCoords,
        assignedVehicleId,
        tripMetrics,
        tripTimes
      });
      
      // Speichern in Firestore
      await saveBooking(
        finalDetails,
        pickupCoords,
        destCoords,
        tripMetrics.rideDistanceKm,
        tripMetrics.durationMin,
        assignedVehicleId,
        tripTimes.start,
        tripTimes.end
      );
      
      // Sende E-Mail an Inhaber und Kunden
      await Promise.all([
        sendBookingEmailToOwner(finalDetails, routeDistance),
        sendBookingEmailToCustomer(finalDetails)
      ]);
      
      setProcessingStatus('Bestätigung wird generiert...');
      await new Promise(r => setTimeout(r, 1000));
      
      setStep(4);
    } catch (error) {
      console.error('Booking failed:', error);
      setProcessingStatus('Fehler bei der Buchung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrice = (service: BookingServiceOption) => {
    if (!tripMetrics) return { total: '---', breakdown: null };
    
    const isLargeGroup = service.id === 'bus' || assignedVehicleId?.startsWith('bus');
    const result = calculatePrice(tripMetrics.rideDistanceKm, tripMetrics.arrivalDistanceKm, isLargeGroup);

    let total = result.total;
    // Trailer surcharge
    if (details.vehicleType === 'bus' && details.hasTrailer) {
      total += 15.00;
    }
    
    return {
      total: (total || 0).toFixed(2).replace('.', ','),
      breakdown: result.breakdown
    };
  };

  const checkRideAvailability = async () => {
    if (!pickupCoords || !destCoords) return;
    
    setIsCheckingAvailability(true);
    setProcessingStatus('Prüfe Fahrzeugverfügbarkeit...');
    
    try {
      // 1. Route berechnen (Home -> Pickup -> Destination -> Home)
      // Die neue Logik in calculateFullTripMetrics entscheidet nun selbstständig,
      // ob die Zielstrecke berechnet wird (basierend auf "Zwischendrin"-Check).
      const metrics = await calculateFullTripMetrics(pickupCoords, destCoords);
      setTripMetrics(metrics);
      
      // 2. Zeitfenster berechnen (inkl. 30 Min Puffer)
      const start = new Date(`${details.date}T${details.time}`);
      const end = new Date(start.getTime() + (metrics.durationMin + 30) * 60000);
      setTripTimes({ start, end });
      
      // 3. Verfügbarkeit prüfen
      // Großraumfahrt ist NUR wenn explizit 'bus' gewählt wurde oder mehr als 4 Personen
      const isLargeGroup = details.vehicleType === 'bus' || details.passengers >= 5;
      const available = await checkAvailability(details.date, start, end, isLargeGroup, details.hasTrailer);
      
      if (available.length > 0) {
        setAvailableVehicles(available);
        setAssignedVehicleId(available[0].id);
        setStep(3); // Gehe zu Schritt 3 (Persönliche Daten)
        setShowAvailabilityError(false);
      } else {
        // Alternativen suchen
        const alternatives: string[] = [];
        const offsets = [-60, -30, 30, 60, 90, 120];
        for (const offset of offsets) {
          const altStart = new Date(start.getTime() + offset * 60000);
          if (altStart < new Date()) continue;
          
          const altEnd = new Date(altStart.getTime() + (metrics.durationMin + 30) * 60000);
          const altAvailable = await checkAvailability(details.date, altStart, altEnd, isLargeGroup, details.hasTrailer);
          if (altAvailable.length > 0) {
            alternatives.push(altStart.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
          }
          if (alternatives.length >= 3) break;
        }
        setAlternativeTimes(alternatives);
        setShowAvailabilityError(true);
      }
    } catch (error) {
      console.error('Availability check failed:', error);
    } finally {
      setIsCheckingAvailability(false);
      setProcessingStatus('');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation wird von Ihrem Browser nicht unterstützt.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPickupCoords({ lat: latitude, lon: longitude });
        
        // Reverse Geocoding via OSRM/Nominatim (vereinfacht)
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          updateField('pickup', data.display_name || 'Aktueller Standort');
        } catch (e) {
          updateField('pickup', 'Aktueller Standort');
        }
        setActiveInput(null);
      },
      (error) => {
        console.error('Standort konnte nicht ermittelt werden:', error);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center font-sans overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full h-[100dvh] md:h-[90vh] md:max-w-7xl bg-white md:rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden animate-slideUp">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-[480px] bg-white flex flex-col z-20 shadow-[20px_0_40px_rgba(0,0,0,0.05)] relative order-1 h-full overflow-hidden">
          
          <div className="px-6 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6 bg-white sticky top-0 z-30">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <Logo className="h-8 md:h-10 w-auto" variant="dark" />
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors"><X size={18} /></button>
            </div>
            <h2 className="text-2xl md:text-3xl font-[900] text-black tracking-tighter mb-1">
              {step === 1 ? 'Fahrt planen' : step === 2 ? 'Klasse wählen' : step === 3 ? 'Bestätigung' : 'Fertig'}
            </h2>
            <div className="flex gap-1.5 mt-4 md:mt-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-secondary' : 'bg-gray-100'}`} />
               ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-2 custom-scrollbar">
            {step === 1 && (
              <div className="space-y-4 md:space-y-6 animate-fadeIn pb-4">
                {/* Address Inputs */}
                <div className="bg-gray-50/50 p-1.5 rounded-[25px] md:rounded-[35px] border border-gray-100 relative">
                  <div className="relative bg-white rounded-[20px] md:rounded-[28px] shadow-lg border border-gray-100 p-4 md:p-6">
                    <div className="absolute left-[27px] md:left-[39px] top-[45px] md:top-[65px] bottom-[45px] md:bottom-[65px] w-0.5 bg-gray-100"></div>
                    
                    <div className="relative mb-4 md:mb-8">
                      <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Abholung</label>
                      <div className="relative flex items-center">
                        <input 
                          className="w-full bg-transparent outline-none font-extrabold text-base md:text-lg text-black truncate pr-8" 
                          placeholder="Startadresse..."
                          value={details.pickup} 
                          onChange={e => {updateField('pickup', e.target.value); setActiveInput('pickup'); setShowAvailabilityError(false);}}
                          onFocus={() => setActiveInput('pickup')}
                        />
                        {details.pickup && (
                          <button 
                            type="button"
                            onClick={() => { updateField('pickup', ''); setPickupCoords(null); }}
                            className="absolute right-2 p-1 text-gray-400 hover:text-black transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Ziel</label>
                      <div className="relative flex items-center">
                        <input 
                          className="w-full bg-transparent outline-none font-extrabold text-base md:text-lg text-black truncate pr-8" 
                          placeholder="Zieladresse..." 
                          value={details.destination}
                          onChange={e => {updateField('destination', e.target.value); setActiveInput('destination'); setShowAvailabilityError(false);}}
                          onFocus={() => setActiveInput('destination')}
                        />
                        {details.destination && (
                          <button 
                            type="button"
                            onClick={() => { updateField('destination', ''); setDestCoords(null); }}
                            className="absolute right-2 p-1 text-gray-400 hover:text-black transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {activeInput && (details.pickup || details.destination || activeInput === 'pickup') && (
                      <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-50 p-3 animate-slideUp max-h-[200px] overflow-y-auto">
                        <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 px-3 flex justify-between items-center">
                           <span>Adressvorschläge</span>
                           {isLoadingSuggestions && <Loader2 size={10} className="animate-spin text-secondary"/>}
                        </div>
                        
                        {activeInput === 'pickup' && (
                          <button 
                            onClick={handleUseCurrentLocation}
                            className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl transition-colors text-left group border-b border-gray-50 mb-1"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                              <LocateFixed size={16} />
                            </div>
                            <div>
                              <span className="block text-sm font-black text-black">Meinen Standort verwenden</span>
                              <span className="block text-[10px] font-bold text-gray-400">GPS nutzen</span>
                            </div>
                          </button>
                        )}

                        {suggestions.length > 0 ? suggestions.map((s, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleSelectSuggestion(s)} 
                            className="w-full text-left p-2.5 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-all group"
                          >
                            <div className="bg-gray-100 p-1.5 rounded-lg text-gray-400 group-hover:bg-secondary group-hover:text-white transition-colors">
                                <MapPin size={14} />
                            </div>
                            <span className="font-bold text-[10px] text-gray-800 line-clamp-2 leading-relaxed">{s.label}</span>
                          </button>
                        )) : !isLoadingSuggestions && (
                          <div className="p-3 text-center text-[10px] text-gray-400 font-bold italic">Keine Ergebnisse</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Map View */}
                <div className="md:hidden h-[200px] rounded-[25px] overflow-hidden relative shadow-inner border border-gray-100">
                   <LiveMap 
                     key={isOpen ? 'map-mobile-active' : 'map-mobile-inactive'}
                     pickupCoords={pickupCoords ? { lat: pickupCoords.lat, lng: pickupCoords.lon } : null}
                     destinationCoords={destCoords ? { lat: destCoords.lat, lng: destCoords.lon } : null}
                   />
                   {/* Compact Route Info Overlay */}
                   {(routeDistance || isCalculatingRoute) && (
                     <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 z-20 flex items-center gap-3 animate-fadeIn">
                        <div className="bg-black w-8 h-8 rounded-xl flex items-center justify-center text-white">
                            {isCalculatingRoute ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} fill="white" />}
                        </div>
                        <div>
                            {isCalculatingRoute ? (
                              <span className="text-[12px] font-black text-black block leading-none">Berechne Route...</span>
                            ) : (
                              <>
                                <span className="text-[14px] font-black text-black block leading-none">{(routeDistance || 0).toFixed(1)} km</span>
                                <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">Ca. {routeDuration} Min.</span>
                              </>
                            )}
                        </div>
                     </div>
                   )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-white rounded-[20px] md:rounded-[28px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 md:mb-2"><Calendar size={10} className="inline mr-1 md:mr-2"/> Datum</span>
                    <input type="date" className="w-full font-black text-sm md:text-base bg-transparent outline-none cursor-pointer" value={details.date} onChange={e => updateField('date', e.target.value)}/>
                  </div>
                  <div className="bg-white rounded-[20px] md:rounded-[28px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 md:mb-2"><Clock size={10} className="inline mr-1 md:mr-2"/> Zeit</span>
                    <input type="time" className="w-full font-black text-sm md:text-base bg-transparent outline-none cursor-pointer" value={details.time} onChange={e => {updateField('time', e.target.value); setShowAvailabilityError(false);}}/>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                {SERVICE_OPTIONS.map(service => (
                  <div 
                    key={service.id} 
                    onClick={() => updateField('vehicleType', service.id)}
                    className={`p-4 md:p-5 rounded-[25px] md:rounded-[30px] border-2 cursor-pointer transition-all ${details.vehicleType === service.id ? 'border-secondary bg-orange-50/30' : 'border-gray-50 bg-white hover:border-gray-100 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${details.vehicleType === service.id ? 'bg-secondary text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                        <service.icon size={20} className="md:w-7 md:h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-black text-sm md:text-base truncate">{service.name}</h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg md:text-xl font-[900] text-black whitespace-nowrap">{getPrice(service).total} €</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Additional Options */}
                {details.vehicleType === 'bus' && (
                  <div className="bg-gray-50 p-6 rounded-[30px] space-y-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-black">Personenanzahl</span>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => updateField('passengers', Math.max(1, details.passengers - 1))}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-black font-black hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="font-black text-lg w-4 text-center">{details.passengers}</span>
                          <button 
                            onClick={() => updateField('passengers', Math.min(8, details.passengers + 1))}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-black font-black hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {details.passengers >= 5 && (
                        <div className="bg-orange-100 text-orange-800 p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                          Großraumzuschlag (+5,90 €) aktiv
                        </div>
                      )}

                      {/* Trailer Option */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${details.hasTrailer ? 'bg-secondary text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                              <ArrowUpDown size={20} className="rotate-90" />
                            </div>
                            <div>
                              <span className="text-sm font-black text-black block leading-none">Mit Anhänger</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">Für Fahrrad, Roller etc. (+15€)</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => updateField('hasTrailer', !details.hasTrailer)}
                            className={`w-14 h-8 rounded-full transition-all relative ${details.hasTrailer ? 'bg-secondary' : 'bg-gray-200'}`}
                          >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${details.hasTrailer ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" placeholder="Vor- und Zuname" className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors" value={details.name} onChange={e => updateField('name', e.target.value)}/>
                  <input type="email" placeholder="E-Mail Adresse" className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors" value={details.email} onChange={e => updateField('email', e.target.value)}/>
                  <input type="tel" placeholder="Telefonnummer" className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors" value={details.phone} onChange={e => updateField('phone', e.target.value)}/>
                </div>

                <div className="bg-black text-white p-6 md:p-8 rounded-[35px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Preisaufschlüsselung</span>
                            <ShieldCheck size={16} className="text-secondary" />
                        </div>
                        
                        {/* Detailed Breakdown */}
                        <div className="space-y-2 mb-6 border-b border-white/10 pb-6">
                          {(() => {
                            const priceInfo = getPrice(SERVICE_OPTIONS.find(s => s.id === details.vehicleType)!);
                            const b = priceInfo.breakdown;
                            if (!b) return null;
                            return (
                              <>
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className="text-gray-400 uppercase tracking-wider">Grundgebühr:</span>
                                  <span>{b.baseFee.toFixed(2).replace('.', ',')} €</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className="text-gray-400 uppercase tracking-wider">Fahrt ({b.rideDistanceKm.toFixed(1)} km):</span>
                                  <span>{b.ridePrice.toFixed(2).replace('.', ',')} €</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className="text-gray-400 uppercase tracking-wider">Anfahrt ({b.arrivalDistanceKm.toFixed(1)} km):</span>
                                  <span>{b.arrivalFee > 0 ? `${b.arrivalFee.toFixed(2).replace('.', ',')} €` : '0,00 € (Inklusive)'}</span>
                                </div>
                                {b.largeGroupFee > 0 && (
                                  <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-gray-400 uppercase tracking-wider">Großraumzuschlag:</span>
                                    <span>{b.largeGroupFee.toFixed(2).replace('.', ',')} €</span>
                                  </div>
                                )}
                                {details.hasTrailer && (
                                  <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-gray-400 uppercase tracking-wider">Anhängerzuschlag:</span>
                                    <span>15,00 €</span>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        <div className="text-4xl md:text-5xl font-[900]">
                            <span className="text-xl mr-2">ca.</span>
                            {getPrice(SERVICE_OPTIONS.find(s => s.id === details.vehicleType)!).total} <span className="text-xl text-secondary">€</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Preise tarifgebunden Kreisverwaltung Mainz-Bingen
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Zahlung beim Fahrer:</span>
                            <div className="flex gap-2">
                              <div className="bg-white/10 px-2 py-1 rounded text-[9px] font-black">BAR</div>
                              <div className="bg-white/10 px-2 py-1 rounded text-[9px] font-black">EC</div>
                              <div className="bg-white/10 px-2 py-1 rounded text-[9px] font-black">PAYPAL</div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-24 h-24 bg-green-500 rounded-[35px] flex items-center justify-center mb-8 shadow-2xl shadow-green-200 animate-bounce">
                  <CheckCircle size={48} className="text-white"/>
                </div>
                <h3 className="text-3xl font-[900] text-black mb-4 tracking-tighter">Reserviert!</h3>
                <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto leading-relaxed">Ihre Fahrt wurde erfolgreich übermittelt. Wir holen Sie pünktlich ab!</p>
                <Button onClick={onClose} className="bg-black text-white px-16 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Schliessen</Button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="p-8 pt-4 bg-white border-t border-gray-50">
              <div className="flex gap-3">
                {step > 1 && (
                    <button onClick={() => setStep(s => (s-1) as any)} className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-black border border-gray-100 hover:bg-gray-100 transition-colors">
                        <ArrowUpDown size={22} className="rotate-90" />
                    </button>
                )}
                <button 
                  onClick={step === 1 ? () => setStep(2) : step === 2 ? checkRideAvailability : step === 3 ? handleFinalSubmit : () => setStep(s => (s+1) as any)}
                  disabled={isProcessing || isCheckingAvailability || (step === 1 && (!details.pickup || !details.destination)) || (step === 3 && (!details.name || !details.phone || !details.email))}
                  className="flex-1 bg-black text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-20 flex items-center justify-center gap-3 shadow-xl hover:bg-dark transition-all transform active:scale-95"
                >
                  {isProcessing || isCheckingAvailability ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] opacity-70 mb-0.5">{processingStatus}</span>
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                  ) : step === 3 ? 'Kostenpflichtig Buchen' : 'Weiter'}
                  {step < 3 && !isProcessing && !isCheckingAvailability && <ArrowRight size={18}/>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Map Container (Desktop only) */}
        <div className="hidden md:flex flex-1 bg-[#f0f2f5] relative overflow-hidden h-full">
           <LiveMap 
             key={isOpen ? 'map-desktop-active' : 'map-desktop-inactive'}
             pickupCoords={pickupCoords ? { lat: pickupCoords.lat, lng: pickupCoords.lon } : null}
             destinationCoords={destCoords ? { lat: destCoords.lat, lng: destCoords.lon } : null}
           />
           
           {/* Floating Map UI Info */}
           <div className="absolute bottom-10 left-10 right-10 flex justify-center z-30">
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 min-w-[340px] animate-fadeIn">
                <div className="flex items-center gap-6">
                    <div className="bg-black w-14 h-14 rounded-[22px] flex items-center justify-center text-white shadow-xl flex-shrink-0">
                        {isCalculatingRoute ? <Loader2 size={28} className="animate-spin" /> : <Navigation size={28} fill="white" className={routeDistance ? 'animate-pulse' : ''} />}
                    </div>
                    <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Live Route Info</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-[900] text-black leading-none">
                              {isCalculatingRoute ? '...' : (routeDistance ? `${routeDistance.toFixed(1)} km` : '-- km')}
                            </span>
                        </div>
                        <span className="text-[11px] font-bold text-secondary block mt-1 uppercase tracking-wider">
                          {isCalculatingRoute ? 'Berechne Route...' : (routeDuration ? `Ca. ${routeDuration} Minuten` : 'Warte auf Adressen...')}
                        </span>
                    </div>
                </div>
              </div>
           </div>
        </div>

        {/* Availability Error Popup */}
        {showAvailabilityError && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowAvailabilityError(false)}></div>
            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 md:p-10 animate-slideUp">
              <button 
                onClick={() => setShowAvailabilityError(false)}
                className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                <AlertCircle size={32} />
              </div>

              <h3 className="text-2xl font-[900] text-black tracking-tighter mb-2">Uhrzeit nicht verfügbar</h3>
              <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8">
                Leider sind zu dieser Zeit alle Fahrzeuge belegt. Bitte wählen Sie eine andere Uhrzeit oder rufen Sie uns direkt an.
              </p>

              {alternativeTimes.length > 0 && (
                <div className="mb-8">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Vorschläge für heute:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {alternativeTimes.map(time => (
                      <button 
                        key={time}
                        onClick={() => {
                          updateField('time', time);
                          setShowAvailabilityError(false);
                        }}
                        className="py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm text-black hover:border-secondary hover:text-secondary hover:bg-orange-50 transition-all"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <a 
                  href="tel:+4917612345678" 
                  className="flex items-center justify-center gap-3 w-full bg-black text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-dark transition-all"
                >
                  <Phone size={18} /> Jetzt anrufen
                </a>
                <button 
                  onClick={() => setShowAvailabilityError(false)}
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-black transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingOverlay;
