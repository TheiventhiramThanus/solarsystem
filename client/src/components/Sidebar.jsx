import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  ShieldAlert, 
  FolderDown, 
  Settings, 
  Users, 
  Building2, 
  BellRing, 
  MessageSquare,
  Bookmark,
  FileText,
  User
} from "lucide-react";

export default function Sidebar() {
  const { user, isOwner, isOfficer, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Navigation configurations
  const smeLinks = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Compliance Checklist", path: "/dashboard/checklist", icon: ClipboardCheck },
    { name: "Risk Assessment Register", path: "/dashboard/risks", icon: ShieldAlert },
    { name: "Document Centre", path: "/dashboard/documents", icon: FolderDown },
  ];

  // Settings only for owner
  if (isOwner) {
    smeLinks.push({ name: "Company Settings", path: "/dashboard/settings", icon: Settings });
  }

  const adminLinks = [
    { name: "Admin Overview", path: "/admin", icon: LayoutDashboard },
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "SME Companies", path: "/admin/companies", icon: Building2 },
    { name: "Manage Resources", path: "/admin/resources", icon: Bookmark },
    { name: "Regulatory Updates", path: "/admin/updates", icon: BellRing },
    { name: "Feedback & Inquiries", path: "/admin/feedback", icon: MessageSquare },
  ];

  const activeLinks = isAdmin ? adminLinks : smeLinks;

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-colors duration-300 shrink-0 md:min-h-[calc(100vh-4rem)]">
      {/* User Info Header in Sidebar */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/20">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-solar-400 border border-slate-700 font-bold uppercase shadow-inner">
          {user?.fullName?.charAt(0) || <User className="w-5 h-5" />}
        </div>
        <div className="overflow-hidden">
          <span className="block font-semibold text-white truncate text-sm">
            {user?.fullName || "Guest User"}
          </span>
          <span className="block text-xxs text-solar-500 font-medium tracking-wide uppercase">
            {user?.role === "owner" ? "SME Owner" : user?.role === "officer" ? "Compliance Officer" : "System Admin"}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <span className="block text-xxs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Management
        </span>
        {activeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? "bg-solar-500 text-white shadow-md shadow-solar-500/10"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(link.path) ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Corporate SME Indicator */}
      {!isAdmin && user?.companyName && (
        <div className="p-4 m-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Registered Company
          </span>
          <span className="block text-xs font-bold text-slate-200 truncate mt-1">
            {user.companyName}
          </span>
        </div>
      )}
    </aside>
  );
}
