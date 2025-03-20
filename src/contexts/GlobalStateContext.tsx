"use client";

import React, { createContext, useState, useContext, useMemo } from "react";
import { GlobalState } from "@/types/types.d";

// Provide an initial default value
const defaultState: GlobalState = {
  isMenuOpen: false,
  toggleMenu: () => {},
  exitMenu: () => {},
  isModalOpen: false,
  toggleModal: () => {},
  exitModal: () => {},
};

// Use the correct type in createContext
const GlobalStateContext = createContext<GlobalState>(defaultState);

// Hook to use global state
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error("useGlobalState must be used within GlobalStateProvider");
  return context;
};

// Provide the state inside a Provider component
export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
        isMenuOpen,
        toggleMenu: () => setMenuOpen((prev) => !prev),
        exitMenu: () => setMenuOpen(false),
        isModalOpen,
        toggleModal: () => setModalOpen((prev) => !prev),
        exitModal: () => setModalOpen(false),
    }),
    [isMenuOpen, isModalOpen]
  );

  return <GlobalStateContext.Provider value={contextValue}>{children}</GlobalStateContext.Provider>;
};
