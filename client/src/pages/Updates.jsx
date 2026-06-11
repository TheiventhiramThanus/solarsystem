import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { BellRing, Search, Calendar, FileText, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const data = await dbService.getUpdates();
        setUpdates(data);
      } catch (err) {
        toast.error("Failed to load regulatory updates.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const categories = ["All", "Regulatory", "Industry Alert", "Health & Safety"];

  const filteredUpdates = updates.filter(up => {
    const matchesSearch = 
      up.title.toLowerCase().includes(search.toLowerCase()) ||
      up.description.toLowerCase().includes(search.toLowerCase()) ||
      up.source.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || up.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <BellRing className="w-10 h-10 text-solar-500 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Regulatory Updates & Alerts
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl mx-auto">
            Stay informed about amendments to BS 7671, updates to MCS install standards, and health & safety enforcement alerts.
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert title, source, or standard..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 md:col-span-6 md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? "bg-solar-500 text-white shadow-md shadow-solar-500/10"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Updates List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-solar-500"></div>
          </div>
        ) : filteredUpdates.length > 0 ? (
          <div className="space-y-6">
            {filteredUpdates.map((up) => (
              <div 
                key={up.updateId} 
                className="glass-card border-l-4 border-solar-500 dark:border-solar-500 p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider ${
                      up.category === "Regulatory"
                        ? "bg-purple-150 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        : up.category === "Health & Safety"
                        ? "bg-red-150 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-amber-150 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {up.category}
                    </span>
                    <span className="text-xxs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(up.date)}</span>
                    </span>
                  </div>
                  <span className="text-xxs font-medium text-slate-500">
                    Source: <strong className="text-slate-700 dark:text-slate-350">{up.source}</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {up.title}
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                    {up.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-2 text-xxs text-slate-500">
                  <AlertCircle className="w-4 h-4 text-solar-500" />
                  <span>Compliance actions should be updated in your checklist accordingly.</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-16 border-dashed border-2 border-slate-300 dark:border-slate-800">
            <p className="text-sm text-slate-555">
              No regulatory updates matched your filters.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
