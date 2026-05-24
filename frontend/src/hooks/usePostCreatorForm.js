import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import apiService from "../services/api";
import brandService from "../services/brand.service";
import socialService from "../services/social.service";
import { usePostCreator } from "../context/PostCreatorContext";

const toLocalDatetimeString = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function usePostCreatorForm() {
  const { 
    isOpen, 
    closePostCreator, 
    editingPost, 
    defaultScheduledAt,
    isLibrary: initialIsLibrary,
    videoFile, 
    setVideoFile,
    videoFileUrl, 
    setVideoFileUrl,
    isUploadingVideo, 
    setIsUploadingVideo,
    uploadedVideoPath, 
    setUploadedVideoPath
  } = usePostCreator();
  
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [activePlatform, setActivePlatform] = useState("youtube");
  const [previewDevice, setPreviewDevice] = useState("mobile");
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [selectedPublishId, setSelectedPublishId] = useState("now");
  const [activeBrand, setActiveBrand] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => toLocalDatetimeString(new Date()));
  const [isLibrary, setIsLibrary] = useState(false);

  // Presets Accordion States
  const [globalOpen, setGlobalOpen] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState(false);

  // Selector Video/Short State
  const [youtubeType, setYoutubeType] = useState("video");
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  // YouTube Presets States
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeMadeForKids, setYoutubeMadeForKids] = useState(false);
  const [youtubePrivacy, setYoutubePrivacy] = useState("public");
  const [youtubeCategory, setYoutubeCategory] = useState("22");
  const [youtubePlaylistId, setYoutubePlaylistId] = useState("");
  const [youtubeTags, setYoutubeTags] = useState("");
  const [youtubeFirstComment, setYoutubeFirstComment] = useState("");
  const [globalFirstComment, setGlobalFirstComment] = useState("");

  // Playlists fetched data
  const [playlists, setPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  const [activePopover, setActivePopover] = useState(null); // 'media', 'emoji', 'utm'
  const [showFirstCommentModal, setShowFirstCommentModal] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const insertAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    setCaption(before + textToInsert + after);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
      textarea.focus();
    }, 0);
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoFileUrl(previewUrl);

    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await apiService.post("/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setUploadedVideoPath(res.data.videoUrl);
      toast.success("Video uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload video to server");
      console.error(err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (videoFileUrl) {
      URL.revokeObjectURL(videoFileUrl);
    }
    setVideoFileUrl("");
    setUploadedVideoPath("");
  };

  const handleSelectDriveFile = async (file) => {
    if (!activeBrand) return;
    
    setIsDriveModalOpen(false);
    setIsUploadingVideo(true);
    toast.loading(`Importing "${file.name}" from Google Drive...`, { id: 'import-drive-toast' });

    try {
      const res = await socialService.downloadGoogleDriveFile(
        activeBrand.id,
        file.id,
        file.name
      );

      if (res.videoUrl) {
        toast.success(`Successfully imported "${file.name}"!`, { id: 'import-drive-toast' });

        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const fullUrl = res.videoUrl.startsWith('http') ? res.videoUrl : `${backendUrl}${res.videoUrl}`;

        setUploadedVideoPath(res.videoUrl);
        setVideoFileUrl(fullUrl);
      } else {
        throw new Error("Invalid response received from import service");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Import failed: ${err.message}`, { id: 'import-drive-toast' });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const fetchPlaylists = async (forceRefresh = false) => {
    if (!activeBrand) return;
    setIsLoadingPlaylists(true);
    try {
      const url = `/social/youtube/playlists?brandId=${activeBrand.id}${forceRefresh ? '&sync=true' : ''}`;
      const res = await apiService.get(url);
      setPlaylists(res.data?.data || []);
      if (forceRefresh) {
        toast.success("YouTube Playlists synchronized successfully");
      }
    } catch (err) {
      console.error("Failed to load playlists:", err);
      if (forceRefresh) {
        toast.error("Failed to synchronize playlists");
      }
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeBrand) {
      fetchPlaylists();
    }
  }, [isOpen, activeBrand]);

  // Load Active Brand
  useEffect(() => {
    if (!isOpen) return;
    const loadBrand = async () => {
      try {
        const res = await brandService.getBrands();
        if (res.data?.length > 0) setActiveBrand(res.data[0]);
      } catch (e) {
        console.error("Failed to load brands:", e);
      }
    };
    loadBrand();
  }, [isOpen]);

  // Populate form states when editing a post
  useEffect(() => {
    if (isOpen) {
      if (editingPost) {
        setCaption(editingPost.caption || "");
        setTitle(editingPost.title || "");
        setActivePlatform(editingPost.platforms?.[0]?.toLowerCase() || "youtube");
        setScheduledDate(editingPost.scheduledAt ? toLocalDatetimeString(editingPost.scheduledAt) : toLocalDatetimeString(new Date()));
        setIsLibrary(editingPost.isLibrary || false);
        
        // Setup options
        const opts = editingPost.options || {};
        setYoutubeType(opts.youtubeType || "video");
        setYoutubeTitle(opts.youtubeTitle || "");
        setYoutubeMadeForKids(opts.madeForKids || false);
        setYoutubePrivacy(opts.privacyStatus || "public");
        setYoutubeCategory(opts.categoryId || "22");
        setYoutubePlaylistId(opts.playlistId || "");
        setYoutubeTags(opts.tags || "");
        setYoutubeFirstComment(opts.firstComment || "");
        setGlobalFirstComment(opts.firstComment || "");
        
        // Setup media
        if (editingPost.mediaUrls?.[0]) {
          const path = editingPost.mediaUrls[0];
          setUploadedVideoPath(path);
          
          const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
          const fullUrl = (path.startsWith('/') || path.startsWith('\\')) ? `${backendUrl}${path.replace(/\\/g, '/')}` : path;
          setVideoFileUrl(fullUrl);
        } else {
          setUploadedVideoPath("");
          setVideoFileUrl("");
        }
      } else {
        // Reset for new creation
        setCaption("");
        setTitle("");
        setActivePlatform("youtube");
        setScheduledDate(defaultScheduledAt ? toLocalDatetimeString(defaultScheduledAt) : toLocalDatetimeString(new Date()));
        setIsLibrary(initialIsLibrary || false);
        setYoutubeType("video");
        setYoutubeTitle("");
        setYoutubeMadeForKids(false);
        setYoutubePrivacy("public");
        setYoutubeCategory("22");
        setYoutubePlaylistId("");
        setYoutubeTags("");
        setYoutubeFirstComment("");
        setGlobalFirstComment("");
      }
    }
  }, [isOpen, editingPost, defaultScheduledAt, initialIsLibrary]);

  const handleCreatePost = async () => {
    if (!activeBrand) {
      toast.error("Please select a brand first");
      return;
    }

    if (!uploadedVideoPath) {
      toast.error("Please upload a video file for your YouTube post");
      return;
    }

    setIsCreating(true);
    try {
      let status = 'DRAFT';
      if (selectedPublishId === 'now') status = 'PUBLISHED';
      else if (selectedPublishId === 'schedule') status = 'SCHEDULED';
      else if (selectedPublishId === 'review') status = 'PENDING_APPROVAL';

      const payload = {
        brandId: activeBrand.id,
        title: title || youtubeTitle || (caption ? caption.substring(0, 50) : "New Video"),
        caption,
        status,
        isLibrary,
        targetPlatforms: [activePlatform.toUpperCase()],
        scheduledAt: new Date(scheduledDate).toISOString(),
        mediaUrls: [uploadedVideoPath],
        options: {
          youtubeType,
          youtubeTitle,
          privacyStatus: youtubePrivacy,
          categoryId: youtubeCategory,
          playlistId: youtubePlaylistId,
          tags: youtubeTags,
          madeForKids: youtubeMadeForKids,
          firstComment: youtubeFirstComment || globalFirstComment
        }
      };

      if (editingPost) {
        await apiService.put(`/posts/${editingPost.id}`, payload);
        toast.success("Post updated successfully");
      } else {
        await apiService.post('/posts', payload);
        toast.success("Post created successfully");
      }
      closePostCreator();
      setCaption("");
      setTitle("");
      setYoutubeTitle("");
      setYoutubeTags("");
      setYoutubeFirstComment("");
      setGlobalFirstComment("");
      setVideoFile(null);
      setVideoFileUrl("");
      setUploadedVideoPath("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isOpen,
    closePostCreator,
    caption,
    setCaption,
    title,
    setTitle,
    activePlatform,
    setActivePlatform,
    previewDevice,
    setPreviewDevice,
    showPublishMenu,
    setShowPublishMenu,
    selectedPublishId,
    setSelectedPublishId,
    activeBrand,
    setActiveBrand,
    isCreating,
    setIsCreating,
    scheduledDate,
    setScheduledDate,
    isLibrary,
    setIsLibrary,
    globalOpen,
    setGlobalOpen,
    youtubeOpen,
    setYoutubeOpen,
    youtubeType,
    setYoutubeType,
    showTypeMenu,
    setShowTypeMenu,
    youtubeTitle,
    setYoutubeTitle,
    youtubeMadeForKids,
    setYoutubeMadeForKids,
    youtubePrivacy,
    setYoutubePrivacy,
    youtubeCategory,
    setYoutubeCategory,
    youtubePlaylistId,
    setYoutubePlaylistId,
    youtubeTags,
    setYoutubeTags,
    youtubeFirstComment,
    setYoutubeFirstComment,
    globalFirstComment,
    setGlobalFirstComment,
    playlists,
    isLoadingPlaylists,
    videoFile,
    videoFileUrl,
    isUploadingVideo,
    uploadedVideoPath,
    activePopover,
    setActivePopover,
    showFirstCommentModal,
    setShowFirstCommentModal,
    isDriveModalOpen,
    setIsDriveModalOpen,
    handleSelectDriveFile,
    textareaRef,
    fileInputRef,
    insertAtCursor,
    handleVideoChange,
    handleRemoveVideo,
    fetchPlaylists,
    editingPost,
    handleCreatePost
  };
}
