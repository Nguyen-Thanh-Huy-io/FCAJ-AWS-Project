import React from "react";
import { Search } from "lucide-react";
import { useStreamHistory } from "../../hooks/useStreamHistory";
import { StreamGrid } from "./stream-history/StreamGrid";
import { StreamListTable } from "./stream-history/StreamListTable";
import { StreamDetailPanel } from "./stream-history/StreamDetailPanel";

export function StreamHistoryPage() {
  const {
    filters,
    updateFilters,
    clearFilters,
    view,
    selected,
    setSelected,
    detailTab,
    setDetailTab,
    loading,
    searchTerm,
    setSearchTerm,
    filteredStreams,
    totalEntries,
    totalPages,
    currentPage,
    currentTotalViews,
    currentMaxPeak
  } = useStreamHistory();

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats */}
        <div className="flex gap-3 px-6 py-4 flex-wrap">
          {[
            { label: "Filtered Streams", value: totalEntries.toString() },
            { label: "Peak Viewers (current page)", value: currentMaxPeak.toLocaleString() },
            { label: "Total Views (current page)", value: currentTotalViews.toLocaleString() }
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                minWidth: 150,
                background: "#FFF",
                border: "0.5px solid #E5E7EB",
                borderRadius: 12,
                padding: "12px 16px"
              }}
            >
              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A" }}>{s.value}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div className="flex items-center overflow-hidden rounded-lg" style={{ border: "0.5px solid #E5E7EB" }}>
              {["grid", "list"].map((v) => (
                <button
                  key={v}
                  onClick={() => updateFilters({ view: v })}
                  className="cursor-pointer capitalize px-3 py-2"
                  style={{
                    background: view === v ? "#0A0A0A" : "#FFF",
                    fontSize: 11,
                    color: view === v ? "#FFF" : "#9CA3AF",
                    border: "none"
                  }}
                >
                  {v === "grid" ? "⊞" : "≡"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-3 px-6 pb-4 pt-1 flex-wrap items-center">
          {/* Search Input */}
          <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 300 }}>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
              style={{ padding: "8px 12px 8px 30px" }}
            />
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Platform Select */}
          <select
            value={filters.platform || ""}
            onChange={(e) => updateFilters({ platform: e.target.value })}
            className="text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-black cursor-pointer transition-all"
            style={{ padding: "8px 12px" }}
          >
            <option value="">All Platforms</option>
            <option value="YouTube">YouTube</option>
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitch">Twitch</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          {/* Status Select */}
          <select
            value={filters.status || ""}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-black cursor-pointer transition-all"
            style={{ padding: "8px 12px" }}
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Clear Filters Button */}
          {(filters.search || filters.platform || filters.status) && (
            <button
              onClick={() => {
                clearFilters();
                setSearchTerm("");
              }}
              className="text-xs text-gray-500 hover:text-black font-bold uppercase tracking-wider cursor-pointer bg-transparent border-none outline-none"
              style={{ padding: "8px 12px" }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div
              className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl"
              style={{ border: "0.5px solid #E5E7EB" }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A0A0A] mb-3" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading history...</span>
            </div>
          ) : filteredStreams.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl"
              style={{ border: "0.5px solid #E5E7EB" }}
            >
              <Search size={32} className="text-gray-300 mb-3" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">No streams found</span>
            </div>
          ) : view === "grid" ? (
            <StreamGrid filteredStreams={filteredStreams} setSelected={setSelected} />
          ) : (
            <StreamListTable filteredStreams={filteredStreams} setSelected={setSelected} />
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {filteredStreams.length} of {totalEntries} streams (Page {currentPage} of {totalPages})
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => updateFilters({ page: currentPage - 1 })}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => updateFilters({ page: currentPage + 1 })}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <StreamDetailPanel
          selected={selected}
          setSelected={setSelected}
          detailTab={detailTab}
          setDetailTab={setDetailTab}
        />
      )}
    </div>
  );
}
