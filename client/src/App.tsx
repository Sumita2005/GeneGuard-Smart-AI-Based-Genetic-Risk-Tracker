import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import ProfileSetup from "@/pages/profile-setup";
import FamilyTree from "@/pages/family-tree";
import RiskAnalysis from "@/pages/risk-analysis";
import Recommendations from "@/pages/recommendations";
import HealthPassport from "@/pages/health-passport";
import DoctorView from "@/pages/doctor-view";
import Settings from "@/pages/settings";
import Navigation from "@/components/navigation";
import AIchatbot from "@/components/ai-chatbot";
import { I18nProvider } from "./lib/i18n";
import { ColorBlindProvider } from "@/contexts/color-blind-context";
import { ColorBlindToggle } from "@/components/color-blind-toggle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/profile-setup" component={ProfileSetup} />
      <Route path="/family-tree" component={FamilyTree} />
      <Route path="/risk-analysis" component={RiskAnalysis} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/health-passport" component={HealthPassport} />
      <Route path="/doctor-view/:passportId?" component={DoctorView} />
      <Route path="/passport/:passportId" component={DoctorView} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorBlindProvider>
        <I18nProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-slate-50">
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <AIchatbot />
              <div className="fixed bottom-6 left-6 z-50">
                <ColorBlindToggle />
              </div>
              <Toaster />
            </div>
          </TooltipProvider>
        </I18nProvider>
      </ColorBlindProvider>
    </QueryClientProvider>
  );
}

export default App;
