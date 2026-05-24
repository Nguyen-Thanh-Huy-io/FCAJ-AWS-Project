import React, { createContext, useContext, useState } from "react";

const PostCreatorContext = createContext();

export function PostCreatorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const openPostCreator = (options = {}) => {
    setEditingPost(options.post || null);
    setIsOpen(true);
  };
  const closePostCreator = () => {
    setEditingPost(null);
    setIsOpen(false);
  };

  return (
    <PostCreatorContext.Provider value={{ isOpen, editingPost, openPostCreator, closePostCreator }}>
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
