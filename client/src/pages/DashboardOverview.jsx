import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/firebase";
import { calculateComplianceScore } from "../utils/complianceEngine";
import { generateAuditReport } from "../utils/pdfGenerator";
import { ClipboardList, ShieldAlert, FolderDown, Calendar, FileText, ArrowRight, Download, Activity, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [risks, setRisks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const companyId = user?.companyId || "";

  const fetchData = async () => {
    if (!companyId) return;
    try {
      const [chk, docs, rsk, acts] = await Promise.all([
        dbService.getChecklists(companyId),
        dbService.getDocuments(companyId),
        dbService.getRisks(companyId),
        dbService.getActivities(companyId)
      ]);
      setChecklists(chk);
      setDocuments(docs);
      setRisks(rsk);
      setActivities(acts.slice(0, 5)); // Show latest 5 activities
    } catch (err) {
      console.error("Dashboard data load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up poller to maintain reactivity during live edits/toggles
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [companyId]);

  const { overallScore, breakdown } = calculateComplianceScore(checklists, documents, risks);

  // Determine colour based on score
  const getScoreColorClass = (score) => {
    if (score >= 80) return "text-green-500 stroke-green-500";
    if (score >= 50) return "text-yellow-500 stroke-yellow-500";
    return "text-red-500 stroke-red-500";
  };

  const getScoreBgClass = (score) => {
    if (score >= 80) return "bg-green-500/10 text-green-600 dark:text-green-400";
    if (score >= 50) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const company = await dbService.getCompany(companyId);
      const success = await generateAuditReport(company, overallScore, breakdown, checklists, risks, documents, user?.fullName);
      if (success) {
        toast.success("PDF Compliance Report generated!");
      } else {
        toast.error("Failed to compile PDF report.");
      }
    } catch (error) {
      toast.error("PDF generation failed: " + error.message);
    } finally {
      setDownloading(false);
    }
  };

  // Calendar dates
  const complianceDates = [
    { title: "MCS Annual Site Audit", date: "24 Jun 2026", status: "Upcoming", type: "MCS Office Review" },
    { title: "Public Liability Policy Renewal", date: "26 Jul 2026", status: "Upcoming", type: "Insurance Review" },
    { title: "NICEIC Contractor Fee Renewal", date: "15 Aug 2026", status: "Scheduled", type: "Accreditation Review" },
    { title: "G99 Network Interconnection Deadline", date: "10 Jul 2026", status: "Pending", type: "DNO Sign-off" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-solar-500"></div>
      </div>
    );
  }

  // SVG parameters for radial gauge
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor, assess, and document compliance for your solar SME operations.
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn-primary flex items-center space-x-2 text-xs py-2.5 px-4 shadow-lg shadow-solar-500/10"
        >
          <Download className="w-4.5 h-4.5" />
          <span>{downloading ? "Compiling Report..." : "Download Compliance Report"}</span>
        </button>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Score Ring Widget (4 cols) */}
        <div className="lg:col-span-4 glass-card flex flex-col items-center justify-center text-center p-6 border-slate-200/60 dark:border-slate-800/80">
          <span className="block font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">
            Overall Compliance Score
          </span>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Back track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                strokeWidth={strokeWidth}
              />
              {/* Foreground progress */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`fill-none transition-all duration-1000 ${getScoreColorClass(overallScore)}`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">
                {overallScore}%
              </span>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${getScoreBgClass(overallScore)}`}>
                {overallScore >= 80 ? "Audited & Good" : overallScore >= 50 ? "At Risk" : "Critical Warning"}
              </span>
            </div>
          </div>
        </div>

        {/* Core breakdown panels (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Checklist Widget */}
          <div className="glass-card flex flex-col justify-between p-5 border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-solar-500/10 text-solar-500 shadow-inner">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-xxs font-bold text-slate-500 uppercase">Weight: 50%</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
                {breakdown.checklist.completed} / {breakdown.checklist.total}
              </span>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                Checklist Tasks Completed
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xxs text-slate-500 flex justify-between">
              <span>Performance:</span>
              <span className="font-bold text-solar-500">{breakdown.checklist.score}%</span>
            </div>
          </div>

          {/* Document Center Widget */}
          <div className="glass-card flex flex-col justify-between p-5 border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shadow-inner">
                <FolderDown className="w-5 h-5" />
              </div>
              <span className="text-xxs font-bold text-slate-500 uppercase">Weight: 30%</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
                {breakdown.documents.uploaded} / {breakdown.documents.total}
              </span>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                Mandatory Credentials
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xxs text-slate-500 flex justify-between">
              <span>Performance:</span>
              <span className="font-bold text-blue-500">{breakdown.documents.score}%</span>
            </div>
          </div>

          {/* Risk Register Widget */}
          <div className="glass-card flex flex-col justify-between p-5 border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 shadow-inner">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xxs font-bold text-slate-500 uppercase">Weight: 20%</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
                {breakdown.risks.mitigated} / {breakdown.risks.total}
              </span>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                Risks Mitigated / Reviewed
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xxs text-slate-500 flex justify-between">
              <span>Performance:</span>
              <span className="font-bold text-green-500">{breakdown.risks.score}%</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Lower Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compliance Calendar */}
        <div className="glass-card border-slate-200/60 dark:border-slate-800/80 p-5">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-4.5 h-4.5 text-solar-500" />
            <span>Compliance Calendar & Deadlines</span>
          </h3>

          <div className="space-y-3">
            {complianceDates.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {item.type}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-solar-500">
                    {item.date}
                  </span>
                  <span className="inline-block text-[9px] font-bold text-green-600 dark:text-green-400 mt-0.5">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs / Audit Trail */}
        <div className="glass-card border-slate-200/60 dark:border-slate-800/80 p-5">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <Activity className="w-4.5 h-4.5 text-solar-500" />
            <span>Recent Activities & Audit Trail</span>
          </h3>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.activityId} className="flex items-start space-x-3 text-xs leading-normal">
                  <div className="p-1 rounded-full bg-slate-150 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-solar-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 dark:text-slate-300">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(act.createdAt).toLocaleString("en-GB")}</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-500 py-8">
                No recent activity logged in the audit trail.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
