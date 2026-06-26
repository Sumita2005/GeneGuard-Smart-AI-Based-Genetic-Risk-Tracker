import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import RiskCharts from "@/components/risk-charts";
import AIRiskAnalysis from "@/components/ai-risk-analysis";
import { useColorBlindStyles } from "@/hooks/use-color-blind-styles";
import { Shield, Activity, Globe, BarChart3, Brain, TrendingUp } from "lucide-react";


export default function RiskAnalysis() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { getRiskStyles, getRiskIcon, getPrimaryButtonStyles } = useColorBlindStyles();

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(parseInt(userId));
    } else {
      setLocation("/profile-setup");
    }
  }, [setLocation]);

  const { data: riskAssessments = [], isLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "risk-assessments"],
    enabled: !!currentUserId,
  });
  const assessments = riskAssessments as any[];

  const calculateRisksMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/users/${currentUserId}/calculate-risks`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "risk-assessments"] });
      toast({
        title: "Risk Analysis Complete",
        description: "Your genetic risk assessment has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate risks. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentUserId && assessments.length === 0 && !isLoading) {
      calculateRisksMutation.mutate();
    }
  }, [currentUserId, assessments.length, isLoading]);

  const getOverallRiskScore = () => {
    if (assessments.length === 0) return 0;
    const totalScore = assessments.reduce((sum: number, assessment: any) => sum + assessment.riskScore, 0);
    return Math.round(totalScore / assessments.length);
  };

  const getOverallRiskLevel = (score: number) => {
    if (score >= 70) return { level: "High", color: "bg-red-500" };
    if (score >= 40) return { level: "Medium", color: "bg-yellow-500" };
    return { level: "Low", color: "bg-green-500" };
  };

  const overallScore = getOverallRiskScore();
  const overallRisk = getOverallRiskLevel(overallScore);

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900">GeneGuard</span>
            </div>
            <div className="text-sm text-slate-600">Risk Analysis</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-health-primary">Step 3 of 4</span>
            <span className="text-sm text-slate-500">Risk Analysis</span>
          </div>
          <Progress value={75} className="w-full" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Genetic Risk Assessment</h2>
          <p className="text-slate-600 max-w-2xl">Based on your family medical history and lifestyle factors, here's your personalized risk analysis.</p>
        </div>

        {/* AI Risk Analysis Component */}
        <AIRiskAnalysis 
          riskAssessments={riskAssessments} 
          isLoading={isLoading || calculateRisksMutation.isPending} 
        />

        {!isLoading && !calculateRisksMutation.isPending && riskAssessments.length > 0 && (
          <>
            {/* Overall Risk Summary */}
            <Card className="shadow-lg mb-8">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Risk Score Visualization */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Overall Risk Score</h3>
                    <RiskCharts riskAssessments={riskAssessments} type="overall" />
                    <div className="text-center mt-4">
                      <p className="text-sm text-slate-600">Based on family history and lifestyle factors</p>
                    </div>
                  </div>

                  {/* Risk Breakdown */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Risk Breakdown by Condition</h3>
                    <div className="space-y-4">
                      {riskAssessments.map((assessment: any) => (
                        <div key={assessment.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-900">{assessment.condition}</span>
                            <span className={getRiskStyles(assessment.riskLevel)}>
                              {getRiskIcon(assessment.riskLevel)} {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                assessment.riskLevel === 'high' ? 'bg-red-500' :
                                assessment.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${assessment.riskScore}%` }}
                            />
                          </div>
                          <div className="text-sm text-slate-600">{assessment.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Risk Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Genetic Factors */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-health-accent rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Genetic Factors</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {riskAssessments.slice(0, 3).map((assessment: any) => (
                      <div key={`genetic-${assessment.id}`} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{assessment.condition}</span>
                        <span className={getRiskStyles(
                          assessment.factors?.familyHistory > 50 ? 'high' :
                          assessment.factors?.familyHistory > 25 ? 'medium' : 'low'
                        )}>
                          {getRiskIcon(assessment.factors?.familyHistory > 50 ? 'high' :
                           assessment.factors?.familyHistory > 25 ? 'medium' : 'low')} 
                          {assessment.factors?.familyHistory > 50 ? 'High' :
                           assessment.factors?.familyHistory > 25 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle Factors */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-health-primary rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Lifestyle Factors</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {riskAssessments.slice(0, 3).map((assessment: any) => (
                      <div key={`lifestyle-${assessment.id}`} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{assessment.condition}</span>
                        <Badge className={`text-white text-xs ${
                          assessment.factors?.lifestyle > 25 ? 'bg-red-500' :
                          assessment.factors?.lifestyle > 15 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {assessment.factors?.lifestyle > 25 ? 'Poor' :
                           assessment.factors?.lifestyle > 15 ? 'Fair' : 'Good'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Factors */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-health-secondary rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Environmental</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Stress Level</span>
                      <Badge className="bg-yellow-500 text-white text-xs">Medium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Sleep Quality</span>
                      <Badge className="bg-green-500 text-white text-xs">Good</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Occupation Risk</span>
                      <Badge className="bg-green-500 text-white text-xs">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="gradient-bg text-white mb-8">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">AI Health Insights</h3>
                    <div className="space-y-2 text-emerald-100">
                      {riskAssessments
                        .filter((assessment: any) => assessment.riskLevel === 'high')
                        .slice(0, 3)
                        .map((assessment: any, index: number) => (
                          <p key={index}>
                            • Your {assessment.condition.toLowerCase()} risk is elevated. {assessment.reasoning}
                          </p>
                        ))}
                      {riskAssessments.some((assessment: any) => assessment.factors?.lifestyle < 20) && (
                        <p>• Your healthy lifestyle choices are helping to mitigate several hereditary risks.</p>
                      )}
                      <p>• Consider discussing preventive measures with your healthcare provider within the next 3 months.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Charts */}
            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Detailed Risk Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RiskCharts riskAssessments={riskAssessments} type="detailed" />
              </CardContent>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation("/family-tree")}
          >
            Back to Family Tree
          </Button>
          <Button 
            className={getPrimaryButtonStyles()}
            onClick={() => setLocation("/recommendations")}
          >
            View Recommendations
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
