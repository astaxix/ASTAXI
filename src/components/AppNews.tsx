
import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, Trash2, Edit2, Plus, X, Send, Loader2 } from 'lucide-react';
import { NewsPost } from '@/types';
import Button from '@/components/AppButton';
import { db, collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, Timestamp, handleFirestoreError, OperationType } from '@/firebase';

interface NewsProps {
  isAdmin?: boolean;
}

const News: React.FC<NewsProps> = ({ isAdmin }) => {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost));
      setNews(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'news'), {
        title,
        content,
        date: new Date().toISOString()
      });
      setTitle('');
      setContent('');
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'news');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'news');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'news', editingPost.id), { 
        title: editingPost.title, 
        content: editingPost.content 
      });
      setEditingPost(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'news');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="news" className="py-24 bg-[#f8f9fa]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative">
          <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Neuigkeiten</h2>
          <h3 className="text-4xl font-black text-black mb-4 tracking-tighter">Aktuelles von AS TAXI UND MIETWAGEN SERVICE</h3>
          <div className="w-16 h-1 bg-black mx-auto"></div>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="absolute top-0 right-0 p-4 bg-black text-white rounded-2xl hover:bg-secondary transition-all shadow-xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
            >
              <Plus size={16} /> Beitrag erstellen
            </button>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-secondary" size={40} />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                <Newspaper size={40} />
              </div>
              <p className="text-gray-400 font-bold italic">Derzeit gibt es keine Neuigkeiten.</p>
            </div>
          ) : (
            news.map((post) => (
              <div key={post.id} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                <div className="flex items-center gap-3 text-secondary mb-6">
                  <Calendar size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-2xl font-black text-black mb-4 tracking-tighter">{post.title}</h4>
                <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {post.content}
                </div>

                {isAdmin && (
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingPost(post)}
                      className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)}></div>
          <div className="relative bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-3xl font-black tracking-tighter">Neuen Beitrag erstellen</h4>
              <button onClick={() => setIsAdding(false)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Titel des Beitrags" 
                className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors text-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea 
                placeholder="Inhalt des Beitrags..." 
                rows={8}
                className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Wird veröffentlicht...' : <><Send size={18} /> Beitrag veröffentlichen</>}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingPost(null)}></div>
          <div className="relative bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-3xl font-black tracking-tighter">Beitrag bearbeiten</h4>
              <button onClick={() => setEditingPost(null)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-6">
              <input 
                type="text" 
                className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors text-lg"
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                required
              />
              <textarea 
                rows={8}
                className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border border-gray-100 focus:border-secondary transition-colors resize-none"
                value={editingPost.content}
                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Wird gespeichert...</> : 'Änderungen speichern'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default News;
