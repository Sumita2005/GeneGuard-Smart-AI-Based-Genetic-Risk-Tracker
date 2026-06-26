import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import FamilyTreeVisualization from "@/components/family-tree-visualization";
import { Plus, Users, History, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


export default function FamilyTree() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"visual" | "list" | "timeline">("visual");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    relation: "",
    age: "",
    gender: "",
    medicalConditions: [] as string[],
    isDeceased: false
  });

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(parseInt(userId));
    } else {
      setLocation("/profile-setup");
    }
  }, [setLocation]);

  const { data: familyMembers = [], isLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "family-members"],
    enabled: !!currentUserId,
  });

  const addMemberMutation = useMutation({
    mutationFn: async (memberData: any) => {
      const response = await apiRequest("POST", `/api/users/${currentUserId}/family-members`, memberData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "family-members"] });
      setIsAddMemberOpen(false);
      setNewMember({
        name: "",
        relation: "",
        age: "",
        gender: "",
        medicalConditions: [],
        isDeceased: false
      });
      toast({
        title: "Success",
        description: "Family member added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add family member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.name || !newMember.relation) {
      toast({
        title: "Validation Error",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    const memberData = {
      ...newMember,
      age: newMember.age ? parseInt(newMember.age) : null,
    };

    addMemberMutation.mutate(memberData);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    setNewMember(prev => ({
      ...prev,
      medicalConditions: checked
        ? [...prev.medicalConditions, condition]
        : prev.medicalConditions.filter(c => c !== condition)
    }));
  };

  const relations = [
    "Father", "Mother", "Brother", "Sister", "Son", "Daughter",
    "Grandfather (Paternal)", "Grandmother (Paternal)",
    "Grandfather (Maternal)", "Grandmother (Maternal)",
    "Uncle", "Aunt", "Cousin", "Nephew", "Niece"
  ];

  const medicalConditions = [
    "Diabetes Type 2", "Heart Disease", "High Blood Pressure",
    "Breast Cancer", "Colon Cancer", "Alzheimer's Disease",
    "Osteoporosis", "Stroke"
  ];

  const handleContinue = () => {
    setLocation("/risk-analysis");
  };

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900">GeneGuard</span>
            </div>
            <div className="text-sm text-slate-600">Family Tree Builder</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-health-primary">Step 2 of 4</span>
            <span className="text-sm text-slate-500">Family Tree Builder</span>
          </div>
          <Progress value={50} className="w-full" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Build Your Family Medical History</h2>
          <p className="text-slate-600 max-w-2xl">Add family members and their medical information to help us assess your genetic risks more accurately.</p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-health-primary hover:bg-emerald-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Family Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Family Member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="memberName">Name *</Label>
                          <Input
                            id="memberName"
                            value={newMember.name}
                            onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Relationship *</Label>
                          <Select value={newMember.relation} onValueChange={(value) => setNewMember(prev => ({ ...prev, relation: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              {relations.map((relation) => (
                                <SelectItem key={relation} value={relation.toLowerCase().replace(/[^a-z]/g, '_')}>
                                  {relation}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="memberAge">Age</Label>
                          <Input
                            id="memberAge"
                            type="number"
                            value={newMember.age}
                            onChange={(e) => setNewMember(prev => ({ ...prev, age: e.target.value }))}
                            placeholder="Enter age"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select value={newMember.gender} onValueChange={(value) => setNewMember(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Medical Conditions</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {medicalConditions.map((condition) => (
                            <div key={condition} className="flex items-center space-x-2">
                              <Checkbox
                                id={`member-${condition}`}
                                checked={newMember.medicalConditions.includes(condition)}
                                onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                              />
                              <Label htmlFor={`member-${condition}`} className="text-sm">{condition}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="deceased"
                          checked={newMember.isDeceased}
                          onCheckedChange={(checked) => setNewMember(prev => ({ ...prev, isDeceased: checked as boolean }))}
                        />
                        <Label htmlFor="deceased">Deceased</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addMemberMutation.isPending}>
                          {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Select value={viewMode} onValueChange={(value: "visual" | "list" | "timeline") => setViewMode(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Visual Tree</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center space-x-2">
                        <List className="w-4 h-4" />
                        <span>List View</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="timeline">
                      <div className="flex items-center space-x-2">
                        <History className="w-4 h-4" />
                        <span>History</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Badge className="bg-green-500 text-white">Low Risk</Badge>
                <Badge className="bg-yellow-500 text-white">Medium Risk</Badge>
                <Badge className="bg-red-500 text-white">High Risk</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Tree Visualization */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-slate-500">Loading family tree...</div>
              </div>
            ) : (
              <FamilyTreeVisualization 
                familyMembers={familyMembers} 
                viewMode={viewMode}
                currentUserId={currentUserId}
              />
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation("/profile-setup")}
          >
            Back to Profile
          </Button>
          <Button 
            className="bg-health-primary hover:bg-emerald-600"
            onClick={handleContinue}
          >
            Continue to Risk Analysis
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
