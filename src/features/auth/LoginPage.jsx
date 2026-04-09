import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, KeyRound, Loader2, ArrowLeft, Activity, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

// --- ANIMATION VARIANTS ---
// These define the staggered boot sequence for the terminal text
const terminalContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.8, delayChildren: 1 }
  }
};

const terminalLine = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.identifier, formData.password);
      if (result.role === 'storekeeper') navigate('/inventory');
      else navigate('/cashbook');
    } catch (err) {
      console.error('[LoginPage] Submit failed', {
        message: err?.message,
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0A101F] to-[#1C2A4A] text-white flex overflow-hidden relative">
      
      

      {/* 2. Ambient Light Orbs (Breathing animation to refract through the glass) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-96 h-96 bg-[#05CD99] rounded-full blur-[120px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] right-[30%] w-80 h-80 bg-indigo-500 rounded-full blur-[100px] pointer-events-none z-0"
      />

      {/* LEFT PANEL: Immersive Branding & Terminal */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 50, duration: 1 }}
        className="hidden lg:flex flex-col justify-between w-[50%] h-full relative py-16 pl-32 pr-8 z-10"
      >
        <div className="relative z-10 flex flex-col items-start gap-12">
          <Link to="/" className="text-slate-400 hover:text-[#05CD99] flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-colors bg-white/5 backdrop-blur-md px-5 py-2.5 border border-white/10 hover:border-[#05CD99]/50 rounded-lg group">
            <motion.div whileHover={{ x: -3 }} transition={{ type: "spring" }}>
              <ArrowLeft size={18} />
            </motion.div>
            Return to Main Node
          </Link>

          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.5, bounce: 0.5 }}
              className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            >
              <Activity className="text-[#05CD99]" size={32} strokeWidth={2} />
            </motion.div>
            
            <h1 className="text-5xl xl:text-7xl font-bold uppercase tracking-tighter leading-[1.1]">
              Secure <br/>
              <motion.span 
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-[#05CD99]"
              >
                Gateway
              </motion.span>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="font-mono text-cyan-200/70 max-w-sm text-lg border-l-2 border-[#05CD99] pl-4"
            >
              Terminal access<br/>
              restricted to<br/>
              authorized financial<br/>
              officers and<br/>
              administrative<br/>
              personnel.
            </motion.p>
          </div>
        </div>

        {/* 3. The Active Terminal Boot Sequence */}
        <motion.div 
          variants={terminalContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 font-mono text-xs text-slate-500 space-y-2 uppercase"
        >
          <motion.div variants={terminalLine} className="text-slate-400">{'>'} Establishing secure SSL connection... <span className="text-[#05CD99]">OK</span></motion.div>
          <motion.div variants={terminalLine} className="text-slate-400">{'>'} Verifying institutional firewall... <span className="text-[#05CD99]">OK</span></motion.div>
          <motion.div variants={terminalLine} className="text-slate-400">{'>'} Awaiting credentials...</motion.div>
          <motion.div variants={terminalLine} className="animate-[pulse_2s_infinite] text-[#05CD99] mt-2">{'>'} STATUS: LOCKED</motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL: The Glassmorphic Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 60, delay: 0.3 }}
        className="w-full lg:w-[50%] h-full flex flex-col justify-center items-center px-4 sm:px-8 relative z-20"
      >
        {/* 1. The Engineering Grid (Pans slowly across the screen) */}
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 z-0 opacity-10" 
          style={{ backgroundImage: 'linear-gradient(#1A4D5C 1px, transparent 1px), linear-gradient(90deg, #1A4D5C 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="w-full max-w-md bg-gradient-to-br from-[rgba(11,20,34,0.5)] to-[rgba(11,20,34,0.2)] backdrop-blur-lg border border-cyan-300/20 p-8 sm:p-12 shadow-2xl shadow-black/40 rounded-2xl relative overflow-hidden group/card">
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#05CD99]/50 to-transparent group-hover/card:via-[#05CD99] transition-colors duration-700"></div>

          <div className="mb-10 text-center">
            <motion.div 
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-black/30 border border-white/10 rounded-xl mb-6 shadow-inner cursor-default"
            >
              <Lock className="text-[#05CD99]" size={20} />
            </motion.div>
            <h2 className="text-2xl font-extrabold tracking-widest uppercase mb-2">Authenticate</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-[#05CD99] to-transparent rounded-full mx-auto"></div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: [0, -5, 5, -5, 5, 0] }} // Glitch shake on error
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
              >
                {'>'} ERR: {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* 4. Interactive Input - ID */}
            <div className="space-y-2 relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative ID</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'id' ? 'drop-shadow-[0_0_8px_rgba(5,205,153,0.3)]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={16} className={focusedField === 'id' ? 'text-[#05CD99]' : 'text-slate-500'} transition="colors" />
                </div>
                <input 
                  type="text" 
                  onFocus={() => setFocusedField('id')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#05CD99]/50 focus:bg-black/40 transition-all rounded-xl shadow-inner placeholder:text-slate-500"
                  placeholder="Enter User ID"
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* 4. Interactive Input - Password */}
            <div className="space-y-2 relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Key</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'pwd' ? 'drop-shadow-[0_0_8px_rgba(5,205,153,0.3)]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound size={16} className={focusedField === 'pwd' ? 'text-[#05CD99]' : 'text-slate-500'} transition="colors" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  onFocus={() => setFocusedField('pwd')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#05CD99]/50 focus:bg-black/40 transition-all rounded-xl shadow-inner placeholder:text-slate-500"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#05CD99] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* The Engineered Button from the previous step */}
            <motion.button 
              type="submit" 
              disabled={isLoading}
              whileTap={{ scale: 0.97, y: 2 }}
              className="relative w-full py-4 mt-6 bg-[#05CD99] text-[#050B14] font-black uppercase tracking-widest rounded-xl overflow-hidden group transition-all disabled:opacity-80 disabled:cursor-not-allowed"
              style={{ boxShadow: isLoading ? "0 0 10px rgba(5,205,153,0.2)" : "0 0 20px rgba(5,205,153,0.4)" }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    <span>{'>'} DECRYPTING_KEY...</span>
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-[#050B14]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center justify-center gap-2 relative z-10"
                  >
                    AUTHORIZE ENTRY
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
          <div className="text-center mt-8">
            <Link to="/forgot-password"
              className="text-cyan-300/50 hover:text-cyan-300/80 text-xs transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}