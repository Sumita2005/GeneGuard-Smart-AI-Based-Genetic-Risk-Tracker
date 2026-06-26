import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import HealthPassportPDF from "@/components/health-passport-pdf";
import { generatePDF } from "@/lib/pdf-generator";
import { 
  FileDown, 
  Printer, 
  Share2, 
  QrCode,
  Mail,
  Copy,
  FileText
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';


export default function HealthPassport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(parseInt(userId));
    } else {
      setLocation("/profile-setup");
    }
  }, [setLocation]);

  const { data: user } = useQuery({
    queryKey: ["/api/users", currentUserId],
    enabled: !!currentUserId,
  });

  const { data: passport } = useQuery({
    queryKey: ["/api/users", currentUserId, "health-passport"],
    enabled: !!currentUserId,
  });

  const { data: riskAssessments = [] } = useQuery({
    queryKey: ["/api/users", currentUserId, "risk-assessments"],
    enabled: !!currentUserId,
  });

  const { data: familyMembers = [] } = useQuery({
    queryKey: ["/api/users", currentUserId, "family-members"],
    enabled: !!currentUserId,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["/api/users", currentUserId, "recommendations"],
    enabled: !!currentUserId,
  });

  const generatePassportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/users/${currentUserId}/health-passport`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "health-passport"] });
      toast({
        title: "Success",
        description: "Health passport generated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate health passport. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentUserId && !passport && user) {
      generatePassportMutation.mutate();
    }
  }, [currentUserId, passport, user]);

  const handleDownloadPDF = async () => {
    if (!user || !riskAssessments.length) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDF({
        user,
        riskAssessments,
        familyMembers,
        recommendations,
        passport
      });
      toast({
        title: "PDF Downloaded",
        description: "Your health passport has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Your health passport is ready to print.",
    });
  };

  const handleCopyLink = () => {
    if (passport?.shareableLink) {
      navigator.clipboard.writeText(passport.shareableLink);
      toast({
        title: "Link Copied",
        description: "Shareable link has been copied to clipboard.",
      });
    }
  };

  const handleShareWithDoctor = () => {
    if (!doctorEmail || !passport?.shareableLink) return;
    
    const subject = `Health Passport from ${user?.name}`;
    const body = `Dear Doctor,\n\nI'm sharing my health passport with you for review.\n\nAccess link: ${passport.shareableLink}\n\nBest regards,\n${user?.name}`;
    const mailtoUrl = `mailto:${doctorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoUrl);
    toast({
      title: "Email Opened",
      description: "Your email client has been opened with the health passport link.",
    });
  };

  if (!currentUserId) {
    return null;
  }

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
            <div className="text-sm text-slate-600">Health Passport</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Digital Health Passport</h2>
          <p className="text-slate-600">A comprehensive summary of your genetic risk profile and health recommendations for easy sharing with healthcare providers.</p>
        </div>

        {/* Health Passport Preview */}
        <Card className="shadow-lg mb-8" id="health-passport-content">
          <CardContent className="p-8 print:p-4">
            {/* Header */}
            <div className="border-b border-slate-200 pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{user?.name || 'Loading...'}</h3>
                  <p className="text-slate-600">
                    {user?.gender && `${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}, `}
                    {user?.age} • Generated on {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  {passport?.qrCode && (
                    <div className="mb-2">
                      <QRCodeSVG 
                        value={passport.shareableLink || ''} 
                        size={80}
                        className="border border-slate-200 rounded"
                      />
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Scan to view online</p>
                </div>
              </div>
            </div>

            {/* Risk Summary */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Risk Assessment Summary</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  {riskAssessments.slice(0, Math.ceil(riskAssessments.length / 2)).map((assessment: any) => (
                    <div key={assessment.id} className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{assessment.condition}</span>
                      <span className={`px-2 py-1 text-white text-xs rounded-full ${
                        assessment.riskLevel === 'high' ? 'bg-red-500' :
                        assessment.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)} ({assessment.riskScore}%)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {riskAssessments.slice(Math.ceil(riskAssessments.length / 2)).map((assessment: any) => (
                    <div key={assessment.id} className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{assessment.condition}</span>
                      <span className={`px-2 py-1 text-white text-xs rounded-full ${
                        assessment.riskLevel === 'high' ? 'bg-red-500' :
                        assessment.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)} ({assessment.riskScore}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Family History Highlights */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Key Family History</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-slate-700">
                  {familyMembers.slice(0, 4).map((member: any) => (
                    <li key={member.id}>
                      • {member.name} ({member.relation.replace(/_/g, ' ')}): {
                        member.medicalConditions?.length > 0 
                          ? member.medicalConditions.join(', ')
                          : 'No significant conditions reported'
                      }
                      {member.age && ` (Age: ${member.age})`}
                    </li>
                  ))}
                  {familyMembers.length === 0 && (
                    <li>• No family medical history data available</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Current Health Status */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Current Health Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-health-primary">Good</div>
                  <div className="text-sm text-slate-600">Overall Health</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-health-primary">
                    {user?.lifestyle?.exerciseLevel || 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">Exercise Level</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-health-primary">
                    {user?.lifestyle?.smokingStatus === 'never' ? 'Never' : 
                     user?.lifestyle?.smokingStatus === 'former' ? 'Former' :
                     user?.lifestyle?.smokingStatus === 'current' ? 'Current' : 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">Smoking Status</div>
                </div>
              </div>
            </div>

            {/* Priority Recommendations */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Priority Actions</h4>
              <div className="space-y-3">
                {priorityRecommendations.slice(0, 4).map((rec: any) => (
                  <div key={rec.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm text-slate-700">{rec.title} ({rec.dueDate})</span>
                  </div>
                ))}
                {priorityRecommendations.length === 0 && (
                  <p className="text-sm text-slate-500">No high-priority recommendations at this time.</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-slate-200 pt-6">
              <div className="text-center text-xs text-slate-500">
                <p>Generated by GeneGuard Smart Genetic Risk Tracker</p>
                <p>For questions or updates, contact your healthcare provider</p>
                <p className="mt-2 font-mono">ID: {passport?.passportId || 'Generating...'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Export Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-16"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                <FileDown className="w-5 h-5 text-red-500" />
                <span className="font-medium">
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-16"
                onClick={handlePrint}
              >
                <Printer className="w-5 h-5 text-slate-600" />
                <span className="font-medium">Print</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-16"
                onClick={handleCopyLink}
              >
                <Copy className="w-5 h-5 text-health-primary" />
                <span className="font-medium">Copy Link</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Sharing Section */}
        <Card className="gradient-bg text-white mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Share with Healthcare Provider</h3>
                <p className="text-blue-100 text-sm">Securely share your health passport with your doctor</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="Doctor's email address"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                className="bg-white text-slate-900 border-blue-300"
              />
              <Button
                onClick={handleShareWithDoctor}
                className="bg-white text-health-primary hover:bg-blue-50 font-semibold"
                disabled={!doctorEmail}
              >
                Send Securely
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation("/recommendations")}
          >
            Back to Recommendations
          </Button>
          <Button 
            className="bg-health-primary hover:bg-emerald-600"
            onClick={() => setLocation("/doctor-view")}
          >
            View Doctor Interface
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
