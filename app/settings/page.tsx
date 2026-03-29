"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Standart");
  const [credits, setCredits] = useState<string | number>("...");
  const [categories, setCategories] = useState<string[]>([]);
  
  const [language, setLanguage] = useState("tr");
  
  const [activeTab, setActiveTab] = useState("profil"); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // YENİ: Dili anlık olarak dinleyen yapı
  useEffect(() => {
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) setLanguage(savedLang);

    const intervalId = setInterval(() => {
        const currentLang = localStorage.getItem("userLanguage") || "tr";
        if (currentLang !== language) setLanguage(currentLang);
    }, 500);

    return () => clearInterval(intervalId);
  }, [language]);

  // YENİ: Ayarlar sayfası metinleri için Akıllı Sözlük
  const translations = {
    tr: {
      settingsTitle: "Ayarlar ⚙️",
      settingsDesc: "Hesap bilgilerinizi ve aboneliğinizi buradan yönetebilirsiniz.",
      tabProfile: "👤 Profil Bilgileri",
      tabSubscription: "💳 Abonelik & Kredi",
      tabPassword: "🔒 Şifre Değiştir",
      appLangLabel: "Uygulama Dili / App Language",
      emailLabel: "E-posta Adresi (Değiştirilemez)",
      interestsLabel: "İlgi Alanlarım (En fazla 3 kategori seçin)",
      saveChangesBtn: "Değişiklikleri Kaydet",
      savingBtn: "Kaydediliyor...",
      currentPlanLabel: "Mevcut Planınız",
      packageLabel: "PAKET",
      creditsLeft: "Kalan Kredi:",
      changePlanTitle: "Planınızı Değiştirin",
      freeTrial: "Ücretsiz Deneme",
      currentPlanBtn: "Mevcut Plan",
      selectBtn: "Seç",
      upgradeBtn: "Yükselt",
      perMonth: "/ Ay",
      passwordTitle: "Şifre Değiştir",
      currentPassLabel: "Mevcut Şifreniz",
      newPassLabel: "Yeni Şifre (En az 8 karakter)",
      confirmPassLabel: "Yeni Şifre (Tekrar)",
      updatePassBtn: "Şifreyi Güncelle",
      updatingBtn: "Güncelleniyor...",
      // Kategoriler
      cat1: "Mimari & Tasarım", cat2: "Sağlık & Besin Takviyesi", cat3: "Teknoloji & Yazılım", 
      cat4: "Moda", cat5: "Hobi", cat6: "Spor", cat7: "Eğlence", cat8: "Eğitim",
      // Plan Özellikleri
      stdFeature1: "Ayda 3 İçerik Kredisi", stdFeature2: "Standart Çözünürlük (720p)", stdFeature3: "Filigranlı Çıktı",
      proFeature1: "Ayda 50 İçerik Kredisi", proFeature2: "Yüksek Çözünürlük (1080p)", proFeature3: "Öncelikli YZ Hızı & Filigransız",
      goldFeature1: "Ayda 200 İçerik Kredisi", goldFeature2: "Ultra Çözünürlük (4K) & Marka Kiti", goldFeature3: "Özel Destek & Ekip Yönetimi"
    },
    en: {
      settingsTitle: "Settings ⚙️",
      settingsDesc: "Manage your account details and subscription here.",
      tabProfile: "👤 Profile Info",
      tabSubscription: "💳 Subscription & Credits",
      tabPassword: "🔒 Change Password",
      appLangLabel: "App Language",
      emailLabel: "Email Address (Cannot be changed)",
      interestsLabel: "My Interests (Select up to 3 categories)",
      saveChangesBtn: "Save Changes",
      savingBtn: "Saving...",
      currentPlanLabel: "Your Current Plan",
      packageLabel: "PLAN",
      creditsLeft: "Credits Left:",
      changePlanTitle: "Change Your Plan",
      freeTrial: "Free Trial",
      currentPlanBtn: "Current Plan",
      selectBtn: "Select",
      upgradeBtn: "Upgrade",
      perMonth: "/ Month",
      passwordTitle: "Change Password",
      currentPassLabel: "Current Password",
      newPassLabel: "New Password (Min. 8 characters)",
      confirmPassLabel: "Confirm New Password",
      updatePassBtn: "Update Password",
      updatingBtn: "Updating...",
      // Kategoriler
      cat1: "Arch. & Design", cat2: "Health & Supplements", cat3: "Tech & Software", 
      cat4: "Fashion", cat5: "Hobbies", cat6: "Sports", cat7: "Entertainment", cat8: "Education",
      // Plan Özellikleri
      stdFeature1: "3 Content Credits / Month", stdFeature2: "Standard Resolution (720p)", stdFeature3: "Watermarked Output",
      proFeature1: "50 Content Credits / Month", proFeature2: "High Resolution (1080p)", proFeature3: "Priority AI Speed & No Watermark",
      goldFeature1: "200 Content Credits / Month", goldFeature2: "Ultra Resolution (4K) & Brand Kit", goldFeature3: "Premium Support & Team Management"
    },
    de: {
      settingsTitle: "Einstellungen ⚙️",
      settingsDesc: "Verwalten Sie hier Ihre Kontodaten und Ihr Abonnement.",
      tabProfile: "👤 Profilinformationen",
      tabSubscription: "💳 Abonnement & Credits",
      tabPassword: "🔒 Passwort ändern",
      appLangLabel: "App-Sprache",
      emailLabel: "E-Mail-Adresse (Kann nicht geändert werden)",
      interestsLabel: "Meine Interessen (Wählen Sie bis zu 3 Kategorien)",
      saveChangesBtn: "Änderungen speichern",
      savingBtn: "Wird gespeichert...",
      currentPlanLabel: "Ihr aktueller Plan",
      packageLabel: "PLAN",
      creditsLeft: "Verbleibende Credits:",
      changePlanTitle: "Ändern Sie Ihren Plan",
      freeTrial: "Kostenlose Testversion",
      currentPlanBtn: "Aktueller Plan",
      selectBtn: "Auswählen",
      upgradeBtn: "Aktualisieren",
      perMonth: "/ Monat",
      passwordTitle: "Passwort ändern",
      currentPassLabel: "Aktuelles Passwort",
      newPassLabel: "Neues Passwort (Min. 8 Zeichen)",
      confirmPassLabel: "Neues Passwort bestätigen",
      updatePassBtn: "Passwort aktualisieren",
      updatingBtn: "Wird aktualisiert...",
      // Kategoriler
      cat1: "Arch. & Design", cat2: "Gesundheit", cat3: "Tech & Software", 
      cat4: "Mode", cat5: "Hobbys", cat6: "Sport", cat7: "Unterhaltung", cat8: "Bildung",
      // Plan Özellikleri
      stdFeature1: "3 Content Credits / Monat", stdFeature2: "Standardauflösung (720p)", stdFeature3: "Ausgabe mit Wasserzeichen",
      proFeature1: "50 Content Credits / Monat", proFeature2: "Hohe Auflösung (1080p)", proFeature3: "Priorität KI-Geschw. & Kein Wasserz.",
      goldFeature1: "200 Content Credits / Monat", goldFeature2: "Ultra-Auflösung (4K) & Markenkit", goldFeature3: "Premium-Support & Teammanagement"
    }
  };

  const t = translations[language as keyof typeof translations];

  const availableCategories = [
    t.cat1, t.cat2, t.cat3, t.cat4, t.cat5, t.cat6, t.cat7, t.cat8
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (!savedEmail) {
      window.location.href = "/login";
      return;
    }

    setEmail(savedEmail);
    setPlan(localStorage.getItem("userPlan") || "Standart");
    
    const savedCredits = localStorage.getItem("userCredits");
    setCredits(savedCredits ? parseInt(savedCredits) : 0);

    const savedCats = localStorage.getItem("userCategories");
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {
        setCategories([]);
      }
    }
  }, []);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
        setCategories(categories.filter(c => c !== cat));
    } else {
        if (categories.length < 3) setCategories([...categories, cat]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const res = await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, categories })
        });
        if (res.ok) {
            localStorage.setItem("userCategories", JSON.stringify(categories));
            localStorage.setItem("userLanguage", language);
            alert("✅ " + (language === 'tr' ? "Profil güncellendi" : language === 'en' ? "Profile updated" : "Profil aktualisiert"));
        } else {
            alert("Hata oluştu.");
        }
    } catch (error) { alert("Bağlantı hatası!"); }
    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword !== confirmPassword) return alert("Yeni şifreler uyuşmuyor!");
    
    if(newPassword.length < 8) return alert("Yeni şifreniz en az 8 karakterden oluşmalıdır!");
    
    setIsLoading(true);
    try {
        const res = await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, currentPassword, newPassword })
        });

        if (res.ok) {
            alert("✅ " + (language === 'tr' ? "Şifre değişti" : language === 'en' ? "Password changed" : "Passwort geändert"));
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        } else {
            const data = await res.json();
            alert("⚠️ " + data.error);
        }
    } catch (error) { alert("Bağlantı hatası!"); }
    setIsLoading(false);
  };

  const handleUpgradePlan = async (targetPlan: string) => {
    if(confirm(`Emin misiniz? / Are you sure?`)) {
        setIsLoading(true);
        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, plan: targetPlan })
            });
            if (res.ok) {
                const data = await res.json();
                setPlan(data.user.plan);
                setCredits(data.user.credits);
                localStorage.setItem("userPlan", data.user.plan);
                localStorage.setItem("userCredits", data.user.credits.toString());
                window.dispatchEvent(new Event("creditsUpdated")); 
                alert(`🎉 Başarılı / Success / Erfolg`);
            }
        } catch (error) { alert("Hata oluştu."); }
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-12 flex flex-col items-center">
      <DashboardNavbar />
      <main className="w-full max-w-5xl px-6 flex flex-col">
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{t.settingsTitle}</h1>
          <p className="text-gray-600 font-medium">{t.settingsDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col gap-2">
            <button onClick={() => setActiveTab("profil")} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === "profil" ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-white/60'}`}>{t.tabProfile}</button>
            <button onClick={() => setActiveTab("abonelik")} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === "abonelik" ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-white/60'}`}>{t.tabSubscription}</button>
            <button onClick={() => setActiveTab("sifre")} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === "sifre" ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-white/60'}`}>{t.tabPassword}</button>
          </div>

          <div className="md:col-span-3 glass-panel p-8 min-h-[400px]">
            {activeTab === "profil" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{t.tabProfile.replace('👤 ', '')}</h2>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">{t.appLangLabel}</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                      <button type="button" onClick={() => { setLanguage("tr"); localStorage.setItem("userLanguage", "tr"); }} className={`flex-1 py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 ${language === 'tr' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>🇹🇷 Türkçe</button>
                      <button type="button" onClick={() => { setLanguage("en"); localStorage.setItem("userLanguage", "en"); }} className={`flex-1 py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 ${language === 'en' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>🇬🇧 English</button>
                      <button type="button" onClick={() => { setLanguage("de"); localStorage.setItem("userLanguage", "de"); }} className={`flex-1 py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 ${language === 'de' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>🇩🇪 Deutsch</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.emailLabel}</label>
                  <input type="email" value={email} disabled className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none font-medium" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">{t.interestsLabel}</label>
                  <div className="flex flex-wrap gap-3">
                      {availableCategories.map((cat) => (
                          <button type="button" key={cat} onClick={() => toggleCategory(cat)} className={`px-5 py-3 rounded-full font-medium transition-all duration-200 border text-sm ${categories.includes(cat) ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md hover:opacity-90' : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white'}`}>{cat}</button>
                      ))}
                  </div>
                </div>
                
                <div className="pt-6">
                  <button type="submit" disabled={isLoading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all hover:scale-105 disabled:opacity-50">{isLoading ? t.savingBtn : t.saveChangesBtn}</button>
                </div>
              </form>
            )}

            {activeTab === "abonelik" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{t.tabSubscription.replace('💳 ', '')}</h2>
                <div className={`mb-10 p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white transition-all ${plan === 'Gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-xl shadow-yellow-400/30' : plan === 'Pro' ? 'bg-[var(--color-primary)] border-blue-400 shadow-xl shadow-blue-400/30' : 'bg-gray-800 border-gray-700 shadow-xl shadow-gray-900/30'}`}>
                  <div className="flex-1">
                    <p className="text-sm opacity-80 mb-1 font-medium">{t.currentPlanLabel}</p>
                    <h3 className="text-3xl font-extrabold mb-4">{plan.toUpperCase()} {t.packageLabel}</h3>
                    <ul className="text-sm space-y-2 opacity-90 mb-6">
                      {plan === "Standart" && (<><li className="flex items-center gap-2"><span>✔️</span> {t.stdFeature1}</li><li className="flex items-center gap-2"><span>✔️</span> {t.stdFeature2}</li><li className="flex items-center gap-2 text-gray-400"><span className="opacity-50">❌</span> {t.stdFeature3}</li></>)}
                      {plan === "Pro" && (<><li className="flex items-center gap-2"><span>✔️</span> {t.proFeature1}</li><li className="flex items-center gap-2"><span>✔️</span> {t.proFeature2}</li><li className="flex items-center gap-2"><span>✔️</span> {t.proFeature3}</li></>)}
                      {plan === "Gold" && (<><li className="flex items-center gap-2"><span>✔️</span> {t.goldFeature1}</li><li className="flex items-center gap-2"><span>✔️</span> {t.goldFeature2}</li><li className="flex items-center gap-2"><span>✔️</span> {t.goldFeature3}</li></>)}
                    </ul>
                    <div className="inline-block bg-black/20 px-5 py-2.5 rounded-xl border border-white/10">
                      <p className="text-base flex items-center gap-2"><span className="text-yellow-300 text-xl">⚡</span> {t.creditsLeft} <strong className="text-xl">{credits}</strong></p>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-xl text-gray-800 mb-6">{t.changePlanTitle}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan === "Standart" ? 'bg-gray-50 border-gray-300 opacity-60' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                        <h4 className="font-bold text-xl text-gray-800">Standart</h4><p className="text-sm text-gray-500 mb-4">{t.freeTrial}</p>
                        <div className="mt-auto">{plan === "Standart" ? <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed">{t.currentPlanBtn}</button> : <button onClick={() => handleUpgradePlan("Standart")} disabled={isLoading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50">{t.selectBtn}</button>}</div>
                    </div>
                    <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan === "Pro" ? 'bg-blue-50 border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-md' : 'bg-white border-gray-300 hover:border-[var(--color-primary)]'}`}>
                        <h4 className="font-bold text-xl text-gray-800">Pro</h4><p className="text-sm text-[var(--color-primary)] font-bold mb-4">₺199 {t.perMonth}</p>
                        <div className="mt-auto">{plan === "Pro" ? <button disabled className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold cursor-not-allowed opacity-80">{t.currentPlanBtn}</button> : <button onClick={() => handleUpgradePlan("Pro")} disabled={isLoading} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50">{t.upgradeBtn}</button>}</div>
                    </div>
                    <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan === "Gold" ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400/50 shadow-md' : 'bg-white border-gray-300 hover:border-yellow-500'}`}>
                        <h4 className="font-bold text-xl text-gray-800">Gold</h4><p className="text-sm text-yellow-600 font-bold mb-4">₺499 {t.perMonth}</p>
                        <div className="mt-auto">{plan === "Gold" ? <button disabled className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold cursor-not-allowed opacity-80">{t.currentPlanBtn}</button> : <button onClick={() => handleUpgradePlan("Gold")} disabled={isLoading} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-md disabled:opacity-50">{t.upgradeBtn}</button>}</div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === "sifre" && (
              <form onSubmit={handleChangePassword} className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{t.passwordTitle}</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.currentPassLabel}</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.newPassLabel}</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.confirmPassLabel}</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isLoading} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50">{isLoading ? t.updatingBtn : t.updatePassBtn}</button>
                </div>
              </form>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}