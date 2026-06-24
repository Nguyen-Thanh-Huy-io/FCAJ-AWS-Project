import React from "react";
import { 
  Rss, Facebook, Instagram, Twitter, 
  Linkedin, Music2, Globe, Store, 
  Diamond, Check, X, Youtube, PlayCircle,
  Send, Loader2, MessageSquare
} from "lucide-react";
import socialService from "../../services/social.service";
import { toast } from "sonner";
import { PlatformIcon } from "./PlatformIcon";

export const NETWORKS = [
  // ... (keep the same array but I'll need it inside the component or export it)
];

export function ConnectionsGrid({ className = "", brand, onDisconnect }) {
  const discordAccounts = brand?.socialAccounts?.filter(sa => sa.platform === "DISCORD" && sa.isConnected) || [];
  const [showTelegramModal, setShowTelegramModal] = React.useState(false);
  const [showDiscordModal, setShowDiscordModal] = React.useState(false);
  const [showDiscordChannelModal, setShowDiscordChannelModal] = React.useState(false);
  const [selectedGuild, setSelectedGuild] = React.useState(null);
  const [discordChannels, setDiscordChannels] = React.useState([]);
  const [selectedChannelId, setSelectedChannelId] = React.useState("");
  const [isLoadingChannels, setIsLoadingChannels] = React.useState(false);
  const [webhookUrl, setWebhookUrl] = React.useState("");
  const [botToken, setBotToken] = React.useState("");
  const [chatId, setChatId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const guildId = params.get("guildId");
    const guildName = params.get("guildName");
    const success = params.get("success");

    if (success === "threads_connected") {
      toast.success("Threads connected successfully!");
      // Dọn dẹp URL và reload / gọi callback để đồng bộ
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, document.title, url.pathname + url.search);
      if (onDisconnect) onDisconnect();
      else window.location.reload();
      return;
    }

    if (provider === "discord" && guildId) {
      setSelectedGuild({ id: guildId, name: decodeURIComponent(guildName || "Discord Server") });
      setShowDiscordChannelModal(true);

      // Dọn dẹp URL query parameters sau khi nhận dạng
      const url = new URL(window.location.href);
      url.searchParams.delete("provider");
      url.searchParams.delete("guildId");
      url.searchParams.delete("guildName");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, []);

  React.useEffect(() => {
    if (showDiscordChannelModal && selectedGuild?.id) {
      const fetchChannels = async () => {
        setIsLoadingChannels(true);
        try {
          const res = await socialService.getDiscordChannels(selectedGuild.id);
          setDiscordChannels(res.channels || []);
          if (res.channels && res.channels.length > 0) {
            setSelectedChannelId(res.channels[0].id);
          }
        } catch (error) {
          toast.error("Failed to load Discord channels: " + error.message);
        } finally {
          setIsLoadingChannels(false);
        }
      };
      fetchChannels();
    }
  }, [showDiscordChannelModal, selectedGuild]);

  const submitDiscordChannelConnection = async (e) => {
    e.preventDefault();
    if (!selectedChannelId) {
      toast.error("Please select a channel");
      return;
    }
    setIsSubmitting(true);
    try {
      await socialService.connectDiscordGuildChannel(brand.id, selectedGuild.id, selectedChannelId);
      toast.success("Discord channel connected successfully!");
      setShowDiscordChannelModal(false);
      if (onDisconnect) onDisconnect();
      else window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to connect Discord channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectTelegram = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("telegram");
    if (status.connected) {
      try {
        await socialService.disconnectTelegramAccount(brand.id);
        toast.success("Telegram channel disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect Telegram");
      }
      return;
    }
    setBotToken("");
    setChatId("");
    setShowTelegramModal(true);
  };

  const submitTelegramConnection = async (e) => {
    e.preventDefault();
    if (!botToken || !chatId) {
      toast.error("Bot Token and Chat ID are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await socialService.connectTelegramAccount(brand.id, botToken, chatId);
      toast.success("Telegram connected successfully!");
      setShowTelegramModal(false);
      if (onDisconnect) onDisconnect();
      else window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to connect Telegram");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectDiscord = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    try {
      const response = await socialService.getDiscordAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start Discord connection");
    }
  };

  const handleDisconnectDiscordChannel = async (accountId) => {
    if (!brand) return;
    try {
      await socialService.disconnectDiscordGuildChannel(brand.id, accountId);
      toast.success("Discord channel disconnected successfully");
      if (onDisconnect) onDisconnect();
      else window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to disconnect Discord channel");
    }
  };

  const submitDiscordConnection = async (e) => {
    e.preventDefault();
    if (!webhookUrl) {
      toast.error("Webhook URL is required");
      return;
    }
    setIsSubmitting(true);
    try {
      await socialService.connectDiscordAccount(brand.id, webhookUrl);
      toast.success("Discord Webhook connected successfully!");
      setShowDiscordModal(false);
      if (onDisconnect) onDisconnect();
      else window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to connect Discord Webhook");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectYouTube = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("youtube");
    if (status.connected) {
      try {
        await socialService.disconnectGoogleAccount(brand.id);
        toast.success("YouTube channel disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect YouTube");
      }
      return;
    }
    try {
      const response = await socialService.getGoogleAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start YouTube connection");
    }
  };

  const handleConnectFacebook = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("facebook");
    if (status.connected) {
      try {
        await socialService.disconnectFacebookAccount(brand.id);
        toast.success("Facebook page disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect Facebook");
      }
      return;
    }
    try {
      const response = await socialService.getFacebookAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start Facebook connection");
    }
  };

  const handleConnectTikTok = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("tiktok_personal");
    if (status.connected) {
      try {
        await socialService.disconnectTikTokAccount(brand.id);
        toast.success("TikTok account disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect TikTok");
      }
      return;
    }
    try {
      const response = await socialService.getTikTokAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start TikTok connection");
    }
  };

  const handleConnectInstagram = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("instagram");
    if (status.connected) {
      try {
        await socialService.disconnectInstagramAccount(brand.id);
        toast.success("Instagram account disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect Instagram");
      }
      return;
    }
    try {
      const response = await socialService.getInstagramAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start Instagram connection");
    }
  };
  const handleConnectLinkedIn = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("linkedin");
    if (status.connected) {
      try {
        await socialService.disconnectLinkedInAccount(brand.id);
        toast.success("LinkedIn account disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect LinkedIn");
      }
      return;
    }
    try {
      const response = await socialService.getLinkedInAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start LinkedIn connection");
    }
  };

  const handleConnectThreads = async () => {
    if (!brand) {
      toast.error("Please select a brand first");
      return;
    }
    const status = getStatus("threads");
    if (status.connected) {
      try {
        await socialService.disconnectThreadsAccount(brand.id);
        toast.success("Threads account disconnected");
        if (onDisconnect) onDisconnect();
        else window.location.reload();
      } catch (error) {
        toast.error(error.message || "Failed to disconnect Threads");
      }
      return;
    }
    try {
      const response = await socialService.getThreadsAuthUrl(brand.id);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start Threads connection");
    }
  };

  const getStatus = (platformId) => {
    if (!brand || !brand.socialAccounts) return { connected: false };
    // Map internal IDs to PlatformType enum in Backend
    const mapping = {
      "facebook": "FACEBOOK",
      "instagram": "INSTAGRAM",
      "youtube": "YOUTUBE",
      "tiktok_personal": "TIKTOK",
      "linkedin": "LINKEDIN",
      "x": "TWITTER_X",
      "telegram": "TELEGRAM",
      "discord": "DISCORD",
      "threads": "THREADS"
    };
    const platform = mapping[platformId];
    if (platformId === "discord") {
      const discordAccs = brand.socialAccounts.filter(sa => sa.platform === "DISCORD" && sa.isConnected);
      return {
        connected: discordAccs.length > 0,
        handle: discordAccs.length === 1 ? (discordAccs[0].discordAccount?.channelName || discordAccs[0].displayName) : `${discordAccs.length} channels`
      };
    }
    const account = brand.socialAccounts.find(sa => sa.platform === platform);
    return {
      connected: !!account,
      handle: account?.username || account?.displayName
    };
  };

  const networks = [
    { 
      id: "web", name: "Web", icon: <Rss size={16} className="text-blue-400" />, 
      btnText: "Connect a web page", btnBg: "bg-blue-400", ...getStatus("web")
    },
    { 
      id: "blog", name: "Blog", icon: <Rss size={16} className="text-blue-300" />, 
      btnText: "Connect a blog", btnBg: "bg-teal-200 opacity-60", 
      note: "In order to connect a blog you need to connect a web page first."
    },
    { 
      id: "facebook", name: "Facebook", icon: <Facebook size={16} className="text-blue-600" />, 
      btnText: "Connect a Facebook page", btnBg: "bg-blue-600", ...getStatus("facebook")
    },
    { 
      id: "instagram", name: "Instagram", icon: <Instagram size={16} className="text-pink-600" />, 
      btnText: "Connect an Instagram professional account", btnBg: "bg-[#FF0069]", ...getStatus("instagram")
    },
    { 
      id: "threads", name: "Threads", icon: <PlatformIcon platform="Threads" size={16} variant="flat" />, 
      btnText: "Connect a Threads account", btnBg: "bg-black", ...getStatus("threads")
    },
    { 
      id: "x", name: "X", icon: <X size={16} className="text-black" />, 
      btnText: "Connect a Twitter / X account", btnBg: "bg-[#FEFCE8]", btnTextColor: "text-gray-800", isPremium: true, ...getStatus("x")
    },
    { 
      id: "bluesky", name: "Bluesky", icon: <Globe size={16} className="text-blue-400" />, 
      btnText: "Connect a Bluesky account", btnBg: "bg-blue-500", connected: false
    },
    { 
      id: "linkedin", name: "LinkedIn", icon: <Linkedin size={16} className="text-blue-700" />, 
      btnText: "Connect a LinkedIn account for 15 days for free", btnBg: "bg-[#FEFCE8]", btnTextColor: "text-gray-800", isPremium: true, ...getStatus("linkedin")
    },
    { 
      id: "pinterest", name: "Pinterest", icon: <Check size={16} className="text-red-600" />, 
      btnText: "Connect a Pinterest account", btnBg: "bg-red-600", connected: false
    },
    { 
      id: "tiktok_personal", name: "TikTok personal", icon: <Music2 size={16} className="text-black" />, 
      btnText: "Connect a TikTok personal account", btnBg: "bg-black", ...getStatus("tiktok_personal")
    },
    { 
      id: "tiktok_business", name: "TikTok business", icon: <Music2 size={16} className="text-black" />, 
      btnText: "Connect a TikTok business account", btnBg: "bg-black", connected: false
    },
    { 
      id: "google", name: "Google Business Profile", icon: <Store size={16} className="text-blue-500" />, 
      btnText: "Connect a Google Business Profile account", btnBg: "bg-blue-500", connected: false
    },
    { 
      id: "youtube", name: "YouTube", icon: <Youtube size={16} className="text-red-600" />, 
      btnText: "Connect a YouTube channel", btnBg: "bg-red-600", ...getStatus("youtube")
    },
    { 
      id: "telegram", name: "Telegram", icon: <Send size={16} className="text-white fill-current" />, 
      btnText: "Connect a Telegram channel", btnBg: "bg-[#0088cc]", ...getStatus("telegram")
    },
    { 
      id: "discord", name: "Discord", icon: <MessageSquare size={16} className="text-white fill-current" />, 
      btnText: "Connect a Discord webhook", btnBg: "bg-[#5865F2]", ...getStatus("discord")
    },
  ];

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 ${className}`}>
        {networks.map((net) => (
          <div key={net.id} className="space-y-4 relative group">
             {/* Network Label */}
             <div className="flex items-center gap-2 px-1">
                {net.icon}
                <span className="text-[15px] font-bold text-[#0A0A0A]">{net.name}</span>
             </div>

             {/* Connection Button */}
             <div className="relative">
                {net.id === "discord" && discordAccounts.length > 0 ? (
                   <div className="space-y-3">
                      {discordAccounts.map((acc) => (
                         <div key={acc.id} className="w-full min-h-[60px] rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between px-6 py-3 transition-all hover:border-gray-200">
                            <div className="flex-1 min-w-0 pr-4">
                               <div className="text-[9px] font-black uppercase tracking-widest text-[#5865F2]">CONNECTED Discord</div>
                               <div className="text-xs font-bold text-gray-805 truncate mt-1">
                                  {acc.discordAccount?.guildName || 'Discord Server'} &gt; #{acc.discordAccount?.channelName || acc.displayName}
                               </div>
                            </div>
                            <button
                               onClick={() => handleDisconnectDiscordChannel(acc.id)}
                               className="text-[10px] font-black text-red-600 hover:text-red-800 uppercase tracking-widest transition-colors cursor-pointer shrink-0 ml-2"
                            >
                               Disconnect
                            </button>
                         </div>
                      ))}
                      <button 
                        onClick={handleConnectDiscord}
                        className={`w-full h-[60px] rounded-2xl flex items-center justify-between px-6 transition-all transform active:scale-95 shadow-sm border border-black/5 ${net.btnBg} ${net.btnTextColor || 'text-white'}`}
                      >
                         <span className="text-[11px] font-black text-left uppercase tracking-[1px]">
                            + Connect Another Channel
                         </span>
                         <div className="text-white/40 group-hover:text-white transition-colors shrink-0">
                            {React.cloneElement(net.icon, { size: 20, className: "text-white" })}
                         </div>
                      </button>
                   </div>
                ) : (
                <button 
                  onClick={() => {
                    if (net.id === "youtube") handleConnectYouTube();
                    if (net.id === "facebook") handleConnectFacebook();
                    if (net.id === "tiktok_personal") handleConnectTikTok();
                    if (net.id === "instagram") handleConnectInstagram();
                    if (net.id === "linkedin") handleConnectLinkedIn();
                    if (net.id === "threads") handleConnectThreads();
                    if (net.id === "telegram") handleConnectTelegram();
                    if (net.id === "discord") handleConnectDiscord();
                  }}
                  className={`w-full h-[60px] rounded-2xl flex items-center justify-between px-6 transition-all transform active:scale-95 shadow-sm border border-black/5 ${net.btnBg} ${net.btnTextColor || 'text-white'}`}
                >
                   <div className="flex-1 min-w-0 pr-4">
                      {net.connected ? (
                         <div className="flex flex-col items-start text-left">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${net.btnTextColor || 'text-white'}`}>CONNECTED {net.handle}</span>
                            <span className={`text-[11px] font-bold underline mt-1 opacity-90 hover:opacity-100 ${net.btnTextColor ? 'text-red-600' : 'text-white'}`}>Disconnect</span>
                         </div>
                      ) : (
                         <span className="text-[11px] font-black text-left leading-snug uppercase tracking-[1px]">
                            {net.btnText}
                         </span>
                      )}
                   </div>
                   
                   {net.isPremium ? (
                      <Diamond size={16} className="text-yellow-500 fill-current shrink-0" />
                   ) : (
                      <div className="text-white/40 group-hover:text-white transition-colors shrink-0">
                         {React.cloneElement(net.icon, { size: 20, className: "text-white" })}
                      </div>
                   )}
                </button>

                 )}

                {/* Tooltip for Blog */}
                {net.note && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-3 bg-white border border-gray-100 rounded-xl shadow-2xl z-10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-1 group-hover:translate-y-0">
                     <p className="text-[10px] text-gray-500 text-center leading-relaxed font-medium">
                        {net.note}
                     </p>
                     <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>

      {showTelegramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0088cc] flex items-center justify-center text-white">
                  <Send size={18} className="fill-current" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Connect Telegram Channel</h3>
              </div>
              <button 
                onClick={() => setShowTelegramModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitTelegramConnection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Bot Token</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 123456:ABC-DEF1234ghIkl-zyx57W2v1u1"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0088cc] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Chat ID (Channel or Group)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. @mychannel or -100123456789"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0088cc] transition-all"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed space-y-1">
                <span className="font-bold block text-xs mb-1">Quick Instructions:</span>
                <p>1. Start a chat with <span className="font-bold">@BotFather</span> on Telegram and create a new bot to get your <span className="font-bold">Bot Token</span>.</p>
                <p>2. Add your bot as an <span className="font-bold">Administrator</span> to your channel/group with post permission.</p>
                <p>3. Provide the <span className="font-bold">Chat ID</span> (e.g. @your_channel_username or the numeric ID starting with -100).</p>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTelegramModal(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold text-white bg-[#0088cc] hover:bg-[#0077b5] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#0088cc]/20"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Connect</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDiscordChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5865F2] flex items-center justify-center text-white">
                  <MessageSquare size={18} className="fill-current animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Connect Discord Channel</h3>
              </div>
              <button 
                onClick={() => setShowDiscordChannelModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitDiscordChannelConnection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">Discord Server</label>
                <div className="w-full h-11 px-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-800 dark:text-gray-200 flex items-center font-bold">
                  {selectedGuild?.name || "Loading..."}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Select Chat Channel</label>
                {isLoadingChannels ? (
                  <div className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2 size={16} className="animate-spin text-[#5865F2]" />
                    <span>Loading channels...</span>
                  </div>
                ) : discordChannels.length === 0 ? (
                  <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/40">
                    No text channels found or bot lacks permissions to read channels.
                  </div>
                ) : (
                  <select
                    value={selectedChannelId}
                    onChange={(e) => setSelectedChannelId(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-all font-medium cursor-pointer"
                  >
                    {discordChannels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                <span className="font-bold block text-xs mb-1">How it works:</span>
                <p>PubliCast will dynamically create a secure Webhook in the selected channel to automatically publish your posts. No bot maintenance or server invite link needed.</p>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDiscordChannelModal(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingChannels || discordChannels.length === 0}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#5865F2]/20"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Connect Channel</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
