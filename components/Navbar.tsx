"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plan, setPlan] = useState("Standart");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [language, setLanguage] = useState("tr");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem("userPlan");
    if (savedPlan) {
      setIsLoggedIn(true);
      setPlan(savedPlan);
    }
    
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userCategories");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userEmail");
    window.location.href = "/"; 
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("userLanguage", lang);
    setIsLangMenuOpen(false);
  };

  // YENİ: Arayüzdeki metinleri anında değiştiren Akıllı Sözlük
  const translations = {
    tr: {
      continue: "İçerik Üretmeye Devam Et",
      start: "Hemen İçerik Üret",
      settings: "⚙️ Ayarlar",
      dashboard: "📂 İçeriklerim",
      logout: "🚪 Hesaptan Çık",
      login: "Giriş Yap",
      register: "Kayıt Ol"
    },
    en: {
      continue: "Continue Creating",
      start: "Start Creating Now",
      settings: "⚙️ Settings",
      dashboard: "📂 My Contents",
      logout: "🚪 Log Out",
      login: "Log In",
      register: "Sign Up"
    },
    de: {
      continue: "Weiter Erstellen",
      start: "Jetzt Erstellen",
      settings: "⚙️ Einstellungen",
      dashboard: "📂 Meine Inhalte",
      logout: "🚪 Abmelden",
      login: "Anmelden",
      register: "Registrieren"
    }
  };

  // Şu an seçili olan dile ait kelimeleri al (TypeScript güvenliği için 'as keyof typeof' kullanıyoruz)
  const t = translations[language as keyof typeof translations];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-white/50 shadow-sm px-6 py-4 flex items-center justify-between transition-all">
      <Link href="/" className="font-extrabold text-2xl tracking-tight text-gray-800 flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">C</div>
        ContentSense AI
      </Link>

      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <Link href={isLoggedIn ? "/dashboard" : "/register"} className="bg-[var(--color-primary)] text-white px-8 py-2.5 rounded-full font-bold shadow-lg hover:opacity-90 transition-all hover:scale-105 inline-block text-center">
          {isLoggedIn ? t.continue : t.start}
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        
        <div className="relative">
          <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-semibold bg-gray-100/50 px-3 py-1.5 rounded-full transition-colors border border-gray-200/50 shadow-sm"
          >
            <span>{language === 'tr' ? '🇹🇷 TR' : language === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}</span>
            <svg className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {isLangMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>}

          {isLangMenuOpen && (
            <div className="absolute right-0 top-10 w-36 bg-white/95 backdrop-blur-3xl rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in flex flex-col py-1">
              <button onClick={() => changeLanguage('tr')} className={`px-4 py-2.5 text-sm font-semibold text-left flex items-center gap-2 hover:bg-gray-100 transition-colors ${language === 'tr' ? 'text-[var(--color-primary)] bg-blue-50/50' : 'text-gray-700'}`}>🇹🇷 Türkçe</button>
              <button onClick={() => changeLanguage('en')} className={`px-4 py-2.5 text-sm font-semibold text-left flex items-center gap-2 hover:bg-gray-100 transition-colors ${language === 'en' ? 'text-[var(--color-primary)] bg-blue-50/50' : 'text-gray-700'}`}>🇬🇧 English</button>
              <button onClick={() => changeLanguage('de')} className={`px-4 py-2.5 text-sm font-semibold text-left flex items-center gap-2 hover:bg-gray-100 transition-colors ${language === 'de' ? 'text-[var(--color-primary)] bg-blue-50/50' : 'text-gray-700'}`}>🇩🇪 Deutsch</button>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <div className="relative">
            <div onClick={() => setIsMenuOpen(!isMenuOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 transition-all duration-300 cursor-pointer ${plan === 'Gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 hover:shadow-yellow-400/50' : plan === 'Pro' ? 'bg-[var(--color-primary)] border-blue-300 hover:shadow-blue-400/50' : 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-300'}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            {plan !== "Standart" && <div className={`absolute -bottom-1 -right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-white shadow-sm text-white tracking-wider pointer-events-none ${plan === 'Gold' ? 'bg-yellow-500' : 'bg-blue-600'}`}>{plan.toUpperCase()}</div>}
            {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>}
            {isMenuOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white/95 backdrop-blur-3xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in flex flex-col">
                <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2">{t.settings}</Link>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2">{t.dashboard}</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">{t.logout}</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-gray-600 font-semibold hover:text-gray-900 transition-colors">{t.login}</Link>
            <Link href="/register" className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-800 transition-colors inline-block text-center">{t.register}</Link>
          </>
        )}
      </div>
    </nav>
  );
}