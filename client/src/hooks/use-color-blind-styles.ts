import { useColorBlind } from "@/contexts/color-blind-context";

export function useColorBlindStyles() {
  const { isColorBlindMode } = useColorBlind();

  const getRiskStyles = (level: string) => {
    const baseStyles = "font-medium px-3 py-1 rounded-full text-sm border-2";
    
    if (isColorBlindMode) {
      switch (level.toLowerCase()) {
        case 'high':
          return `${baseStyles} bg-orange-100 text-orange-800 border-orange-400`;
        case 'medium':
          return `${baseStyles} bg-yellow-100 text-yellow-800 border-yellow-400`;
        case 'low':
          return `${baseStyles} bg-blue-100 text-blue-800 border-blue-400`;
        default:
          return `${baseStyles} bg-gray-100 text-gray-800 border-gray-400`;
      }
    } else {
      switch (level.toLowerCase()) {
        case 'high':
          return `${baseStyles} bg-red-100 text-red-800 border-red-400`;
        case 'medium':
          return `${baseStyles} bg-yellow-100 text-yellow-800 border-yellow-400`;
        case 'low':
          return `${baseStyles} bg-green-100 text-green-800 border-green-400`;
        default:
          return `${baseStyles} bg-gray-100 text-gray-800 border-gray-400`;
      }
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return '🔺';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getPrimaryButtonStyles = () => {
    if (isColorBlindMode) {
      return "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800";
    }
    return "bg-green-600 hover:bg-green-700 text-white";
  };

  const getSecondaryButtonStyles = () => {
    if (isColorBlindMode) {
      return "bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-700";
    }
    return "bg-gray-600 hover:bg-gray-700 text-white";
  };

  const getChartColors = () => {
    if (isColorBlindMode) {
      return {
        high: '#ea580c', // Orange
        medium: '#eab308', // Yellow
        low: '#2563eb', // Blue
        primary: '#2563eb',
        secondary: '#ea580c',
      };
    }
    return {
      high: '#dc2626', // Red
      medium: '#eab308', // Yellow
      low: '#16a34a', // Green
      primary: '#16a34a',
      secondary: '#3b82f6',
    };
  };

  return {
    isColorBlindMode,
    getRiskStyles,
    getRiskIcon,
    getPrimaryButtonStyles,
    getSecondaryButtonStyles,
    getChartColors,
  };
}