import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Activity, Heart, Brain, Stethoscope, Eye } from "lucide-react";
import { useColorBlindStyles } from "@/hooks/use-color-blind-styles";

interface Disease {
  name: string;
  riskLevel: "Low" | "Medium" | "High";
  prevalence: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const diseases: Disease[] = [
  {
    name: "Type 2 Diabetes",
    riskLevel: "Medium",
    prevalence: "15%",
    category: "Metabolic",
    icon: Activity
  },
  {
    name: "Hypertension",
    riskLevel: "High",
    prevalence: "25%",
    category: "Cardiovascular",
    icon: Heart
  },
  {
    name: "Breast Cancer",
    riskLevel: "Low",
    prevalence: "8%",
    category: "Oncology",
    icon: AlertTriangle
  },
  {
    name: "Alzheimer's Disease",
    riskLevel: "Low",
    prevalence: "5%",
    category: "Neurological",
    icon: Brain
  },
  {
    name: "Coronary Artery Disease",
    riskLevel: "Medium",
    prevalence: "18%",
    category: "Cardiovascular",
    icon: Heart
  },
  {
    name: "Asthma",
    riskLevel: "Medium",
    prevalence: "12%",
    category: "Respiratory",
    icon: Stethoscope
  },
  {
    name: "Glaucoma",
    riskLevel: "Low",
    prevalence: "3%",
    category: "Ophthalmology",
    icon: Eye
  },
  {
    name: "Osteoporosis",
    riskLevel: "Medium",
    prevalence: "10%",
    category: "Bone Health",
    icon: Activity
  }
];



interface DiseaseChartProps {
  compact?: boolean;
}

export default function DiseaseChart({ compact = false }: DiseaseChartProps) {
  const displayDiseases = compact ? diseases.slice(0, 6) : diseases;
  const { getRiskStyles } = useColorBlindStyles();

  return (
    <div className="w-full">
      <ScrollArea className={compact ? "h-64" : "h-80"}>
        <div className="space-y-3 pr-4">
          {displayDiseases.map((disease, index) => {
            const IconComponent = disease.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">{disease.name}</h4>
                    <p className="text-xs text-slate-500">{disease.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-slate-600">{disease.prevalence}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getRiskStyles(disease.riskLevel)}`}
                  >
                    {disease.riskLevel}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}