import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api/client";
import { useAuth } from "../../context/AuthContext";
import type { EmployeeDocument } from "../../types";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadFormValues {
  name: string;
  category: EmployeeDocument["category"];
  expiryDate?: string;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: DocumentUploadModalProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormValues>({
    defaultValues: {
      name: "",
      category: "CONTRACT",
    },
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!user) return;
    setIsUploading(true);
    try {
      await api.uploadDocument({
        employeeId: user.employeeId || "EMP004",
        employeeName: user.name,
        name: data.name || (selectedFile ? selectedFile.name : "Document.pdf"),
        category: data.category,
        fileSize: selectedFile
          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
          : "1.2 MB",
        expiryDate: data.expiryDate,
      });
      reset();
      setSelectedFile(null);
      onSuccess();
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Employee Document"
      description="Upload employment agreements, identification proofs, or certifications."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-text-main mb-1">
            Document Title *
          </label>
          <input
            {...register("name", { required: "Document title is required" })}
            placeholder="e.g. Relieving_Letter_Previous_Employer.pdf"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
          {errors.name && (
            <p className="text-[11px] text-error mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-text-main mb-1">
            Document Category *
          </label>
          <select
            {...register("category")}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          >
            <option value="CONTRACT">Employment Contract & NDAs</option>
            <option value="ID_PROOF">National ID / Passport / Aadhaar</option>
            <option value="TAX_FORM">Tax Exemption / Form 16</option>
            <option value="CERTIFICATE">
              Professional Certification / Degrees
            </option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-text-main mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            {...register("expiryDate")}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold text-text-main mb-1">
            Select File (PDF, PNG, JPG up to 10MB)
          </label>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-2xs transition-colors disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save Document"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
