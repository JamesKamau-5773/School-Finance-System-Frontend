import React from "react";
import { NavLink } from "react-router-dom";
import {
  Wallet,
  WalletCards,
  Boxes,
  ClipboardList,
  FileText,
  Users,
  UserCog,
  Settings,
  UserCircle2,
  LogOut,
} from "lucide-react";
import AuthHelper from "../components/AuthHelper";
import { useAuth } from "../context/AuthContext";
import { canAccessModule } from "../auth/roleAccess";

export default function MainLayout({
  children,
}) {
  const { user, logout } = useAuth();
  const canAccess = (moduleKey) => canAccessModule(user?.role, moduleKey);

  const navClassName = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      isActive
        ? "bg-app-background/35 text-structural-navy border border-app-background/60"
        : "text-structural-navy/85 hover:bg-app-background/24 hover:text-structural-navy"
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-structural-navy via-structural-navy/70 to-action-mint/35 text-app-background font-sans selection:bg-alert-crimson selection:text-structural-navy">
      {/* Sidebar - Glassy and Modern */}
      <aside className="sticky top-0 w-64 h-screen shrink-0 bg-app-background/30 backdrop-blur-2xl border-r border-app-background/45 flex flex-col">
        <div className="p-6 border-b border-app-background/55">
          <h2 className="text-xl font-extrabold text-structural-navy tracking-tight">
            ST. GERALD HIGH
          </h2>
          <p className="text-xs text-structural-navy/75 font-mono mt-1">
            FINANCE ENGINE v1.0
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
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
          {canAccess("inventory") && (
            <NavLink to="/ledger" className={navClassName}>
              <ClipboardList size={18} />
              Store Ledger
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

        <div className="p-4 border-t border-app-background/55">
          <NavLink to="/profile" className={navClassName}>
            <UserCircle2 size={18} />
            My Profile
          </NavLink>

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

          <button
            type="button"
            onClick={logout}
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-alert-crimson hover:bg-alert-crimson/10 border border-alert-crimson/45"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">{children}</main>

      {/* Development: JWT Token Helper */}
      <AuthHelper />
    </div>
  );
}
