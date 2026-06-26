import React, { createContext, useContext, useState, ReactNode } from "react";

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.familyTree": "Family Tree",
    "nav.riskAnalysis": "Risk Analysis",
    "nav.healthPassport": "Health Passport",
    "nav.settings": "Settings",
    
    // Landing page
    "landing.heroTitle": "Track Genetic Risks.",
    "landing.heroSubtitle": "Empower Preventive Health.",
    "landing.heroDescription": "Build your family medical history, assess genetic risks using AI, and receive personalized health insights to stay ahead of potential health issues.",
    "landing.getStarted": "Get Started Free",
    "landing.watchDemo": "Watch Demo",
    
    // Profile setup
    "profile.title": "Let's Get Started",
    "profile.description": "Tell us about yourself to create your personalized health profile.",
    "profile.fullName": "Full Name",
    "profile.age": "Age",
    "profile.gender": "Gender",
    "profile.male": "Male",
    "profile.female": "Female",
    "profile.other": "Other",
    "profile.continue": "Continue to Family Tree",
    
    // Family tree
    "family.title": "Build Your Family Medical History",
    "family.description": "Add family members and their medical information to help us assess your genetic risks more accurately.",
    "family.addMember": "Add Family Member",
    
    // Risk analysis
    "risk.title": "Your Genetic Risk Assessment",
    "risk.description": "Based on your family medical history and lifestyle factors, here's your personalized risk analysis.",
    
    // Recommendations
    "recommendations.title": "Personalized Health Recommendations",
    "recommendations.description": "Based on your risk analysis, here are tailored recommendations to help you stay healthy and reduce your genetic risks.",
    
    // Health passport
    "passport.title": "Your Digital Health Passport",
    "passport.description": "A comprehensive summary of your genetic risk profile and health recommendations for easy sharing with healthcare providers.",
    
    // Common
    "common.back": "Back",
    "common.continue": "Continue",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
  },
  
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.familyTree": "पारिवारिक वृक्ष",
    "nav.riskAnalysis": "जोखिम विश्लेषण",
    "nav.healthPassport": "स्वास्थ्य पासपोर्ट",
    "nav.settings": "सेटिंग्स",
    
    // Landing page
    "landing.heroTitle": "आनुवंशिक जोखिमों को ट्रैक करें।",
    "landing.heroSubtitle": "निवारक स्वास्थ्य को सशक्त बनाएं।",
    "landing.heroDescription": "अपना पारिवारिक चिकित्सा इतिहास बनाएं, AI का उपयोग करके आनुवंशिक जोखिमों का आकलन करें, और संभावित स्वास्थ्य समस्याओं से आगे रहने के लिए व्यक्तिगत स्वास्थ्य अंतर्दृष्टि प्राप्त करें।",
    "landing.getStarted": "निःशुल्क शुरू करें",
    "landing.watchDemo": "डेमो देखें",
    
    // Profile setup
    "profile.title": "चलिए शुरू करते हैं",
    "profile.description": "अपना व्यक्तिगत स्वास्थ्य प्रोफ़ाइल बनाने के लिए हमें अपने बारे में बताएं।",
    "profile.fullName": "पूरा नाम",
    "profile.age": "आयु",
    "profile.gender": "लिंग",
    "profile.male": "पुरुष",
    "profile.female": "महिला",
    "profile.other": "अन्य",
    "profile.continue": "पारिवारिक वृक्ष पर जाएं",
    
    // Common
    "common.back": "वापस",
    "common.continue": "जारी रखें",
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "एक त्रुटि हुई",
    "common.success": "सफलता",
  },
  
  mr: {
    // Navigation
    "nav.home": "मुख्यपृष्ठ",
    "nav.familyTree": "कौटुंबिक वृक्ष",
    "nav.riskAnalysis": "जोखीम विश्लेषण",
    "nav.healthPassport": "आरोग्य पासपोर्ट",
    "nav.settings": "सेटिंग्ज",
    
    // Landing page
    "landing.heroTitle": "आनुवंशिक जोखीम ट्रॅक करा।",
    "landing.heroSubtitle": "प्रतिबंधक आरोग्यास सक्षम करा।",
    "landing.heroDescription": "तुमचा कौटुंबिक वैद्यकीय इतिहास तयार करा, AI वापरून आनुवंशिक जोखमींचे मूल्यांकन करा, आणि संभाव्य आरोग्य समस्यांपूर्वी वैयक्तिक आरोग्य अंतर्दृष्टी मिळवा।",
    "landing.getStarted": "विनामूल्य सुरू करा",
    "landing.watchDemo": "डेमो पहा",
    
    // Common
    "common.back": "मागे",
    "common.continue": "पुढे चला",
    "common.save": "जतन करा",
    "common.cancel": "रद्द करा",
    "common.loading": "लोड होत आहे...",
    "common.error": "एक त्रुटी उद्भवली",
    "common.success": "यशस्वी",
  },
  
  bn: {
    // Navigation
    "nav.home": "হোম",
    "nav.familyTree": "পারিবারিক বৃক্ষ",
    "nav.riskAnalysis": "ঝুঁকি বিশ্লেষণ",
    "nav.healthPassport": "স্বাস্থ্য পাসপোর্ট",
    "nav.settings": "সেটিংস",
    
    // Landing page
    "landing.heroTitle": "জেনেটিক ঝুঁকি ট্র্যাক করুন।",
    "landing.heroSubtitle": "প্রতিরোধমূলক স্বাস্থ্যকে ক্ষমতায়ন করুন।",
    "landing.heroDescription": "আপনার পারিবারিক চিকিৎসা ইতিহাস তৈরি করুন, AI ব্যবহার করে জেনেটিক ঝুঁকি মূল্যায়ন করুন, এবং সম্ভাব্য স্বাস্থ্য সমস্যার আগে থাকতে ব্যক্তিগত স্বাস্থ্য অন্তর্দৃষ্টি পান।",
    "landing.getStarted": "বিনামূল্যে শুরু করুন",
    "landing.watchDemo": "ডেমো দেখুন",
    
    // Profile setup
    "profile.title": "চলুন শুরু করি",
    "profile.description": "আপনার ব্যক্তিগত স্বাস্থ্য প্রোফাইল তৈরি করতে আমাদের নিজের সম্পর্কে বলুন।",
    "profile.fullName": "পূর্ণ নাম",
    "profile.age": "বয়স",
    "profile.gender": "লিঙ্গ",
    "profile.male": "পুরুষ",
    "profile.female": "মহিলা",
    "profile.other": "অন্যান্য",
    "profile.continue": "পারিবারিক বৃক্ষে যান",
    
    // Common
    "common.back": "ফিরে যান",
    "common.continue": "চালিয়ে যান",
    "common.save": "সেভ করুন",
    "common.cancel": "বাতিল করুন",
    "common.loading": "লোড হচ্ছে...",
    "common.error": "একটি ত্রুটি ঘটেছে",
    "common.success": "সফল",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");

  const t = (key: string): string => {
    const dict = translations[language as keyof typeof translations];
    return dict?.[key as keyof typeof dict] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
