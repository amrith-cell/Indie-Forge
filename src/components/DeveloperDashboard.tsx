import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Plus, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, TrendingUp, Users, CreditCard } from 'lucide-react';

export default function DeveloperDashboard({ setView }: { setView?: (v: string) => void }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    missionBrief: '',
    classification: 'Action',
    buildVersion: '1.0.0'
  });

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/games/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok || response.status === 201) {
        setPublishSuccess(true);
        setTimeout(() => {
          if (setView) setView('store');
        }, 2000);
      } else {
        console.error("Upload failed with status:", response.status);
      }
    } catch (error) {
      console.error("Network error during upload:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-black mb-2">Developer Hub</h1>
          <p className="text-neutral-500">Manage your creations and reach thousands of gamers.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-neutral-400">Total Downloads</p>
            <p className="text-2xl font-display font-bold">12.4k</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Plus size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-l-4 border-l-accent">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <CreditCard size={20} />
            </div>
            <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">+14.2%</span>
          </div>
          <p className="text-neutral-500 text-sm font-bold mb-1">Total Revenue</p>
          <h3 className="text-3xl font-display font-black">$42,890.50</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users size={20} />
            </div>
            <span className="text-sm font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">+8.1%</span>
          </div>
          <p className="text-neutral-500 text-sm font-bold mb-1">Active Players (30d)</p>
          <h3 className="text-3xl font-display font-black">15,234</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">+22.4%</span>
          </div>
          <p className="text-neutral-500 text-sm font-bold mb-1">Store Conversion</p>
          <h3 className="text-3xl font-display font-black">4.8%</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {publishSuccess ? (
            <div className="bg-black border-2 border-green-500 font-mono text-green-500 p-8 rounded-none flex flex-col items-center justify-center h-full min-h-[400px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-6">✔</div>
                <h2 className="text-2xl font-bold tracking-widest mb-2 animate-pulse">UPLOAD COMPLETE.</h2>
                <p className="text-green-500/70 tracking-widest">TERMINAL DISCONNECTING...</p>
              </motion.div>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="bg-black border border-green-500/30 p-8 rounded-none space-y-6 font-mono text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
              
              <div className="flex items-center gap-2 mb-6 border-b border-green-500/30 pb-4">
                <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
                <h2 className="text-xl tracking-widest font-bold">SYSTEM UPLOAD TERMINAL // STEP 1</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-green-500/70">GAME TITLE</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-green-500/50 text-green-400 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] outline-none transition-all placeholder:text-green-900"
                    placeholder="ENTER DESIGNATION..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-green-500/70">CLASSIFICATION</label>
                  <select
                    value={formData.classification}
                    onChange={e => setFormData({...formData, classification: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-green-500/50 text-green-400 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] outline-none transition-all appearance-none"
                  >
                    <option>Action</option>
                    <option>Open-World</option>
                    <option>RPG</option>
                    <option>Strategy</option>
                    <option>Indie</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-green-500/70">MISSION BRIEF</label>
                <textarea
                  required
                  rows={4}
                  value={formData.missionBrief}
                  onChange={e => setFormData({...formData, missionBrief: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-green-500/50 text-green-400 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] outline-none resize-none transition-all placeholder:text-green-900"
                  placeholder="INPUT SCENARIO PARAMETERS..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-green-500/70">BUILD VERSION</label>
                <input
                  required
                  type="text"
                  value={formData.buildVersion}
                  onChange={e => setFormData({...formData, buildVersion: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-green-500/50 text-green-400 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] outline-none transition-all"
                  placeholder="1.0.0"
                />
              </div>

              <button
                disabled={isPublishing}
                type="submit"
                className={`w-full py-4 mt-8 font-black text-lg tracking-widest transition-all uppercase border ${
                  isPublishing 
                  ? 'bg-transparent border-green-500/50 text-green-500/50 cursor-not-allowed animate-pulse' 
                  : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500 hover:text-black shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                }`}
              >
                {isPublishing ? 'TRANSMITTING PAYLOAD...' : 'Execute Publish'}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-accent" />
              Publishing Checklist
            </h3>
            <ul className="space-y-3">
              {[
                'High-quality cover art (16:9)',
                'Gameplay trailer (under 50MB)',
                'Clear system requirements',
                'Release notes for v1.0.0'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              Developer Tips
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Games with autoplaying trailers on hover see 40% higher engagement. Make sure your first 5 seconds are captivating!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
