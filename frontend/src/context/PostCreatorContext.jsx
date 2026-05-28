import React, { createContext, useContext, useState } from "react";

const PostCreatorContext = createContext();

export function PostCreatorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [templatePost, setTemplatePost] = useState(null);
  const [defaultScheduledAt, setDefaultScheduledAt] = useState(null);
  const [isLibrary, setIsLibrary] = useState(false);
  
  // Shared Video Upload States
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedVideoPath, setUploadedVideoPath] = useState("");

  const openPostCreator = (options = {}) => {
    setEditingPost(options.post || null);
    setTemplatePost(options.template || null);
    setDefaultScheduledAt(options.defaultScheduledAt || null);
    setIsLibrary(options.isLibrary || false);
    setVideoFile(null);
    setVideoFileUrl(options.defaultVideoUrl || "");
    setUploadedVideoPath(options.defaultVideoPath || "");
    setIsUploadingVideo(options.isUploadingVideo || false);
    setIsOpen(true);
  };

  const closePostCreator = () => {
    setEditingPost(null);
    setTemplatePost(null);
    setDefaultScheduledAt(null);
    setIsLibrary(false);
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
      templatePost,
      defaultScheduledAt,
      isLibrary,
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
