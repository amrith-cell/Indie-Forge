import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Download, Star } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  key?: React.Key;
}

export default function GameCard({ game }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="glass-card group cursor-pointer relative"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={game.coverUrl}
          alt={game.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110 blur-sm' : 'scale-100'}`}
          referrerPolicy="no-referrer"
        />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <video
                ref={videoRef}
                src={game.trailerUrl}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-3 left-3 z-20">
          <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
            {game.genre}
          </span>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-(--accent)/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end p-4">
          <button className="btn-accent w-full py-2 text-sm flex items-center justify-center gap-2">
            <Download size={16} />
            {parseInt(game.id, 36) % 3 === 0 ? "Free to Play" : "$19.99"}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-xl leading-tight group-hover:text-accent transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold">4.8</span>
          </div>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {game.description}
        </p>
      </div>
    </motion.div>
  );
}
