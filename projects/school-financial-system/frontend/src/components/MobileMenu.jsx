import React, { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { canAccessModule } from "../auth/roleAccess";

export default function MobileMenu({ user, logout, canAccess }) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest("[data-mobile-menu]") &&
        !e.target.closest("[data-menu-toggle]")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const navClassName = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      isActive
        ? "bg-app-background/35 text-structural-navy border border-app-background/60"
        : "text-structural-navy/85 hover:bg-app-background/24 hover:text-structural-navy"
    }`;

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Toggle Button - Mobile Only */}
      <button
        data-menu-toggle
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-app-background/30 backdrop-blur-2xl border border-app-background/45 text-structural-navy hover:bg-app-background/50 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      <aside
        data-mobile-menu
        className={`fixed md:hidden top-0 left-0 h-screen w-64 bg-app-background/30 backdrop-blur-2xl border-r border-app-background/45 flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-app-background/55 mt-12">
          <h2 className="text-xl font-extrabold text-structural-navy tracking-tight">
            ST. GERALD HIGH
          </h2>
          <p className="text-xs text-structural-navy/75 font-mono mt-1">
            FINANCE ENGINE v1.0
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {canAccess("cashbook") && (
            <NavLink
              to="/cashbook"
              className={navClassName}
              onClick={handleNavClick}
            >
              <Wallet size={18} />
              Cashbook
            </NavLink>
          )}
          {canAccess("fees") && (
            <NavLink
              to="/fees"
              className={navClassName}
              onClick={handleNavClick}
            >
              <WalletCards size={18} />
              Fee Master
            </NavLink>
          )}
          {canAccess("students") && (
            <NavLink
              to="/students"
              className={navClassName}
              onClick={handleNavClick}
            >
              <Users size={18} />
              Student Directory
            </NavLink>
          )}
          {canAccess("inventory") && (
            <NavLink
              to="/inventory"
              className={navClassName}
              onClick={handleNavClick}
            >
              <Boxes size={18} />
              Store Keeper
            </NavLink>
          )}
          {canAccess("inventory") && (
            <NavLink
              to="/ledger"
              className={navClassName}
              onClick={handleNavClick}
            >
              <ClipboardList size={18} />
              Store Ledger
            </NavLink>
          )}
          {canAccess("reports") && (
            <NavLink
              to="/reports"
              className={navClassName}
              onClick={handleNavClick}
            >
              <FileText size={18} />
              Audit Report
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-app-background/55">
          <NavLink
            to="/profile"
            className={navClassName}
            onClick={handleNavClick}
          >
            <UserCircle2 size={18} />
            My Profile
          </NavLink>

          {canAccess("users") && (
            <NavLink
              to="/users"
              className={navClassName}
              onClick={handleNavClick}
            >
              <UserCog size={18} />
              User Management
            </NavLink>
          )}
          {canAccess("settings") && (
            <NavLink
              to="/settings"
              className={navClassName}
              onClick={handleNavClick}
            >
              <Settings size={18} />
              Settings
            </NavLink>
          )}

          <button
            type="button"
            onClick={() => {
              logout();
              handleNavClick();
            }}
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-alert-crimson hover:bg-alert-crimson/10 border border-alert-crimson/45"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
