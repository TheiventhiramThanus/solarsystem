import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Menu, X, LayoutDashboard, LogIn, LogOut, ShieldAlert } from "lucide-react";

export default function Navbar() {
  const { user, signOut, isAdmin, isSmeUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Project", path: "/about" },
    { name: "Quick Start Guide", path: "/quick-start" },
    { name: "Official Resources", path: "/resources" },
    { name: "Updates & Alerts", path: "/updates" },
    { name: "Contact & Feedback", path: "/contact" }
  ];

  const handleLogout = async () => {
    await signOut();
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white font-bold shadow-md shadow-solar-500/20 group-hover:scale-105 transition-all duration-200">
                ☀️
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Solar<span className="text-solar-500">SME</span> Toolkit
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-solar-500 ${
                  isActive(link.path)
                    ? "text-solar-500 dark:text-solar-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-solar-500 dark:hover:text-solar-400 transition-all duration-200 border border-slate-200/50 dark:border-slate-800/50"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Dashboard Redirect or Login */}
            {user ? (
              <div className="flex items-center space-x-3">
                {isSmeUser && (
                  <Link to="/dashboard" className="btn-primary flex items-center space-x-1.5 py-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>SME Dashboard</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center space-x-1.5 py-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-secondary flex items-center space-x-1.5 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center space-x-1.5 py-2">
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-2 shadow-inner transition-colors duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? "bg-solar-500/10 text-solar-500 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-200 dark:border-slate-800 my-2" />
          {user ? (
            <div className="space-y-2 pt-2">
              {isSmeUser && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>SME Dashboard</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="w-full btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center space-x-2 py-2"
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full btn-secondary flex items-center justify-center space-x-2 py-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Portal Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
