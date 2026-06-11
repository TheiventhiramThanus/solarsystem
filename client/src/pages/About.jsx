import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, FileCheck, Landmark, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const challenges = [
    { title: "MCS Accreditation Audits", desc: "SMEs must maintain strict Quality Management Systems (QMS) and submit to yearly site audits.", icon: FileCheck },
    { title: "BS 7671 Electrical Sign-offs", desc: "Meeting IET standards for dual-supply isolators, earth cabling, and surge protection.", icon: ShieldCheck },
    { title: "DNO Interconnection Delays", desc: "Applying for G98/G99 approvals from regional network operators to commission arrays.", icon: Landmark },
    { title: "Consumer Safety Red Tape", desc: "Adhering to strict consumer protection codes (RECC/HIES) covering client deposits.", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-solar-500 mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            About the Project
          </h1>
          <p className="text-base text-solar-600 dark:text-solar-400 font-semibold max-w-xl mx-auto">
            UK Solar SME Compliance Scaffolding Framework
          </p>
        </div>

        {/* 1. Academic Abstract */}
        <section className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <span>Research Context & Abstract</span>
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-650 dark:text-slate-350">
            <p>
              This toolkit was built by <strong className="text-slate-900 dark:text-white">Jeneevan Jeyarasa</strong> as a core component of postgraduate research under the <strong className="text-slate-900 dark:text-white">MSc Engineering Management</strong> programme at the <strong className="text-slate-900 dark:text-white">University of Chester</strong>.
            </p>
            <p>
              The study investigates how compliance automation and cloud-based scaffolding can reduce administrative overhead and operational risks in Microgeneration Certification Scheme (MCS) installer operations. By structuring UK compliance rules into an interactive checklist, risk engine, and file manager, the platform helps installers satisfy MCS standards, HSE roof safety rules, and IET electrical wiring guidelines.
            </p>
          </div>
        </section>

        {/* 2. Key Challenges Targeted */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Compliance Bottlenecks for Solar SMEs
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              SMEs in the UK solar installation market face heavy regulatory overhead across multiple compliance bodies:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="glass-card flex items-start space-x-4 border-slate-200 dark:border-slate-850 p-5">
                  <div className="p-2.5 rounded-lg bg-solar-500/10 text-solar-500 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Methodology & Design Objectives */}
        <section className="glass-card p-6 md:p-8 space-y-4 text-sm leading-relaxed text-slate-650 dark:text-slate-350">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            System Design Objectives
          </h2>
          <p>
            To achieve "compliance scaffolding" that feels practical for day-to-day installers, the platform was developed with three design pillars:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>Active Progress Score Engine:</strong> A live score engine that weights tasks (e.g., MCS registration and electrical safety hold higher weights than branding updates), giving managers an accurate gauge of business health.
            </li>
            <li>
              <strong>Role-Based Accountability (RBAC):</strong> Separating tasks between SME Owners (who establish business profiles) and Compliance Officers (who run inspections on-site) to ensure clean chain of custody.
            </li>
            <li>
              <strong>Audit Trail Integrity:</strong> Automatically recording every checklist completion, risk assessment change, and document upload as an immutable timeline feed, which acts as evidence for annual MCS auditor reviews.
            </li>
          </ul>
        </section>

        {/* Call to action */}
        <div className="flex justify-center space-x-4">
          <Link to="/quick-start" className="btn-primary">
            <span>View Quick Start Guide</span>
          </Link>
          <Link to="/login" className="btn-secondary">
            <span>Enter SME Portal</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
