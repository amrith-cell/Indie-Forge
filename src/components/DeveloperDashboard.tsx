import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Plus, Rocket, BarChart3, Settings, Trash2, Edit2, Search } from 'lucide-react';
import UploadGameModal from './UploadGameModal';

interface Game {
  id: string;
  title: string;
  genre: string;
  coverUrl: string;
  views?: number;
  downloads?: number;
}

interface DeveloperDashboardProps {
  setView: (view: 'store' | 'dashboard' | 'support' | 'settings' | 'library' | 'game') => void;
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ setView }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeveloperGames();
  }, []);

  const fetchDeveloperGames = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // For now, we fetch all games and filter locally to show the concept
      // In a real app, this would be GET /api/developer/games
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/games`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGames(data); // In demo, showing all as "yours" or filtering
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Total Players', value: '12.4k', icon: Rocket, color: 'text-blue-400' },
    { label: 'Avg. Playtime', value: '45m', icon: BarChart3, color: 'text-purple-400' },
    { label: 'Live Games', value: games.length.toString(), icon: LayoutGrid, color: 'text-emerald-400' }
  ];

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Developer <span className="text-blue-500">Forge</span>
            </motion.h1>
            <p className="text-gray-400">Manage your creations and track performance.</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Publish New Game
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`${stat.color}`} size={24} />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-semibold text-white">Your Games</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-all w-full md:w-64"
              />
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-gray-500">No games found matches your search.</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col md:flex-row items-center gap-6 p-4 bg-zinc-900/40 hover:bg-zinc-800/40 border border-white/5 rounded-2xl transition-all group"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-lg font-bold text-white mb-1">{game.title}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">{game.genre}</span>
                        <span className="text-xs text-gray-500">v1.2.0</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="p-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-xl transition-colors" title="Settings">
                        <Settings size={18} />
                      </button>
                      <button className="p-3 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-xl transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <UploadGameModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSuccess={fetchDeveloperGames}
      />
    </div>
  );
};

export default DeveloperDashboard;
