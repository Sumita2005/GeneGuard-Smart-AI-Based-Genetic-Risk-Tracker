import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";


export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    medicalConditions: [] as string[],
    lifestyle: {
      smokingStatus: "never",
      exerciseLevel: "moderate",
      dietType: "balanced",
      dietQuality: "good",
      stressLevel: "moderate",
      sleepQuality: "good",
      alcoholConsumption: "moderate",
      physicalActivity: "moderate",
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem("currentUserId", user.id.toString());
      toast({
        title: t("common.success"),
        description: "Profile created successfully!",
      });
      setLocation("/family-tree");
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.age || !formData.gender) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createUserMutation.mutate(formData);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: checked
        ? [...prev.medicalConditions, condition]
        : prev.medicalConditions.filter(c => c !== condition)
    }));
  };

  const medicalConditions = [
    "Diabetes Type 2",
    "Heart Disease",
    "High Blood Pressure",
    "Breast Cancer",
    "Colon Cancer",
    "Alzheimer's Disease",
    "Osteoporosis",
    "Stroke"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900">GeneGuard</span>
            </div>
            <div className="text-sm text-slate-600">Profile Setup</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-health-primary">Step 1 of 4</span>
            <span className="text-sm text-slate-500">Profile Setup</span>
          </div>
          <Progress value={25} className="w-full" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t("profile.title")}</CardTitle>
            <p className="text-slate-600">{t("profile.description")}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.fullName")} *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t("profile.age")} *</Label>
                  <Select value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25</SelectItem>
                      <SelectItem value="26-35">26-35</SelectItem>
                      <SelectItem value="36-45">36-45</SelectItem>
                      <SelectItem value="46-55">46-55</SelectItem>
                      <SelectItem value="56-65">56-65</SelectItem>
                      <SelectItem value="65+">65+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>{t("profile.gender")} *</Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">{t("profile.male")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">{t("profile.female")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">{t("profile.other")}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Current Health Conditions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medicalConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <Checkbox
                        id={condition}
                        checked={formData.medicalConditions.includes(condition)}
                        onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="text-sm cursor-pointer">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Lifestyle Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Smoking Status</Label>
                    <Select 
                      value={formData.lifestyle.smokingStatus} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, smokingStatus: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Exercise Level</Label>
                    <Select 
                      value={formData.lifestyle.exerciseLevel} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, exerciseLevel: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (0-1 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (2-4 days/week)</SelectItem>
                        <SelectItem value="high">High (5+ days/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Diet Type</Label>
                    <Select 
                      value={formData.lifestyle.dietType} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, dietType: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Additional Lifestyle Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Diet Quality</Label>
                    <Select 
                      value={formData.lifestyle.dietQuality} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, dietQuality: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor (processed foods, high sugar)</SelectItem>
                        <SelectItem value="fair">Fair (some healthy choices)</SelectItem>
                        <SelectItem value="good">Good (mostly healthy foods)</SelectItem>
                        <SelectItem value="excellent">Excellent (whole foods, balanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Stress Level</Label>
                    <Select 
                      value={formData.lifestyle.stressLevel} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, stressLevel: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (rarely stressed)</SelectItem>
                        <SelectItem value="moderate">Moderate (occasional stress)</SelectItem>
                        <SelectItem value="high">High (frequent stress)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sleep Quality</Label>
                    <Select 
                      value={formData.lifestyle.sleepQuality} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, sleepQuality: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor (less than 6 hours)</SelectItem>
                        <SelectItem value="fair">Fair (6-7 hours)</SelectItem>
                        <SelectItem value="good">Good (7-8 hours)</SelectItem>
                        <SelectItem value="excellent">Excellent (8+ hours, restful)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Alcohol Consumption</Label>
                    <Select 
                      value={formData.lifestyle.alcoholConsumption} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, alcoholConsumption: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="light">Light (1-2 drinks/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                        <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-8">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  {t("common.back")}
                </Button>
                <Button 
                  type="submit" 
                  className="bg-health-primary hover:bg-emerald-600"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? t("common.loading") : t("profile.continue")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
