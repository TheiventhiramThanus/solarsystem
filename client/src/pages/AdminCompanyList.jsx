import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { calculateComplianceScore } from "../utils/complianceEngine";
import { Building2, Landmark, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCompanyList() {
  const [companies, setCompanies] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [risks, setRisks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, c] = await Promise.all([
          dbService.getAdminUsers(),
          dbService.getAdminCompanies()
        ]);
        
        setUsers(u);
        setCompanies(c);

        // Fetch checklist, docs, and risks for all companies to compute scores
        const chkPromises = c.map(comp => dbService.getChecklists(comp.companyId));
        const docPromises = c.map(comp => dbService.getDocuments(comp.companyId));
        const rskPromises = c.map(comp => dbService.getRisks(comp.companyId));

        const allChecklists = await Promise.all(chkPromises);
        const allDocuments = await Promise.all(docPromises);
        const allRisks = await Promise.all(rskPromises);

        setChecklists(allChecklists.flat());
        setDocuments(allDocuments.flat());
        setRisks(allRisks.flat());
      } catch (err) {
        toast.error("Failed to load company compliance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCompanyOwner = (ownerId) => {
    const owner = users.find(u => u.uid === ownerId);
    return owner ? owner.fullName : "Unknown Owner";
  };

  const getCompanyScore = (companyId) => {
    const compChecklists = checklists.filter(c => c.companyId === companyId);
    const compDocs = documents.filter(d => d.companyId === companyId);
    const compRisks = risks.filter(r => r.companyId === companyId);
    const result = calculateComplianceScore(compChecklists, compDocs, compRisks);
    return result.overallScore;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 font-bold";
    if (score >= 50) return "text-yellow-500 font-bold";
    return "text-red-500 font-bold";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500/10 text-green-600 dark:text-green-400";
    if (score >= 50) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
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
          <Building2 className="w-6 h-6 text-purple-500" />
          <span>SME Installation Companies</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review business registrations, corporate owners, and live audit scores.
        </p>
      </div>

      {/* Main Companies Register Table */}
      <div className="glass-card border-slate-200 dark:border-slate-850 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-550 dark:text-slate-400 text-xxs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Company Name & Sector</th>
                <th className="px-6 py-4">Principal Manager</th>
                <th className="px-6 py-4">Headquarters Address</th>
                <th className="px-6 py-4">Phone Contact</th>
                <th className="px-6 py-4 text-center">Compliance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {companies.map((item) => {
                const score = getCompanyScore(item.companyId);
                return (
                  <tr key={item.companyId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    {/* Name & Sector */}
                    <td className="px-6 py-4">
                      <span className="block font-bold text-slate-850 dark:text-slate-100">
                        {item.companyName}
                      </span>
                      <span className="block text-[10px] text-slate-450 mt-0.5 uppercase font-medium tracking-wide">
                        {item.industry}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-700 dark:text-slate-350">
                        {getCompanyOwner(item.ownerId)}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 max-w-xxs truncate" title={item.address}>
                      {item.address}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {item.phone}
                    </td>

                    {/* Overall Score indicator */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold leading-normal ${getScoreBg(score)} ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
