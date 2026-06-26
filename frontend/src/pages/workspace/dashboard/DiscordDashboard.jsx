import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MessageSquare, Users, Wifi, RefreshCw, Plus, Trash2,
  BarChart2, Loader2, AlertCircle, CheckCircle, Clock, Hash,
  ThumbsUp, MousePointer
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { useBrand } from "../../../context/BrandContext";
import socialService from "../../../services/social.service";
import apiService from "../../../services/api.js";
import { DateRangeFilter } from "../../../components/app/DateRangeFilter";

const DISCORD_COLOR = "#5865F2";

// ── Sub components ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = DISCORD_COLOR }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#0A0A0A]">{value ?? "—"}</div>
      {sub && <div className="text-[11px] text-gray-400 font-medium">{sub}</div>}
    </div>
  );
}

function GrowthChart({ data, selectedGuildId, servers, onGuildChange }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <BarChart2 size={40} className="text-gray-100 mb-4" />
        <p className="text-sm font-semibold text-gray-400">Chưa có dữ liệu tăng trưởng</p>
        <p className="text-xs text-gray-300 mt-1">Dữ liệu sẽ được thu thập mỗi ngày tự động</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Tăng Trưởng Thành Viên</h3>
          <p className="text-[11px] text-gray-300 mt-0.5">Snapshot mỗi ngày bởi bot Discord</p>
        </div>
        <div className="flex items-center gap-3">
          {servers && servers.length > 0 && (
            <select
              value={selectedGuildId || "all"}
              onChange={e => onGuildChange?.(e.target.value)}
              className="text-[11px] font-semibold border border-gray-100 rounded-xl px-3 py-1.5 bg-white text-gray-600 outline-none cursor-pointer"
            >
              <option value="all">📊 Tất cả máy chủ</option>
              {servers.map(s => (
                <option key={s.guildId} value={s.guildId}>{s.guildName}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="discordMemberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DISCORD_COLOR} stopOpacity={0.15} />
              <stop offset="95%" stopColor={DISCORD_COLOR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="discordOnlineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}
            formatter={(val, name) => [val.toLocaleString(), name === "memberCount" ? "Thành viên" : "Đang online"]}
          />
          <Area type="monotone" dataKey="memberCount" stroke={DISCORD_COLOR} strokeWidth={2.5}
            fillOpacity={1} fill="url(#discordMemberGrad)" dot={false} name="memberCount" />
          <Area type="monotone" dataKey="onlineCount" stroke="#22C55E" strokeWidth={2}
            fillOpacity={1} fill="url(#discordOnlineGrad)" dot={false} name="onlineCount" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DISCORD_COLOR }} />
          <span className="text-[10px] font-semibold text-gray-500">Tổng thành viên</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-[10px] font-semibold text-gray-500">Đang online</span>
        </div>
      </div>
    </div>
  );
}

function ChannelsTab({ brand, onRefresh, pendingGuild }) {
  const [discordAccounts, setDiscordAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [channelPickerGuild, setChannelPickerGuild] = useState(null);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (brand?.socialAccounts) {
      const accounts = brand.socialAccounts.filter(sa => sa.platform === "DISCORD");
      setDiscordAccounts(accounts);
    }
  }, [brand]);

  // Khi có pendingGuild từ URL params (sau OAuth), mở picker chọn channel
  useEffect(() => {
    if (pendingGuild?.guildId) {
      setChannelPickerGuild(pendingGuild);
      setShowChannelPicker(true);
      fetchChannels(pendingGuild.guildId);
    }
  }, [pendingGuild]);

  const fetchChannels = async (guildId) => {
    setIsLoadingChannels(true);
    try {
      const res = await socialService.getDiscordChannels(guildId);
      setAvailableChannels(res.channels || []);
      if (res.channels?.length > 0) setSelectedChannelId(res.channels[0].id);
    } catch (err) {
      toast.error("Không tải được danh sách kênh: " + err.message);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const handleOpenChannelPicker = (guild) => {
    setChannelPickerGuild(guild);
    setShowChannelPicker(true);
    fetchChannels(guild.guildId);
  };

  const handleConnectChannel = async () => {
    if (!selectedChannelId || !channelPickerGuild) return;
    setIsSubmitting(true);
    try {
      await socialService.connectDiscordGuildChannel(brand.id, channelPickerGuild.guildId, selectedChannelId);
      toast.success("Kênh Discord đã được kết nối!");
      setShowChannelPicker(false);
      onRefresh?.();
    } catch (err) {
      toast.error(err.message || "Kết nối thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!confirm("Bạn có chắc muốn ngắt kết nối kênh này?")) return;
    try {
      await socialService.disconnectDiscordGuildChannel(brand.id, accountId);
      toast.success("Đã ngắt kết nối kênh Discord");
      onRefresh?.();
    } catch (err) {
      toast.error(err.message || "Ngắt kết nối thất bại");
    }
  };

  const handleConnectNew = async () => {
    try {
      const res = await socialService.getDiscordAuthUrl(brand.id);
      if (res.url) window.location.href = res.url;
    } catch (err) {
      toast.error("Không thể bắt đầu kết nối Discord");
    }
  };

  // Group discord accounts by Server (guildId)
  const groupedServers = useMemo(() => {
    const serversMap = {};
    discordAccounts.forEach(acc => {
      const gId = acc.discordAccount?.guildId || acc.platformAccountId;
      const gName = acc.discordAccount?.guildName || acc.displayName || "Discord Server";
      
      if (!serversMap[gId]) {
        serversMap[gId] = {
          guildId: gId,
          guildName: gName,
          channels: [],
          isPending: false,
          pendingAccount: null
        };
      }
      
      if (acc.discordAccount?.isPending) {
        serversMap[gId].isPending = true;
        serversMap[gId].pendingAccount = acc;
      } else {
        serversMap[gId].channels.push(acc);
      }
    });
    return Object.values(serversMap);
  }, [discordAccounts]);

  // Helper to generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "DS";
    return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0A0A0A]">Kênh Discord đã kết nối</h3>
          <p className="text-xs text-gray-400 mt-0.5">{discordAccounts.length} kênh đang quản lý trên {groupedServers.length} máy chủ</p>
        </div>
        <button
          onClick={handleConnectNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
          style={{ backgroundColor: DISCORD_COLOR }}
        >
          <Plus size={13} />
          Kết nối Server mới
        </button>
      </div>

      {/* Grouped Server List */}
      {groupedServers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${DISCORD_COLOR}15` }}>
            <MessageSquare size={28} style={{ color: DISCORD_COLOR }} />
          </div>
          <h3 className="text-base font-bold text-[#0A0A0A]">Chưa có kênh Discord nào</h3>
          <p className="text-xs text-gray-400 mt-2 mb-6 max-w-xs">Kết nối server Discord để bắt đầu đăng bài và theo dõi thống kê thành viên.</p>
          <button
            onClick={handleConnectNew}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: DISCORD_COLOR }}
          >
            Kết nối Discord ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedServers.map(server => (
            <div key={server.guildId} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:border-gray-200 transition-all flex flex-col justify-between gap-4">
              <div className="space-y-4">
                {/* Server Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-black text-sm tracking-wider shadow-inner" 
                    style={{ background: `linear-gradient(135deg, ${DISCORD_COLOR}, #404eed)` }}>
                    {getInitials(server.guildName)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[14px] text-[#0A0A0A] truncate">
                      {server.guildName}
                    </div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                      Server ID: {server.guildId}
                    </div>
                  </div>
                </div>

                {/* Server Channels */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Kênh đã cấu hình</span>
                  
                  {server.channels.length === 0 && !server.isPending && (
                    <p className="text-xs text-gray-400 font-medium italic">Không có kênh nào được cấu hình</p>
                  )}

                  {server.channels.map(acc => (
                    <div key={acc.id} className="flex items-center justify-between p-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all">
                      <div className="flex items-center gap-2 min-w-0">
                        <Hash size={13} className="text-gray-400 shrink-0" />
                        <span className="text-xs font-bold text-gray-700 truncate">{acc.discordAccount?.channelName || acc.displayName}</span>
                      </div>
                      <button
                        onClick={() => handleDisconnect(acc.id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Ngắt kết nối kênh này"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Warning banner for pending status */}
                  {server.isPending && (
                    <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Clock size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-amber-800">Chưa chọn kênh đăng bài</p>
                          <p className="text-[10px] text-amber-600/90 mt-0.5 leading-relaxed">
                            Server này đã xác thực thành công nhưng chưa kết nối kênh nào để nhận bài viết.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenChannelPicker(server)}
                        className="w-full py-1.5 rounded-xl text-[10px] font-black text-white transition-all hover:opacity-90 cursor-pointer text-center bg-amber-600 hover:bg-amber-700"
                      >
                        Cấu hình kênh ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Server Actions */}
              {!server.isPending && (
                <div className="border-t border-gray-50 pt-4 flex gap-2">
                  <button
                    onClick={() => handleOpenChannelPicker(server)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-100 hover:border-gray-200 bg-white text-gray-600 hover:text-[#5865F2] hover:bg-[#5865F2]/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus size={13} />
                    Thêm kênh đăng bài
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Channel Picker Modal */}
      {showChannelPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowChannelPicker(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[#0A0A0A] mb-1">
              Chọn kênh để đăng bài
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Server: <span className="font-semibold text-gray-600">{channelPickerGuild?.guildName}</span>
            </p>

            {isLoadingChannels ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-300" size={24} />
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableChannels.map(ch => {
                  // Check if this channel name is already connected in this guild
                  const isAlreadyConnected = discordAccounts.some(acc => 
                    acc.discordAccount?.guildId === channelPickerGuild?.guildId && 
                    acc.discordAccount?.channelName === ch.name
                  );

                  return (
                    <label key={ch.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isAlreadyConnected 
                          ? "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                          : selectedChannelId === ch.id 
                            ? "border-[#5865F2] bg-[#5865F2]/5 cursor-pointer" 
                            : "border-transparent hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="radio"
                          name="discordChannel"
                          value={ch.id}
                          disabled={isAlreadyConnected}
                          checked={selectedChannelId === ch.id}
                          onChange={() => setSelectedChannelId(ch.id)}
                          className="accent-[#5865F2] cursor-pointer"
                        />
                        <Hash size={13} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-semibold text-gray-700 truncate">{ch.name}</span>
                      </div>
                      {isAlreadyConnected && (
                        <span className="text-[10px] font-black text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md shrink-0">
                          ĐÃ KẾT NỐI
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowChannelPicker(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleConnectChannel}
                disabled={isSubmitting || !selectedChannelId}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: DISCORD_COLOR }}
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Kết nối kênh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ── Main Component ─────────────────────────────────────────────────────────────

const DISCORD_TABS = [
  { id: "community", label: "CỘNG ĐỒNG" },
  { id: "channels", label: "KÊNH KẾT NỐI" },
];

export function DiscordDashboard({ activeTab, setActiveTab }) {
  const { activeBrand, refreshBrands } = useBrand();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState("all");
  const [days, setDays] = useState(30);
  const [pendingGuild, setPendingGuild] = useState(null);

  // Đọc pendingGuild từ URL params (sau OAuth redirect)
  useEffect(() => {
    const provider = searchParams.get("provider");
    const guildId = searchParams.get("guildId");
    const guildName = searchParams.get("guildName");

    if (provider === "discord" && guildId) {
      setPendingGuild({ guildId, guildName: decodeURIComponent(guildName || "Discord Server") });
      setActiveTab("channels"); // Auto-switch to channels tab
      
      // Tải lại danh sách social accounts để đồng bộ với Database ngay lập tức
      refreshBrands?.();
      
      // Clean URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("provider");
      newParams.delete("guildId");
      newParams.delete("guildName");
      newParams.delete("brandId");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, setActiveTab, refreshBrands]);

  const loadStats = useCallback(async () => {
    if (!activeBrand?.id) return;
    setIsLoading(true);
    try {
      const discAccounts = activeBrand.socialAccounts?.filter(sa => sa.platform === "DISCORD") || [];
      let guildIdParam = "all";
      if (selectedTarget.startsWith("server-")) {
        guildIdParam = selectedTarget.substring(7);
      } else if (selectedTarget.startsWith("channel-")) {
        const saId = selectedTarget.substring(8);
        const acc = discAccounts.find(a => a.id === saId);
        guildIdParam = acc?.discordAccount?.guildId || "all";
      }

      const data = await socialService.getDiscordStats(activeBrand.id, guildIdParam, days);
      setStats(data);
      setGrowthData(data.growth || []);
    } catch (err) {
      // No discord connected yet — ok
      setStats(null);
      setGrowthData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeBrand?.id, activeBrand?.socialAccounts, selectedTarget, days]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (activeBrand?.id) {
        let guildsToSnapshot = [];
        if (selectedTarget === "all") {
          guildsToSnapshot = stats?.servers?.map(s => s.guildId) || [];
        } else if (selectedTarget.startsWith("server-")) {
          guildsToSnapshot = [selectedTarget.substring(7)];
        } else if (selectedTarget.startsWith("channel-")) {
          const saId = selectedTarget.substring(8);
          const chan = stats?.channels?.find(c => c.id === saId);
          if (chan?.guildId) guildsToSnapshot = [chan.guildId];
        }

        for (const gid of guildsToSnapshot) {
          await socialService.triggerDiscordSnapshot(activeBrand.id, gid);
        }
        toast.success("Đã cập nhật snapshot thành viên!");
      }
      await loadStats();
    } catch {
      toast.error("Không thể refresh dữ liệu");
    } finally {
      setIsRefreshing(false);
    }
  };

  const discordAccounts = activeBrand?.socialAccounts?.filter(sa => sa.platform === "DISCORD") || [];
  const hasDiscord = discordAccounts.length > 0;

  // Kiểm tra xem target hiện tại có đang pending (chờ cấu hình kênh) hay không
  let isSelectedPending = false;
  let pendingGuildId = null;
  let pendingGuildName = "";

  if (selectedTarget.startsWith("server-")) {
    const targetGuildId = selectedTarget.substring(7);
    const serverObj = discordAccounts.find(a => a.discordAccount?.guildId === targetGuildId)?.discordAccount;
    isSelectedPending = !!serverObj?.isPending;
    pendingGuildId = targetGuildId;
    pendingGuildName = serverObj?.guildName || "Discord Server";
  } else if (selectedTarget.startsWith("channel-")) {
    const targetSaId = selectedTarget.substring(8);
    const acc = discordAccounts.find(a => a.id === targetSaId);
    isSelectedPending = !!acc?.discordAccount?.isPending;
    pendingGuildId = acc?.discordAccount?.guildId;
    pendingGuildName = acc?.discordAccount?.guildName || "Discord Server";
  } else {
    // "all"
    const firstPending = discordAccounts.find(a => a.discordAccount?.isPending);
    isSelectedPending = !!firstPending;
    pendingGuildId = firstPending?.discordAccount?.guildId;
    pendingGuildName = firstPending?.discordAccount?.guildName || "Discord Server";
  }

  // 1. Tính toán giá trị hiển thị cho các Stat Card dựa trên target được chọn
  let displayServers = stats?.totalServers ?? 0;
  let displayChannels = stats?.totalChannels ?? 0;
  let displayMembers = stats?.totalMembers ?? 0;
  let displayOnline = stats?.totalOnline ?? 0;
  let displayImpressions = stats?.totalImpressions ?? 0;
  let displayClicks = stats?.totalClicks ?? 0;

  if (selectedTarget.startsWith("server-")) {
    const targetGuildId = selectedTarget.substring(7);
    const serverObj = stats?.servers?.find(s => s.guildId === targetGuildId);
    const serverChannels = stats?.channels?.filter(c => c.guildId === targetGuildId) || [];
    
    displayServers = 1;
    displayChannels = serverChannels.length;
    displayMembers = serverObj?.memberCount ?? 0;
    displayOnline = serverObj?.onlineCount ?? 0;
    displayImpressions = serverChannels.reduce((sum, c) => sum + (c.impressions || 0), 0);
    displayClicks = serverChannels.reduce((sum, c) => sum + (c.clicks || 0), 0);
  } else if (selectedTarget.startsWith("channel-")) {
    const targetSaId = selectedTarget.substring(8);
    const channelObj = stats?.channels?.find(c => c.id === targetSaId);
    const parentServer = stats?.servers?.find(s => s.guildId === channelObj?.guildId);

    displayServers = 1;
    displayChannels = 1;
    displayMembers = parentServer?.memberCount ?? 0;
    displayOnline = parentServer?.onlineCount ?? 0;
    displayImpressions = channelObj?.impressions ?? 0;
    displayClicks = channelObj?.clicks ?? 0;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[1,2,3,4].map(n => (
            <div key={n} className="bg-white rounded-3xl border border-gray-100 h-28" />
          ))}
        </div>
      ) : !hasDiscord ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 flex flex-col items-center text-center shadow-sm">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${DISCORD_COLOR}15` }}>
            <MessageSquare size={36} style={{ color: DISCORD_COLOR }} />
          </div>
          <h3 className="text-xl font-bold text-[#0A0A0A]">Discord chưa được kết nối</h3>
          <p className="text-sm text-gray-400 mt-2 mb-8 max-w-sm">Kết nối Discord để theo dõi thành viên, đăng bài đồng thời và xem thống kê tăng trưởng.</p>
          <button
            onClick={async () => {
              const res = await socialService.getDiscordAuthUrl(activeBrand?.id);
              if (res?.url) window.location.href = res.url;
            }}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: DISCORD_COLOR }}
          >
            Kết nối Discord
          </button>
        </div>
      ) : (
        <>
          {/* Bộ lọc lựa chọn Server / Channel */}
          {activeTab === "community" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-[#0A0A0A]">Báo cáo & Thống kê Discord</h3>
                <p className="text-xs text-gray-400 mt-0.5">Chọn phạm vi dữ liệu để theo dõi chi tiết hiệu quả của bot.</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="text-xs font-bold border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-700 outline-none cursor-pointer shadow-sm focus:ring-2 focus:ring-[#5865F2]"
                >
                  <option value="all">📊 Tất cả máy chủ (Tổng hợp)</option>
                  {stats?.servers?.length > 0 && (
                    <optgroup label="Máy chủ">
                      {stats.servers.map(s => (
                        <option key={`server-${s.guildId}`} value={`server-${s.guildId}`}>
                          🖥️ {s.guildName} ({s.memberCount} TV)
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {stats?.channels?.length > 0 && (
                    <optgroup label="Kênh kết nối">
                      {stats.channels.map(c => (
                        <option key={`channel-${c.id}`} value={`channel-${c.id}`}>
                          #️⃣ {c.guildName} {'>'} #{c.channelName}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
                  title="Cập nhật dữ liệu"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          )}

          {/* Grid Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {selectedTarget === "all" ? (
              <>
                <StatCard
                  icon={<MessageSquare size={16} />}
                  label="Máy chủ"
                  value={displayServers.toLocaleString()}
                  sub={`${discordAccounts.filter(a => a.discordAccount?.isPending).length} đang chờ cấu hình`}
                />
                <StatCard
                  icon={<Users size={16} />}
                  label="Tổng thành viên"
                  value={displayMembers.toLocaleString()}
                  sub="Từ tất cả máy chủ"
                />
                <StatCard
                  icon={<Hash size={16} />}
                  label="Kênh kết nối"
                  value={displayChannels.toLocaleString()}
                  sub="Các kênh đã cấu hình"
                  color="#F59E0B"
                />
                <StatCard
                  icon={<MessageSquare size={16} />}
                  label="Tin nhắn đã gửi"
                  value={displayImpressions.toLocaleString()}
                  sub="Bài đăng xuất bản qua bot"
                  color="#10B981"
                />
              </>
            ) : (
              <>
                <StatCard
                  icon={<Users size={16} />}
                  label="Thành viên"
                  value={displayMembers.toLocaleString()}
                  sub="Quy mô máy chủ"
                />
                <StatCard
                  icon={<Wifi size={16} />}
                  label="Đang online"
                  value={displayOnline.toLocaleString()}
                  sub="Thành viên trực tuyến"
                  color="#22C55E"
                />
                <StatCard
                  icon={<MessageSquare size={16} />}
                  label="Tin nhắn đã gửi"
                  value={displayImpressions.toLocaleString()}
                  sub="Bài đăng xuất bản qua bot"
                  color="#10B981"
                />
                <StatCard
                  icon={<MousePointer size={16} />}
                  label="Click liên kết"
                  value={displayClicks.toLocaleString()}
                  sub="Lượt click bài viết"
                  color="#F59E0B"
                />
              </>
            )}
          </div>

          {/* Banner cảnh báo nếu server hiện tại chưa chọn kênh (chưa kết nối webhook) */}
          {activeTab === "community" && isSelectedPending && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-amber-800">Chưa chọn kênh để đăng bài cho Server này</h4>
                  <p className="text-[11px] text-amber-600 mt-0.5">Thống kê thành viên vẫn được cập nhật, nhưng bạn cần chọn 1 kênh Discord để bot có thể tự động xuất bản bài viết.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab("channels");
                  if (pendingGuildId) {
                    setPendingGuild({
                      guildId: pendingGuildId,
                      guildName: pendingGuildName
                    });
                  }
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shrink-0 whitespace-nowrap"
              >
                Cấu hình kênh ngay
              </button>
            </div>
          )}

          {/* Growth Chart — chỉ hiện ở tab community */}
          {activeTab === "community" && (
            <GrowthChart
              data={growthData}
              selectedGuildId={selectedTarget.startsWith("server-") ? selectedTarget.substring(7) : (selectedTarget.startsWith("channel-") ? stats?.channels?.find(c => c.id === selectedTarget.substring(8))?.guildId : "all")}
              servers={stats?.servers}
              onGuildChange={(gid) => setSelectedTarget(gid === "all" ? "all" : `server-${gid}`)}
            />
          )}
        </>
      )}

      {/* Tabs Content */}
      {activeTab === "channels" && (
        <ChannelsTab brand={activeBrand} onRefresh={() => { refreshBrands?.(); loadStats(); }} pendingGuild={pendingGuild} />
      )}
    </div>
  );
}
