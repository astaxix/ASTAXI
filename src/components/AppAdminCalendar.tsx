
import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, Timestamp } from '@/firebase';
import { Calendar as CalendarIcon, Clock, MapPin, User, Phone, Info, CheckCircle, XCircle, Loader2, AlertTriangle, X } from 'lucide-react';
import { cancelBooking } from '@/services/bookingService';

interface Booking {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleId: string;
  passengers: number;
  price: number;
  status: string;
  hasTrailer?: boolean;
  startTime?: string;
  endTime?: string;
}

const AdminCalendar: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('date', 'desc'), orderBy('time', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
      setLoading(false);
    }, (error) => {
      console.error('Calendar onSnapshot error:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCancelClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedBookingId(id);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingId || !cancelReason.trim()) return;
    
    setCancellingId(selectedBookingId);
    setShowCancelModal(false);
    
    const success = await cancelBooking(selectedBookingId, cancelReason);
    if (success) {
      console.log('Buchung wurde erfolgreich storniert und der Kunde wurde benachrichtigt.');
    } else {
      console.error('Fehler beim Stornieren der Buchung.');
    }
    setCancellingId(null);
    setSelectedBookingId(null);
  };

  const filteredBookings = bookings.filter(b => b.date === selectedDate);

  const getVehicleName = (id: string) => {
    if (id.startsWith('bus')) return 'Großraumbus';
    return 'Standard PKW';
  };

  return (
    <div className="p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tighter mb-1">Buchungskalender</h3>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Fahrten am {new Date(selectedDate).toLocaleDateString('de-DE')}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
          <CalendarIcon size={16} className="text-secondary" />
          <input 
            type="date" 
            className="bg-transparent font-black outline-none cursor-pointer text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-secondary" size={32} />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-gray-50 rounded-[30px] p-16 text-center border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 mx-auto mb-4 shadow-sm">
            <CalendarIcon size={32} />
          </div>
          <h4 className="text-lg font-black text-gray-400">Keine Buchungen</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredBookings.map((booking) => {
            const isExpanded = expandedId === booking.id;
            return (
              <div 
                key={booking.id} 
                onClick={() => toggleExpand(booking.id)}
                className={`bg-white rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group relative ${isExpanded ? 'ring-1 ring-black ring-inset' : ''}`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${booking.vehicleType === 'bus' ? 'bg-secondary' : 'bg-black'}`}></div>
                
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                        <Clock size={18} />
                      </div>
                      <div>
                        <span className="text-lg font-black block leading-none">{booking.time} Uhr</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 block">{booking.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="hidden sm:block">
                        <p className="font-bold text-xs text-black truncate max-w-[180px]">
                          {booking.pickup.split(',')[0]} → {booking.destination.split(',')[0]}
                        </p>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <span className="text-base font-black text-black">
                          {(booking.price || 0).toFixed(2).replace('.', ',')} €
                        </span>
                        <div className="flex items-center gap-1 justify-end">
                          <div className={`w-1 h-1 rounded-full ${booking.status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <span className={`text-[7px] font-black uppercase tracking-widest ${booking.status === 'cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                            {booking.status === 'cancelled' ? 'Storniert' : 'OK'}
                          </span>
                        </div>
                      </div>

                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <Info size={14} className="text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-6 pt-5 border-t border-gray-50 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin size={14} className="text-gray-400 mt-1" />
                            <div>
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Route</span>
                              <p className="font-bold text-xs text-black leading-relaxed">
                                <span className="text-gray-400">VON:</span> {booking.pickup} <br />
                                <span className="text-gray-400">NACH:</span> {booking.destination}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="text-gray-400"><Phone size={14} /></div>
                            <div>
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Tel</span>
                              <p className="font-bold text-xs text-black">{booking.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-gray-400"><User size={14} /></div>
                            <div>
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Pers</span>
                              <p className="font-bold text-xs text-black">{booking.passengers}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-4 pt-5 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${booking.vehicleType === 'bus' ? 'bg-orange-50 text-secondary' : 'bg-gray-50 text-black'}`}>
                            <Info size={14} />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">
                            {getVehicleName(booking.vehicleId)}
                            {booking.hasTrailer && <span className="text-secondary ml-1.5">+ Anhänger</span>}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => handleCancelClick(e, booking.id)}
                          disabled={cancellingId === booking.id || booking.status === 'cancelled'}
                          className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${booking.status === 'cancelled' ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                        >
                          {cancellingId === booking.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {booking.status === 'cancelled' ? 'Storniert' : 'Stornieren'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowCancelModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 md:p-10 animate-slideUp">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-2xl font-[900] text-black tracking-tighter mb-2">Fahrt stornieren</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6">
              Bitte geben Sie einen Grund für die Stornierung an. Dieser wird dem Kunden per E-Mail mitgeteilt.
            </p>

            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Stornierungsgrund</label>
              <textarea 
                className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-red-200 transition-colors min-h-[120px] resize-none"
                placeholder="z.B. Fahrzeugdefekt, Personalmangel..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmCancel}
                disabled={!cancelReason.trim()}
                className="flex items-center justify-center gap-3 w-full bg-red-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-red-700 transition-all disabled:opacity-20"
              >
                <XCircle size={18} /> Definitiv stornieren
              </button>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-black transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
