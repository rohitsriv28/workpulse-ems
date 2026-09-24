import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api/client";
import type { EmployeeDocument } from "../../types";
import { Download, Plus, FileText } from "lucide-react";
import { DocumentUploadModal } from "./DocumentUploadModal";

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const empId = user?.employeeId || "EMP004";

  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadData = async () => {
    const data = await api.getDocuments(empId);
    setDocuments(data);
  };

  useEffect(() => {
    loadData();
  }, [empId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            My Documents & Credentials
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Access your signed contracts, verified national identification
            proofs, and certifications.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-2xs"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Grid of Employee Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {doc.status}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main leading-snug">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    {doc.fileSize} • Uploaded {doc.uploadedAt}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-text-muted">Verified</span>
              <button
                onClick={() => alert(`Simulated downloading ${doc.name}`)}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
