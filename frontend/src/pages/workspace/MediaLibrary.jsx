import React from "react";
import { Search, Upload, LayoutGrid, List } from "lucide-react";
import { useMediaLibrary } from "../../hooks/useMediaLibrary";
import { MediaGrid } from "./media-library/MediaGrid";
import { MediaListTable } from "./media-library/MediaListTable";
import { MediaDetailPanel } from "./media-library/MediaDetailPanel";
import { BulkActionsBar } from "./media-library/BulkActionsBar";

export function MediaLibraryPage() {
  const {
    filters,
    updateFilters,
    clearFilters,
    view,
    typeFilter,
    searchTerm,
    setSearchTerm,
    loading,
    selected,
    toggleSelect,
    clearSelection,
    detail,
    setDetail,
    dragging,
    setDragging,
    filteredMedia,
    totalEntries,
    totalPages,
    currentPage
  } = useMediaLibrary();

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "#F8F8F7" }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
    >
      {/* Drag overlay */}
      {dragging && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(255,255,255,0.9)", border: "2px dashed #E5E7EB" }}
        >
          <div className="text-center">
            <Upload size={32} style={{ color: "#D1D5DB", margin: "0 auto 8px" }} />
            <div style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A" }}>Drop files to upload</div>
          </div>
        </div>
      )}

      {/* Sub-header */}
      <div
        className="flex items-center gap-3 px-6 py-3"
        style={{ background: "#FFF", borderBottom: "0.5px solid #E5E7EB" }}
      >
        <div className="relative" style={{ flex: "0 0 240px" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF"
            }}
          />
          <input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px 7px 30px",
              borderRadius: 8,
              border: "0.5px solid #E5E7EB",
              fontSize: 12,
              outline: "none"
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          {["All", "Images", "Videos", "GIFs"].map((t) => (
            <button
              key={t}
              onClick={() => updateFilters({ type: t })}
              className="cursor-pointer"
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 11,
                background: typeFilter === t ? "#0A0A0A" : "#FFF",
                color: typeFilter === t ? "#FFF" : "#6B7280",
                border: "0.5px solid #E5E7EB"
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Clear Filters Button */}
        {(filters.search || typeFilter !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              clearFilters();
            }}
            className="cursor-pointer text-xs text-gray-500 hover:text-black transition-colors"
            style={{ fontSize: 12, fontWeight: 500, background: "none", border: "none", outline: "none" }}
          >
            Clear Filters
          </button>
        )}

        <div style={{ flex: 1 }} />
        <select
          onChange={(e) => updateFilters({ sortBy: e.target.value.split(":")[0].toLowerCase(), sortOrder: "desc" })}
          style={{
            padding: "5px 10px",
            borderRadius: 6,
            border: "0.5px solid #E5E7EB",
            fontSize: 11,
            color: "#6B7280",
            outline: "none",
            cursor: "pointer"
          }}
        >
          <option value="createdAt">Sort: Newest</option>
          <option value="filename">Sort: Name</option>
          <option value="sizeBytes">Sort: Size</option>
        </select>
        <div className="flex items-center overflow-hidden rounded-lg" style={{ border: "0.5px solid #E5E7EB" }}>
          <button
            onClick={() => updateFilters({ view: "grid" })}
            style={{ padding: "5px 8px", background: view === "grid" ? "#0A0A0A" : "#FFF", cursor: "pointer", border: "none" }}
          >
            <LayoutGrid size={13} style={{ color: view === "grid" ? "#FFF" : "#9CA3AF" }} />
          </button>
          <button
            onClick={() => updateFilters({ view: "list" })}
            style={{ padding: "5px 8px", background: view === "list" ? "#0A0A0A" : "#FFF", cursor: "pointer", border: "none" }}
          >
            <List size={13} style={{ color: view === "list" ? "#FFF" : "#9CA3AF" }} />
          </button>
        </div>
        <button
          className="flex items-center gap-2 cursor-pointer rounded-lg"
          style={{ padding: "7px 14px", background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500 }}
        >
          <Upload size={13} /> Upload Files
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "16px 24px" }}>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A0A0A]" />
            </div>
          ) : view === "grid" ? (
            <MediaGrid
              filteredMedia={filteredMedia}
              setDetail={setDetail}
              selected={selected}
              toggleSelect={toggleSelect}
              clearFilters={clearFilters}
            />
          ) : (
            <MediaListTable
              filteredMedia={filteredMedia}
              setDetail={setDetail}
              selected={selected}
              toggleSelect={toggleSelect}
              clearFilters={clearFilters}
            />
          )}
        </div>

        {/* Detail Panel */}
        {detail && <MediaDetailPanel detail={detail} setDetail={setDetail} />}
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing {filteredMedia.length} of {totalEntries} files
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1 || loading}
            onClick={() => updateFilters({ page: currentPage - 1 })}
            className="px-4 py-2 border rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage >= totalPages || loading}
            onClick={() => updateFilters({ page: currentPage + 1 })}
            className="px-4 py-2 border rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar selected={selected} clearSelection={clearSelection} />
    </div>
  );
}
