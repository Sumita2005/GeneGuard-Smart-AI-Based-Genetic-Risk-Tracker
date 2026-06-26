import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Shield, Users, BarChart3, FileText, Activity, MessageCircle, CheckCircle, Lock, Zap, Newspaper } from "lucide-react";
import DiseaseNewsFeed from "@/components/disease-news-feed";
import AIchatbot from "@/components/ai-chatbot";
import Logo from "@/components/logo";


export default function Landing() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useI18n();

  const features = [
    {
      icon: Users,
      title: "Interactive Family Tree",
      description: "Build a comprehensive family medical history with our intuitive drag-and-drop interface.",
      items: ["Add unlimited family members", "Track medical conditions", "Visual relationship mapping"]
    },
    {
      icon: BarChart3,
      title: "AI-Powered Risk Analysis",
      description: "Get intelligent risk assessments based on family history and lifestyle factors.",
      items: ["Real-time risk scoring", "Color-coded indicators", "Evidence-based algorithms"]
    },
    {
      icon: FileText,
      title: "Digital Health Passport",
      description: "Generate comprehensive health reports with QR codes for easy sharing with healthcare providers.",
      items: ["PDF export functionality", "QR code integration", "Secure doctor sharing"]
    },
    {
      icon: Activity,
      title: "Smart Recommendations",
      description: "Receive personalized lifestyle and screening recommendations based on your risk profile.",
      items: ["Preventive care reminders", "Lifestyle optimization tips", "Screening schedules"]
    },
    {
      icon: MessageCircle,
      title: "Family Health Timeline",
      description: "Track major health events across your family timeline for better pattern recognition.",
      items: ["Chronological health events", "Pattern identification", "Interactive timeline view"]
    },
    {
      icon: Zap,
      title: "AI Health Assistant",
      description: "Get instant answers to your health questions through our intelligent chatbot.",
      items: ["24/7 health guidance", "Symptom assessment", "Medical terminology help"]
    }
  ];

  const trustIndicators = [
    { icon: Shield, text: "HIPAA Compliant" },
    { icon: Lock, text: "End-to-End Encrypted" },
    { icon: CheckCircle, text: "AI-Powered Insights" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold text-slate-900">GeneGuard</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setLocation("/")} className="text-slate-700 hover:text-emerald-600 font-medium">{t("nav.home")}</button>
              <button onClick={() => setLocation("/profile-setup")} className="text-slate-700 hover:text-emerald-600 font-medium">Profile</button>
              <button onClick={() => setLocation("/family-tree")} className="text-slate-700 hover:text-emerald-600 font-medium">{t("nav.familyTree")}</button>
              <button onClick={() => setLocation("/risk-analysis")} className="text-slate-700 hover:text-emerald-600 font-medium">{t("nav.riskAnalysis")}</button>
              <button onClick={() => setLocation("/recommendations")} className="text-slate-700 hover:text-emerald-600 font-medium">Recommendations</button>
              <button onClick={() => setLocation("/health-passport")} className="text-slate-700 hover:text-emerald-600 font-medium">{t("nav.healthPassport")}</button>
              <button onClick={() => setLocation("/settings")} className="text-slate-700 hover:text-emerald-600 font-medium">{t("nav.settings")}</button>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <select 
                className="text-sm bg-transparent border-none text-slate-700 cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="mr">🇮🇳 मराठी</option>
                <option value="bn">🇧🇩 বাংলা</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {t("landing.heroTitle")}<br />
                  <span className="text-emerald-100">{t("landing.heroSubtitle")}</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg leading-relaxed">
                  {t("landing.heroDescription")}
                </p>
              </div>
              
              {/* Action Button */}
              <div className="flex justify-start">
                <Button 
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setLocation("/profile-setup")}
                >
                  {t("landing.getStarted")}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-8">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <indicator.icon className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-200">{indicator.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Disease News Feed Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Live Updates</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Health News
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                  <Newspaper className="w-4 h-4" />
                  <span>Disease News Feed</span>
                </h3>
                
                <DiseaseNewsFeed compact={true} />
                
                <div className="mt-4 flex items-center space-x-2 text-sm text-slate-600">
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <span>Health Updates</span>
                  <span className="text-slate-400">•</span>
                  <span>Live feed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Comprehensive Health Risk Management
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              From family tree building to AI-powered risk analysis, GeneGuard provides everything you need for proactive health management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-slate-700">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
            Start building your family medical history and get personalized health insights today.
          </p>
          <Button 
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => setLocation("/profile-setup")}
          >
            Begin Your Health Journey
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-health-primary rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GeneGuard</span>
              </div>
              <p className="text-slate-400 text-sm">Empowering preventive health through genetic risk tracking and AI-powered insights.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Family Tree Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Passport</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <div className="space-y-3">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                    <indicator.icon className="w-4 h-4 text-health-primary" />
                    <span>{indicator.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-sm">&copy; 2024 GeneGuard. All rights reserved. This is a prototype for demonstration purposes.</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Button */}
      <AIchatbot />
    </div>
  );
}
