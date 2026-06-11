import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { BellRing, Plus, Trash2, Calendar, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUpdates() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Regulatory");
  const [source, setSource] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const adminId = user?.fullName || "System Admin";

  const fetchUpdates = async () => {
    try {
      const data = await dbService.getUpdates();
      setUpdates(data);
    } catch (err) {
      toast.error("Failed to load updates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !description || !source) {
      toast.error("Please fill in all update detail fields.");
      return;
    }

    setSubmitting(true);
    try {
      const newUp = await dbService.addUpdate({
        title,
        description,
        category,
        source
      }, adminId);
      setUpdates(prev => [newUp, ...prev]);
      toast.success(`Regulatory update added: ${title}`);
      
      // Reset
      setTitle("");
      setDescription("");
      setSource("");
    } catch (err) {
      toast.error("Failed to add update.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      await dbService.deleteUpdate(id);
      setUpdates(prev => prev.filter(u => u.updateId !== id));
      toast.success("Regulatory alert deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete alert.");
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <BellRing className="w-6 h-6 text-purple-500" />
          <span>Manage Regulatory Alerts</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Create, publish, and delete industry safety alerts and wiring regulation updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="glass-card border-slate-200 dark:border-slate-850 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Plus className="w-4.5 h-4.5 text-purple-500" />
              <span>Publish Regulatory Alert</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Alert Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field bg-white dark:bg-slate-800 text-xs py-2"
                >
                  <option value="Regulatory">Regulatory Code</option>
                  <option value="Industry Alert">Industry Alert</option>
                  <option value="Health & Safety">Health & Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Alert Heading (Title)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BS 7671 Amendment 3 details"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Authority Source (Publisher)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Institution of Engineering & Technology"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Detailed Specifications
                </label>
                <textarea
                  rows="4"
                  placeholder="Explain standard modifications and action required..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-xs"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn bg-gradient-to-r from-purple-600 to-indigo-650 text-white flex items-center justify-center space-x-1.5 text-xs py-2.5 shadow-md shadow-purple-500/10 hover:from-purple-750 hover:to-indigo-750"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>{submitting ? "Publishing alert..." : "Publish Alert"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* List panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 px-1">
            Active Alerts Feed
          </h3>

          <div className="space-y-4">
            {updates.map((item) => (
              <div 
                key={item.updateId} 
                className="glass-card border-l-4 border-purple-500 dark:border-purple-500 p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="badge badge-info bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-bold">
                      {item.category}
                    </span>
                    <span className="text-xxs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.date)}</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item.updateId, item.title)}
                    className="p-1 text-slate-450 hover:text-red-500 rounded hover:bg-red-500/5 transition-all"
                    title="Delete Update"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-405 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="text-xxs text-slate-500">
                  Authority Source: <span className="font-bold text-slate-700 dark:text-slate-350">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
