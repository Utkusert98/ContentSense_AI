"use client";

import { useState, useEffect } from "react";
import Link from "next/navigation"; // Link için next/link kullanımı daha doğrudur
import NextLink from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPlan, setSelectedPlan] = useState("Standart");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [language, setLanguage] = useState("tr");

    const categories = [
        "Mimari & Tasarım", "Sağlık & Besin Takviyesi",
        "Teknoloji & Yazılım", "Moda", "Hobi", "Spor", "Eğlence", "Eğitim"
    ];

    useEffect(() => {
        const savedLang = localStorage.getItem("userLanguage");
        if (savedLang) setLanguage(savedLang);

        const intervalId = setInterval(() => {
            const currentLang = localStorage.getItem("userLanguage") || "tr";
            if (currentLang !== language) setLanguage(currentLang);
        }, 500);

        return () => clearInterval(intervalId);
    }, [language]);

    const translations = {
        tr: {
            backHome: "← Ana Sayfa",
            step1Title: "Hesap Oluştur",
            step1Desc: "İçerik üretmeye başlamak için temel bilgilerinizi girin.",
            namePlaceholder: "Ad Soyad",
            nameWarn: "Sayı ve özel karakter yazmayın.",
            emailPlaceholder: "E-posta Adresi (Zorunlu)",
            passPlaceholder: "Şifre (Zorunlu)",
            passWarnVeryWeak: "Çok Zayıf", passWarnWeak: "Zayıf", passWarnMedium: "Orta", passWarnStrong: "Çok Güçlü",
            confirmPassPlaceholder: "Şifreyi Onayla (Zorunlu)",
            passMismatch: "Şifreler uyuşmuyor",
            rememberMe: "Hesabımı açık tut (Beni Hatırla)",
            or: "veya",
            continueGoogle: "Google ile Devam Et",
            step2Title: "İlgi Alanlarınızı Seçin",
            step2Desc: "Lütfen en az 1 kategori seçin.",
            categoriesArr: ["Mimari & Tasarım", "Sağlık & Besin Takviyesi", "Teknoloji & Yazılım", "Moda", "Hobi", "Spor", "Eğlence", "Eğitim"],
            step3Title: "Sistem Nasıl Çalışır?",
            howItWorks1: "Seçtiğiniz kategorilere göre yapay zeka fikir sunar.",
            howItWorks2: "Video mu yoksa metin/görsel mi istediğinizi seçersiniz.",
            howItWorks3: "Hedef platformunuzu belirtirsiniz.",
            howItWorks4: "Yapay zeka anında 3 farklı alternatif üretir!",
            step4Title: "Planınızı Seçin",
            freeTrial: "Ücretsiz Deneme",
            perMonth: "/ Ay",
            stdFeat1: "Ayda 3 İçerik Kredisi", stdFeat2: "Standart Çözünürlük", stdFeat3: "Filigranlı İndirme",
            proFeat1: "Sınırsız Üretim", proFeat2: "Yüksek Çözünürlük (4K)", proFeat3: "Filigransız İndirme", proFeat4: "Öncelikli YZ Hızı",
            goldFeat1: "Tüm Pro Özellikleri", goldFeat2: "Marka Kiti (Logo/Font)", goldFeat3: "Çoklu Ekip Yönetimi", goldFeat4: "Özel API Erişimi",
            btnBack: "Geri",
            btnNext: "İleri",
            btnSubmit: "Kayıt Ol ve Başla",
            btnSaving: "Kaydediliyor...",
            alertName: "⚠️ İsim alanına sadece harf girebilirsiniz. (Sayı ve özel karakter kullanılamaz)",
            alertEmail: "⚠️ Lütfen geçerli bir e-posta adresi girin.",
            alertPassMismatch: "⚠️ Şifreleriniz birbiriyle uyuşmuyor!",
            alertPassWeak: "⚠️ Lütfen daha güçlü bir şifre belirleyin. Şifreniz en az 8 karakter olmalı, büyük harf, sayı ve özel karakter (!@#$% vb.) içermelidir.",
            alertError: "Hata: ",
            alertConnection: "Bağlantı hatası yaşandı."
        },
        en: {
            backHome: "← Home",
            step1Title: "Create Account",
            step1Desc: "Enter your basic details to start creating content.",
            namePlaceholder: "Full Name",
            nameWarn: "Do not use numbers or special characters.",
            emailPlaceholder: "Email Address (Required)",
            passPlaceholder: "Password (Required)",
            passWarnVeryWeak: "Very Weak", passWarnWeak: "Weak", passWarnMedium: "Medium", passWarnStrong: "Very Strong",
            confirmPassPlaceholder: "Confirm Password (Required)",
            passMismatch: "Passwords do not match",
            rememberMe: "Keep me signed in (Remember Me)",
            or: "or",
            continueGoogle: "Continue with Google",
            step2Title: "Choose Your Interests",
            step2Desc: "Please select at least 1 category.",
            categoriesArr: ["Arch & Design", "Health & Supplements", "Tech & Software", "Fashion", "Hobbies", "Sports", "Entertainment", "Education"],
            step3Title: "How It Works?",
            howItWorks1: "AI suggests ideas based on your chosen categories.",
            howItWorks2: "You choose between video or text/image.",
            howItWorks3: "You specify your target platform.",
            howItWorks4: "AI instantly generates 3 different alternatives!",
            step4Title: "Choose Your Plan",
            freeTrial: "Free Trial",
            perMonth: "/ Month",
            stdFeat1: "3 Content Credits / Month", stdFeat2: "Standard Resolution", stdFeat3: "Watermarked Download",
            proFeat1: "Unlimited Creation", proFeat2: "High Resolution (4K)", proFeat3: "No Watermark", proFeat4: "Priority AI Speed",
            goldFeat1: "All Pro Features", goldFeat2: "Brand Kit (Logo/Font)", goldFeat3: "Multi-Team Management", goldFeat4: "Custom API Access",
            btnBack: "Back",
            btnNext: "Next",
            btnSubmit: "Sign Up & Start",
            btnSaving: "Saving...",
            alertName: "⚠️ Name field can only contain letters. (No numbers or special characters)",
            alertEmail: "⚠️ Please enter a valid email address.",
            alertPassMismatch: "⚠️ Your passwords do not match!",
            alertPassWeak: "⚠️ Please choose a stronger password. Must be at least 8 chars, include uppercase, number, and special character.",
            alertError: "Error: ",
            alertConnection: "Connection error occurred."
        },
        de: {
            backHome: "← Startseite",
            step1Title: "Konto erstellen",
            step1Desc: "Geben Sie Ihre Daten ein, um Inhalte zu erstellen.",
            namePlaceholder: "Vollständiger Name",
            nameWarn: "Verwenden Sie keine Zahlen oder Sonderzeichen.",
            emailPlaceholder: "E-Mail-Adresse (Erforderlich)",
            passPlaceholder: "Passwort (Erforderlich)",
            passWarnVeryWeak: "Sehr schwach", passWarnWeak: "Schwach", passWarnMedium: "Mittel", passWarnStrong: "Sehr stark",
            confirmPassPlaceholder: "Passwort bestätigen (Erforderlich)",
            passMismatch: "Passwörter stimmen nicht überein",
            rememberMe: "Angemeldet bleiben",
            or: "oder",
            continueGoogle: "Weiter mit Google",
            step2Title: "Wählen Sie Ihre Interessen",
            step2Desc: "Bitte wählen Sie mindestens 1 Kategorie.",
            categoriesArr: ["Arch. & Design", "Gesundheit", "Tech & Software", "Mode", "Hobbys", "Sport", "Unterhaltung", "Bildung"],
            step3Title: "Wie es funktioniert?",
            howItWorks1: "KI schlägt Ideen basierend auf Ihren Kategorien vor.",
            howItWorks2: "Sie wählen zwischen Video oder Text/Bild.",
            howItWorks3: "Sie geben Ihre Zielplattform an.",
            howItWorks4: "KI generiert sofort 3 verschiedene Alternativen!",
            step4Title: "Wählen Sie Ihren Plan",
            freeTrial: "Kostenlose Testversion",
            perMonth: "/ Monat",
            stdFeat1: "3 Content Credits / Monat", stdFeat2: "Standardauflösung", stdFeat3: "Download mit Wasserzeichen",
            proFeat1: "Unbegrenzte Erstellung", proFeat2: "Hohe Auflösung (4K)", proFeat3: "Kein Wasserzeichen", proFeat4: "Priorität KI-Geschwindigkeit",
            goldFeat1: "Alle Pro-Funktionen", goldFeat2: "Markenkit (Logo/Font)", goldFeat3: "Multi-Team-Management", goldFeat4: "Benutzerdefinierter API-Zugriff",
            btnBack: "Zurück",
            btnNext: "Weiter",
            btnSubmit: "Registrieren & Starten",
            btnSaving: "Speichern...",
            alertName: "⚠️ Das Namensfeld darf nur Buchstaben enthalten.",
            alertEmail: "⚠️ Bitte geben Sie eine gültige E-Mail ein.",
            alertPassMismatch: "⚠️ Ihre Passwörter stimmen nicht überein!",
            alertPassWeak: "⚠️ Bitte wählen Sie ein stärkeres Passwort. (Min. 8 Zeichen, Großbuchstabe, Zahl, Sonderzeichen).",
            alertError: "Fehler: ",
            alertConnection: "Verbindungsfehler aufgetreten."
        }
    };

    const t = translations[language as keyof typeof translations];

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length >= 8) score += 25; 
        if (/[A-Z]/.test(pass)) score += 25; 
        if (/[0-9]/.test(pass)) score += 25; 
        if (/[^A-Za-z0-9]/.test(pass)) score += 25; 
        return score;
    };
    const strength = calculateStrength(password);

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            if (selectedCategories.length < 3) setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleNextStep = () => {
        if (step === 1) {
            const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
            if (!name || !nameRegex.test(name)) return alert(t.alertName);
            if (!email) return alert(t.alertEmail);
            if (password !== confirmPassword) return alert(t.alertPassMismatch);
            if (strength < 100) return alert(t.alertPassWeak);
        }
        setStep(step + 1);
    };

    // GÜNCELLENDİ: Hata veren JSON okuma işlemi daha güvenli hale getirildi
    const handleRegisterAndStart = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        setIsLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    plan: selectedPlan, 
                    categories: selectedCategories 
                }),
            });

            // GÜNCELLENDİ: Yanıtı metin olarak oku, eğer boş değilse JSON parse et
            const textResponse = await res.text();
            const data = textResponse ? JSON.parse(textResponse) : {};

            if (res.ok) {
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userPlan", selectedPlan);
                localStorage.setItem("userCredits", selectedPlan === "Standart" ? "3" : "9999");
                if (selectedCategories.length > 0) {
                    localStorage.setItem("userCategories", JSON.stringify(selectedCategories));
                }
                
                window.location.href = "/dashboard";
            } else {
                alert(t.alertError + (data.error || "Sunucu hatası"));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Kayıt Hatası:", error);
            alert(t.alertConnection);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem("userEmail", "google-user@example.com");
            localStorage.setItem("userPlan", "Standart");
            localStorage.setItem("userCredits", "3");
            window.location.href = "/dashboard";
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f3f4f6]">
            <div className="glass-panel w-full max-w-2xl p-10 relative overflow-hidden z-50 bg-white/80 backdrop-blur-xl">
                
                <NextLink href="/" className="absolute top-6 left-6 text-gray-400 hover:text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 transition-colors">
                    {t.backHome}
                </NextLink>

                <div className="flex justify-between mb-8 mt-4 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>{num}</div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t.step1Title}</h2>
                        <p className="text-gray-500 mb-6">{t.step1Desc}</p>
                        <div className="space-y-4">
                            <div>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                                <p className="text-xs text-gray-500 mt-1 font-medium ml-1">{t.nameWarn}</p>
                            </div>
                            
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
                            
                            <div>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passPlaceholder} className="w-full p-4 pr-12 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full transition-all duration-300" style={{ width: `${strength}%`, backgroundColor: strength <= 25 ? '#ef4444' : strength === 50 ? '#f97316' : strength === 75 ? '#eab308' : '#22c55e' }}></div>
                                        </div>
                                        <p className="text-xs mt-1 font-bold text-right" style={{ color: strength <= 25 ? '#ef4444' : strength === 50 ? '#f97316' : strength === 75 ? '#eab308' : '#22c55e' }}>
                                            {strength <= 25 ? t.passWarnVeryWeak : strength === 50 ? t.passWarnWeak : strength === 75 ? t.passWarnMedium : t.passWarnStrong}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="relative">
                                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t.confirmPassPlaceholder} className={`w-full p-4 pr-12 rounded-xl border focus:outline-none focus:ring-2 transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 bg-white focus:ring-[var(--color-primary)]'}`} required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1 font-bold ml-1 absolute -bottom-5 left-0">{t.passMismatch}</p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium pt-4">
                                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 text-[var(--color-primary)]" />
                                {t.rememberMe}
                            </label>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">{t.or}</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <button onClick={handleGoogleLogin} disabled={isLoading} type="button" className="w-full p-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 font-bold text-gray-700 transition-all shadow-sm disabled:opacity-50">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                {t.continueGoogle}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t.step2Title}</h2>
                        <p className="text-gray-500 mb-6">{t.step2Desc} ({selectedCategories.length}/3)</p>
                        <div className="flex flex-wrap gap-3">
                            {t.categoriesArr.map((cat, index) => (
                                <button key={index} onClick={() => toggleCategory(categories[index])} className={`px-5 py-3 rounded-full font-medium transition-all duration-200 border ${selectedCategories.includes(categories[index]) ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{t.step3Title}</h2>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-left space-y-4 shadow-sm">
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">1.</span> {t.howItWorks1}</p>
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">2.</span> {t.howItWorks2}</p>
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">3.</span> {t.howItWorks3}</p>
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">4.</span> {t.howItWorks4}</p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">{t.step4Title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div onClick={() => setSelectedPlan("Standart")} className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col ${selectedPlan === "Standart" ? 'bg-white border-[var(--color-primary)] shadow-xl transform scale-105 ring-2 ring-[var(--color-primary)]/40' : 'bg-white/80 border-gray-300 opacity-80 hover:opacity-100'}`}>
                                <h3 className="font-bold text-xl text-gray-800">Standart</h3><p className="text-sm text-gray-500 mb-4">{t.freeTrial}</p>
                                <ul className="text-sm text-gray-600 space-y-3 flex-grow">
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.stdFeat1}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.stdFeat2}</li>
                                    <li className="flex items-center gap-2 text-gray-400"><span className="opacity-50">❌</span> {t.stdFeat3}</li>
                                </ul>
                            </div>
                            
                            <div onClick={() => setSelectedPlan("Pro")} className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-white flex flex-col ${selectedPlan === "Pro" ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-xl transform scale-105 ring-2 ring-[var(--color-primary)]/40' : 'bg-[var(--color-primary)]/80 border-transparent opacity-80 hover:opacity-100'}`}>
                                <h3 className="font-bold text-xl">Pro</h3><p className="text-sm text-blue-200 mb-4">₺199 {t.perMonth}</p>
                                <ul className="text-sm space-y-3 flex-grow">
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.proFeat1}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.proFeat2}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.proFeat3}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.proFeat4}</li>
                                </ul>
                            </div>
                            
                            <div onClick={() => setSelectedPlan("Gold")} className={`bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-white flex flex-col ${selectedPlan === "Gold" ? 'border-yellow-300 shadow-xl transform scale-105 ring-2 ring-yellow-400/50' : 'border-yellow-500 opacity-80 hover:opacity-100'}`}>
                                <h3 className="font-bold text-xl">Gold</h3><p className="text-sm text-yellow-100 mb-4">₺499 {t.perMonth}</p>
                                <ul className="text-sm space-y-3 flex-grow">
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.goldFeat1}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.goldFeat2}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.goldFeat3}</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> {t.goldFeat4}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10 flex justify-between items-center">
                    {step > 1 ? <button onClick={() => setStep(step - 1)} className="text-gray-500 font-semibold hover:text-gray-800 transition-colors">{t.btnBack}</button> : <div></div>}

                    {step < 4 ? <button disabled={step === 2 && selectedCategories.length === 0} onClick={handleNextStep} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 disabled:opacity-50">{t.btnNext}</button> : 
                    <button onClick={handleRegisterAndStart} disabled={isLoading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-800 transition-all text-center hover:scale-105 disabled:opacity-50 disabled:scale-100">
                        {isLoading ? t.btnSaving : t.btnSubmit}
                    </button>}
                </div>
            </div>
        </div>
    );
}