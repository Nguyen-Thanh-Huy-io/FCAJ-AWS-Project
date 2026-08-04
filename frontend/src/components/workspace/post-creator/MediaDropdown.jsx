import * as React from "react";
import { Image as ImageIcon, PlayCircle, Folder, ChevronRight } from "lucide-react";

export function MediaDropdown({ onClose, onSelectImage, onSelectVideo, onSelectDrive, onSelectLibrary }) {
  const containerRef = React.useRef(null);
  const [positionClass, setPositionClass] = React.useState("bottom-full mb-2");

  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        setPositionClass("top-full mt-2");
      }
    }
  }, []);

  const menuItems = [
    { id: 'image', label: 'Add image', icon: <ImageIcon size={16} className="text-gray-500" />, onClick: onSelectImage },
    { id: 'video', label: 'Add video', icon: <PlayCircle size={16} className="text-gray-500" />, onClick: onSelectVideo },
    { id: 'library', label: 'From Media Library', icon: <Folder size={16} className="text-gray-500" />, onClick: onSelectLibrary },
    { isSeparator: true },
    { id: 'adobe', label: 'Adobe Express', icon: (
      <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
        <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z"/>
      </svg>
    )},
    { id: 'drive', label: 'Google Drive', onClick: onSelectDrive, icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M8.5 2.5L2 13.5L5 19L11.5 8H8.5Z" fill="#0066DA"/>
        <path d="M15.5 2.5L22 13.5L19 19L12.5 8H15.5Z" fill="#00A25B"/>
        <path d="M12 8.5L8.5 14.5L12 20.5L15.5 14.5H12Z" fill="#FFC107"/>
      </svg>
    )},
    { id: 'canva', label: 'Canva', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#00C4CC"/>
        <text x="12" y="15" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">C</text>
      </svg>
    )},
    { isSeparator: true },
    { id: 'stock_img', label: 'Stock images', icon: <ImageIcon size={16} className="text-gray-500" />, hasSub: true },
    { id: 'stock_vid', label: 'Stock videos', icon: <PlayCircle size={16} className="text-gray-500" />, hasSub: true },
    { id: 'gifs', label: 'GIFs gallery', icon: <Folder size={16} className="text-gray-500" />, hasSub: true },
  ];

  return (
    <div 
      ref={containerRef}
      className={`absolute left-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in text-left ${positionClass}`}
    >
      {menuItems.map((item, idx) => {
        if (item.isSeparator) {
          return <div key={idx} className="h-px bg-gray-100 my-1" />;
        }
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.onClick) item.onClick();
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
            </div>
            {item.hasSub && <ChevronRight size={12} className="text-gray-400" />}
          </button>
        );
      })}
    </div>
  );
}
