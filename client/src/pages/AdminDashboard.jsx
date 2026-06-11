import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { Users, Building2, BellRing, MessageSquare, ShieldCheck, Activity, Clock, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, companies: 0, updates: 0, feedback: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [u, c, up, fb, acts] = await Promise.all([
        dbService.getAdminUsers(),
        dbService.getAdminCompanies(),
        dbService.getUpdates(),
        dbService.getFeedback(),
        dbService.getActivities()
      ]);
      setStats({
        users: u.length,
        companies: c.length,
        updates: up.length,
        feedback: fb.length
      });
      setActivities(acts.slice(0, 10)); // Show latest 10 activities across platform
    } catch (err) {
      console.error("Admin stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Poll stats
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResetDemoData = () => {
    if (window.confirm("Are you sure you want to reset all mock databases back to preloaded defaults? This will erase custom documents, risks, and checklist additions.")) {
      const res = dbService.resetDemoData();
      if (res) {
        toast.success("Seeded database reset to factory defaults!");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Database reset is only supported in offline simulation mode.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-solar-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-purple-500" />
            <span>Platform Administration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review platform KPIs, manage regulatory links, and inspect system audit trails.
          </p>
        </div>

        {/* Demo reset control */}
        <button
          onClick={handleResetDemoData}
          className="btn border border-dashed border-red-500/30 text-red-500 hover:bg-red-500/5 flex items-center space-x-1.5 text-xs py-2 px-3 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Platform Demo Data</span>
        </button>
      </div>

      {/* 2. Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              Registered Users
            </span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.users}
            </span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Companies */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              Solar SMEs
            </span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.companies}
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Total Updates */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              Regulatory Alerts
            </span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.updates}
            </span>
          </div>
          <div className="p-3 bg-solar-500/10 text-solar-500 rounded-xl">
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        {/* Feedback submissions */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              SME Feedback
            </span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.feedback}
            </span>
          </div>
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Global Activity Log */}
      <div className="glass-card border-slate-200/60 dark:border-slate-800/80 p-5">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
          <Activity className="w-4.5 h-4.5 text-purple-500" />
          <span>Global Audit Trail & Activities</span>
        </h3>

        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((act) => (
              <div key={act.activityId} className="flex items-start space-x-3 text-xs leading-normal pb-3 border-b border-slate-100 dark:border-slate-800/40 last:border-0 last:pb-0">
                <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-400 shrink-0">
                  🧬
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 dark:text-slate-200 font-semibold">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(act.createdAt).toLocaleString("en-GB")}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-500 py-8">
              No recent activity recorded on the platform.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
