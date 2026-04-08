import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Lock, Users, TrendingUp, Zap, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp size={28} />,
      title: 'Financial Management',
      description: 'Real-time transaction tracking, expense management, and revenue collection'
    },
    {
      icon: <Users size={28} />,
      title: 'Student Directory',
      description: 'Comprehensive student records and fee collection management'
    },
    {
      icon: <Shield size={28} />,
      title: 'Inventory Control',
      description: 'Track stock levels, manage procurement, and monitor stock movement'
    },
    {
      icon: <Zap size={28} />,
      title: 'Real-Time Reports',
      description: 'Trial balance, financial summaries, and institutional analytics'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full min-h-screen bg-structural-navy text-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24"
      >
        {/* Animated Background Grid */}
        <div
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#1C1917 1px, transparent 1px), linear-gradient(90deg, #1C1917 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-3xl text-center space-y-12"
        >
          {/* Logo & Title */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-text-border border-2 border-action-mint flex items-center justify-center shadow-[0_0_30px_rgba(5,205,153,0.3)]">
                <Activity className="text-action-mint" size={48} strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.1]">
              School Financial <br />
              <span className="text-action-mint">Management System</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Enterprise-grade financial operations, inventory management, and institutional analytics designed for educational institutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(5, 205, 153, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-action-mint text-structural-navy font-black uppercase tracking-widest flex items-center justify-center gap-3 rounded-none shadow-[8px_8px_0px_0px_#1C1917] hover:shadow-[12px_12px_0px_0px_#1C1917] transition-all"
            >
              Access Dashboard
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-action-mint rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-action-mint rounded-full animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative py-20 sm:py-32 px-6 sm:px-12 lg:px-24 bg-text-border border-t border-text-border"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">
              Core Modules
            </h2>
            <p className="text-slate-300 text-lg">
              Comprehensive toolset for modern educational finance
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 0 30px rgba(5, 205, 153, 0.2)' }}
                className="bg-structural-navy border border-text-border p-8 cursor-pointer transition-all group"
              >
                <div className="text-action-mint mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-text-border py-8 px-6 sm:px-12 lg:px-24 text-center text-slate-300 text-sm">
        <p>
          School Financial Management System • Built for institutional excellence •{' '}
          <span className="text-action-mint">© 2026</span>
        </p>
      </footer>
    </div>
  );
}
