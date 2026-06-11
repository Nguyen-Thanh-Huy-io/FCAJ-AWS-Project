import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import apiService from "../services/api";
import { useBrand } from "../context/BrandContext";
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
    templatePost,
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
  const [altText, setAltText] = useState("");
  const [activePlatform, setActivePlatform] = useState("youtube");
  const [previewDevice, setPreviewDevice] = useState("mobile");
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [selectedPublishId, setSelectedPublishId] = useState("now");
  const { activeBrand } = useBrand();
  const [isCreating, setIsCreating] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => toLocalDatetimeString(new Date()));
  const [isLibrary, setIsLibrary] = useState(false);

  // Presets Accordion States
  const [globalOpen, setGlobalOpen] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [facebookOpen, setFacebookOpen] = useState(false);
  const [tiktokOpen, setTiktokOpen] = useState(false);
  const [tiktokPrivacy, setTiktokPrivacy] = useState("public");
  const [tiktokAllowComments, setTiktokAllowComments] = useState(true);
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState(true);
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState(true);
  const [tiktokAiGenerated, setTiktokAiGenerated] = useState(false);
  const [tiktokCommercialContent, setTiktokCommercialContent] = useState(false);

  // Selector Video/Short State
  const [youtubeType, setYoutubeType] = useState("video");
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  // Facebook Dropdown / Mode State
  const [facebookType, setFacebookType] = useState("post"); // post, reel, story
  const [showFacebookTypeMenu, setShowFacebookTypeMenu] = useState(false);
  const [facebookTitle, setFacebookTitle] = useState("");

  // YouTube Presets States
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeMadeForKids, setYoutubeMadeForKids] = useState(false);
  const [youtubePrivacy, setYoutubePrivacy] = useState("public");
  const [youtubeCategory, setYoutubeCategory] = useState("22");
  const [youtubePlaylistId, setYoutubePlaylistId] = useState("");
  const [youtubeTags, setYoutubeTags] = useState("");
  const [youtubeFirstComment, setYoutubeFirstComment] = useState("");
  const [globalFirstComment, setGlobalFirstComment] = useState("");

  // Video metadata states for format validation
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    if (!videoFileUrl) {
      setVideoDuration(0);
      setVideoWidth(0);
      setVideoHeight(0);
      return;
    }

    const isVid = videoFileUrl.endsWith(".mp4") || 
                  videoFileUrl.endsWith(".mov") || 
                  videoFileUrl.endsWith(".avi") || 
                  (videoFile && videoFile.type.startsWith("video/"));
    if (!isVid) {
      setVideoDuration(0);
      setVideoWidth(0);
      setVideoHeight(0);
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = videoFileUrl;
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
      setVideoWidth(video.videoWidth);
      setVideoHeight(video.videoHeight);
    };
    video.onerror = () => {
      console.warn("Failed to load video metadata");
    };
  }, [videoFileUrl, videoFile]);

  // Validation function
  const getValidationErrors = () => {
    const errors = [];
    if (isLibrary) {
      return errors; // Templates do not require scheduled dates or media uploads
    }

    const isPastDate = new Date(scheduledDate).getTime() < Date.now() - 60000;
    if (isPastDate) {
      errors.push("Publish date can't be a past date.");
    }

    const isVid = videoFileUrl && (
      videoFileUrl.endsWith(".mp4") || 
      videoFileUrl.endsWith(".mov") || 
      videoFileUrl.endsWith(".avi") || 
      (videoFile && videoFile.type.startsWith("video/"))
    );

    if (activePlatform === "facebook") {
      if (facebookType === "reel") {
        if (!uploadedVideoPath && !videoFile) {
          errors.push("Reel -> Add at least 1 video.");
        } else if (!isVid) {
          errors.push("Facebook Reel must be a video file.");
        } else {
          if (videoDuration > 0 && (videoDuration < 3 || videoDuration > 90)) {
            errors.push(`Facebook Reels must be between 3 and 90 seconds. (Current: ${videoDuration.toFixed(1)}s)`);
          }
          if (videoWidth > 0 && videoHeight > 0 && videoWidth >= videoHeight) {
            errors.push(`Facebook Reels must be vertical (9:16 aspect ratio). Current ratio is horizontal or square.`);
          }
        }
      }
      if (facebookType === "story") {
        if (!uploadedVideoPath && !videoFile) {
          errors.push("Auto publish (story) -> Add at least 1 image or video.");
        } else if (isVid) {
          if (videoDuration > 15) {
            errors.push(`Facebook Story videos should be 15 seconds or less. (Current: ${videoDuration.toFixed(1)}s)`);
          }
          if (videoWidth > 0 && videoHeight > 0 && videoWidth >= videoHeight) {
            errors.push(`Facebook Story videos should be vertical (9:16 aspect ratio).`);
          }
        }
      }
    } else if (activePlatform === "youtube") {
      if (!uploadedVideoPath && !videoFile) {
        errors.push("YouTube -> Add at least 1 video.");
      } else if (!isVid) {
        errors.push("YouTube publication must be a video file.");
      } else if (youtubeType === "short") {
        if (videoDuration > 60) {
          errors.push(`YouTube Shorts must be 60 seconds or less. (Current: ${videoDuration.toFixed(1)}s)`);
        }
        if (videoWidth > 0 && videoHeight > 0 && videoWidth > videoHeight) {
          errors.push(`YouTube Shorts must be vertical or square. Current ratio is horizontal.`);
        }
      }
    } else if (activePlatform === "tiktok") {
      if (!uploadedVideoPath && !videoFile) {
        errors.push("TikTok -> Add at least 1 image or video.");
      }
    }
    return errors;
  };

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

  // Populate form states when editing a post
  useEffect(() => {
    if (isOpen) {
      if (editingPost) {
        setCaption(editingPost.caption || "");
        setTitle(editingPost.title || "");
        setAltText(editingPost.altText || "");
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

        // Setup Facebook
        setFacebookType(opts.facebookType || "post");
        setFacebookTitle(opts.facebookTitle || "");

        // Setup TikTok
        setTiktokPrivacy(opts.tiktokPrivacy || "public");
        setTiktokAllowComments(opts.tiktokAllowComments !== undefined ? opts.tiktokAllowComments : true);
        setTiktokAllowDuet(opts.tiktokAllowDuet !== undefined ? opts.tiktokAllowDuet : true);
        setTiktokAllowStitch(opts.tiktokAllowStitch !== undefined ? opts.tiktokAllowStitch : true);
        setTiktokAiGenerated(opts.tiktokAiGenerated || false);
        setTiktokCommercialContent(opts.tiktokCommercialContent || false);
        
        // Setup media
        if (editingPost.mediaUrls?.[0]) {
          const path = editingPost.mediaUrls[0];
          setUploadedVideoPath(path);
          
          const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
          const serverBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
          const cleanPath = path.replace(/\\/g, '/');
          const fullUrl = (path.startsWith('/') || path.startsWith('\\')) ? `${serverBase}${cleanPath}` : `${serverBase}/${cleanPath}`;
          setVideoFileUrl(fullUrl);
        } else {
          setUploadedVideoPath("");
          setVideoFileUrl("");
        }
      } else if (templatePost) {
        // Load presets from a template to create a new post
        setCaption(templatePost.caption || "");
        setTitle(templatePost.title || "");
        setAltText(templatePost.altText || "");
        setActivePlatform(templatePost.platforms?.[0]?.toLowerCase() || "youtube");
        setScheduledDate(defaultScheduledAt ? toLocalDatetimeString(defaultScheduledAt) : toLocalDatetimeString(new Date()));
        setIsLibrary(initialIsLibrary || false);
        
        // Setup options
        const opts = templatePost.options || {};
        setYoutubeType(opts.youtubeType || "video");
        setYoutubeTitle(opts.youtubeTitle || "");
        setYoutubeMadeForKids(opts.madeForKids || false);
        setYoutubePrivacy(opts.privacyStatus || "public");
        setYoutubeCategory(opts.categoryId || "22");
        setYoutubePlaylistId(opts.playlistId || "");
        setYoutubeTags(opts.tags || "");
        setYoutubeFirstComment(opts.firstComment || "");
        setGlobalFirstComment(opts.firstComment || "");

        // Setup Facebook
        setFacebookType(opts.facebookType || "post");
        setFacebookTitle(opts.facebookTitle || "");

        // Setup TikTok
        setTiktokPrivacy(opts.tiktokPrivacy || "public");
        setTiktokAllowComments(opts.tiktokAllowComments !== undefined ? opts.tiktokAllowComments : true);
        setTiktokAllowDuet(opts.tiktokAllowDuet !== undefined ? opts.tiktokAllowDuet : true);
        setTiktokAllowStitch(opts.tiktokAllowStitch !== undefined ? opts.tiktokAllowStitch : true);
        setTiktokAiGenerated(opts.tiktokAiGenerated || false);
        setTiktokCommercialContent(opts.tiktokCommercialContent || false);
        
        // Setup media
        if (templatePost.mediaUrls?.[0]) {
          const path = templatePost.mediaUrls[0];
          setUploadedVideoPath(path);
          
          const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
          const serverBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
          const cleanPath = path.replace(/\\/g, '/');
          const fullUrl = (path.startsWith('/') || path.startsWith('\\')) ? `${serverBase}${cleanPath}` : `${serverBase}/${cleanPath}`;
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

        // Reset Facebook
        setFacebookType("post");
        setFacebookTitle("");
        setAltText("");

        // Reset TikTok
        setTiktokPrivacy("public");
        setTiktokAllowComments(true);
        setTiktokAllowDuet(true);
        setTiktokAllowStitch(true);
        setTiktokAiGenerated(false);
        setTiktokCommercialContent(false);
      }
    }
  }, [isOpen, editingPost, templatePost, defaultScheduledAt, initialIsLibrary]);

  const loadTemplate = (template) => {
    if (!template) return;
    setCaption(template.caption || "");
    setTitle(template.title || "");
    setAltText(template.altText || "");
    setActivePlatform(template.platforms?.[0]?.toLowerCase() || "youtube");
    
    // Setup options
    const opts = template.options || {};
    setYoutubeType(opts.youtubeType || "video");
    setYoutubeTitle(opts.youtubeTitle || "");
    setYoutubeMadeForKids(opts.madeForKids || false);
    setYoutubePrivacy(opts.privacyStatus || "public");
    setYoutubeCategory(opts.categoryId || "22");
    setYoutubePlaylistId(opts.playlistId || "");
    setYoutubeTags(opts.tags || "");
    setYoutubeFirstComment(opts.firstComment || "");
    setGlobalFirstComment(opts.firstComment || "");

    // Setup Facebook
    setFacebookType(opts.facebookType || "post");
    setFacebookTitle(opts.facebookTitle || "");

    // Setup TikTok
    setTiktokPrivacy(opts.tiktokPrivacy || "public");
    setTiktokAllowComments(opts.tiktokAllowComments !== undefined ? opts.tiktokAllowComments : true);
    setTiktokAllowDuet(opts.tiktokAllowDuet !== undefined ? opts.tiktokAllowDuet : true);
    setTiktokAllowStitch(opts.tiktokAllowStitch !== undefined ? opts.tiktokAllowStitch : true);
    setTiktokAiGenerated(opts.tiktokAiGenerated || false);
    setTiktokCommercialContent(opts.tiktokCommercialContent || false);
    
    // Setup media
    if (template.mediaUrls?.[0]) {
      const path = template.mediaUrls[0];
      setUploadedVideoPath(path);
      
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const serverBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
      const cleanPath = path.replace(/\\/g, '/');
      const fullUrl = (path.startsWith('/') || path.startsWith('\\')) ? `${serverBase}${cleanPath}` : `${serverBase}/${cleanPath}`;
      setVideoFileUrl(fullUrl);
    } else {
      setUploadedVideoPath("");
      setVideoFileUrl("");
    }
    toast.success(`Loaded template "${template.title}"`);
  };

  const handleCreatePost = async () => {
    if (!activeBrand) {
      toast.error("Please select a brand first");
      return;
    }

    const errors = getValidationErrors();
    if (errors.length > 0) {
      toast.error("Please resolve the validation errors first");
      return;
    }

    setIsCreating(true);
    try {
      let status = 'DRAFT';
      if (selectedPublishId === 'now') status = 'PUBLISHED';
      else if (selectedPublishId === 'schedule') status = 'SCHEDULED';
      else if (selectedPublishId === 'review') status = 'PENDING_APPROVAL';

      let postType = "VIDEO";
      if (activePlatform === 'facebook') {
        if (facebookType === 'story') postType = 'STORY';
        else if (facebookType === 'reel') postType = 'REEL';
        else {
          postType = (uploadedVideoPath || videoFile) ? 'VIDEO' : 'IMAGE';
        }
      } else if (activePlatform === 'youtube') {
        postType = youtubeType === 'short' ? 'SHORT' : 'VIDEO';
      } else if (activePlatform === 'tiktok') {
        postType = 'VIDEO';
      }

      const payload = {
        brandId: activeBrand.id,
        title: title || (activePlatform === 'facebook' && facebookType === 'reel' ? facebookTitle : youtubeTitle) || (caption ? caption.substring(0, 50) : "New Post"),
        caption,
        type: postType,
        status,
        isLibrary,
        altText,
        targetPlatforms: [activePlatform.toUpperCase()],
        scheduledAt: new Date(scheduledDate).toISOString(),
        mediaUrls: uploadedVideoPath ? [uploadedVideoPath] : [],
        options: {
          youtubeType,
          youtubeTitle,
          privacyStatus: youtubePrivacy,
          categoryId: youtubeCategory,
          playlistId: youtubePlaylistId,
          tags: youtubeTags,
          madeForKids: youtubeMadeForKids,
          firstComment: youtubeFirstComment || globalFirstComment,
          facebookType,
          facebookTitle,
          tiktokPrivacy,
          tiktokAllowComments,
          tiktokAllowDuet,
          tiktokAllowStitch,
          tiktokAiGenerated,
          tiktokCommercialContent
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
      setFacebookTitle("");
      setFacebookType("post");
      setAltText("");
      setTiktokPrivacy("public");
      setTiktokAllowComments(true);
      setTiktokAllowDuet(true);
      setTiktokAllowStitch(true);
      setTiktokAiGenerated(false);
      setTiktokCommercialContent(false);
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
    setVideoFile,
    videoFileUrl,
    setVideoFileUrl,
    isUploadingVideo,
    uploadedVideoPath,
    setUploadedVideoPath,
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
    handleCreatePost,
    // Facebook States
    facebookOpen,
    setFacebookOpen,
    facebookType,
    setFacebookType,
    showFacebookTypeMenu,
    setShowFacebookTypeMenu,
    facebookTitle,
    setFacebookTitle,
    getValidationErrors,
    altText,
    setAltText,
    // TikTok States
    tiktokOpen,
    setTiktokOpen,
    tiktokPrivacy,
    setTiktokPrivacy,
    tiktokAllowComments,
    setTiktokAllowComments,
    tiktokAllowDuet,
    setTiktokAllowDuet,
    tiktokAllowStitch,
    setTiktokAllowStitch,
    tiktokAiGenerated,
    setTiktokAiGenerated,
    tiktokCommercialContent,
    setTiktokCommercialContent,
    loadTemplate
  };
}
