import React, { useState } from "react";
import {
  PackageSearch,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useInventoryStatus, useDeleteInventoryItem } from "./hooks/useInventory";
import StockTransactionModal from "./StockTransactionModal";
import InventoryItemFormModal from "./InventoryItemFormModal";

export default function StorekeeperDashboard() {
  const { data: response, isLoading } = useInventoryStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const { mutate: deleteItem } = useDeleteInventoryItem();
  const [selectedItem, setSelectedItem] = useState(null);
  const [transactionType, setTransactionType] = useState("IN"); // 'IN' or 'OUT'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = response?.data || [];

  // Derived metrics for the top dashboard cards
  const lowStockItems = items.filter(
    (item) => item.current_stock <= item.reorder_level,
  );
  const totalValue = items.reduce((acc, item) => acc + item.current_stock, 0); // Simplified

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openTransactionModal = (item, type) => {
    setSelectedItem(item);
    setTransactionType(type);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    const confirmed = window.confirm(
      `Delete inventory item \"${item.name}\" (${item.item_code})? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteItem(item.id);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-text-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <PackageSearch className="text-action-mint" size={28} />
            Storekeeper & Inventory
          </h1>
          <p className="text-slate-300 font-medium tracking-wide uppercase text-sm">
            Physical Asset & Consumable Tracking
          </p>
        </div>

        {/* Warning Badge for Low Stock */}
        {lowStockItems.length > 0 && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-pulse">
            <AlertTriangle size={18} />
            {lowStockItems.length} Items Below Reorder Level
          </div>
        )}
      </div>

      {/* Omni-Search Row */}
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 rounded-xl mb-8 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-action-mint" />
          </div>
          <input
            type="text"
            className="w-full bg-structural-navy border border-text-border text-white pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-action-mint rounded-lg"
            placeholder="Search by Item Name or Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 bg-structural-navy text-slate-300 border border-text-border hover:bg-text-border/50 hover:text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <button
            onClick={() => {
              setItemToEdit(null);
              setIsItemModalOpen(true);
            }}
            className="px-4 py-3 bg-text-border text-white border border-action-mint/30 hover:bg-text-border/80 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={16} /> New Item
          </button>
        </div>
      </div>

      {/* Main Stock Ledger Table */}
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 p-0 overflow-hidden rounded-xl">
        <div style={{ overflowX: "auto" }}>
          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse", minWidth: "1000px" }}
          >
            <thead>
              <tr className="border-b border-text-border bg-structural-navy/50">
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Item Code & Name
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Category
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-right">
                  Stock Level
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-right">
                  Reorder Threshold
                </th>
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest text-center">
                  Actions (IN / OUT)
                </th>
              </tr>
            </thead>
            <tbody className="financial-data text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Loading inventory catalog...
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isLowStock = item.current_stock <= item.reorder_level;
                  const displayUnit = (item.unit_of_measure || "")
                    .replace(/^\d+\s*/u, "")
                    .trim();
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-sans text-white font-bold text-base">
                          {item.name}
                        </div>
                        <div className="text-xs text-alert-crimson mt-1 font-mono tracking-wider">
                          {item.item_code}
                        </div>
                      </td>
                      <td className="p-4 font-sans text-slate-300">
                        <span className="bg-white/5 px-2.5 py-1 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 rounded-md">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div
                          className={`font-mono font-bold text-lg tracking-wider ${isLowStock ? "text-rose-400" : "text-action-mint"}`}
                        >
                          {item.current_stock.toLocaleString("en-KE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <div className="text-xs text-slate-300 uppercase tracking-widest mt-1">
                          {displayUnit || item.unit_of_measure}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-mono text-slate-300">
                          {item.reorder_level.toLocaleString("en-KE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => openTransactionModal(item, "IN")}
                            className="px-3 py-1.5 bg-action-mint/10 hover:bg-action-mint/20 text-action-mint border border-action-mint/30 rounded-md flex items-center gap-2 text-xs font-bold uppercase transition-all"
                            title="Receive Stock"
                          >
                            <ArrowDownToLine size={14} /> IN
                          </button>
                          <button
                            onClick={() => openTransactionModal(item, "OUT")}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md flex items-center gap-2 text-xs font-bold uppercase transition-all"
                            title="Issue Stock"
                          >
                            <ArrowUpFromLine size={14} /> OUT
                          </button>
                          <button
                            onClick={() => {
                              setItemToEdit(item);
                              setIsItemModalOpen(true);
                            }}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-text-border bg-text-border/20 text-slate-300 hover:bg-text-border/50 hover:text-white transition-all"
                            title="Edit Item"
                            aria-label="Edit Item"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                            title="Delete Item"
                            aria-label="Delete Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-300 italic"
                  >
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <StockTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          type={transactionType}
        />
      )}

      <InventoryItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        initialData={itemToEdit}
      />
    </div>
  );
}
