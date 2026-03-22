import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Download, Clock, Search } from 'lucide-react';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ownedGames, setOwnedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/library/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setOwnedGames(data);
        }
      } catch (e) {
        console.error('Failed to fetch library', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const filteredGames = ownedGames.filter(own =>
    own.game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-black mb-2">My Library</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Manage and play your collection of awesome indie games.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-100 dark:bg-[#0f0c29]/50 border border-transparent dark:border-white/10 focus:ring-2 focus:ring-accent transition-all outline-none backdrop-blur-md text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredGames.map((own, index) => (
            <motion.div
              key={own.ownershipId}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card group flex flex-col cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={own.game.coverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'}
                  alt={own.game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <a 
                  href={own.game.fileUrl !== '#' ? own.game.fileUrl : undefined}
                  className={`absolute bottom-4 right-4 text-white p-3 rounded-full transition-colors shadow-lg transform hover:scale-110 active:scale-95 ${
                    own.game.fileUrl !== '#' ? 'bg-accent shadow-accent/50 hover:bg-emerald-400' : 'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-neutral-400'
                  }`}
                >
                  {own.game.fileUrl !== '#' ? <Play fill="currentColor" size={24} /> : <Download size={24} />}
                </a>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">{own.game.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {own.playtimeHours} hrs
                    </span>
                    <span>Acquired: {new Date(own.acquiredAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredGames.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <Search className="text-neutral-400" size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No games found</h3>
          <p className="text-neutral-500 max-w-sm">
            {ownedGames.length === 0 ? "You haven't added any games to your library yet. Go find some in the Store!" : `We couldn't find any games matching "${searchQuery}".`}
          </p>
        </div>
      )}
    </div>
  );
}
