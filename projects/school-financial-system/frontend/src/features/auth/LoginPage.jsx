import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, User, KeyRound, Loader2, ArrowLeft, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const prefersReducedMotion = useReducedMotion();
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.identifier, formData.password);
      if (result.role === 'storekeeper') {
        navigate('/inventory');
      } else {
        navigate('/cashbook');
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#050B14] text-white flex overflow-hidden relative">
      
      {/* 1. The Engineering Grid */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#1A4D5C 1px, transparent 1px), linear-gradient(90deg, #1A4D5C 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* 2. Ambient Light Orbs (Crucial for Glassmorphism refraction) */}
      <motion.div
        animate={prefersReducedMotion ? { opacity: 0.2 } : { x: [0, 16, 0], y: [0, -10, 0], scale: [1, 1.04, 1] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] right-[15%] w-96 h-96 bg-[#05CD99]/20 rounded-full blur-[120px] pointer-events-none z-0"
      ></motion.div>
      <motion.div
        animate={prefersReducedMotion ? { opacity: 0.2 } : { x: [0, -14, 0], y: [0, 12, 0], scale: [1, 1.03, 1] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] right-[30%] w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0"
      ></motion.div>

      {/* LEFT PANEL: Immersive Branding & Terminal */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-between w-[55%] h-full border-r border-white/5 relative p-16 z-10"
      >
        <div className="relative z-10 flex flex-col items-start gap-12">
          <Link to="/" className="text-slate-500 hover:text-[#05CD99] flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-colors bg-white/5 backdrop-blur-md px-5 py-2.5 border border-white/10 hover:border-[#05CD99]/50 rounded-lg">
            <ArrowLeft size={18} /> Return to Main Node
          </Link>

          <div className="space-y-6">
            <div className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <Activity className="text-[#05CD99]" size={32} strokeWidth={2} />
            </div>
            <h1 className="text-5xl xl:text-7xl font-black uppercase tracking-tighter leading-[1.1]">
              Secure <br/>
              <span className="text-[#05CD99]">Gateway</span>
            </h1>
            <p className="text-xl text-slate-400 font-mono border-l-2 border-[#05CD99]/50 pl-5 max-w-lg">
              Terminal access restricted to authorized financial officers and administrative personnel.
            </p>
          </div>
        </div>

        {/* Fake Terminal Output for Atmosphere */}
        <div className="relative z-10 font-mono text-xs text-slate-500 space-y-2 uppercase bg-black/20 p-6 rounded-xl border border-white/5 backdrop-blur-sm max-w-md">
          <div className="text-slate-400">{'>'} Establishing secure SSL connection... <span className="text-[#05CD99]">OK</span></div>
          <div className="text-slate-400">{'>'} Verifying institutional firewall... <span className="text-[#05CD99]">OK</span></div>
          <div className="text-slate-400">{'>'} Awaiting credentials...</div>
          <div className="animate-pulse text-[#05CD99] mt-2">{'>'} STATUS: LOCKED</div>
        </div>
      </motion.div>

      {/* RIGHT PANEL: The Glassmorphic Auth Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center px-4 sm:px-8 relative z-20"
      >
        
        {/* The Glass Container */}
        <div className="w-full max-w-md bg-[#0B192C]/40 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl relative overflow-hidden">
          
          {/* Specular Edge Highlight (Simulates light hitting the top edge of the glass) */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Subtle animated sheen sweep */}
          <motion.div
            aria-hidden="true"
            initial={{ x: '-140%' }}
            animate={prefersReducedMotion ? { opacity: 0 } : { x: ['-140%', '160%'] }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
            className="pointer-events-none absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
          />

          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-black/20 border border-white/10 rounded-xl mb-6 shadow-inner">
              <Lock className="text-[#05CD99]" size={20} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-widest uppercase mb-2">Authenticate</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-[#05CD99] to-transparent rounded-full"></div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm font-bold uppercase tracking-widest backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Administrative ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={16} className="text-[#05CD99]" />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-4 py-3.5 text-sm font-sans focus:outline-none focus:border-[#05CD99]/50 focus:bg-black/40 transition-all rounded-xl shadow-inner placeholder:text-slate-600"
                  placeholder="Enter User ID"
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound size={16} className="text-[#05CD99]" />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-4 py-3.5 text-sm font-mono focus:outline-none focus:border-[#05CD99]/50 focus:bg-black/40 transition-all rounded-xl shadow-inner placeholder:text-slate-600"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(5,205,153,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#05CD99] text-[#050B14] font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 mt-6 rounded-xl transition-all"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Authorize Entry'}
            </motion.button>
          </form>
        </div>

        {/* Mobile Back Button */}
        <Link to="/" className="lg:hidden mt-12 text-slate-500 hover:text-[#05CD99] flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors z-20 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          <ArrowLeft size={14} /> Return to Home
        </Link>

      </motion.div>
    </div>
  );
}