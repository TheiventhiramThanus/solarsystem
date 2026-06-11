import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Project Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">☀️</span>
              <span className="font-bold text-lg text-white">UK Solar SME Compliance Toolkit</span>
            </div>
            <p className="text-sm text-slate-400">
              An intelligent compliance scaffolding framework designed for UK solar installers. Aligning businesses with MCS, BS 7671 electrical requirements, HSE regulations, and consumer codes.
            </p>
          </div>

          {/* Column 2: Academic Context */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Academic Project</h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="font-medium text-white">Developer:</span> Jeneevan Jeyarasa
              </p>
              <p>
                <span className="font-medium text-slate-300">University:</span> University of Chester
              </p>
              <p>
                <span className="font-medium text-slate-300">Programme:</span> MSc Engineering Management
              </p>
              <p>
                <span className="font-medium text-slate-300">Focus:</span> Solar SME Operations & Regulatory Compliance
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Official Bodies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://mcscertified.com" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 transition-colors">
                  MCS (Microgeneration Certification Scheme)
                </a>
              </li>
              <li>
                <a href="https://www.hse.gov.uk" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 transition-colors">
                  HSE (Health & Safety Executive)
                </a>
              </li>
              <li>
                <a href="https://www.ofgem.gov.uk" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 transition-colors">
                  Ofgem (SEG & Grid Regulations)
                </a>
              </li>
              <li>
                <a href="https://www.theiet.org" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 transition-colors">
                  IET (BS 7671 Wiring Regulations)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer section */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-xs leading-relaxed text-slate-500">
          <p className="mb-4">
            <strong className="text-slate-400">Disclaimer:</strong> This platform has been developed for academic, compliance awareness, and educational purposes. Solar installation SMEs should verify all regulatory requirements through official regulatory bodies including MCS, Ofgem, HSE, Planning Portal, HMRC, Companies House, and Distribution Network Operators before making business decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center text-slate-600">
            <span>&copy; {new Date().getFullYear()} UK Solar SME Compliance Toolkit. Academic Showcase.</span>
            <span className="mt-2 sm:mt-0">Supervised Research &bull; University of Chester</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
