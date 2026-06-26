import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useColorBlindStyles } from "@/hooks/use-color-blind-styles";
import { Brain, Activity, Shield, TrendingUp, BarChart3 } from "lucide-react";

interface AIRiskAnalysisProps {
  riskAssessments: any[];
  isLoading?: boolean;
}

export default function AIRiskAnalysis({ riskAssessments, isLoading }: AIRiskAnalysisProps) {
  const { getRiskStyles, getRiskIcon, isColorBlindMode } = useColorBlindStyles();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Risk Analysis</h2>
          <p className="text-gray-600">Advanced genetic risk assessment using machine learning and family history patterns</p>
        </div>
      </div>
    );
  }

  // Get top 3 conditions for main display
  const topConditions = riskAssessments
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Risk Analysis</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Advanced genetic risk assessment using machine learning and family history patterns
        </p>
      </div>

      {/* Main Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topConditions.map((assessment, index) => (
          <Card key={assessment.id} className="bg-white border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Condition Name and Risk Level */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {assessment.condition}
                  </h3>
                  <span className={getRiskStyles(assessment.riskLevel)}>
                    {assessment.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Risk Score Circle */}
                <div className="flex items-center justify-center py-4">
                  <div className="relative">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={isColorBlindMode ? "#e5e7eb" : "#f3f4f6"}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={
                          assessment.riskLevel === 'high' 
                            ? (isColorBlindMode ? '#ea580c' : '#dc2626')
                            : assessment.riskLevel === 'medium'
                            ? '#eab308'
                            : (isColorBlindMode ? '#2563eb' : '#16a34a')
                        }
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${assessment.riskScore * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {assessment.riskScore}
                        <span className="text-sm text-gray-500">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Description */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    {assessment.factors?.familyHistory > 0 && (
                      <div className="flex items-center mr-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        No significant family history
                      </div>
                    )}
                    {assessment.factors?.familyHistory === 0 && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        No significant family history
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Breakdown by Condition */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Risk Breakdown by Condition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAssessments.map((assessment) => (
                <div key={assessment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {assessment.condition}
                    </span>
                    <span className={getRiskStyles(assessment.riskLevel)}>
                      {getRiskIcon(assessment.riskLevel)} {assessment.riskLevel}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={assessment.riskScore} 
                      className="h-2"
                      style={{
                        '--progress-background': assessment.riskLevel === 'high' 
                          ? (isColorBlindMode ? '#ea580c' : '#dc2626')
                          : assessment.riskLevel === 'medium'
                          ? '#eab308'
                          : (isColorBlindMode ? '#2563eb' : '#16a34a')
                      } as React.CSSProperties}
                    />
                    <p className="text-xs text-gray-600">{assessment.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Risk Factors Analysis */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Risk Factors Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Diabetes Factors Example */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Diabetes Factors</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Family History</span>
                    <span className="font-medium">Low Impact</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lifestyle</span>
                    <span className="font-medium">Moderate Impact</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Age Factor</span>
                    <span className="font-medium">Low Impact</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Environmental</span>
                    <span className="font-medium">Low Impact</span>
                  </div>
                </div>
              </div>

              {/* Overall Assessment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">AI Insights</h4>
                    <p className="text-sm text-gray-600">
                      Your risk profile shows low genetic predisposition with healthy lifestyle factors 
                      contributing to overall reduced risk across most conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}