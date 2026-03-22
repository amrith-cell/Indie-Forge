import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, ShieldCheck, Star, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GameDetailsProps {
  gameId: string | null;
  onBack: () => void;
}

interface DetailedGame {
  id: string;
  title: string;
  description: string;
  genre: string;
  coverUrl: string;
  trailerUrl: string;
  fileUrl: string;
  developerName: string;
}

export default function GameDetails({ gameId, onBack }: GameDetailsProps) {
  const [game, setGame] = useState<DetailedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!gameId) return;
    
    const fetchGame = async () => {
      setLoading(true);
      setError('');
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_URL}/api/games/${gameId}`);
        if (!res.ok) throw new Error('Game not found');
        const data = await res.json();
        setGame(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="pt-28 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-neutral-400">{error || 'Game not found.'}</p>
        <button onClick={onBack} className="text-accent font-semibold hover:underline">
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors py-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Store</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Hero Image & Trailer */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <img 
              src={game.coverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80'} 
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8">
              <span className="mb-4 inline-block px-4 py-1.5 rounded-full bg-accent text-white text-sm font-bold tracking-widest uppercase">
                {game.genre}
              </span>
              <h1 className="text-5xl font-display font-black text-white tracking-tight drop-shadow-md">
                {game.title}
              </h1>
            </div>
          </motion.div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Star className="text-accent" /> About this Game
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap">
              {game.description}
            </p>
          </div>
        </div>

        {/* Right Column: Actions & Details */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-accent/5 border-accent/20">
            <a 
              href={game.fileUrl !== '#' ? game.fileUrl : undefined}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all ${
                game.fileUrl !== '#' ? 'bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-[1.02]' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Download size={24} />
              {game.fileUrl !== '#' ? 'Download Now' : 'Not Available'}
            </a>
            
            <p className="text-center text-sm text-neutral-400 mt-4 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Verified by IndieForge
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-lg mb-4 text-white">Developer Details</h3>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Created by</p>
                <p className="font-bold text-lg text-white">{game.developerName}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
