
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Settings, MessageSquare, Newspaper, ShieldCheck, Calendar as CalendarIcon, ArrowLeft, Loader2, User, Key, BarChart3 } from 'lucide-react';
import { auth, signOut, db, doc, onSnapshot, setDoc, signInAnonymously, onAuthStateChanged } from '@/firebase';
import Guestbook from '@/components/AppGuestbook';
import News from '@/components/AppNews';
import AdminCalendar from '@/components/AppAdminCalendar';
import AdminAnalytics from '@/components/AppAdminAnalytics';
import Button from '@/components/AppButton';
import Logo from '@/components/AppLogo';

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'guestbook' | 'stats' | 'calendar' | 'analytics'>('calendar');
  const [googleStats, setGoogleStats] = useState({ rating: 4.9, count: 255 });
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);

  useEffect(() => {
    // Track Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setIsAuthReady(true);
      if (firebaseUser) {
        console.log('Firebase Auth: User is authenticated', firebaseUser.uid);
      } else {
        console.log('Firebase Auth: User is not authenticated');
      }
    });

    // Check for existing session
    const restoreSession = async () => {
      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      try {
        const sessionToken = sessionStorage.getItem('adminToken');
        if (sessionToken === 'admin-session-token-123') {
          setIsAdmin(true);
          setUser({ email: 'admin@as-taxi.de', displayName: 'AS.TAXI' });
          
          // Background auth - wait for it if possible or let onAuthStateChanged handle it
          if (!auth.currentUser) {
            await signInAnonymously(auth).catch(err => console.error('Background auth failed:', err));
          }
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        clearTimeout(safetyTimer);
        setIsLoading(false);
      }
    };
    
    restoreSession();

    // Fetch Google Stats from Firestore
    const statsUnsubscribe = onSnapshot(doc(db, 'settings', 'google-stats'), (doc) => {
      if (doc.exists()) {
        setGoogleStats(doc.data() as any);
      }
    }, (error) => {
      console.error('Error fetching stats:', error);
    });

    return () => {
      unsubscribeAuth();
      statsUnsubscribe();
    };
  }, []);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30s for cold starts

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Anmeldung fehlgeschlagen';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          errorMessage = `Server-Fehler: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('adminToken', data.token);
        setIsAdmin(true);
        setUser({ email: 'admin@as-taxi.de', displayName: 'AS.TAXI' });
        
        // Background auth to Firebase so we can use Firestore
        try {
          await signInAnonymously(auth);
          console.log('Firebase Auth Success (Background)');
        } catch (authErr) {
          console.error('Firebase Auth Error (Background):', authErr);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.name === 'AbortError') {
        setError('Zeitüberschreitung bei der Verbindung. Der Server braucht zu lange zum Antworten (Cold Start). Bitte versuchen Sie es gleich noch einmal.');
      } else {
        setError('Verbindungsfehler zum Server. Bitte prüfen Sie Ihre Internetverbindung oder ob der Server läuft.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('adminToken');
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsAdmin(false);
    setUser(null);
  };

  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStats(true);
    try {
      // Use setDoc with merge: true to create or update the document
      await setDoc(doc(db, 'settings', 'google-stats'), {
        rating: googleStats.rating,
        count: googleStats.count
      }, { merge: true });
      console.log('Google Statistiken aktualisiert!');
    } catch (err: any) {
      console.error('Fehler beim Aktualisieren der Statistiken:', err);
      setError('Fehler beim Speichern der Statistiken: ' + err.message);
    } finally {
      setIsUpdatingStats(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl border border-gray-100 animate-slideUp">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-black rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
              <Lock size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Admin Login</h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Nur für autorisiertes Personal</p>
          </div>
          
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Benutzername</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 ring-black transition-all"
                  placeholder="Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Passwort</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 ring-black transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-secondary transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              Anmelden
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo className="h-10 w-auto" variant="dark" />
            <div className="h-8 w-px bg-gray-100 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin Modus Aktiv</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Cloud Database Live</span>
            </div>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-400 hover:text-black font-black uppercase tracking-widest text-[10px] transition-colors"
            >
              <ArrowLeft size={16} /> Zur Website
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-black uppercase tracking-widest text-[10px] transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${activeTab === 'calendar' ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
            >
              <CalendarIcon size={18} /> Kalender
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${activeTab === 'news' ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
            >
              <Newspaper size={18} /> Neuigkeiten
            </button>
            <button 
              onClick={() => setActiveTab('guestbook')}
              className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${activeTab === 'guestbook' ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
            >
              <MessageSquare size={18} /> Gästebuch
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${activeTab === 'analytics' ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
            >
              <BarChart3 size={18} /> Analyse
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${activeTab === 'stats' ? 'bg-black text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
            >
              <Settings size={18} /> Google Stats
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              {!isAuthReady ? (
                <div className="p-10 md:p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-secondary" size={32} />
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Verbindung zur Datenbank wird hergestellt...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'calendar' && <AdminCalendar />}
                  {activeTab === 'news' && <News isAdmin={true} />}
                  {activeTab === 'guestbook' && <Guestbook isAdmin={true} />}
                  {activeTab === 'analytics' && <AdminAnalytics />}
                  {activeTab === 'stats' && (
                    <div className="p-6 md:p-10">
                      <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-6 md:mb-8">Google Statistiken</h3>
                      <form onSubmit={handleUpdateStats} className="space-y-6 max-w-md">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Google Bewertung (Sterne)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              min="0"
                              max="5"
                              className="w-full bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors text-sm"
                              value={googleStats.rating}
                              onChange={(e) => setGoogleStats({...googleStats, rating: parseFloat(e.target.value)})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Anzahl der Bewertungen</label>
                            <input 
                              type="number" 
                              className="w-full bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors text-sm"
                              value={googleStats.count}
                              onChange={(e) => setGoogleStats({...googleStats, count: parseInt(e.target.value)})}
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" disabled={isUpdatingStats} className="w-full bg-black text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl">
                          {isUpdatingStats ? 'Wird gespeichert...' : 'Statistiken speichern'}
                        </Button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
