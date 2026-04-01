import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, User, KeyRound, Loader2, ArrowLeft, Activity, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const prefersReducedMotion = useReducedMotion();
  const statusLines = [
    'Establishing secure SSL connection... OK',
    'Verifying institutional firewall... OK',
    'Awaiting credentials...',
  ];
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.identifier, formData.password);
      if (result.mustChangePassword) {
        navigate('/profile', {
          state: {
            forcePasswordChange: true,
            notice: 'Temporary password detected. Update your password to continue securely.',
          },
        });
        return;
      }

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
    <div className="relative min-h-screen overflow-hidden bg-structural-navy text-app-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-structural-navy via-structural-navy/72 to-action-mint/38" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,theme(colors.app-background/30),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,theme(colors.action-mint/35),transparent_35%)]" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,233,143,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,233,143,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        animate={prefersReducedMotion ? { opacity: 0.3 } : { x: [0, 18, 0], y: [0, -10, 0] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-12 top-24 h-64 w-64 rounded-full bg-action-mint/25 blur-[95px]"
      />

      <motion.div
        animate={prefersReducedMotion ? { opacity: 0.28 } : { x: [0, -14, 0], y: [0, 12, 0] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-10 right-14 h-72 w-72 rounded-full bg-app-background/26 blur-[110px]"
      />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border-r border-app-background/30 bg-app-background/8 px-8 py-12 backdrop-blur-2xl sm:px-14 sm:py-16 lg:px-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-app-background/45 bg-app-background/16 px-4 py-2 text-sm font-bold uppercase tracking-wider text-app-background transition hover:border-action-mint/70 hover:text-action-mint"
          >
            <ArrowLeft size={16} /> Return to Main Node
          </Link>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
            className="mt-14 max-w-xl"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.06, ease: 'easeOut' }}
              className="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-app-background/45 bg-app-background/10 backdrop-blur-xl"
            >
              <Activity className="text-action-mint" size={30} />
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.12, ease: 'easeOut' }}
              className="text-6xl font-black uppercase leading-[0.95] tracking-tight"
            >
              <span className="block text-app-background">Secure</span>
              <span className="block text-action-mint">Gateway</span>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
              className="mt-8 max-w-md border-l-4 border-action-mint/70 pl-5 font-mono text-3xl leading-relaxed text-app-background/90 sm:text-[2rem]"
            >
              Terminal access restricted to authorized financial officers and administrative personnel.
            </motion.p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : 0.28, ease: 'easeOut' }}
            className="mt-24 space-y-2 font-mono text-lg uppercase text-app-background/75"
          >
            {statusLines.map((line, index) => (
              <motion.p
                key={line}
                initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.34 + index * 0.08, ease: 'easeOut' }}
              >
                {line}
              </motion.p>
            ))}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.58, ease: 'easeOut' }}
              className="text-action-mint"
            >
              Status: Locked
            </motion.p>
          </motion.div>
        </section>

        <section className="flex items-center bg-app-background/5 px-8 py-12 backdrop-blur-2xl sm:px-14">
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mx-auto w-full max-w-lg rounded-3xl border border-app-background/45 bg-app-background/18 p-8 backdrop-blur-2xl shadow-xl shadow-structural-navy/50 sm:p-10"
          >
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-app-background/45 bg-app-background/10">
              <Lock className="text-app-background" size={28} />
            </div>

            <h2 className="text-5xl font-black uppercase tracking-[0.1em] text-app-background">Authenticate</h2>
            <div className="mt-4 h-1.5 w-28 bg-action-mint" />

            <form onSubmit={handleLogin} className="mt-12 space-y-8">
              <div>
                <label className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-app-background/85">
                  Administrative ID
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-action-mint" size={18} />
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Enter User ID"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full rounded-xl border border-app-background/55 bg-app-background/18 py-4 pl-12 pr-4 text-xl text-app-background placeholder:text-app-background/75 outline-none transition focus:border-action-mint focus:ring-2 focus:ring-action-mint/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-app-background/85">
                  Security Key
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-action-mint" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-app-background/55 bg-app-background/18 py-4 pl-12 pr-12 text-xl text-app-background placeholder:text-app-background/75 outline-none transition focus:border-action-mint focus:ring-2 focus:ring-action-mint/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-app-background/80 transition hover:text-action-mint"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-alert-crimson/50 bg-alert-crimson/15 px-4 py-3 text-sm font-semibold text-alert-crimson"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={prefersReducedMotion || isLoading ? undefined : { scale: 1.01, y: -1 }}
                whileTap={prefersReducedMotion || isLoading ? undefined : { scale: 0.99 }}
                animate={
                  prefersReducedMotion || !isLoading
                    ? undefined
                    : {
                        boxShadow: [
                          '0 0 0 rgba(0, 233, 143, 0.0)',
                          '0 0 24px rgba(0, 233, 143, 0.35)',
                          '0 0 0 rgba(0, 233, 143, 0.0)',
                        ],
                      }
                }
                transition={
                  prefersReducedMotion || !isLoading
                    ? { duration: 0.15 }
                    : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="flex w-full items-center justify-center gap-3 rounded-full border border-action-mint/75 bg-action-mint py-5 text-xl font-black uppercase tracking-[0.12em] text-structural-navy shadow-xl shadow-action-mint/45 transition hover:bg-action-mint/90 hover:shadow-2xl hover:shadow-action-mint/55 disabled:cursor-not-allowed disabled:bg-action-mint/60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Authorizing...
                  </>
                ) : (
                  'Authorize Entry'
                )}
              </motion.button>

              <p className="text-center text-sm text-app-background/80">
                <a href="#" className="underline underline-offset-4 transition hover:text-action-mint">
                  Forgot Password?
                </a>
              </p>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}