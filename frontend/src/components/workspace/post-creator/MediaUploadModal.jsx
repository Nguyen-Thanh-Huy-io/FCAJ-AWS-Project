import * as React from "react";
import { useState, useRef } from "react";
import { X, Upload, Link2, File, Image as ImageIcon, Video, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import apiService from "../../../services/api";

export function MediaUploadModal({ isOpen, onClose, onAccept }) {
  const [activeTab, setActiveTab] = useState("computer"); // 'computer' | 'url'
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAccept = async () => {
    if (activeTab === "computer") {
      if (!selectedFile) {
        toast.error("Please select a file first");
        return;
      }
      
      setIsUploading(true);
      const formData = new FormData();
      formData.append("video", selectedFile); // Key matches backend expectation

      try {
        const res = await apiService.post("/posts/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        const path = res.data.videoUrl;
        
        // Return file and path
        onAccept(selectedFile, path);
        toast.success("File uploaded successfully");
        onClose();
        // Reset states
        setSelectedFile(null);
      } catch (err) {
        toast.error("Failed to upload file");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    } else {
      if (!fileUrlInput.trim()) {
        toast.error("Please enter a valid URL");
        return;
      }
      // Simple validation for URL
      if (!fileUrlInput.startsWith("http://") && !fileUrlInput.startsWith("https://")) {
        toast.error("URL must start with http:// or https://");
        return;
      }
      
      // Accept link directly
      onAccept(null, fileUrlInput.trim());
      toast.success("Media link accepted");
      onClose();
      // Reset state
      setFileUrlInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-[560px] w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Close Button - Floats overlapping the top-right corner */}
        <button 
          onClick={onClose}
          className="absolute -top-2.5 -right-2.5 w-9 h-9 rounded-full bg-[#2D1D35] hover:bg-black text-white flex items-center justify-center shadow-lg transition-all cursor-pointer z-50 group"
        >
          <X size={16} className="group-hover:rotate-90 transition-transform duration-300 text-yellow-300" />
        </button>

        {/* Modal Title */}
        <div className="pt-6 px-6 pb-4">
          <h2 className="text-xl font-bold text-gray-800">Image upload</h2>
        </div>

        {/* Custom Tab Header */}
        <div className="bg-[#2D1D35] flex items-end px-4 h-12">
          <button
            type="button"
            onClick={() => setActiveTab("computer")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "computer"
                ? "bg-white text-gray-800"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Upload size={14} />
            From computer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "url"
                ? "bg-white text-gray-800"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Link2 size={14} />
            From URL
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 min-h-[220px] flex flex-col justify-center">
          
          {activeTab === "computer" ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[180px] ${
                dragActive 
                  ? "border-[#2D1D35] bg-purple-50/30" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
              
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1D35] mx-auto">
                    {selectedFile.type.startsWith("image/") ? (
                      <ImageIcon size={24} />
                    ) : (
                      <Video size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 truncate max-w-[280px] mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold">
                    <CheckCircle2 size={12} />
                    Selected Successfully
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-500">
                    Click to select or drag your file here.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Media URL Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={fileUrlInput}
                    onChange={(e) => setFileUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-normal">
                  Provide a direct URL to a photo (.png, .jpg) or video (.mp4).
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-black border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleAccept}
            disabled={isUploading}
            className="px-6 py-2.5 text-xs font-bold bg-[#2D1D35] hover:bg-black text-yellow-300 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading && (
              <svg className="animate-spin h-3.5 w-3.5 text-yellow-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isUploading ? "Uploading..." : "Accept"}
          </button>
        </div>

      </div>
    </div>
  );
}
