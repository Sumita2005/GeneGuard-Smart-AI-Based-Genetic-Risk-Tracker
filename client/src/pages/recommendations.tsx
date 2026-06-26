import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckSquare, 
  Activity, 
  Calendar, 
  UserCheck, 
  AlertTriangle,
  Clock,
  TrendingUp
} from "lucide-react";


export default function Recommendations() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(parseInt(userId));
    } else {
      setLocation("/profile-setup");
    }
  }, [setLocation]);

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "recommendations"],
    enabled: !!currentUserId,
  });

  const { data: riskAssessments = [] } = useQuery({
    queryKey: ["/api/users", currentUserId, "risk-assessments"],
    enabled: !!currentUserId,
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/users/${currentUserId}/generate-recommendations`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "recommendations"] });
      toast({
        title: "Recommendations Generated",
        description: "Your personalized health recommendations have been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateRecommendationMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await apiRequest("PATCH", `/api/recommendations/${id}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "recommendations"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update recommendation.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentUserId && recommendations.length === 0 && !isLoading && riskAssessments.length > 0) {
      generateRecommendationsMutation.mutate();
    }
  }, [currentUserId, recommendations.length, isLoading, riskAssessments.length]);

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateRecommendationMutation.mutate({ id, completed });
  };

  const groupedRecommendations = recommendations.reduce((groups: any, rec: any) => {
    const category = rec.category || 'General';
    if (!groups[category]) groups[category] = [];
    groups[category].push(rec);
    return groups;
  }, {});

  const todoItems = recommendations.filter((rec: any) => !rec.completed);
  const completedItems = recommendations.filter((rec: any) => rec.completed);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <TrendingUp className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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
            <div className="text-sm text-slate-600">Health Recommendations</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Personalized Health Recommendations</h2>
          <p className="text-slate-600 max-w-2xl">Based on your risk analysis, here are tailored recommendations to help you stay healthy and reduce your genetic risks.</p>
        </div>

        {isLoading || generateRecommendationsMutation.isPending ? (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-health-primary"></div>
                <span className="text-slate-600">Generating your personalized recommendations...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Preventive To-Do List */}
            <Card className="bg-slate-50 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <CheckSquare className="w-6 h-6 text-health-primary" />
                  <span>Your Preventive To-Do List</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {todoItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>Great! You've completed all your recommendations.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {todoItems.map((item: any) => (
                      <Card key={item.id} className="bg-white border border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={(checked) => handleToggleComplete(item.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{item.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <Badge className={`text-white ${getPriorityColor(item.priority)}`}>
                                  {getPriorityIcon(item.priority)}
                                  <span className="ml-1">{item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority</span>
                                </Badge>
                                {item.dueDate && (
                                  <span className="text-xs text-slate-500">Due: {item.dueDate}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendation Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Lifestyle Recommendations */}
              {groupedRecommendations['Lifestyle'] && (
                <Card className="shadow-lg card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Activity className="w-6 h-6 text-health-primary" />
                      <span>Lifestyle Modifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {groupedRecommendations['Lifestyle'].slice(0, 3).map((rec: any) => (
                        <div key={rec.id} className="border-l-4 border-health-primary pl-4">
                          <h4 className="font-medium text-slate-900">{rec.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Screening Schedule */}
              {(groupedRecommendations['Preventive Care'] || groupedRecommendations['Cancer Screening']) && (
                <Card className="shadow-lg card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-health-secondary" />
                      <span>Screening Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...(groupedRecommendations['Preventive Care'] || []), ...(groupedRecommendations['Cancer Screening'] || [])]
                        .slice(0, 4)
                        .map((rec: any) => (
                          <div key={rec.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <div className="font-medium text-slate-900">{rec.title}</div>
                              <div className="text-sm text-slate-500">{rec.relatedCondition}</div>
                            </div>
                            <div className="text-sm font-medium text-health-primary">{rec.dueDate}</div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Doctor Consultations */}
              {(groupedRecommendations['Specialist Care'] || groupedRecommendations['Genetic Testing']) && (
                <Card className="shadow-lg card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <UserCheck className="w-6 h-6 text-health-accent" />
                      <span>Specialist Consultations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...(groupedRecommendations['Specialist Care'] || []), ...(groupedRecommendations['Genetic Testing'] || [])]
                        .slice(0, 3)
                        .map((rec: any) => (
                          <div key={rec.id} className={`border-l-4 pl-4 ${
                            rec.priority === 'high' ? 'border-red-500' : 
                            rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                          }`}>
                            <h4 className="font-medium text-slate-900">{rec.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                            <Badge className={`mt-2 text-white ${getPriorityColor(rec.priority)}`}>
                              {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Completed Items */}
            {completedItems.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-green-600">
                    Completed Recommendations ({completedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedItems.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Checkbox checked={true} disabled className="text-green-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-700 line-through">{item.title}</h4>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">Completed</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation("/risk-analysis")}
          >
            Back to Risk Analysis
          </Button>
          <Button 
            className="bg-health-primary hover:bg-emerald-600"
            onClick={() => setLocation("/health-passport")}
          >
            Generate Health Passport
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
