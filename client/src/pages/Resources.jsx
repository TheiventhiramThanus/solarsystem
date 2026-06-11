import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { Bookmark, Search, ExternalLink, Globe, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await dbService.getResources();
        setResources(data);
      } catch (err) {
        toast.error("Failed to load official resources.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = ["All", "MCS", "HSE", "Ofgem", "Planning Portal", "DNO"];

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.name.toLowerCase().includes(search.toLowerCase()) ||
      res.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || res.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Bookmark className="w-10 h-10 text-solar-500 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Official Compliance Resources
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl mx-auto">
            Access trusted guidelines, templates, and regulatory handbooks from official UK solar installer regulatory bodies.
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search resource standard or keyword..."
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

        {/* Resources list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-solar-500"></div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((res) => (
              <div 
                key={res.resourceId} 
                className="glass-card-hover border-slate-200 dark:border-slate-850 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-info bg-solar-500/10 text-solar-500 dark:bg-solar-500/20 text-xxs font-bold">
                      {res.category}
                    </span>
                    {res.trustedSource && (
                      <span className="flex items-center space-x-0.5 text-xxs font-semibold text-green-600 dark:text-green-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {res.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {res.purpose}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-slate-450 dark:text-slate-500 flex items-center space-x-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Link</span>
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-solar-500 hover:text-solar-600 dark:hover:text-solar-400"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-16 border-dashed border-2 border-slate-300 dark:border-slate-800">
            <p className="text-sm text-slate-555">
              No official resources matched your search query.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
