import React, { useState } from 'react';

// OCP Strategy definitions
const INTEGRATIONS = [
  {
    id: 'drive',
    icon: (isActive) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M19.43 12.98L12 21.36L4.57 12.98L6.87 9.17H17.13L19.43 12.98Z" fill="#4CAF50" />
        <path d="M15.43 2H8.57L5.13 7.82H18.87L15.43 2Z" fill="#FFC107" />
        <path d="M2.14 7.82L5.57 13.64L2.14 19.45L2.14 7.82Z" fill="#2196F3" />
      </svg>
    ),
    title: 'Google Drive',
    description: 'Upgrade to a Premium plan and create your content using Google Drive!',
    buttonText: 'Get premium',
    hasDiamond: true,
    illustration: () => (
      <div className="w-28 h-28 mx-auto flex items-center justify-center bg-blue-50/50 rounded-full mb-6">
        {/* Triangle colored Drive logo */}
        <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none">
          <path d="M19.43 12.98L12 21.36L4.57 12.98L6.87 9.17H17.13L19.43 12.98Z" fill="#4CAF50" />
          <path d="M15.43 2H8.57L5.13 7.82H18.87L15.43 2Z" fill="#FFC107" />
          <path d="M2.14 7.82L5.57 13.64L2.14 19.45L2.14 7.82Z" fill="#2196F3" />
        </svg>
      </div>
    )
  },
  {
    id: 'canva',
    icon: (isActive) => (
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#00C4CC]">
        C
      </div>
    ),
    title: 'Canva',
    description: 'Connect your Canva account to design templates and schedule them in seconds.',
    buttonText: 'Connect Canva',
    hasDiamond: false,
    illustration: () => (
      <div className="w-28 h-28 mx-auto flex items-center justify-center bg-[#E6F9FA] rounded-full mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-[#00C4CC] shadow-md">
          C
        </div>
      </div>
    )
  },
  {
    id: 'ideas',
    icon: (isActive) => (
      <svg className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Content Assistant',
    description: 'Get AI-driven ideas and trending formats customized for your audience.',
    buttonText: 'Try AI Assistant',
    hasDiamond: false,
    illustration: () => (
      <div className="w-28 h-28 mx-auto flex items-center justify-center bg-yellow-50 rounded-full mb-6">
        <svg className="w-16 h-16 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
];

export function SidebarIntegrations() {
  const [activeTab, setActiveTab] = useState('drive');

  const activeStrategy = INTEGRATIONS.find(item => item.id === activeTab) || INTEGRATIONS[0];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[550px] no-print shrink-0">
      {/* Header Tabs Navigation */}
      <div className="flex border-b border-gray-100 h-12 shrink-0">
        {INTEGRATIONS.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center relative hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <div className="h-full flex items-center justify-center">
                {item.icon(isActive)}
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          );
        })}
      </div>

      {/* Strategy-rendered View Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {activeStrategy.illustration()}
        
        <h4 className="text-sm font-extrabold text-[#0A0A0A] mb-2">{activeStrategy.title}</h4>
        <p className="text-[11px] text-gray-400 font-bold leading-relaxed max-w-[200px] mb-8">
          {activeStrategy.description}
        </p>

        {/* Dynamic button wrapper matching standard visual style */}
        <button className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#FEF08A] hover:bg-[#FDE047] text-gray-900 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
          <span>{activeStrategy.buttonText}</span>
          {activeStrategy.hasDiamond && <span className="text-[10px]">💎</span>}
        </button>
      </div>
    </div>
  );
}
