import React from "react";
import {
  Wallet,
  Boxes,
  FileText,
  Settings,
} from "lucide-react";

export default function MainLayout({
  children,
  activeSection = "cashbook",
  onSectionChange = () => {},
}) {
  return (
    <div className="flex min-h-screen bg-[#050B14] text-white font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Sidebar - Glassy and Modern */}
      <aside className="w-64 bg-black/20 backdrop-blur-lg border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            ST. GERALD HIGH
          </h2>
          <p className="text-xs text-white/40 font-mono mt-1">
            FINANCE ENGINE v1.0
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<Wallet size={20} />}
            label="Cashbook"
            active={activeSection === "cashbook"}
            onClick={() => onSectionChange("cashbook")}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Fee Master"
            active={activeSection === "fee-master"}
            onClick={() => onSectionChange("fee-master")}
          />
          <NavItem
            icon={<Boxes size={20} />}
            label="Store Keeper"
            active={activeSection === "store-keeper"}
            onClick={() => onSectionChange("store-keeper")}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Audit Report"
            active={activeSection === "audit-report"}
            onClick={() => onSectionChange("audit-report")}
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

// Sub-component for navigation items
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-lg ${
        active
          ? "bg-[#FFC107]/10 text-[#FFC107] font-bold"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
