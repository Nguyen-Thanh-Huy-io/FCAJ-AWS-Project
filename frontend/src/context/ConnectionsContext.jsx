import React, { createContext } from "react";
import { useConnectionsStore } from "../store/useConnectionsStore";

const ConnectionsContext = createContext(null);

export function ConnectionsProvider({ children }) {
  return (
    <ConnectionsContext.Provider value={null}>
      {children}
    </ConnectionsContext.Provider>
  );
}

export function useConnections() {
  return useConnectionsStore();
}
