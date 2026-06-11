import React, { useState, useEffect } from "react";
import { dbService } from "../services/firebase";
import { Users, UserPlus, ShieldAlert, CheckCircle, Ban, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Registration Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const [u, c] = await Promise.all([
        dbService.getAdminUsers(),
        dbService.getAdminCompanies()
      ]);
      setUsers(u);
      setCompanies(c);
      if (c.length > 0) setSelectedCompanyId(c[0].companyId);
    } catch (err) {
      toast.error("Failed to load user directories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    try {
      await dbService.setUserStatus(user.uid, nextStatus);
      setUsers(prev =>
        prev.map(u => u.uid === user.uid ? { ...u, status: nextStatus } : u)
      );
      toast.success(`User '${user.fullName}' status updated to ${nextStatus.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to update user status.");
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !selectedCompanyId) {
      toast.error("Please fill in all officer account credentials.");
      return;
    }

    setCreating(true);
    try {
      const comp = companies.find(c => c.companyId === selectedCompanyId);
      const companyName = comp ? comp.companyName : "Assigned Company";
      
      const newOfficer = await dbService.createComplianceOfficer(
        selectedCompanyId,
        companyName,
        fullName,
        email,
        password
      );

      setUsers(prev => [...prev, newOfficer]);
      toast.success(`Compliance Officer '${fullName}' created successfully!`);
      
      // Reset
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to create officer account.");
    } finally {
      setCreating(false);
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
          <Users className="w-6 h-6 text-purple-500" />
          <span>User Directory & Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review user roles, manage account suspensions, and register Compliance Officer profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Officer Creator Form (4 cols) */}
        <div className="lg:col-span-4">
          <div className="glass-card border-slate-200 dark:border-slate-850 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <UserPlus className="w-4.5 h-4.5 text-purple-500" />
              <span>Create Compliance Officer</span>
            </h3>

            <form onSubmit={handleCreateOfficer} className="space-y-4">
              {/* Select target company */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Assign to Solar Company
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="input-field bg-white dark:bg-slate-800 text-xs py-2"
                >
                  {companies.map(c => (
                    <option key={c.companyId} value={c.companyId}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Officer Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. compliance@solarforce.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Temporary Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center space-x-1.5 text-xs py-2.5 shadow-md shadow-purple-500/10 hover:from-purple-700 hover:to-indigo-700"
              >
                <UserPlus className="w-4.5 h-4.5" />
                <span>{creating ? "Registering Officer..." : "Create Officer Account"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Directory Table (8 cols) */}
        <div className="lg:col-span-8">
          <div className="glass-card border-slate-200 dark:border-slate-850 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-550 dark:text-slate-400 text-xxs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Full Name & Email</th>
                    <th className="px-6 py-4">Role Classification</th>
                    <th className="px-6 py-4">Attached Company</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {users.map((item) => (
                    <tr key={item.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <span className="block font-bold text-slate-850 dark:text-slate-100">
                          {item.fullName}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {item.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap uppercase font-bold text-[9px] tracking-wider">
                        {item.role === "admin" ? (
                          <span className="text-purple-650 dark:text-purple-400">Admin</span>
                        ) : item.role === "owner" ? (
                          <span className="text-solar-600 dark:text-solar-400">SME Owner</span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">Compliance Staff</span>
                        )}
                      </td>

                      {/* Company Name */}
                      <td className="px-6 py-4 max-w-xxs truncate whitespace-nowrap">
                        {item.companyName || <span className="text-slate-500 italic">None</span>}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge uppercase text-[8px] font-bold py-0.5 px-2.5 ${
                          item.status === "active" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Toggle suspend (blocked for themselves) */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {item.role !== "admin" ? (
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`p-2 rounded-xl border transition-all ${
                              item.status === "active"
                                ? "text-red-500 border-red-500/10 hover:bg-red-500/5 hover:border-red-500/25"
                                : "text-green-500 border-green-500/10 hover:bg-green-500/5 hover:border-green-500/25"
                            }`}
                            title={item.status === "active" ? "Suspend Account" : "Activate Account"}
                          >
                            {item.status === "active" ? (
                              <Ban className="w-4.5 h-4.5" />
                            ) : (
                              <CheckCircle className="w-4.5 h-4.5" />
                            )}
                          </button>
                        ) : (
                          <span className="text-xxs text-slate-500 italic">Super</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
