import React from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a1526] text-slate-300 py-16 relative overflow-hidden font-sans border-t border-slate-800">
      {/* Background Graphic placeholder */}
      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <img src="/footer_bg.png" alt="" className="w-[400px] md:w-[600px] object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-8 md:gap-6 xl:gap-8">
          
          {/* BRAND INFO */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 lg:pr-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative shrink-0 flex items-center justify-center">
                <span className="text-4xl">☀️</span>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-600 rounded-sm opacity-80 backdrop-blur border border-blue-400/50"></div>
              </div>
              <h2 className="text-white font-bold text-lg leading-tight">
                UK Solar Installation<br />
                <span className="text-slate-200">SME Compliance Toolkit</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              The all-in-one compliance platform for UK solar installation businesses. Manage certifications, documentation, risk assessments and regulatory requirements with confidence.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Platform</h3>
            <div className="w-8 h-0.5 bg-amber-500 mb-6"></div>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance Toolkit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documents</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Risk Assessments</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reports & Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Alerts & Notifications</a></li>
            </ul>
          </div>

          {/* COMPLIANCE */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Compliance</h3>
            <div className="w-8 h-0.5 bg-amber-500 mb-6"></div>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">MCS Certification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DNO Applications</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BS 7671 Compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Risk Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Method Statements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HSE Guidance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Insurance Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audit & Inspections</a></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Resources</h3>
            <div className="w-8 h-0.5 bg-amber-500 mb-6"></div>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Knowledge Base</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guides & Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Industry Updates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Regulation Changes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Centre</a></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Company</h3>
            <div className="w-8 h-0.5 bg-amber-500 mb-6"></div>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Why We Built This</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book a Demo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* STAY UPDATED */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Stay Updated</h3>
            <div className="w-8 h-0.5 bg-amber-500 mb-6"></div>
            <p className="text-sm mb-6 leading-relaxed text-slate-300">
              Get the latest compliance updates, industry news and toolkit tips.
            </p>
            <div className="flex mb-8">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-l-md px-4 py-2.5 w-full text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-md transition-colors flex items-center justify-center shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-5 text-sm">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-blue-600/20 rounded-lg text-blue-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="pt-0.5">
                  <p className="text-white font-medium text-[15px]">+44 7424 373432</p>
                  <p className="text-xs text-slate-400 mt-1">Mon-Fri, 9:00am - 5:00pm GMT</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-600/20 rounded-lg text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <p className="text-white font-medium text-[15px]">hello@ukscompliancetoolkit.co.uk</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-600/20 rounded-lg text-blue-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-white font-medium text-[15px]">London, United Kingdom</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">Data Security</a>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; 2025 UK Solar Installation SME Compliance Toolkit.</p>
            <p className="mt-1">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
