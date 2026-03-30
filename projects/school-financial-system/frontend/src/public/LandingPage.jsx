import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="w-full min-h-screen bg-[#050B14] text-white selection:bg-[#05CD99] selection:text-black overflow-x-hidden relative flex flex-col">
      {/* Edge-to-Edge Engineering Grid */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#1A4D5C 1px, transparent 1px), linear-gradient(90deg, #1A4D5C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Full-Width Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 border-b-2 border-[#1A4D5C] bg-[#050B14]/90 backdrop-blur-md w-full"
      >
        <div className="w-full px-8 lg:px-16 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1A4D5C] border-2 border-[#05CD99] flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(5,205,153,0.2)]">
              <Activity className="text-[#05CD99]" size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-extrabold tracking-widest uppercase">
              Smart<span className="text-[#05CD99]">School</span> ERP
            </span>
          </div>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-8 py-3 bg-[#05CD99] text-[#050B14] text-sm font-bold uppercase tracking-widest border-2 border-[#05CD99] hover:bg-[#050B14] hover:text-[#05CD99] transition-none shadow-[6px_6px_0px_0px_#1A4D5C]"
            >
              System Login
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Edge-to-Edge Hero Section */}
      <main className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center px-8 lg:px-16 py-20 lg:py-0 min-h-[calc(100vh-96px)]">
        <motion.div
          className="flex-1 w-full space-y-10 pr-0 lg:pr-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A4D5C]/30 border-l-4 border-[#05CD99] text-[#05CD99] text-sm font-bold uppercase tracking-widest"
          >
            <ShieldCheck size={18} /> MoE Compliant Architecture
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-6xl lg:text-[5.5rem] leading-[1.1] font-extrabold tracking-tighter uppercase"
          >
            Institutional Finance, <br />
            <span className="text-[#05CD99]">Engineered for Precision.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl text-slate-400 max-w-3xl leading-relaxed font-medium"
          >
            A bespoke, double-entry financial engine built exclusively for
            modern schools. Command your cashbook, automate student billing, and
            secure your physical inventory from a single, high-contrast command
            center.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-6 pt-8"
          >
            <a
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-[#05CD99] text-[#050B14] font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-colors shadow-[8px_8px_0px_0px_#1A4D5C]"
            >
              Access Dashboard <ArrowRight size={24} />
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Visual Concept - Scaled Up */}
        <motion.div
          className="flex-1 w-full max-w-2xl hidden lg:block relative mt-20 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-[#05CD99]/10 blur-[100px] rounded-full"></div>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-[#0B192C] border-2 border-[#1A4D5C] shadow-[16px_16px_0px_0px_#05CD99] p-10"
          >
            <div className="flex justify-between items-center border-b-2 border-[#1A4D5C] pb-6 mb-6">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Live Trial Balance
              </span>
              <span className="flex items-center gap-2 text-[#05CD99] text-sm font-mono font-bold tracking-widest">
                <span className="w-3 h-3 bg-[#05CD99] rounded-none animate-pulse"></span>
                SYNCED
              </span>
            </div>
            <div className="space-y-5 font-mono text-lg">
              <div className="flex justify-between text-slate-300">
                <span>DR_CASH_BANK</span>
                <span className="text-white">KES 30,612,000.00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>CR_TUITION_REV</span>
                <span className="text-[#05CD99]">KES 12,774,400.00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>CR_RMI_FUND</span>
                <span className="text-[#05CD99]">KES 6,128,500.00</span>
              </div>
              <div className="w-full h-1 bg-[#1A4D5C] my-4"></div>
              <div className="flex justify-between font-bold text-xl">
                <span className="text-slate-500">SYSTEM STATUS</span>
                <span className="text-[#05CD99] bg-[#05CD99]/10 px-3 py-1 border border-[#05CD99]/30">
                  BALANCED
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Full-Width Zero-Gap Modules Grid */}
      <section className="relative z-10 w-full border-t-2 border-[#1A4D5C] bg-[#050B14]">
        <motion.div
          className="w-full grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1A4D5C]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={fadeUp}
            className="p-12 lg:p-20 hover:bg-[#1A4D5C]/20 transition-colors group"
          >
            <TrendingUp
              className="text-[#05CD99] mb-8 transform group-hover:-translate-y-2 transition-transform duration-300"
              size={48}
              strokeWidth={1.5}
            />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white">
              Core Cashbook
            </h3>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Immutable double-entry ledger. Track government capitation and
              daily operational expenses with absolute mathematical certainty.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-12 lg:p-20 hover:bg-[#1A4D5C]/20 transition-colors group"
          >
            <ShieldCheck
              className="text-[#05CD99] mb-8 transform group-hover:-translate-y-2 transition-transform duration-300"
              size={48}
              strokeWidth={1.5}
            />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white">
              Fee Master
            </h3>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Automated cohort invoicing. Issue mass bills instantly, log M-Pesa
              receipts, and monitor student debt via the omni-search directory.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-12 lg:p-20 hover:bg-[#1A4D5C]/20 transition-colors group"
          >
            <Package
              className="text-[#05CD99] mb-8 transform group-hover:-translate-y-2 transition-transform duration-300"
              size={48}
              strokeWidth={1.5}
            />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white">
              Storekeeper
            </h3>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Row-locked physical asset tracking. Prevent negative stock
              balances and monitor IN/OUT requisitions securely.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
