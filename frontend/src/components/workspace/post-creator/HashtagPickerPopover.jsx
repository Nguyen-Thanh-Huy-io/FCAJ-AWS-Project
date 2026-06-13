import * as React from "react";
import { useState } from "react";
import { Hash, ChevronRight, X } from "lucide-react";

const HASHTAG_SETS = [
  {
    name: "Fitness Motivation",
    tags: ["#fitnessmotivation", "#workout", "#gym", "#fitlife", "#healthylifestyle", "#personaltrainer", "#fitnesschallenge", "#bodybuilding"],
  },
  {
    name: "Tech Reviews",
    tags: ["#techreview", "#gadgets", "#technology", "#smartphone", "#apple", "#android", "#unboxing", "#tech"],
  },
  {
    name: "Business Growth",
    tags: ["#entrepreneur", "#business", "#startup", "#marketing", "#digitalmarketing", "#growthhacking", "#socialmedia", "#branding"],
  },
];

export function HashtagPickerPopover({ onInsert, onClose }) {
  const [expandedSet, setExpandedSet] = useState(null);

  const handleInsertSet = (set) => {
    onInsert("\n" + set.tags.join(" "));
    onClose();
  };

  const handleInsertTag = (tag) => {
    onInsert(" " + tag);
    onClose();
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[300] animate-in fade-in slide-in-from-bottom-2 duration-150 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Hash size={14} className="text-[#0A0A0A]" />
          <span className="text-[11px] font-bold text-[#0A0A0A] uppercase tracking-widest">Hashtag Sets</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {HASHTAG_SETS.map((set, idx) => (
          <div key={idx} className="border-b border-gray-50 last:border-0">
            <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group">
              <button
                onClick={() => setExpandedSet(expandedSet === idx ? null : idx)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <ChevronRight
                  size={12}
                  className={`text-gray-400 transition-transform ${expandedSet === idx ? "rotate-90" : ""}`}
                />
                <span className="text-[11px] font-semibold text-gray-700">{set.name}</span>
                <span className="text-[9px] text-gray-400 font-medium">{set.tags.length} tags</span>
              </button>
              <button
                onClick={() => handleInsertSet(set)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold uppercase tracking-wider text-white bg-[#0A0A0A] px-2 py-1 rounded-lg hover:bg-gray-800 shrink-0 cursor-pointer"
              >
                Insert All
              </button>
            </div>
            {expandedSet === idx && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
                {set.tags.map((tag, tagIdx) => (
                  <button
                    key={tagIdx}
                    onClick={() => handleInsertTag(tag)}
                    className="text-[10px] font-medium text-[#1877F2] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-[9px] text-gray-400 font-medium">
          Hover set roi nhan <strong>Insert All</strong>, hoac expand de chon tung tag.
        </p>
      </div>
    </div>
  );
}
