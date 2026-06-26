import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useColorBlind } from "@/contexts/color-blind-context";

export function ColorBlindToggle() {
  const { isColorBlindMode, toggleColorBlindMode } = useColorBlind();

  return (
    <Button
      onClick={toggleColorBlindMode}
      className={`
        shadow-lg transition-all duration-300 hover:scale-105
        ${isColorBlindMode 
          ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-orange-400' 
          : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300'
        }
      `}
      size="sm"
    >
      {isColorBlindMode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
      <span className="font-medium">
        👁 Color Blind Mode
      </span>
    </Button>
  );
}