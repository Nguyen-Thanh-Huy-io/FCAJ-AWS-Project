import React, { createContext, useContext, useState } from "react";

const PostCreatorContext = createContext();

export function PostCreatorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPostCreator = () => setIsOpen(true);
  const closePostCreator = () => setIsOpen(false);

  return (
    <PostCreatorContext.Provider value={{ isOpen, openPostCreator, closePostCreator }}>
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
