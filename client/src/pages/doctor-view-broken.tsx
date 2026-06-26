import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  FileText,
  Share2,
  Download,
  QrCode,
  Shield,
  Activity
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

export default function DoctorView() {
  const [match, params] = useRoute("/doctor-view/:passportId?");
  const [match2] = useRoute("/passport/:passportId");
  const passportId = params?.passportId || (match2 ? window.location.pathname.split('/').pop() : null);

  const { data: passportData, isLoading, error } = useQuery({
    queryKey: ["/api/passport", passportId],
    enabled: !!passportId,
  });

  if (!passportId) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                
                <span className="text-xl font-bold text-slate-900">GeneGuard</span>
              </div>
              <div className="text-sm text-slate-600">Doctor Portal</div>
            </div>
          </div>
        </nav>
        
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <QrCode className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor View Access</h2>
              <p className="text-slate-600 mb-6">Enter a health passport ID or scan a QR code to access patient data.</p>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter Health Passport ID"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-health-primary focus:border-health-primary"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value) {
                        window.location.href = `/doctor-view/${value}`;
                      }
                    }
                  }}
                />
                <p className="text-sm text-slate-500 mt-2">Press Enter to access</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                
                <span className="text-xl font-bold text-slate-900">GeneGuard</span>
              </div>
              <div className="text-sm text-slate-600">Doctor Portal</div>
            </div>
          </div>
        </nav>
        
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-primary mx-auto mb-4"></div>
              <p className="text-slate-600">Loading patient health passport...</p>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !passportData) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                
                <span className="text-xl font-bold text-slate-900">GeneGuard</span>
              </div>
              <div className="text-sm text-slate-600">Doctor Portal</div>
            </div>
          </div>
        </nav>
        
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Health Passport Not Found</h2>
              <p className="text-slate-600 mb-6">The requested health passport could not be found or may have been removed.</p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  }

  const { passport, user, familyMembers = [], riskAssessments = [], recommendations = [] } = passportData || {};

  const highRiskConditions = riskAssessments.filter((r: any) => r.riskLevel === 'high');
  const priorityRecommendations = recommendations.filter((r: any) => r.priority === 'high' && !r.completed);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              
              <span className="text-xl font-bold text-slate-900">GeneGuard</span>
            </div>
            <div className="text-sm text-slate-600">Doctor Portal - {user?.name}</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Healthcare Provider View</h1>
              <p className="text-slate-600 mt-1">Comprehensive patient genetic risk assessment</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Secure
              </Badge>
            </div>
          </div>
        </div>

        {/* Patient Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-health-primary rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                    <div className="flex items-center space-x-4 text-slate-600 mt-1">
                      <span>{user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1)}</span>
                      <span>•</span>
                      <span>{user?.age} years old</span>
                      <span>•</span>
                      <span>ID: {user?.id}</span>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-slate-900 mb-2">Current Medical Conditions</h3>
                      <div className="flex flex-wrap gap-2">
                        {user?.medicalConditions?.length > 0 ? (
                          user.medicalConditions.map((condition: string, index: number) => (
                            <Badge key={index} className="bg-red-100 text-red-800 border-red-300">
                              {condition}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-500 text-sm">No current medical conditions reported</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-primary mb-2">
                    {Math.round(riskAssessments.reduce((sum: number, r: any) => sum + r.riskScore, 0) / riskAssessments.length) || 0}%
                  </div>
                  <div className="text-sm text-slate-600 mb-4">Overall Risk Score</div>
                  <Badge className={`${
                    highRiskConditions.length > 2 ? 'bg-red-500' :
                    highRiskConditions.length > 0 ? 'bg-yellow-500' : 'bg-green-500'
                  } text-white`}>
                    {highRiskConditions.length > 2 ? 'High Risk' :
                     highRiskConditions.length > 0 ? 'Medium Risk' : 'Low Risk'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* High-Risk Conditions Alert */}
        {highRiskConditions.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">High-Risk Conditions Identified</h3>
                  <div className="space-y-3">
                    {highRiskConditions.map((condition: any) => (
                      <div key={condition.id} className="bg-white p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-red-900">{condition.condition}</h4>
                          <Badge className="bg-red-500 text-white">
                            {condition.riskScore}% Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-red-800">{condition.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Family History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Family Medical History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {familyMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyMembers.map((member: any) => (
                  <div key={member.id} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-slate-900">{member.name}</h4>
                        <p className="text-sm text-slate-600">{member.relation} • {member.gender} {member.age && `• ${member.age} years`}</p>
                      </div>
                      {member.isDeceased && (
                        <Badge className="bg-slate-500 text-white text-xs">Deceased</Badge>
                      )}
                    </div>
                    {member.medicalConditions?.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {member.medicalConditions.map((condition: string, index: number) => (
                            <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                No family medical history available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommendations for Healthcare Provider */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span>Clinical Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {priorityRecommendations.length > 0 ? (
              <div className="space-y-4">
                {priorityRecommendations.map((rec: any) => (
                  <div key={rec.id} className={`p-4 rounded-lg border-l-4 ${
                    rec.type === 'screening' ? 'bg-blue-50 border-blue-400' :
                    rec.type === 'consultation' ? 'bg-purple-50 border-purple-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                      <Badge className={`${
                        rec.type === 'screening' ? 'bg-blue-500' :
                        rec.type === 'consultation' ? 'bg-purple-500' :
                        'bg-green-500'
                      } text-white`}>
                        {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {rec.relatedCondition && `Related to: ${rec.relatedCondition}`}
                      </span>
                      <span className="font-medium text-slate-700">
                        Timeframe: {rec.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                No high-priority clinical recommendations at this time.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Patient Lifestyle Factors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <span>Lifestyle & Risk Factors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-health-primary mb-2">
                  {user?.lifestyle?.exerciseLevel?.charAt(0).toUpperCase() + user?.lifestyle?.exerciseLevel?.slice(1) || 'N/A'}
                </div>
                <div className="text-sm text-slate-600">Exercise Level</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-health-secondary mb-2">
                  {user?.lifestyle?.smokingStatus === 'never' ? 'Never' :
                   user?.lifestyle?.smokingStatus === 'former' ? 'Former' :
                   user?.lifestyle?.smokingStatus === 'current' ? 'Current' : 'N/A'}
                </div>
                <div className="text-sm text-slate-600">Smoking History</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-health-accent mb-2">
                  {user?.lifestyle?.dietType?.charAt(0).toUpperCase() + user?.lifestyle?.dietType?.slice(1) || 'N/A'}
                </div>
                <div className="text-sm text-slate-600">Diet Type</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Healthcare Provider Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-12">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="h-12">
                <FileText className="w-4 h-4 mr-2" />
                Add to EMR
              </Button>
              <Button variant="outline" className="h-12">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Healthcare Provider Notes</h4>
              <p className="text-sm text-blue-800">
                This genetic risk assessment is based on family history and lifestyle factors. 
                Clinical correlation and professional judgment should always be applied when 
                making medical decisions. Consider genetic counseling referral for high-risk conditions.
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}