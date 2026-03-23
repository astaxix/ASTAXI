
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Trash2, Edit2, Send, X, Loader2 } from 'lucide-react';
import { Review } from '@/types';
import Button from '@/components/AppButton';
import { db, collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, handleFirestoreError, OperationType } from '@/firebase';

interface GuestbookProps {
  isAdmin?: boolean;
}

const Guestbook: React.FC<GuestbookProps> = ({ isAdmin }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ rating: 5.0, count: 258 });
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sourceToAdd, setSourceToAdd] = useState<'local' | 'google'>('local');

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    const settingsUnsubscribe = onSnapshot(doc(db, 'settings', 'google-stats'), (doc) => {
      if (doc.exists()) {
        setStats(doc.data() as any);
      }
    }, (error) => {
      // Settings might not exist yet, ignore error
    });

    return () => {
      unsubscribe();
      settingsUnsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name,
        message,
        rating,
        date: new Date().toISOString(),
        source: isAdmin ? sourceToAdd : 'local'
      });
      setName('');
      setMessage('');
      setRating(5);
      setSourceToAdd('local');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'reviews');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'reviews', editingReview.id), { 
        name: editingReview.name, 
        message: editingReview.message, 
        rating: editingReview.rating,
        source: editingReview.source
      });
      setEditingReview(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'reviews');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Gästebuch</h2>
          <h3 className="text-4xl font-black text-black mb-4 tracking-tighter">Was unsere Kunden sagen</h3>
          <div className="w-16 h-1 bg-black mx-auto mb-8"></div>
          
          {/* Google Reviews Badge */}
          <a 
            href="https://www.google.com/search?q=AS+MIETWAGEN+Bingen+Bewertungen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-5 w-auto" />
            <div className="text-left border-l border-gray-100 pl-4">
              <div className="flex text-[#fbbc05] mb-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-secondary transition-colors">
                {(stats.rating || 0).toFixed(1)} Sterne ({stats.count} Bewertungen)
              </div>
            </div>
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Form to add review */}
          {(true) && (
            <div className="bg-gray-50 rounded-[40px] p-8 mb-16 border border-gray-100 shadow-sm">
              <h4 className="text-xl font-black mb-6">{isAdmin ? 'Bewertung hinzufügen (Admin)' : 'Bewertung hinterlassen'}</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full bg-white rounded-2xl p-4 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="flex items-center gap-2 bg-white rounded-2xl p-4 border border-gray-100">
                    <span className="text-xs font-black uppercase text-gray-400 mr-2">Bewertung:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`transition-colors ${rating >= star ? 'text-secondary' : 'text-gray-200'}`}
                      >
                        <Star size={20} fill={rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  placeholder="Nachricht..." 
                  rows={4}
                  className="w-full bg-white rounded-2xl p-4 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Wird gesendet...' : <><Send size={16} /> {isAdmin ? 'Hinzufügen' : 'Bewertung absenden'}</>}
                  </Button>
                  {isAdmin && (
                    <select 
                      className="bg-white rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-[10px] border border-gray-100 outline-none focus:border-secondary transition-colors"
                      value={sourceToAdd}
                      onChange={(e) => setSourceToAdd(e.target.value as any)}
                    >
                      <option value="local">Lokal</option>
                      <option value="google">Google</option>
                    </select>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-secondary" size={32} />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-bold italic">Noch keine Bewertungen vorhanden.</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                        <User size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-black">{review.name}</h5>
                          {review.source === 'google' && (
                            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-3 w-auto" />
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(review.date).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill={review.rating >= star ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium">{review.message}</p>

                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingReview(review)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingReview(null)}></div>
          <div className="relative bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-black tracking-tighter">Bewertung bearbeiten</h4>
              <button onClick={() => setEditingReview(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input 
                type="text" 
                className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors"
                value={editingReview.name}
                onChange={(e) => setEditingReview({...editingReview, name: e.target.value})}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setEditingReview({...editingReview, rating: star})}
                      className={`transition-colors ${editingReview.rating >= star ? 'text-secondary' : 'text-gray-200'}`}
                    >
                      <Star size={20} fill={editingReview.rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <select 
                  className="bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors"
                  value={editingReview.source || 'local'}
                  onChange={(e) => setEditingReview({...editingReview, source: e.target.value as any})}
                >
                  <option value="local">Lokal</option>
                  <option value="google">Google</option>
                </select>
              </div>
              <textarea 
                rows={4}
                className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors resize-none"
                value={editingReview.message}
                onChange={(e) => setEditingReview({...editingReview, message: e.target.value})}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> Wird gespeichert...</> : 'Änderungen speichern'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Guestbook;
