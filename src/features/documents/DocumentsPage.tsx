import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { EmployeeDocument } from "../../types";
import { Plus, Download, Trash2, FileText } from "lucide-react";
import { DocumentUploadModal } from "./DocumentUploadModal";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadData = async () => {
    const data = await api.getDocuments();
    setDocuments(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this document from official records?")) {
      await api.deleteDocument(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Employee Document Management
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Store and audit employment contracts, legal identification records,
            and certifications.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-2xs"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === "VALID"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
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
                    {doc.employeeName} • {doc.fileSize}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-text-muted">
                Uploaded {doc.uploadedAt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Simulated downloading ${doc.name}`)}
                  className="p-1.5 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-100"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
