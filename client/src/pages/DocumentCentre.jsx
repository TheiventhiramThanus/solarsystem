import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dbService, isMock } from "../services/firebase";
import { Folder, Upload, Trash2, FileText, Download, Calendar, FolderOpen, ArrowUpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentCentre() {
  const { user, isOwner } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeFolder, setActiveFolder] = useState("All");

  // Form states
  const [selectedFileType, setSelectedFileType] = useState("insurance");
  const [fileObject, setFileObject] = useState(null);

  const companyId = user?.companyId || "";
  const userId = user?.uid || "";
  const userName = user?.fullName || "Staff";

  const fetchDocuments = async () => {
    if (!companyId) return;
    try {
      const data = await dbService.getDocuments(companyId);
      setDocuments(data);
    } catch (err) {
      toast.error("Failed to load document register.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // Poll documents
    const interval = setInterval(fetchDocuments, 4000);
    return () => clearInterval(interval);
  }, [companyId]);

  const folders = [
    { key: "All", label: "All Documents" },
    { key: "insurance", label: "Insurance Policies" },
    { key: "mcs-certificate", label: "MCS Certificates" },
    { key: "electrical-certificate", label: "Electrical Registers" },
    { key: "risk-assessment", label: "RAMS Assessment" },
    { key: "handover", label: "Handovers & Packs" }
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileObject(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileObject) {
      toast.error("Please select a local document to upload.");
      return;
    }

    setUploading(true);
    try {
      if (isMock) {
        // Mock upload sync
        const fileInfo = {
          name: fileObject.name,
          type: selectedFileType,
          url: "virtual://document_downloads/" + fileObject.name
        };
        const newDoc = await dbService.uploadDocument(companyId, fileInfo, userId, userName);
        setDocuments(prev => [newDoc, ...prev]);
        toast.success(`Simulated upload successful: ${fileObject.name}`);
      } else {
        // Live Firebase Storage upload
        const fileInfo = {
          fileObject: fileObject,
          type: selectedFileType
        };
        const newDoc = await dbService.uploadDocument(companyId, fileInfo, userId, userName);
        setDocuments(prev => [newDoc, ...prev]);
        toast.success(`Document uploaded to Firebase Storage: ${fileObject.name}`);
      }
      setFileObject(null);
      // Clear HTML input file element
      document.getElementById("file-uploader-element").value = "";
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docu) => {
    if (!window.confirm(`Are you sure you want to delete ${docu.documentName}?`)) return;
    try {
      await dbService.deleteDocument(docu.documentId, docu.documentName, companyId, docu.documentType);
      setDocuments(prev => prev.filter(d => d.documentId !== docu.documentId));
      toast.success("Document deleted.");
    } catch (err) {
      toast.error("Failed to delete document.");
    }
  };

  const getFilteredDocs = () => {
    if (activeFolder === "All") return documents;
    return documents.filter(d => d.documentType === activeFolder);
  };

  const getFolderCount = (type) => {
    if (type === "All") return documents.length;
    return documents.filter(d => d.documentType === type).length;
  };

  const getDocBadgeClass = (type) => {
    switch (type) {
      case "insurance": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "mcs-certificate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "electrical-certificate": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "risk-assessment": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  const getDocTypePretty = (type) => {
    const f = folders.find(f => f.key === type);
    return f ? f.label : type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-solar-500"></div>
      </div>
    );
  }

  const activeDocs = getFilteredDocs();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Document Centre
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Store insurance policies, MCS inspector certificates, and handover packs securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Upload Card & Folders (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upload card */}
          <div className="glass-card border-slate-200 dark:border-slate-850 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Upload className="w-4.5 h-4.5 text-solar-500" />
              <span>Upload Credentials</span>
            </h3>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Type select */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Document Classification
                </label>
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                  className="input-field bg-white dark:bg-slate-800 text-xs py-2"
                >
                  <option value="insurance">Public Liability Insurance</option>
                  <option value="mcs-certificate">MCS Accreditation Certificate</option>
                  <option value="electrical-certificate">NICEIC / CPS Certificate</option>
                  <option value="risk-assessment">RAMS / Method Statement</option>
                  <option value="handover">Commissioning Handover Pack</option>
                </select>
              </div>

              {/* Local File input */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1.5">
                  Select File
                </label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-350 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-all relative">
                  <input
                    type="file"
                    id="file-uploader-element"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center space-y-1">
                    <ArrowUpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                    <span className="block text-xxs font-semibold text-slate-500">
                      {fileObject ? fileObject.name : "Choose PDF or doc file..."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full btn-primary flex items-center justify-center space-x-1.5 text-xs py-2.5 shadow-md shadow-solar-500/10"
              >
                <Upload className="w-4.5 h-4.5" />
                <span>{uploading ? "Uploading file..." : "Upload File"}</span>
              </button>
            </form>
          </div>

          {/* Folder List */}
          <div className="glass-card border-slate-200 dark:border-slate-850 p-4 space-y-2">
            <span className="block text-xxs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Accreditation Folders
            </span>
            
            {folders.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFolder(f.key)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                  activeFolder === f.key
                    ? "bg-solar-500/10 text-solar-500 dark:bg-solar-500/20"
                    : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {activeFolder === f.key ? (
                    <FolderOpen className="w-4.5 h-4.5 text-solar-500" />
                  ) : (
                    <Folder className="w-4.5 h-4.5 text-slate-400" />
                  )}
                  <span>{f.label}</span>
                </div>
                <span className="text-xxs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold">
                  {getFolderCount(f.key)}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Right Col: Documents Lists (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 px-1">
            {activeFolder === "All" ? "All Documents" : getDocTypePretty(activeFolder)}
          </h3>

          <div className="space-y-3">
            {activeDocs.length > 0 ? (
              activeDocs.map((docu) => (
                <div 
                  key={docu.documentId} 
                  className="glass-card border-slate-200 dark:border-slate-850 p-4 flex items-center justify-between gap-3 hover:shadow-sm"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-500 shrink-0">
                      <FileText className="w-5 h-5 text-solar-500" />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {docu.documentName}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`badge uppercase text-[8px] font-bold py-0.5 px-2.5 ${getDocBadgeClass(docu.documentType)}`}>
                          {getDocTypePretty(docu.documentType)}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(docu.uploadedAt).toLocaleDateString("en-GB")}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Download button (links to document URL) */}
                    <a
                      href={docu.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-solar-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all"
                      title="Download Document"
                      onClick={(e) => {
                        if (docu.fileUrl.startsWith("virtual://")) {
                          e.preventDefault();
                          toast.success(`Virtual file download: ${docu.documentName}`);
                        }
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    {/* Delete button (RBAC: Owners only) */}
                    {isOwner ? (
                      <button
                        onClick={() => handleDelete(docu)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-550/5 rounded-xl transition-all"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-550 italic px-2">Locked</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card text-center py-16 border-dashed border-2 border-slate-300 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  No files uploaded in this folder. Use the upload panel to upload PDF credentials.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
