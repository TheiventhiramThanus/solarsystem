import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/firebase";
import { Settings, Save, Building, Phone, MapPin, Users, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function CompanySettings() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const companyId = user?.companyId || "";

  useEffect(() => {
    if (!companyId) return;
    const fetchCompanyData = async () => {
      try {
        const [comp, usersList] = await Promise.all([
          dbService.getCompany(companyId),
          dbService.getAdminUsers() // Fetch all users to filter staff
        ]);
        
        if (comp) {
          setCompany(comp);
          setName(comp.companyName);
          setAddress(comp.address);
          setPhone(comp.phone);
        }
        
        // Filter users belonging to this company
        const companyStaff = usersList.filter(u => u.companyId === companyId);
        setStaff(companyStaff);
      } catch (err) {
        toast.error("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      toast.error("Please fill in all company profile fields.");
      return;
    }

    setSaving(true);
    try {
      await dbService.updateCompany(companyId, {
        companyName: name,
        address,
        phone
      });
      toast.success("Company profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update company profile.");
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-solar-500" />
          <span>Company Profile & Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your solar business registration details and review assigned staff members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Form (7 cols) */}
        <div className="md:col-span-7">
          <div className="glass-card border-slate-200 dark:border-slate-850 p-6 md:p-8">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6 flex items-center space-x-1.5">
              <Building className="w-4.5 h-4.5 text-solar-500" />
              <span>Registered Business Details</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Head Office Address
                </label>
                <textarea
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Telephone Contact
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center justify-center space-x-1.5 w-full py-3 shadow-md"
              >
                <Save className="w-4.5 h-4.5" />
                <span>{saving ? "Saving changes..." : "Save Company Profile"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Staff / Officers List (5 cols) */}
        <div className="md:col-span-5">
          <div className="glass-card border-slate-200 dark:border-slate-850 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Users className="w-4.5 h-4.5 text-solar-500" />
              <span>Assigned Personnel</span>
            </h3>

            <div className="space-y-3">
              {staff.map((member) => (
                <div 
                  key={member.uid} 
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {member.fullName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block font-bold text-xs text-slate-900 dark:text-slate-200 truncate leading-tight">
                      {member.fullName}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Role: {member.role === "owner" ? "SME Manager" : "Compliance Officer"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-solar-500/5 dark:bg-solar-500/5 border border-solar-500/10 text-xxs text-slate-500 leading-relaxed">
              Compliance Officer and Administrator logins are created by platform admins to maintain security. To add more officers, please submit an request.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
