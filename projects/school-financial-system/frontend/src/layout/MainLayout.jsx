import React from "react";
import { NavLink } from "react-router-dom";
import {
  Wallet,
  WalletCards,
  Boxes,
  FileText,
  Users,
  UserCog,
  Settings,
} from "lucide-react";
import AuthHelper from "../components/AuthHelper";
import { useAuth } from "../context/AuthContext";
import { canAccessModule } from "../auth/roleAccess";

export default function MainLayout({
  children,
}) {
  const { user } = useAuth();
  const canAccess = (moduleKey) => canAccessModule(user?.role, moduleKey);

  const navClassName = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      isActive
        ? "bg-[#1A4D5C] text-white border border-[#05CD99]/30"
        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    }`;

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
          {canAccess("cashbook") && (
            <NavLink to="/cashbook" className={navClassName}>
              <Wallet size={18} />
              Cashbook
            </NavLink>
          )}
          {canAccess("fees") && (
            <NavLink
              to="/fees"
              className={navClassName}
            >
              <WalletCards size={18} />
              Fee Master
            </NavLink>
          )}
          {canAccess("students") && (
            <NavLink
              to="/students"
              className={navClassName}
            >
              <Users size={18} />
              Student Directory
            </NavLink>
          )}
          {canAccess("inventory") && (
            <NavLink to="/inventory" className={navClassName}>
              <Boxes size={18} />
              Store Keeper
            </NavLink>
          )}
          {canAccess("reports") && (
            <NavLink
              to="/reports"
              className={navClassName}
            >
              <FileText size={18} />
              Audit Report
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          {canAccess("users") && (
            <NavLink to="/users" className={navClassName}>
              <UserCog size={18} />
              User Management
            </NavLink>
          )}
          {canAccess("settings") && (
            <NavLink to="/settings" className={navClassName}>
              <Settings size={18} />
              Settings
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Development: JWT Token Helper */}
      <AuthHelper />
    </div>
  );
}
