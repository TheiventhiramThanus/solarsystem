import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles, Smartphone, Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  // Stats data
  const stats = [
    { value: "500+", label: "UK Solar Installations", detail: "Microgeneration systems active across Great Britain" },
    { value: "MCS 012", label: "Mounting Standards", detail: "Mandatory structural wind/snow load compliance" },
    { value: "BS 7671", label: "Electrical Regulations", detail: "Strict wiring standards (Amendment 2/3)" },
    { value: "28 Days", label: "DNO Notification Limit", detail: "Strict legal deadline for commissioning reports" }
  ];

  const coreFeatures = [
    { title: "Dynamic Score Engine", desc: "Instantly computes your business readiness percentage using a weighted compliance algorithm.", icon: Cpu },
    { title: "Risk Register (RAMS)", desc: "Build HSE-compliant risk assessments with pre-populated UK solar hazards like roof work & DC arcs.", icon: ShieldAlert },
    { title: "4-Phase Scaffolding", desc: "Follow solar project stages from company accreditations to final grid commission sign-off.", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-solar-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left max-w-4xl">


              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
              >
                UK Solar Installation <br />
                <span className="bg-gradient-to-r from-solar-500 to-amber-500 bg-clip-text text-transparent">
                  SME Compliance Toolkit
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
              >
                Align your microgeneration operations with official UK standards. Automate audit readiness logs, evaluate site risks, verify electrical certification, and download professional compliance reports.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4"
              >
                <Link to="/login" className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 shadow-lg shadow-solar-500/20">
                  <span>Enter Dashboard Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/quick-start" className="w-full sm:w-auto btn-secondary flex items-center justify-center space-x-1.5">
                  <span>Quick Start Guide</span>
                </Link>
              </motion.div>
            </div>
            {/* Hero Image */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <img src="/home_hero_image.png" alt="Solar panels" className="w-full max-w-md" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Grid */}
      <section className="py-12 bg-slate-100 dark:bg-slate-900/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card flex flex-col justify-between border-slate-200 dark:border-slate-800/60 p-5">
                <span className="block text-3xl font-extrabold text-solar-500 tracking-tight">{stat.value}</span>
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">{stat.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Value Proposition / Features */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Compliance Scaffolding for Solar Installation
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Solar installer compliance is highly fragmented across health & safety, grid interconnection, customer protection, and electrical design. We build this unified toolkit to streamline those checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="glass-card-hover border-slate-200 dark:border-slate-850 p-6 flex flex-col items-start space-y-4">
                  <div className="p-3.5 rounded-xl bg-solar-500/10 text-solar-500 dark:bg-solar-500/20 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Interactive QR-Code Onsite Scanner Section */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-850/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Context Info */}
            <div className="lg:col-span-12 space-y-5 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>On-Site Mobile Scanning</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                On-Field QR Safety & Warranty Portal
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Solar roof installers and electricians need immediate access to health & safety guidelines, RAMS, or wiring schematics while on-site. The toolkit features a QR landing profile creator.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                By affixing a weatherproof QR code inside the customer's inverter cabinet, technicians can instantly scan the tag with their smartphone to pull up compliance checklists, electrical test logs, and equipment warranty details.
              </p>
              <div className="pt-2 flex justify-center">
                <Link to="/quick-start" className="btn-secondary flex items-center space-x-2 w-fit">
                  <span>Explore Compliance Process Flow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* 5. Academic Author Profile Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/40 border-solar-500/10 p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              {/* Profile Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-solar-500 to-amber-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-solar-500/20 shrink-0">
                🎓
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start space-x-2">
                    <span>Developer Profile & Project Background</span>
                    <Award className="w-5 h-5 text-solar-500" />
                  </h3>
                  <span className="block text-sm text-solar-500 font-semibold uppercase tracking-wider mt-1">
                    Jeneevan Jeyarasa &bull; University of Chester
                  </span>
                </div>
                
                <p className="text-sm text-slate-650 dark:text-slate-355 leading-relaxed">
                  This system was developed as a postgraduate project for the <strong>MSc Engineering Management</strong> programme. The primary goal is to address compliance bottlenecks faced by small and medium enterprises (SMEs) in the UK microgeneration sector.
                </p>
                
                <p className="text-sm text-slate-650 dark:text-slate-355 leading-relaxed">
                  Solar SMEs often spend significant administrative overhead navigating MCS audits, DNO connection requests, and BS 7671 electrical certifications. This dashboard solves this overhead by providing clear compliance scaffolding, risk registers, and instant audit generation.
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <a 
                    href="https://www.chester.ac.uk" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-solar-600 hover:text-solar-700 dark:text-solar-400 dark:hover:text-solar-300"
                  >
                    <span>University of Chester Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
