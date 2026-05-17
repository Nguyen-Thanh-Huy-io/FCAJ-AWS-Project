import React, { createContext, useContext, useState } from "react";

const ConnectionsContext = createContext();

export function ConnectionsProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openConnections = () => setIsOpen(true);
  const closeConnections = () => setIsOpen(false);

  return (
    <ConnectionsContext.Provider value={{ isOpen, openConnections, closeConnections }}>
      {children}
    </ConnectionsContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }
  return context;
}
