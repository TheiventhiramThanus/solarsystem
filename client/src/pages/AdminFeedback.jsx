import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { MessageSquare, Calendar, ShieldCheck, Mail, Building, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFeedback = async () => {
    try {
      const data = await dbService.getFeedback();
      setFeedback(data);
    } catch (err) {
      toast.error("Failed to load user inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter(fb => {
    return (
      fb.name.toLowerCase().includes(search.toLowerCase()) ||
      fb.company.toLowerCase().includes(search.toLowerCase()) ||
      fb.message.toLowerCase().includes(search.toLowerCase()) ||
      fb.type.toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <span>Feedback & Support Inquiries</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review feature suggestions, bug reports, and research inquiries submitted by stakeholders.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter messages by name, company, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Feed list */}
      <div className="space-y-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((fb) => (
            <div 
              key={fb.feedbackId} 
              className="glass-card border-slate-200 dark:border-slate-850 p-5 space-y-4 hover:shadow-sm transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/40 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <span className={`badge uppercase text-[8px] font-bold py-0.5 px-2.5 ${
                    fb.type === "Bug Report" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                      : fb.type === "Feature Request" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                      : "bg-slate-150 text-slate-700 dark:bg-slate-800 dark:text-slate-350"
                  }`}>
                    {fb.type}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(fb.createdAt)}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xxs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{fb.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{fb.company}</span>
                  </span>
                </div>
              </div>

              <div>
                <span className="block font-bold text-xs text-slate-900 dark:text-white">
                  Sender: {fb.name}
                </span>
                <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed mt-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850/50">
                  {fb.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card text-center py-16 border-dashed border-2 border-slate-300 dark:border-slate-800">
            <p className="text-xs text-slate-555">
              No feedback submissions registered matching filters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
