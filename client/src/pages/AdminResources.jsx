import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { Bookmark, Plus, Trash2, Globe, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("MCS");
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    try {
      const data = await dbService.getResources();
      setResources(data);
    } catch (err) {
      toast.error("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !purpose || !url) {
      toast.error("Please fill in all resource detail fields.");
      return;
    }

    setSubmitting(true);
    try {
      const newRes = await dbService.addResource({
        name,
        purpose,
        url,
        category
      });
      setResources(prev => [...prev, newRes]);
      toast.success(`Compliance resource added: ${name}`);
      
      // Reset
      setName("");
      setPurpose("");
      setUrl("");
    } catch (err) {
      toast.error("Failed to add resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      await dbService.deleteResource(id);
      setResources(prev => prev.filter(r => r.resourceId !== id));
      toast.success("Resource deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete resource.");
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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Bookmark className="w-6 h-6 text-purple-500" />
          <span>Manage Compliance Resources</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Create, edit, and delete official standards links shown on visitor pages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="glass-card border-slate-200 dark:border-slate-850 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Plus className="w-4.5 h-4.5 text-purple-500" />
              <span>Add Resource Link</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Resource Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field bg-white dark:bg-slate-800 text-xs py-2"
                >
                  <option value="MCS">MCS Scheme</option>
                  <option value="HSE">HSE Safety</option>
                  <option value="Ofgem">Ofgem / Grid</option>
                  <option value="DNO">BS 7671 / IET</option>
                  <option value="Planning Portal">Planning Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Standard Name (Title)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MCS 012 Solar Mounting Guide"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Description of Purpose
                </label>
                <textarea
                  rows="3"
                  placeholder="Explain what this guidelines covers..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="input-field text-xs"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Official URL Link
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center space-x-1.5 text-xs py-2.5 shadow-md shadow-purple-500/10 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>{submitting ? "Adding..." : "Add Resource"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* List panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 px-1">
            Active Resource Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div 
                key={res.resourceId} 
                className="glass-card flex flex-col justify-between border-slate-200 dark:border-slate-850 p-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-info bg-solar-500/10 text-solar-500 dark:bg-solar-500/20 text-[9px] font-bold">
                      {res.category}
                    </span>
                    <button
                      onClick={() => handleDelete(res.resourceId, res.name)}
                      className="p-1 text-slate-450 hover:text-red-500 rounded hover:bg-red-500/5 transition-all"
                      title="Delete Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {res.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {res.purpose}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Official Link</span>
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-solar-500 hover:text-solar-600"
                  >
                    Visit Site &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
