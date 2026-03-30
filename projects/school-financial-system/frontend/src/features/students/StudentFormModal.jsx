import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  UserCog,
  Loader2,
  Phone,
  Mail,
  Hash,
  BookOpen,
} from "lucide-react";
import { useCreateStudent, useUpdateStudent } from "./hooks/useStudents";

export default function StudentFormModal({ isOpen, onClose, initialData }) {
  // If initialData exists, we are in "Edit" mode. Otherwise, "Create" mode.
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    admission_number: "",
    first_name: "",
    last_name: "",
    grade_level: "Grade 10",
    sponsor_name: "",
    sponsor_relation: "Parent",
    sponsor_phone: "",
    sponsor_email: "",
  });

  const {
    mutate: createStudent,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateStudent();
  const {
    mutate: updateStudent,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateStudent();

  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  // Populate form if editing
  useEffect(() => {
    if (initialData && isOpen) {
      resetCreate();
      resetUpdate();
      setFormData({
        admission_number: initialData.admission_number,
        first_name: initialData.full_name.split(" ")[0] || "",
        last_name: initialData.full_name.split(" ").slice(1).join(" ") || "",
        grade_level: initialData.grade_level,
        sponsor_name: initialData.sponsor.name,
        sponsor_relation: initialData.sponsor.relation,
        sponsor_phone: initialData.sponsor.phone,
        sponsor_email: initialData.sponsor.email || "",
      });
    } else if (isOpen) {
      resetCreate();
      resetUpdate();
      // Reset form on open if creating
      setFormData({
        admission_number: "",
        first_name: "",
        last_name: "",
        grade_level: "Grade 10",
        sponsor_name: "",
        sponsor_relation: "Parent",
        sponsor_phone: "",
        sponsor_email: "",
      });
    }
  }, [initialData, isOpen, resetCreate, resetUpdate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateStudent(
        { id: initialData.id, data: formData },
        { onSuccess: onClose },
      );
    } else {
      createStudent(formData, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050B14]/90 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl edtech-card border border-[#1A4D5C] !bg-[#0B192C] p-0 overflow-hidden shadow-2xl shadow-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1A4D5C]/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isEditMode ? (
              <UserCog className="text-[#05CD99]" size={20} />
            ) : (
              <UserPlus className="text-[#05CD99]" size={20} />
            )}
            {isEditMode ? "Edit Student Profile" : "Register New Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/50 rounded text-rose-400 text-sm font-bold">
              {error?.response?.data?.message ||
                "Failed to save student record."}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- SECTION 1: Academic Identity --- */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#05CD99] uppercase tracking-widest border-b border-white/10 pb-2">
                Academic Identity
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Admission Number
                </label>
                <div className="relative">
                  <Hash
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    disabled={isEditMode} // ADM numbers shouldn't change once assigned
                    className="w-full bg-[#050B14] border border-white/10 text-white pl-9 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="e.g. ADM-001"
                    value={formData.admission_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admission_number: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#050B14] border border-white/10 text-white px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#050B14] border border-white/10 text-white px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Grade / Cohort
                </label>
                <div className="relative">
                  <BookOpen
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <select
                    className="w-full bg-[#050B14] border border-white/10 text-white pl-9 pr-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                    value={formData.grade_level}
                    onChange={(e) =>
                      setFormData({ ...formData, grade_level: e.target.value })
                    }
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: Financial Sponsor --- */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#FFC107] uppercase tracking-widest border-b border-white/10 pb-2">
                Financial Sponsor
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Sponsor Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#050B14] border border-white/10 text-white px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                  placeholder="e.g. John Doe"
                  value={formData.sponsor_name}
                  onChange={(e) =>
                    setFormData({ ...formData, sponsor_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Relation to Student
                  </label>
                  <select
                    className="w-full bg-[#050B14] border border-white/10 text-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                    value={formData.sponsor_relation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sponsor_relation: e.target.value,
                      })
                    }
                  >
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Corporate Sponsor">Corporate Sponsor</option>
                    <option value="Government Scholarship">
                      Government Scholarship
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Primary Phone (For SMS)
                </label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="tel"
                    className="w-full bg-[#050B14] border border-white/10 text-white pl-9 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                    placeholder="e.g. 0712345678"
                    value={formData.sponsor_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sponsor_phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="email"
                    className="w-full bg-[#050B14] border border-white/10 text-white pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#05CD99] focus:border-transparent transition-all"
                    placeholder="sponsor@email.com"
                    value={formData.sponsor_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sponsor_email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2 bg-transparent text-slate-400 hover:text-white border border-white/10 text-sm font-bold uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#05CD99] text-[#050B14] hover:bg-[#04B083] text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving
                </>
              ) : (
                "Save Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
