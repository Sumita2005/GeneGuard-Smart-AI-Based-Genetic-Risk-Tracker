import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ColorBlindContextType {
  isColorBlindMode: boolean;
  toggleColorBlindMode: () => void;
}

const ColorBlindContext = createContext<ColorBlindContextType | undefined>(undefined);

export function ColorBlindProvider({ children }: { children: ReactNode }) {
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("colorBlindMode");
    if (saved === "true") {
      setIsColorBlindMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("colorBlindMode", isColorBlindMode.toString());
    
    // Apply global CSS class
    if (isColorBlindMode) {
      document.documentElement.classList.add("color-blind-mode");
    } else {
      document.documentElement.classList.remove("color-blind-mode");
    }
  }, [isColorBlindMode]);

  const toggleColorBlindMode = () => {
    setIsColorBlindMode(prev => !prev);
  };

  return (
    <ColorBlindContext.Provider value={{ isColorBlindMode, toggleColorBlindMode }}>
      {children}
    </ColorBlindContext.Provider>
  );
}

export function useColorBlind() {
  const context = useContext(ColorBlindContext);
  if (context === undefined) {
    throw new Error("useColorBlind must be used within a ColorBlindProvider");
  }
  return context;
}