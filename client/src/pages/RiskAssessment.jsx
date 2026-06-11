import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/firebase";
import { ShieldAlert, Plus, Trash2, CheckCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function RiskAssessment() {
  const { user, isOwner } = useAuth();
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [area, setArea] = useState("Health & Safety");
  const [hazard, setHazard] = useState("");
  const [level, setLevel] = useState("High");
  const [mitigation, setMitigation] = useState("");

  const companyId = user?.companyId || "";
  const userId = user?.uid || "";
  const userName = user?.fullName || "Staff";

  const fetchRisks = async () => {
    if (!companyId) return;
    try {
      const data = await dbService.getRisks(companyId);
      setRisks(data);
    } catch (err) {
      toast.error("Failed to load risk register.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
    // Poll risks state
    const interval = setInterval(fetchRisks, 4000);
    return () => clearInterval(interval);
  }, [companyId]);

  // Standard Solar Risk Templates
  const riskTemplates = [
    { area: "Health & Safety", hazard: "Falls from height during roof installation due to ladder shears or wind drafts.", level: "High", mitigation: "Mandatory scaffold edge protection, safety harness anchor points, and stop-work wind speed rules (>25mph)." },
    { area: "Electrical Standards", hazard: "DC arc-fault fire hazard in attic spaces due to hand-crimped MC4 connectors.", level: "High", mitigation: "Deploy manufacturer-matched MC4 crimping tools, inspect lines with thermal cameras, and deploy fire-retardant DC enclosures." },
    { area: "Structural Integrity", hazard: "Roof rafter deflection or slate shearing under heavy panel load.", level: "Medium", mitigation: "Conduct pre-install load calculation using MCS 012 calculators. Replace weak timbers." },
    { area: "Grid Connection", hazard: "DNO delays in G98/G99 application approvals delaying grid handovers.", level: "Medium", mitigation: "File DNO grid applications at engineering stage, before purchasing solar packages or booking scaffolds." }
  ];

  const handleApplyTemplate = (tpl) => {
    setArea(tpl.area);
    setHazard(tpl.hazard);
    setLevel(tpl.level);
    setMitigation(tpl.mitigation);
  };

  const handleAddRisk = async (e) => {
    e.preventDefault();
    if (!hazard || !mitigation) {
      toast.error("Please fill in all risk assessment fields.");
      return;
    }

    try {
      const newRisk = await dbService.addRisk(companyId, {
        complianceArea: area,
        potentialRisk: hazard,
        riskLevel: level,
        mitigationAction: mitigation,
        status: "Open"
      }, userId, userName);

      setRisks(prev => [newRisk, ...prev]);
      setModalOpen(false);
      resetForm();
      toast.success("Risk assessment added successfully.");
    } catch (err) {
      toast.error("Failed to add risk.");
    }
  };

  const handleStatusChange = async (riskId, currentStatus) => {
    const nextStatus = currentStatus === "Open" ? "Mitigated" : currentStatus === "Mitigated" ? "Reviewed" : "Open";
    try {
      await dbService.updateRisk(riskId, { status: nextStatus }, userId, userName);
      setRisks(prev =>
        prev.map(r => r.riskId === riskId ? { ...r, status: nextStatus } : r)
      );
      toast.success(`Risk status updated to: ${nextStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (riskId) => {
    if (!window.confirm("Are you sure you want to delete this risk assessment?")) return;
    try {
      await dbService.deleteRisk(riskId);
      setRisks(prev => prev.filter(r => r.riskId !== riskId));
      toast.success("Risk assessment deleted.");
    } catch (err) {
      toast.error("Failed to delete risk assessment.");
    }
  };

  const resetForm = () => {
    setArea("Health & Safety");
    setHazard("");
    setLevel("High");
    setMitigation("");
  };

  const countByLevel = (lvl) => risks.filter(r => r.riskLevel === lvl).length;
  const countByStatus = (stat) => risks.filter(r => r.status === stat).length;

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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Risk Assessment Register
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Log technical hazards, outline mitigation plans, and record inspection outcomes.
          </p>
        </div>
        
        {/* Add Risk button */}
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center space-x-1.5 text-xs py-2.5 px-4 shadow-lg shadow-solar-500/10"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Site Risk Assessment</span>
        </button>
      </div>

      {/* Matrix overview counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* High Risk Panel */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              High Hazards
            </span>
            <span className="block text-2xl font-extrabold text-red-500">
              {countByLevel("High")}
            </span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Medium Risk Panel */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              Medium Hazards
            </span>
            <span className="block text-2xl font-extrabold text-amber-500">
              {countByLevel("Medium")}
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Low Risk Panel */}
        <div className="glass-card flex items-center justify-between border-slate-200 dark:border-slate-800 p-5">
          <div className="space-y-1">
            <span className="block text-xxs font-bold uppercase tracking-wider text-slate-500">
              Mitigated / Reviewed
            </span>
            <span className="block text-2xl font-extrabold text-green-500">
              {countByStatus("Mitigated") + countByStatus("Reviewed")}
            </span>
          </div>
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Table Register */}
      <div className="glass-card border-slate-200 dark:border-slate-850 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-550 dark:text-slate-400 text-xxs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Area & Hazard</th>
                <th className="px-6 py-4">Mitigation Action Plan</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Status Check</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {risks.length > 0 ? (
                risks.map((risk) => (
                  <tr key={risk.riskId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    {/* Area & Hazard */}
                    <td className="px-6 py-4 max-w-xs">
                      <span className="block font-bold text-xxs uppercase tracking-wide text-solar-500 mb-1">
                        {risk.complianceArea}
                      </span>
                      <p className="font-semibold text-slate-850 dark:text-slate-150 leading-relaxed">
                        {risk.potentialRisk}
                      </p>
                    </td>

                    {/* Mitigation plan */}
                    <td className="px-6 py-4 max-w-sm text-slate-550 dark:text-slate-350 leading-relaxed">
                      {risk.mitigationAction}
                    </td>

                    {/* Level badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge uppercase font-bold text-[9px] ${
                        risk.riskLevel === "High" 
                          ? "bg-red-500/10 text-red-500" 
                          : risk.riskLevel === "Medium" 
                          ? "bg-amber-500/10 text-amber-500" 
                          : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {risk.riskLevel}
                      </span>
                    </td>

                    {/* Status Badge clickable toggler */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChange(risk.riskId, risk.status)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xxs font-bold border hover:scale-102 active:scale-98 transition-all ${
                          risk.status === "Open"
                            ? "bg-red-500/5 text-red-500 border-red-500/20"
                            : risk.status === "Mitigated"
                            ? "bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20"
                            : "bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }`}
                        title="Click to toggle status"
                      >
                        {risk.status === "Open" ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : risk.status === "Mitigated" ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        <span>{risk.status}</span>
                      </button>
                    </td>

                    {/* Delete button (RBAC: Owners only) */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {isOwner ? (
                        <button
                          onClick={() => handleDelete(risk.riskId)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                          title="Delete Risk Assessment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No risk assessments currently registered. Click 'Add Site Risk Assessment' to log hazards.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Risk Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
                <ShieldAlert className="w-5 h-5 text-solar-500" />
                <span>Create Site Risk Assessment Log</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[70vh] overflow-y-auto">
              
              {/* Form Col */}
              <form onSubmit={handleAddRisk} className="space-y-4 md:col-span-7">
                {/* Area Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Compliance Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="input-field bg-white dark:bg-slate-800"
                  >
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Structural Integrity">Structural Integrity</option>
                    <option value="Electrical Standards">Electrical Standards</option>
                    <option value="Grid Connection">Grid Connection</option>
                  </select>
                </div>

                {/* Level selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Severity Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low", "Medium", "High"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          level === lvl
                            ? lvl === "High"
                              ? "bg-red-500/10 text-red-600 border-red-500/30"
                              : lvl === "Medium"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : "bg-blue-500/10 text-blue-650 border-blue-500/30"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hazard description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Identified Hazard (Potential Risk)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Describe specific risk hazard (e.g. roof shear or MC4 arc sparks)..."
                    value={hazard}
                    onChange={(e) => setHazard(e.target.value)}
                    className="input-field"
                  ></textarea>
                </div>

                {/* Mitigation instructions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mitigation Action Plan
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Detail specific prevention checks and equipment..."
                    value={mitigation}
                    onChange={(e) => setMitigation(e.target.value)}
                    className="input-field"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center space-x-1.5 py-3 shadow-md"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>Log Risk Assessment</span>
                </button>
              </form>

              {/* Template quick select Col */}
              <div className="md:col-span-5 border-l border-slate-200/60 dark:border-slate-800/80 pl-6 space-y-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Hazard Templates
                </span>
                
                <div className="space-y-3">
                  {riskTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 hover:border-solar-500/20 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-all text-xxs leading-snug"
                    >
                      <strong className="block text-solar-500 uppercase tracking-wide font-bold mb-1">
                        {tpl.area}
                      </strong>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold block truncate">
                        {tpl.hazard}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
