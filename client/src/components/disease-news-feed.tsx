import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper } from "lucide-react";

interface NewsItem {
  id: number;
  date: string;
  disease: string;
  location: string;
}

const diseases = [
  "Cancer",
  "Hypertension", 
  "Type 2 Diabetes",
  "Alzheimer's Disease",
  "Coronary Artery Disease",
  "Stroke",
  "Breast Cancer",
  "Heart Disease",
  "Lung Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Brain Tumor"
];

const locations = [
  "India", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur"
];

function generateRandomDate(): string {
  const start = new Date(2024, 0, 1);
  const end = new Date(2025, 6, 25);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);
  
  return randomDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generateNewsItem(id: number): NewsItem {
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomDate = generateRandomDate();
  
  return {
    id,
    date: randomDate,
    disease: randomDisease,
    location: randomLocation
  };
}

interface DiseaseNewsFeedProps {
  compact?: boolean;
}

export default function DiseaseNewsFeed({ compact = false }: DiseaseNewsFeedProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    // Generate initial news items
    const initialItems = Array.from({ length: 20 }, (_, i) => generateNewsItem(i + 1));
    setNewsItems(initialItems);
  }, []);

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setNewsItems(prev => {
        const newItem = generateNewsItem(prev.length + 1);
        return [newItem, ...prev.slice(0, 19)]; // Keep only latest 20 items
      });
    }, 3000); // Add new item every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const handleScrollAreaClick = () => {
    setIsAutoScrolling(false);
  };

  return (
    <div className="w-full">
      <ScrollArea 
        className={compact ? "h-64" : "h-80"} 
        onClick={handleScrollAreaClick}
      >
        <div className="space-y-2 pr-4">
          {newsItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <Newspaper className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 leading-relaxed">
                  📰 <span className="font-medium text-slate-600">{item.date}</span> | In {item.location}, a patient was diagnosed with {item.disease}.
                </p>
              </div>
            </div>
          ))}
          
          {newsItems.length === 0 && (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <p className="text-sm">Loading news feed...</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {!isAutoScrolling && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsAutoScrolling(true)}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Resume auto-scroll
          </button>
        </div>
      )}
    </div>
  );
}