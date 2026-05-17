import { useState } from "react";
import { Plus, X, Check, Settings2, Edit3, Trash2, Box, Layers, Globe, Zap, Megaphone } from "lucide-react";

// Categorized Core Products
const AVAILABLE_PRODUCTS = [
  { id: "P1", name: "YouTube Analytics", category: "Platforms", icon: <Globe size={14} /> },
  { id: "P2", name: "Facebook Management", category: "Platforms", icon: <Globe size={14} /> },
  { id: "P3", name: "TikTok Creative Suite", category: "Platforms", icon: <Globe size={14} /> },
  { id: "P4", name: "Instagram Insights", category: "Platforms", icon: <Globe size={14} /> },
  { id: "P5", name: "AI Content Engine", category: "AI Tools", icon: <Zap size={14} /> },
  { id: "P6", name: "AI Best Time Suggest", category: "AI Tools", icon: <Zap size={14} /> },
  { id: "P7", name: "Ads Manager Pro", category: "Management", icon: <Megaphone size={14} /> },
  { id: "P8", name: "Unified Inbox", category: "Management", icon: <Megaphone size={14} /> },
  { id: "P9", name: "Custom Branded Links", category: "Tools", icon: <Box size={14} /> },
];

const initialPlans = [
  {
    id: "PL1",
    name: "Free",
    status: "active",
    mostPopular: false,
    monthly: 0,
    annual: 0,
    limits: { "Social Brands": 1, "Posts/month": 10, "AI Credits": 50, "Platforms": 2 },
    includedProducts: ["P1", "P2"]
  },
  {
    id: "PL2",
    name: "Starter",
    status: "active",
    mostPopular: false,
    monthly: 19,
    annual: 15,
    limits: { "Social Brands": 3, "Posts/month": 100, "AI Credits": 200, "Platforms": 3 },
    includedProducts: ["P1", "P2", "P3", "P8"]
  },
  {
    id: "PL3",
    name: "Pro",
    status: "active",
    mostPopular: true,
    monthly: 49,
    annual: 39,
    limits: { "Social Brands": 10, "Posts/month": 500, "AI Credits": "Unlimited", "Platforms": 7 },
    includedProducts: ["P1", "P2", "P3", "P4", "P5", "P7", "P8"]
  },
];

function PlanModal({ isOpen, onClose, onSave, plan = null }) {
  const [formData, setFormData] = useState(plan || {
    name: "",
    monthly: 0,
    annual: 0,
    status: "active",
    mostPopular: false,
    limits: { "Social Brands": 1, "Posts/month": 50, "AI Credits": 100, "Platforms": 2 },
    includedProducts: []
  });

  const toggleProduct = (prodId) => {
    const next = formData.includedProducts.includes(prodId)
      ? formData.includedProducts.filter(id => id !== prodId)
      : [...formData.includedProducts, prodId];
    setFormData({...formData, includedProducts: next});
  };

  const groupedProducts = AVAILABLE_PRODUCTS.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
           <div>
             <h3 className="text-xl font-bold text-[#0A0A0A]">{plan ? "Edit Plan Bundle" : "Create New Plan"}</h3>
             <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Package Configuration</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-black">
              <X size={24} />
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-12">
           {/* Left Col: Basics & Limits */}
           <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Name</label>
                   <input 
                     placeholder="e.g. Enterprise" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium" 
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly ($)</label>
                      <input 
                        type="number"
                        value={formData.monthly}
                        onChange={(e) => setFormData({...formData, monthly: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all text-sm font-bold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Annual ($)</label>
                      <input 
                        type="number"
                        value={formData.annual}
                        onChange={(e) => setFormData({...formData, annual: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all text-sm font-bold text-green-600" 
                      />
                   </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.mostPopular}
                        onChange={(e) => setFormData({...formData, mostPopular: e.target.checked})}
                        className="w-4 h-4 rounded accent-black" 
                      />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-black">Most Popular</span>
                  </label>
                  <div className="flex-1 flex gap-1">
                      {["active", "hidden", "archived"].map(s => (
                        <button 
                          key={s}
                          onClick={() => setFormData({...formData, status: s})}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${formData.status === s ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"}`}
                        >
                          {s}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Usage Limits</label>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    {Object.entries(formData.limits).map(([key, val]) => (
                      <div key={key} className="flex flex-col gap-1">
                         <span className="text-[10px] text-gray-400 font-bold uppercase">{key}</span>
                         <input 
                           value={val}
                           onChange={(e) => setFormData({...formData, limits: {...formData.limits, [key]: e.target.value}})}
                           className="w-full bg-transparent border-b border-gray-200 focus:border-black outline-none text-sm font-bold text-black pb-1" 
                         />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Col: Product Selection (Categorized) */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bundle Feature Catalog</label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{formData.includedProducts.length} items bundled</span>
              </div>
              
              <div className="space-y-8 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                 {Object.entries(groupedProducts).map(([category, products]) => (
                   <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{category}</span>
                         <div className="h-px flex-1 bg-gray-100"></div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                         {products.map((prod) => {
                           const isSelected = formData.includedProducts.includes(prod.id);
                           return (
                             <div 
                               key={prod.id} 
                               onClick={() => toggleProduct(prod.id)}
                               className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-[#0A0A0A] bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                             >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}>
                                   {prod.icon}
                                </div>
                                <div className="flex-1">
                                   <div className="text-xs font-bold text-[#0A0A0A]">{prod.name}</div>
                                </div>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "bg-[#16A34A] border-[#16A34A] scale-110" : "border-gray-200"}`}>
                                   {isSelected && <Check size={10} className="text-white" />}
                                </div>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
           <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">Cancel</button>
           <button 
             onClick={() => onSave(formData)}
             className="px-8 py-2.5 rounded-xl bg-[#0A0A0A] text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
           >
             <Check size={16} />
             {plan ? "Update Plan" : "Create Plan"}
           </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 20px; }
      `}</style>
    </div>
  );
}

export function AdminPricing() {
  const [plans, setPlans] = useState(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleSave = (newPlan) => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setPlans([...plans, { ...newPlan, id: `PL${plans.length + 1}` }]);
    }
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const deletePlan = (id) => {
    if(window.confirm("Are you sure you want to delete this plan? This will affect subscribers.")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const getProductName = (id) => AVAILABLE_PRODUCTS.find(p => p.id === id)?.name || id;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7]" style={{ padding: "40px 60px" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex gap-5">
           <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <Settings2 size={28} className="text-[#0A0A0A]" />
           </div>
           <div>
             <h1 className="text-2xl font-bold text-[#0A0A0A]">Subscription Plans</h1>
             <p className="text-gray-500 mt-1">Package Core Products and Features into commercial plans.</p>
           </div>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                 {["Plan Name", "Price (Monthly/Annual)", "Usage Limits", "Included Products", "Status", ""].map(h => (
                   <th key={h} className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                 ))}
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0A0A0A]">{p.name}</span>
                        {p.mostPopular && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[8px] font-black rounded uppercase">Popular</span>}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{p.id}</div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[#0A0A0A]">${p.monthly}<span className="text-gray-400 font-normal text-xs"> / ${p.annual}</span></div>
                   </td>
                   <td className="px-8 py-6 text-xs text-gray-500 leading-relaxed">
                      {p.limits["Social Brands"]} Brands · {p.limits["Platforms"]} Platforms<br/>
                      {p.limits["Posts/month"]} Posts · {p.limits["AI Credits"]} AI
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                         {p.includedProducts.map((prodId) => (
                           <div key={prodId} className="px-1.5 py-0.5 bg-gray-100 text-[#0A0A0A] text-[9px] font-bold rounded border border-gray-200" title={getProductName(prodId)}>
                              {getProductName(prodId).split(' ')[0]}
                           </div>
                         ))}
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                         {p.status}
                      </span>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => { setEditingPlan(p); setIsModalOpen(true); }} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-black shadow-sm border border-transparent hover:border-gray-100"><Edit3 size={14} /></button>
                         <button onClick={() => deletePlan(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100"><Trash2 size={14} /></button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      <PlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        plan={editingPlan} 
      />
    </div>
  );
}
