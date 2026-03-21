import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Flame, Clock, Trophy } from 'lucide-react';
import GameCard from './GameCard';
import { Game } from '../types';

const featuredGames = [
  {
    id: 1,
    title: "Cyber Strike: Retribution",
    description: "The ultimate tactical shooter experience. Join the resistance and reclaim the city in this high-octane indie masterpiece.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80",
    tag: "Featured Release"
  },
  {
    id: 2,
    title: "Neon Nights",
    description: "A neon-soaked cyberpunk adventure. Explore a sprawling metropolis full of danger and mystery.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80",
    tag: "Top Rated"
  },
  {
    id: 3,
    title: "Stardust Odyssey",
    description: "Embark on an epic journey across the galaxy. Build your ship, assemble your crew, and discover new worlds.",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1920&q=80",
    tag: "New Arrival"
  }
];

export default function Storefront() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHero, setCurrentHero] = useState(0);

  const genres = ['All', 'Action', 'Open-World', 'RPG', 'Strategy', 'Indie'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      });
  }, []);

  const filteredGames = games.filter(game => {
    const matchesGenre = activeGenre === 'All' || game.genre === activeGenre;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={featuredGames[currentHero].image}
              alt={featuredGames[currentHero].title}
              className="w-full h-full object-cover transition-transform duration-10000 ease-linear scale-110 group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center p-12">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow-lg shadow-accent/30">
                  {featuredGames[currentHero].tag}
                </span>
                <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4 leading-tight">
                  {featuredGames[currentHero].title}
                </h1>
                <p className="text-white/80 max-w-md mb-8 text-lg font-medium">
                  {featuredGames[currentHero].description}
                </p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-emerald-400 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-accent/40">
                    Play Now
                  </button>
                  <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                    View Details
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-12 flex gap-2 z-20">
          {featuredGames.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHero(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentHero ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeGenre === genre
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-accent transition-all outline-none"
          />
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} />
          ))}
        </AnimatePresence>
      </div>

      {filteredGames.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">No games found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
