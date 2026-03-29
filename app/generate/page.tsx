"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { useRouter } from "next/navigation";

export default function GenerateContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState(""); 
  const [platform, setPlatform] = useState("");
  const [promptText, setPromptText] = useState("");
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [tempImageUrls, setTempImageUrls] = useState<string[]>([]);
  
  const [userCategories, setUserCategories] = useState<string[]>(["Trendler", "Genel"]);
  const [aiAlternatives, setAiAlternatives] = useState<any[]>([]);

  const platforms = ["Instagram", "TikTok", "LinkedIn", "Twitter (X)"];

  const [language, setLanguage] = useState("tr");

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
      step1Tab: "1. Kategori",
      step2Tab: "2. Görsel & Detaylar",
      step1Title: "Hangi Kategoride Üretiyoruz?",
      step1Desc: "İlgi alanlarınızdan birini seçin.",
      btnContinue: "Devam Et →",
      step2Title: "İçeriği Oluşturalım",
      platformPlaceholder: "Platform Seçin...",
      imagesUploaded: "görsel yüklendi (Otomatik Algılandı)",
      uploadPrompt: "Görsellerinizi yükleyin (Birden fazla seçerseniz kaydırmalı post olur)",
      magicWords: "Sihirli Kelimeleriniz... (Örn: Görselin hissettirdiği atmosferi anlatan, okuyanları içine çekecek samimi bir hikaye kurgula ve metnin sonunda takipçilerle etkileşim yaratacak bir soru sor)",
      btnBack: "← Geri",
      btnGenerate: "✨ Yapay Zeka ile Üret",
      analyzingTitle: "Görselleriniz Analiz Ediliyor...",
      analyzingDesc: "Yapay zeka detayları inceliyor, lütfen bekleyin.",
      step3Title: "İşte Senin İçin 3 Alternatif",
      btnNewGenerate: "← Yeni Bir Şey Üret",
      alternative: "Alternatif",
      btnEdit: "✨ Bunu Düzenle",
      alertConnection: "Bağlantı hatası yaşandı."
    },
    en: {
      step1Tab: "1. Category",
      step2Tab: "2. Visuals & Details",
      step1Title: "Which Category Are We Creating For?",
      step1Desc: "Select one of your interests.",
      btnContinue: "Continue →",
      step2Title: "Let's Create Content",
      platformPlaceholder: "Select Platform...",
      imagesUploaded: "images uploaded (Auto Detected)",
      uploadPrompt: "Upload your images (Selecting multiple creates a carousel post)",
      magicWords: "Your Magic Words... (e.g., Craft a sincere story describing the atmosphere of the visual to draw readers in, and end with a question to create engagement)",
      btnBack: "← Back",
      btnGenerate: "✨ Generate with AI",
      analyzingTitle: "Analyzing Your Visual(s)...",
      analyzingDesc: "AI is examining the details, please wait.",
      step3Title: "Here Are 3 Alternatives For You",
      btnNewGenerate: "← Create Something New",
      alternative: "Alternative",
      btnEdit: "✨ Edit This",
      alertConnection: "Connection error occurred."
    },
    de: {
      step1Tab: "1. Kategorie",
      step2Tab: "2. Bilder & Details",
      step1Title: "Für welche Kategorie erstellen wir?",
      step1Desc: "Wählen Sie eines Ihrer Interessen.",
      btnContinue: "Weiter →",
      step2Title: "Lassen Sie uns Inhalte erstellen",
      platformPlaceholder: "Plattform auswählen...",
      imagesUploaded: "Bilder hochgeladen (Automatisch erkannt)",
      uploadPrompt: "Laden Sie Ihre Bilder hoch (Mehrere Bilder erstellen einen Karussell-Beitrag)",
      magicWords: "Ihre Zauberwörter... (z. B. Erstellen Sie eine aufrichtige Geschichte, die die Atmosphäre des Bildes beschreibt, um die Leser in den Bann zu ziehen, und schließen Sie mit einer Frage ab, um Interaktion zu erzeugen)",
      btnBack: "← Zurück",
      btnGenerate: "✨ Mit KI generieren",
      analyzingTitle: "Ihre Bilder werden analysiert...",
      analyzingDesc: "Die KI prüft die Details, bitte warten.",
      step3Title: "Hier sind 3 Alternativen für Sie",
      btnNewGenerate: "← Etwas Neues erstellen",
      alternative: "Alternative",
      btnEdit: "✨ Dies bearbeiten",
      alertConnection: "Verbindungsfehler aufgetreten."
    }
  };

  const t = translations[language as keyof typeof translations];

  const categoryTranslations: Record<string, Record<string, string>> = {
      tr: {
          "Mimari & Tasarım": "Mimari & Tasarım", "Sağlık & Besin Takviyesi": "Sağlık & Besin Takviyesi", "Teknoloji & Yazılım": "Teknoloji & Yazılım", "Moda": "Moda", "Hobi": "Hobi", "Spor": "Spor", "Eğlence": "Eğlence", "Eğitim": "Eğitim", "Trendler": "Trendler", "Genel": "Genel"
      },
      en: {
          "Mimari & Tasarım": "Arch & Design", "Sağlık & Besin Takviyesi": "Health & Supplements", "Teknoloji & Yazılım": "Tech & Software", "Moda": "Fashion", "Hobi": "Hobbies", "Spor": "Sports", "Eğlence": "Entertainment", "Eğitim": "Education", "Trendler": "Trends", "Genel": "General"
      },
      de: {
          "Mimari & Tasarım": "Arch. & Design", "Sağlık & Besin Takviyesi": "Gesundheit", "Teknoloji & Yazılım": "Tech & Software", "Moda": "Mode", "Hobi": "Hobbys", "Spor": "Sport", "Eğlence": "Unterhaltung", "Eğitim": "Bildung", "Trendler": "Trends", "Genel": "Allgemein"
      }
  };

  const getTranslatedCategory = (catName: string) => {
      return categoryTranslations[language]?.[catName] || catName;
  };

  useEffect(() => {
    const savedCategories = localStorage.getItem("userCategories");
    if (savedCategories) setUserCategories(JSON.parse(savedCategories));
    
    const savedAlts = sessionStorage.getItem("currentAlternatives");
    if (window.location.search.includes("step=3") && savedAlts) {
        setAiAlternatives(JSON.parse(savedAlts));
        const savedUrls = localStorage.getItem("tempUserUploads");
        if (savedUrls) setTempImageUrls(JSON.parse(savedUrls));
        setStep(3);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files).slice(0, 10);
        setUploadedImages(files.map(f => f.name));
        
        const tempUrls = files.map(f => URL.createObjectURL(f));
        setTempImageUrls(tempUrls);
        localStorage.setItem("tempUserUploads", JSON.stringify(tempUrls));

        const base64Promises = files.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(base64Promises).then(base64DataArray => {
            setBase64Images(base64DataArray);
        });
    }
  };

  const handleGenerate = async () => {
    const plan = localStorage.getItem("userPlan") || "Standart";
    const email = localStorage.getItem("userEmail");
    if (!email) return router.push("/login");

    setIsGenerating(true);

    try {
        const autoType = uploadedImages.length > 1 ? "Kaydırmalı (Carousel)" : "Tekli Görsel";

        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email, 
                type: autoType, 
                platform, 
                promptText, 
                category,
                images: base64Images 
            })
        });

        if (res.ok) {
            const data = await res.json();
            
            if (plan === "Standart") {
                localStorage.setItem("userCredits", data.newCredits.toString());
                window.dispatchEvent(new Event("creditsUpdated"));
            }

            setAiAlternatives(data.alternatives);
            sessionStorage.setItem("currentAlternatives", JSON.stringify(data.alternatives));

            const newContent = {
              id: data.content.id,
              type: data.content.type,
              platform: data.content.platform,
              title: data.content.title,
              date: "Az Önce",
              image: "📸", 
              hasUpload: uploadedImages.length > 0 ? true : false
            };
            
            const existingContents = JSON.parse(localStorage.getItem("pastContents") || "[]");
            localStorage.setItem("pastContents", JSON.stringify([newContent, ...existingContents]));

            setIsGenerating(false);
            setStep(3);
        } else {
            const errorData = await res.json();
            alert("⚠️ " + errorData.error);
            setIsGenerating(false);
        }
    } catch (error) {
        alert(t.alertConnection);
        setIsGenerating(false);
    }
  };

  const handleEditAlternative = (alt: any) => {
      localStorage.setItem("selectedAlternative", JSON.stringify(alt));
      router.push("/edit");
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-12 flex flex-col items-center">
      <DashboardNavbar />
      <main className="w-full max-w-4xl px-6 flex flex-col">
        <div className="glass-panel p-8 md:p-12 w-full relative overflow-hidden">
          
          {step < 3 && (
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200/50">
              <button onClick={() => setStep(1)} className={`font-bold transition-colors hover:text-[var(--color-primary)] ${step >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>{t.step1Tab}</button>
              <span className="text-gray-300">→</span>
              <button disabled={!category} onClick={() => setStep(2)} className={`font-bold transition-colors disabled:cursor-not-allowed ${step >= 2 ? 'text-[var(--color-primary)] hover:text-blue-600' : 'text-gray-400'}`}>{t.step2Tab}</button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t.step1Title}</h2>
              <p className="text-gray-500 mb-8">{t.step1Desc}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {userCategories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`p-6 rounded-2xl border-2 transition-all font-bold text-lg flex items-center justify-center text-center h-full min-h-[120px] hover:bg-white hover:shadow-sm ${category === cat ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] shadow-md' : 'border-gray-200 bg-white/50 text-gray-700'}`}>
                    {getTranslatedCategory(cat)}
                  </button>
                ))}
              </div>
              <button disabled={!category} onClick={() => setStep(2)} className="bg-gray-900 text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 disabled:opacity-50 transition-all">{t.btnContinue}</button>
            </div>
          )}

          {step === 2 && !isGenerating && (
            <div className="animate-fade-in text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t.step2Title}</h2>
              <div className="space-y-6">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 outline-none focus:border-[var(--color-primary)]"><option value="" disabled>{t.platformPlaceholder}</option>{platforms.map(p => <option key={p} value={p}>{p}</option>)}</select>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-white/50 transition-all">
                    <input type="file" id="fileUpload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <label htmlFor="fileUpload" className="cursor-pointer text-gray-600 flex flex-col items-center">
                        <span className="text-3xl block mb-2">📥</span>
                        {uploadedImages.length > 0 ? (
                            <span className="text-[var(--color-primary)] font-bold">{uploadedImages.length} {t.imagesUploaded}</span>
                        ) : (
                            <span>{t.uploadPrompt}</span>
                        )}
                    </label>
                </div>
                
                <textarea rows={4} placeholder={t.magicWords} value={promptText} onChange={(e) => setPromptText(e.target.value)} className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 outline-none focus:border-[var(--color-primary)] resize-none"></textarea>
                
              </div>
              <div className="flex justify-between items-center mt-8"><button onClick={() => setStep(1)} className="text-gray-500 font-semibold hover:text-black">{t.btnBack}</button><button disabled={!platform || !promptText || uploadedImages.length === 0} onClick={handleGenerate} className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50">{t.btnGenerate}</button></div>
            </div>
          )}

          {isGenerating && (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-pulse">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900">{t.analyzingTitle}</h2>
              <p className="text-gray-500 mt-2">{t.analyzingDesc}</p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                {/* GÜNCELLENDİ: Yazım hatası düzeltildi */}
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t.step3Title}</h2>
                <button onClick={() => { setStep(2); setAiAlternatives([]); sessionStorage.removeItem("currentAlternatives"); router.push('/generate'); }} className="text-sm text-gray-500 hover:text-gray-900 underline mt-2">{t.btnNewGenerate}</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiAlternatives.map((alt, index) => (
                  <div key={index} className="bg-white/80 rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:border-[var(--color-primary)] transition-all group h-full">
                    <div className="h-48 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                        <img src={tempImageUrls.length > 0 ? tempImageUrls[0] : `https://image.pollinations.ai/prompt/${encodeURIComponent(alt.title)}?width=400&height=250&nologo=true`} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <span className="text-white font-bold relative z-10 drop-shadow-md text-center px-4 leading-snug text-lg" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{alt.title}</span>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                        <h4 className="font-bold text-gray-900 mb-2">{t.alternative} {index + 1}</h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-4 leading-relaxed" title={alt.caption}>{alt.caption}</p>
                        <p className="text-xs text-[var(--color-primary)] font-bold mt-auto">{alt.hashtags}</p>
                    </div>
                    <div className="p-4 border-t flex gap-2">
                        <button onClick={() => handleEditAlternative(alt)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[var(--color-primary)] transition-colors flex justify-center items-center gap-2">
                          {t.btnEdit}
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}