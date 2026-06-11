import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/firebase";
import { ClipboardCheck, CheckCircle2, Circle, Clock, Info, HelpCircle, FileCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function ComplianceChecklist() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Phase 1");
  const [expandedTask, setExpandedTask] = useState(null);

  const companyId = user?.companyId || "";
  const userId = user?.uid || "";
  const userName = user?.fullName || "Staff";

  const fetchChecklist = async () => {
    if (!companyId) return;
    try {
      const list = await dbService.getChecklists(companyId);
      setTasks(list);
    } catch (err) {
      toast.error("Failed to load checklist tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
    // Poll checklist state
    const interval = setInterval(fetchChecklist, 4000);
    return () => clearInterval(interval);
  }, [companyId]);

  const phases = [
    "Phase 1: Registration & Accreditations",
    "Phase 2: Health & Safety / Pre-Installation",
    "Phase 3: Installation Standards (BS 7671)",
    "Phase 4: Commissioning & DNO Notification"
  ];

  const handleToggle = async (task) => {
    try {
      const nextCompleted = !task.completed;
      await dbService.toggleChecklistTask(task.checklistId, nextCompleted, userId, userName);
      
      setTasks(prev =>
        prev.map(t => t.checklistId === task.checklistId ? { ...t, completed: nextCompleted, updatedAt: Date.now() } : t)
      );
      toast.success(nextCompleted ? `Task completed: ${task.taskName}` : `Task incomplete: ${task.taskName}`);
    } catch (err) {
      toast.error("Failed to update task status.");
    }
  };

  // Find phase full text based on prefix
  const getPhaseFullText = (prefix) => {
    return phases.find(p => p.startsWith(prefix)) || prefix;
  };

  const getFilteredTasks = () => {
    const fullPhaseName = getPhaseFullText(activeTab);
    return tasks.filter(t => t.phase === fullPhaseName);
  };

  const getPhaseStats = (phaseName) => {
    const fullPhaseName = getPhaseFullText(phaseName);
    const phaseTasks = tasks.filter(t => t.phase === fullPhaseName);
    const completed = phaseTasks.filter(t => t.completed).length;
    return { completed, total: phaseTasks.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-solar-500"></div>
      </div>
    );
  }

  const activeTasks = getFilteredTasks();
  const completedAll = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Compliance Checklist Scaffolding
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the standard microgeneration requirements to secure certificate integrity.
          </p>
        </div>
        <div className="glass-card py-2 px-4 border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center space-x-2">
          <ClipboardCheck className="w-4.5 h-4.5 text-solar-500" />
          <span>Total Progress: {completedAll} / {tasks.length} Done</span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["Phase 1", "Phase 2", "Phase 3", "Phase 4"].map((phasePrefix) => {
          const stats = getPhaseStats(phasePrefix);
          const isCurrent = activeTab === phasePrefix;
          return (
            <button
              key={phasePrefix}
              onClick={() => setActiveTab(phasePrefix)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                isCurrent 
                  ? "bg-slate-900 dark:bg-slate-900 border-solar-500 text-white shadow-md" 
                  : "bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/80 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60"
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isCurrent ? "text-solar-400" : "text-slate-450"}`}>
                {phasePrefix}
              </span>
              <span className={`block font-bold text-xs mt-1 truncate ${isCurrent ? "text-white" : "text-slate-850 dark:text-slate-200"}`}>
                {phasePrefix === "Phase 1" && "Accreditations"}
                {phasePrefix === "Phase 2" && "Pre-Install RAMS"}
                {phasePrefix === "Phase 3" && "Installation Standard"}
                {phasePrefix === "Phase 4" && "DNO Grid Out"}
              </span>
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100 dark:border-slate-850/60 text-[10px] text-slate-400 font-semibold">
                <span>Completed:</span>
                <span className={isCurrent ? "text-solar-400" : "text-slate-700 dark:text-slate-300"}>
                  {stats.completed}/{stats.total}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tasks breakdown lists */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 px-1">
          {activeTab} Tasks breakdown
        </h3>

        <div className="space-y-3">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => {
              const isExpanded = expandedTask === task.checklistId;
              return (
                <div 
                  key={task.checklistId}
                  className={`glass-card border transition-all ${
                    task.completed 
                      ? "border-green-500/20 bg-green-500/[0.01] dark:bg-green-950/[0.01]" 
                      : "border-slate-200/60 dark:border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    
                    {/* Toggle button */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => handleToggle(task)}
                        className="p-1 rounded-full text-slate-400 hover:text-solar-500 dark:hover:text-solar-400 focus:outline-none transition-all"
                        title={task.completed ? "Mark Incomplete" : "Mark Completed"}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                        )}
                      </button>
                      
                      {/* Name */}
                      <span className={`font-bold text-xs sm:text-sm leading-snug cursor-pointer ${
                        task.completed 
                          ? "text-slate-500 line-through decoration-slate-400" 
                          : "text-slate-850 dark:text-slate-100"
                      }`}
                      onClick={() => setExpandedTask(isExpanded ? null : task.checklistId)}
                      >
                        {task.taskName}
                      </span>
                    </div>

                    {/* Expand trigger button */}
                    <button
                      onClick={() => setExpandedTask(isExpanded ? null : task.checklistId)}
                      className="text-slate-400 hover:text-solar-500 font-semibold text-xxs flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{isExpanded ? "Hide Details" : "Audit Reason"}</span>
                    </button>

                  </div>

                  {/* Expanded Audit instructions */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-150 dark:border-slate-850/80 text-xs text-slate-600 dark:text-slate-350 space-y-3 animate-fadeIn">
                      <div>
                        <strong className="block font-bold text-xxs uppercase tracking-wider text-solar-500 mb-1">
                          Action Required & Rationale:
                        </strong>
                        <p className="leading-relaxed">
                          {task.actionRequired}
                        </p>
                      </div>
                      
                      {task.completed && (
                        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center space-x-2 text-[10px] text-green-600 dark:text-green-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Last verified on {new Date(task.updatedAt).toLocaleDateString("en-GB")}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="glass-card text-center py-12">
              <p className="text-xs text-slate-500">No checklist tasks loaded for this phase.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
