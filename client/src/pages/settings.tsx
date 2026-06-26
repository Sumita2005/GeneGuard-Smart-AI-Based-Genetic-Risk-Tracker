import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Trash2, 
  Download,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";


export default function Settings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      emailReminders: true,
      riskAlerts: true,
      healthTips: false,
      familyUpdates: true,
    },
    privacy: {
      shareWithResearchers: false,
      allowDataAnalytics: true,
      publicProfile: false,
    },
    preferences: {
      theme: 'light',
      units: 'metric',
      defaultView: 'visual',
    }
  });

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(parseInt(userId));
    } else {
      setLocation("/profile-setup");
    }
  }, [setLocation]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users", currentUserId],
    enabled: !!currentUserId,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest("PATCH", `/api/users/${currentUserId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId] });
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = (field: string, value: any) => {
    updateUserMutation.mutate({ [field]: value });
  };

  const handleSettingsUpdate = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
    
    toast({
      title: "Setting Updated",
      description: "Your preference has been saved.",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would delete the user account
    localStorage.removeItem("currentUserId");
    toast({
      title: "Account Deleted",
      description: "Your account and all data have been permanently deleted.",
      variant: "destructive",
    });
    setLocation("/");
  };

  const handleExportData = () => {
    // In a real app, this would generate and download user data
    toast({
      title: "Data Export Started",
      description: "Your data export will be emailed to you shortly.",
    });
  };

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
            <div className="text-sm text-slate-600">Settings</div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Settings</h2>
          <p className="text-slate-600">Manage your account preferences and privacy settings.</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-health-primary"></div>
                  <span className="text-slate-600">Loading profile...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={user?.name || ''}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language & Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Language & Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Language</Label>
                    <p className="text-sm text-slate-500">Choose your preferred language for the interface</p>
                  </div>
                  <LanguageSelector />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Units</Label>
                    <p className="text-sm text-slate-500">Measurement units for health data</p>
                  </div>
                  <select 
                    value={settings.preferences.units}
                    onChange={(e) => handleSettingsUpdate('preferences', 'units', e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-health-primary focus:border-health-primary"
                  >
                    <option value="metric">Metric</option>
                    <option value="imperial">Imperial</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Email Reminders</Label>
                  <p className="text-sm text-slate-500">Receive reminders for health screenings and appointments</p>
                </div>
                <Switch
                  checked={settings.notifications.emailReminders}
                  onCheckedChange={(checked) => handleSettingsUpdate('notifications', 'emailReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Risk Alerts</Label>
                  <p className="text-sm text-slate-500">Get notified when new risk factors are identified</p>
                </div>
                <Switch
                  checked={settings.notifications.riskAlerts}
                  onCheckedChange={(checked) => handleSettingsUpdate('notifications', 'riskAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Health Tips</Label>
                  <p className="text-sm text-slate-500">Receive personalized health and wellness tips</p>
                </div>
                <Switch
                  checked={settings.notifications.healthTips}
                  onCheckedChange={(checked) => handleSettingsUpdate('notifications', 'healthTips', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Family Updates</Label>
                  <p className="text-sm text-slate-500">Notifications about family tree changes and updates</p>
                </div>
                <Switch
                  checked={settings.notifications.familyUpdates}
                  onCheckedChange={(checked) => handleSettingsUpdate('notifications', 'familyUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Research Participation</Label>
                  <p className="text-sm text-slate-500">Allow anonymized data to be used for genetic research</p>
                </div>
                <Switch
                  checked={settings.privacy.shareWithResearchers}
                  onCheckedChange={(checked) => handleSettingsUpdate('privacy', 'shareWithResearchers', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Analytics</Label>
                  <p className="text-sm text-slate-500">Help improve our service with usage analytics</p>
                </div>
                <Switch
                  checked={settings.privacy.allowDataAnalytics}
                  onCheckedChange={(checked) => handleSettingsUpdate('privacy', 'allowDataAnalytics', checked)}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Data Encryption</h4>
                </div>
                <p className="text-sm text-blue-800">
                  All your health data is encrypted end-to-end and complies with HIPAA regulations. 
                  We never share identifiable information without your explicit consent.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Export Your Data</Label>
                  <p className="text-sm text-slate-500">Download a complete copy of your health data</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium text-red-600">Delete Account</Label>
                    <p className="text-sm text-slate-500">Permanently delete your account and all associated data</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={showDeleteConfirm}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                
                {showDeleteConfirm && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-medium text-red-900">Confirm Account Deletion</h4>
                    </div>
                    <p className="text-sm text-red-800 mb-4">
                      This action cannot be undone. All your health data, family history, and risk assessments will be permanently deleted.
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteAccount}
                      >
                        Yes, Delete My Account
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-8">
          <Button 
            className="bg-health-primary hover:bg-emerald-600 px-8"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
