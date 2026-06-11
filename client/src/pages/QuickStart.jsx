import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, ShieldAlert, Cpu, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickStart() {
  const [activeTab, setActiveTab] = useState(0);

  const phases = [
    {
      title: "Phase 1",
      subtitle: "Setup & Accreditations",
      badgeColor: "bg-amber-500/10 text-amber-500",
      description: "Establish the legal and industry foundation of your solar installation business before carrying out customer sales or surveys.",
      tasks: [
        { name: "MCS Installer Accreditation", purpose: "Enables customers to receive financial export incentives (SEG). Demands an audited quality handbook." },
        { name: "Consumer Code Registration", purpose: "Join RECC or HIES to legally safeguard deposit payments and provide standard consumer dispute mediation." },
        { name: "Competent Person Scheme (CPS)", purpose: "Register with NICEIC or NAPIT. Allows self-certification of domestic electrical works to local Building Regulations." },
        { name: "Public Liability Insurance (£2M)", purpose: "Provides minimum indemnity protection against rooftop damage, tiles cracking, or electrical fire hazards." }
      ]
    },
    {
      title: "Phase 2",
      subtitle: "Pre-Installation RAMS",
      badgeColor: "bg-blue-500/10 text-blue-500",
      description: "Conduct safety surveys and engineering calculations for each site prior to equipment arriving at the property.",
      tasks: [
        { name: "Draft RAMS (Method Statement)", purpose: "Create safety guidelines for roof work, material lifting, scaffold erection, and DC voltage handling." },
        { name: "Structural Roof Load Assessment", purpose: "Verify rafters can support dead panel load and wind uplifts using MCS 012 calculation sheets." },
        { name: "CDM 2015 Pre-Construction File", purpose: "Establish onsite waste management, briefing sub-contractors on fire assembly and storage zones." }
      ]
    },
    {
      title: "Phase 3",
      subtitle: "Installation Standards",
      badgeColor: "bg-green-500/10 text-green-500",
      description: "Execute the physical racking, cabling, and inverter commissioning, following current UK building codes.",
      tasks: [
        { name: "MCS 012 Certified Mountings", purpose: "Install wind-uplift certified roof hooks matched to the slate or clay tile style to avoid roof sheers." },
        { name: "BS 7671 Wiring Standards", purpose: "Deploy fire-rated UV-stable DC conduits, verify earth bonding of metal array, and install surge protection (SPDs)." },
        { name: "Affix Dual-Supply Warning Labels", purpose: "Affix standard labels at consumer units and isolators to warn firefighters of live DC strings during grid outages." }
      ]
    },
    {
      title: "Phase 4",
      subtitle: "Commissioning & Grid Notification",
      badgeColor: "bg-purple-500/10 text-purple-500",
      description: "Submit final reports, register the systems, and hand over the operation pack to the end client.",
      tasks: [
        { name: "DNO G98 / G99 Grid Notification", purpose: "Notify regional network operator within 28 days of system start (or secure prior approval for G99 systems > 3.68kW)." },
        { name: "Register MCS Installer Database", purpose: "Generate official MCS installation certificates on the central registry, paying standard registration fees." },
        { name: "Deliver Client Handover Pack", purpose: "Deliver EIC (Electrical Certificate), MCS Certificate, system manuals, roof load signs, and warranties." }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Page title */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Quick Start Compliance Guide
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            UK solar installers must follow a systematic 4-phase compliance flow. Select a phase below to review mandatory requirements and regulatory rationale.
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="flex flex-wrap justify-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          {phases.map((phase, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                activeTab === idx
                  ? "bg-solar-500 text-white shadow-lg shadow-solar-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50"
              }`}
            >
              <span className="block text-[9px] uppercase tracking-wider opacity-75">{phase.title}</span>
              <span className="block text-sm mt-0.5">{phase.subtitle.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Active phase card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Col: Phase Info */}
            <div className="lg:col-span-5 space-y-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider ${phases[activeTab].badgeColor}`}>
                {phases[activeTab].title}: {phases[activeTab].subtitle}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {phases[activeTab].subtitle} Requirements
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {phases[activeTab].description}
              </p>
              
              <div className="p-4 rounded-2xl bg-solar-500/5 dark:bg-solar-500/5 border border-solar-500/10 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-100">
                  <ShieldCheck className="w-4.5 h-4.5 text-solar-500" />
                  <span>Why is this phase audited?</span>
                </div>
                <p className="leading-relaxed">
                  Failure to document these items correctly voids insurance liability, triggers MCS audit failures, or risks Grid (DNO) prosecution. Ticking these off in the dashboard ensures complete audit trail validity.
                </p>
              </div>
            </div>

            {/* Right Col: Task breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                Mandatory Documentation Tasks
              </h3>
              
              <div className="space-y-3">
                {phases[activeTab].tasks.map((task, tid) => (
                  <div key={tid} className="glass-card flex items-start space-x-3 border-slate-200 dark:border-slate-850 p-4">
                    <CheckCircle2 className="w-5 h-5 text-solar-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {task.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-300 font-medium">Compliance Reason:</strong> {task.purpose}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Process Flow Diagram */}
        <section className="glass-card border-slate-200 dark:border-slate-800/80 p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Compliance Process Flow Diagram
            </h2>
            <p className="text-xs text-slate-500">
              The lifecycle of a compliance setup for UK Solar SMEs, from business setup to grid sign-off.
            </p>
          </div>

          {/* Simple HTML-based responsive timeline flowchart */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-4 md:gap-2 pt-4">
            {phases.map((p, i) => (
              <React.Fragment key={i}>
                {/* Timeline Card */}
                <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between text-center relative">
                  <div>
                    <span className="w-8 h-8 rounded-full bg-solar-500 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-3 shadow-md shadow-solar-500/10">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                      {p.subtitle.split(" ")[0]}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">
                      {p.subtitle}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-550 dark:text-slate-400 leading-tight">
                    {p.tasks.length} Mandatory Tasks
                  </div>
                </div>

                {/* Arrow Divider */}
                {i < phases.length - 1 && (
                  <div className="hidden md:flex items-center text-slate-300 dark:text-slate-800 px-1">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Quick CTA to Portal */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-solar-500 to-amber-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-solar-500/10">
          <div>
            <h3 className="font-extrabold text-lg">Ready to audit your solar business?</h3>
            <p className="text-xs text-amber-100 mt-1">
              Log in to seed your dashboard with "SolarForce UK Ltd" demo data and check your score.
            </p>
          </div>
          <Link to="/login" className="btn bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold py-3 px-6 shadow-md rounded-xl shrink-0">
            <span>Access SME Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
