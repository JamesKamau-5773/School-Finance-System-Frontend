import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  ChevronRight,
  UserPlus,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";
import { useStudentDirectory, useDeleteStudent } from "./hooks/useStudents";
import { useDebounce } from "use-debounce";
import StudentProfileModal from "./StudentProfileModal";
import StudentFormModal from "./StudentFormModal";

const getInitialDirectoryFilters = () => {
  if (typeof window === "undefined") {
    return {
      selectedGradeLevel: "all",
      showDefaultersOnly: false,
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    selectedGradeLevel: params.get("grade") || "all",
    showDefaultersOnly: params.get("defaulters") === "true",
  };
};

export default function StudentDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDefaultersOnly, setShowDefaultersOnly] = useState(
    () => getInitialDirectoryFilters().showDefaultersOnly,
  );
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(
    () => getInitialDirectoryFilters().selectedGradeLevel,
  );

  // State for modals
  const [selectedStudentForProfile, setSelectedStudentForProfile] =
    useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const { data: response, isLoading } = useStudentDirectory({
    search: debouncedSearch,
  });
  const { mutate: deleteStudent } = useDeleteStudent();

  const students = response?.data || [];

  const gradeOptions = useMemo(() => {
    const allGrades = students
      .map((student) => student?.grade_level)
      .filter(Boolean);
    return Array.from(new Set(allGrades));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return students.filter((student) => {
      if (
        selectedGradeLevel !== "all" &&
        student?.grade_level !== selectedGradeLevel
      ) {
        return false;
      }

      if (showDefaultersOnly && Number(student?.balance || 0) <= 0) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableFields = [
        student?.full_name,
        student?.admission_number,
        student?.sponsor?.phone,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return searchableFields.some((value) => value.includes(normalizedSearch));
    });
  }, [students, selectedGradeLevel, showDefaultersOnly, debouncedSearch]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);

    if (selectedGradeLevel !== "all") {
      url.searchParams.set("grade", selectedGradeLevel);
    } else {
      url.searchParams.delete("grade");
    }

    if (showDefaultersOnly) {
      url.searchParams.set("defaulters", "true");
    } else {
      url.searchParams.delete("defaulters");
    }

    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;

    window.history.replaceState(window.history.state, "", nextUrl);
  }, [selectedGradeLevel, showDefaultersOnly]);

  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setStudentToEdit(null); // Ensure form is empty
    setIsFormModalOpen(true);
  };

  const handleDeactivate = (student) => {
    if (
      window.confirm(
        `SECURITY WARNING: Are you sure you want to deactivate ${student.full_name}? They will be removed from future invoicing, but their historical financial records will be preserved.`,
      )
    ) {
      deleteStudent(student.id);
    }
  };

  const handlePrint = () => {
    // Create a table without the Actions column for printing
    const rows = filteredStudents.map((student) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px; font-size: 10px;">
          <div style="font-weight: bold; margin-bottom: 3px;">${student.full_name}</div>
          <div style="color: #d32f2f; font-size: 9px; margin-top: 2px;">${student.admission_number}</div>
        </td>
        <td style="border: 1px solid #ddd; padding: 10px; font-size: 10px; text-align: center;">
          <span style="background-color: #f5f5f5; border: 1px solid #ddd; padding: 4px 8px; border-radius: 3px; display: inline-block; font-size: 9px; font-weight: bold;">
            ${student.grade_level}
          </span>
        </td>
        <td style="border: 1px solid #ddd; padding: 10px; font-size: 10px;">
          <div style="color: #00c65e; margin-bottom: 3px;">📞 ${student.sponsor.phone}</div>
          <div style="font-size: 9px; margin-top: 2px;">${student.sponsor.name} (${student.sponsor.relation})</div>
        </td>
        <td style="border: 1px solid #ddd; padding: 10px; font-size: 10px; text-align: right; font-weight: bold;">
          ${student.balance > 0 
            ? `<span style="color: #d32f2f;">${student.balance.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>` 
            : `<span style="color: #00c65e;">0.00</span>`
          }
        </td>
      </tr>
    `).join('');

    const titleHtml = `
      <div style="margin-bottom: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Student Financial Directory</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Enrollment & Account Balances</p>
        <p style="margin: 10px 0 0 0; color: #999; font-size: 11px;">Printed on ${new Date().toLocaleString("en-KE")}</p>
      </div>
    `;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Financial Directory</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          thead {
            background-color: #f5f5f5;
          }
          th {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
          }
          td {
            border: 1px solid #ddd;
            padding: 10px;
            font-size: 10px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          /* Print-specific styles */
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          body {
            background-color: white !important;
            color-scheme: light !important;
          }
          table {
            background-color: white !important;
          }
          th, td {
            background-color: white !important;
            color: #333 !important;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9 !important;
          }
        </style>
      </head>
      <body>
        ${titleHtml}
        <table>
          <thead>
            <tr>
              <th>Student Profile</th>
              <th style="text-align: center;">Grade</th>
              <th>Sponsor Contact</th>
              <th style="text-align: right;">Balance (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    try {
      const printWindow = window.open("", "", "height=600,width=800");
      if (!printWindow) {
        alert("Please disable pop-up blocker for this site to print.");
        return;
      }
      
      // Write HTML content to new window
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to render before printing
      printWindow.onload = () => {
        printWindow.print();
        // Close window after printing
        setTimeout(() => printWindow.close(), 1000);
      };
      
      // Fallback if onload doesn't fire
      setTimeout(() => {
        if (printWindow) {
          printWindow.print();
          setTimeout(() => printWindow.close(), 1000);
        }
      }, 500);
    } catch (error) {
      console.error("Print error:", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-text-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Users className="text-alert-crimson" size={28} />
            Student Financial Directory
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
            Enrollment & Account Balances
          </p>
        </div>

        {/* Search, Filters & Add Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-300"
            />
            <input
              type="text"
              className="w-full bg-structural-navy border border-text-border text-white pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint focus:border-transparent transition-all rounded-lg"
              placeholder="Search Name, ADM, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedGradeLevel}
            onChange={(e) => setSelectedGradeLevel(e.target.value)}
            className="px-4 py-2 text-sm font-bold uppercase tracking-wider bg-structural-navy text-slate-300 border border-text-border hover:bg-text-border/50 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-action-mint"
          >
            <option value="all">All Forms/Grades</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowDefaultersOnly(!showDefaultersOnly)}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border transition-all rounded-lg ${
              showDefaultersOnly
                ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                : "bg-structural-navy text-slate-300 border-text-border hover:bg-text-border/50 hover:text-white"
            }`}
          >
            <Filter size={14} />
            {showDefaultersOnly ? "Defaulters" : "Show All"}
          </button>

          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-action-mint text-structural-navy border border-action-mint text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-action-mint transition-all shadow-[0_4px_14px_0_rgba(5,205,153,0.2)] rounded-lg"
          >
            <UserPlus size={16} /> Register Student
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-structural-navy text-slate-300 border border-text-border text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-text-border/50 hover:text-white transition-all rounded-lg"
            title="Print Student Directory"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Directory Table - Restored to Dark Glass aesthetics */}
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 p-0 overflow-hidden rounded-xl">
        <div style={{ overflowX: "auto" }}>
          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse", minWidth: "1000px" }}
          >
            <thead>
              <tr className="border-b border-text-border bg-structural-navy/50">
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Student Profile
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Grade
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Sponsor Contact
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-right">
                  Balance (KES)
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="financial-data text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Loading directory...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-sans text-white font-bold text-base">
                        {student.full_name}
                      </div>
                      <div className="text-xs text-alert-crimson mt-1 font-mono tracking-wider">
                        {student.admission_number}
                      </div>
                    </td>
                    <td className="p-4 font-sans text-slate-300">
                      <span className="bg-white/5 px-2 py-1 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 rounded-md">
                        {student.grade_level}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-slate-300">
                      <div className="flex items-center gap-2 font-mono text-sm text-action-mint">
                        <Phone size={14} />
                        {student.sponsor.phone}
                      </div>
                      <div className="text-xs text-slate-300 mt-1 uppercase tracking-wider">
                        {student.sponsor.name} ({student.sponsor.relation})
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {student.balance > 0 ? (
                        <span className="text-rose-400 font-bold text-base font-mono">
                          {student.balance.toLocaleString("en-KE", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      ) : (
                        <span className="text-action-mint font-bold font-mono tracking-widest">
                          0.00
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="p-2 text-slate-300 hover:text-indigo-400 bg-black/20 hover:bg-black/40 border border-transparent hover:border-indigo-500/30 transition-all rounded-md"
                          title="Edit Student"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeactivate(student)}
                          className="p-2 text-slate-300 hover:text-rose-400 bg-black/20 hover:bg-black/40 border border-transparent hover:border-rose-500/30 transition-all rounded-md"
                          title="Deactivate Student"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedStudentForProfile(student)}
                          className="p-2 ml-2 text-action-mint bg-action-mint/10 hover:bg-action-mint/20 border border-action-mint/30 transition-all rounded-md"
                          title="View Ledger & Receive Payment"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-slate-300 italic"
                    >
                      No students match the current filters.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-300 italic"
                  >
                    No active students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the Modals */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
      />

      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={studentToEdit}
      />
    </div>
  );
}
