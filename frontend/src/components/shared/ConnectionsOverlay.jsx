import React from "react";
import { X } from "lucide-react";
import { useConnections } from "../../context/ConnectionsContext";
import { ConnectionsGrid } from "./ConnectionsGrid";

export function ConnectionsOverlay() {
  const { isOpen, closeConnections } = useConnections();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
           <h1 className="text-2xl font-bold text-[#0A0A0A]">Manage connections</h1>
           <button 
             onClick={closeConnections}
             className="w-10 h-10 bg-[#2D1D35] text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
           >
              <X size={20} />
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-white custom-scrollbar">
           <ConnectionsGrid />
        </div>

        {/* Custom Scrollbar Styling */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}</style>
      </div>
    </div>
  );
}
