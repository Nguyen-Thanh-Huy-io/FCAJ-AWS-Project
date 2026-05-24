import React, { createContext, useContext, useState } from "react";

const PostCreatorContext = createContext();

export function PostCreatorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [defaultScheduledAt, setDefaultScheduledAt] = useState(null);
  
  // Shared Video Upload States
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedVideoPath, setUploadedVideoPath] = useState("");

  const openPostCreator = (options = {}) => {
    setEditingPost(options.post || null);
    setDefaultScheduledAt(options.defaultScheduledAt || null);
    setVideoFile(null);
    setVideoFileUrl(options.defaultVideoUrl || "");
    setUploadedVideoPath(options.defaultVideoPath || "");
    setIsUploadingVideo(options.isUploadingVideo || false);
    setIsOpen(true);
  };

  const closePostCreator = () => {
    setEditingPost(null);
    setDefaultScheduledAt(null);
    setVideoFile(null);
    setVideoFileUrl("");
    setUploadedVideoPath("");
    setIsUploadingVideo(false);
    setIsOpen(false);
  };

  return (
    <PostCreatorContext.Provider value={{
      isOpen,
      editingPost,
      defaultScheduledAt,
      videoFile,
      setVideoFile,
      videoFileUrl,
      setVideoFileUrl,
      isUploadingVideo,
      setIsUploadingVideo,
      uploadedVideoPath,
      setUploadedVideoPath,
      openPostCreator,
      closePostCreator
    }}>
      {children}
    </PostCreatorContext.Provider>
  );
}

export function usePostCreator() {
  const context = useContext(PostCreatorContext);
  if (!context) {
    throw new Error("usePostCreator must be used within a PostCreatorProvider");
  }
  return context;
}
