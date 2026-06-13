import React, { createContext } from "react";
import { usePostCreatorStore } from "../store/usePostCreatorStore";

const PostCreatorContext = createContext(null);

export function PostCreatorProvider({ children }) {
  return (
    <PostCreatorContext.Provider value={null}>
      {children}
    </PostCreatorContext.Provider>
  );
}

export function usePostCreator() {
  return usePostCreatorStore();
}
