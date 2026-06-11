import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/firebase";
import Sidebar from "./Sidebar";
import { Bell, LogOut, ShieldCheck, Sun, Moon, Calendar, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }) {
  const { user, signOut, isSmeUser, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const companyId = user?.companyId || "";

  useEffect(() => {
    if (!companyId) return;
    const fetchNotifications = async () => {
      try {
        const list = await dbService.getNotifications(companyId);
        setNotifications(list);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // Set up a periodic poller in mock simulation mode to keep dashboards reactive
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [companyId]);

  const handleMarkRead = async (id) => {
    try {
      await dbService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.notificationId === id ? { ...n, read: true } : n)
      );
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content pane */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Workspace
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
              {isAdmin ? "Platform Administration" : user?.companyName || "SME Installer Portal"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Notification Bell */}
            {isSmeUser && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-300 hover:text-solar-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                      <span className="font-bold text-xs">Alert Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xxs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold">
                          {unreadCount} Unread
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.notificationId} 
                            onClick={() => !notif.read && handleMarkRead(notif.notificationId)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-2.5 ${
                              notif.read 
                                ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50 opacity-60" 
                                : "bg-solar-500/5 dark:bg-solar-500/5 border-solar-500/10 hover:bg-solar-500/10"
                            }`}
                          >
                            <div className="mt-0.5">
                              {notif.type === "renewal" ? (
                                <Calendar className="w-4 h-4 text-blue-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-solar-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="block font-bold text-xxs leading-tight text-slate-850 dark:text-slate-200">
                                {notif.title}
                              </span>
                              <span className="block text-[10px] text-slate-500 leading-normal mt-0.5">
                                {notif.message}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xxs text-slate-500 py-6">
                          No active notifications.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-300 hover:text-red-500 hover:bg-red-500/5 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard child views */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
