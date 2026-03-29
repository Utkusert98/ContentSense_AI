"use client";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState("tr");

  useEffect(() => {
    setIsMounted(true);
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
      heroTitlePart1: "İçeriğinizi ",
      heroTitleHighlight: "Yapay Zeka",
      heroTitlePart2: " ile Şekillendirin",
      heroSubtitle: "Mimari, moda, teknoloji veya hobi... Sektörünüz ne olursa olsun, ContentSense AI ile saniyeler içinde etkileyici Reels videoları ve gönderiler oluşturun.",
      whyTitle: "Neden ContentSense AI?",
      feat1Title: "3 Farklı Alternatif",
      feat1Desc: "Tek bir prompt ile yetinmeyin. Sistem size her zaman 3 farklı video veya görsel sunar.",
      feat2Title: "Platforma Özel Üretim",
      feat2Desc: "İçeriğinizin nerede paylaşılacağını seçin. Instagram veya LinkedIn için saniyeler içinde hazır.",
      feat3Title: "Sınırsız Düzenleme",
      feat3Desc: "Oluşturulan içeriklerin metinlerini ve görsellerini platform üzerinden anında düzenleyin.",
      terms: "Kullanım Koşulları",
      contact: "İletişim",
      
      showcase: [
        { title: "Modern İç Mimari", tag: "#mimari #içmekan", type: "Görsel (Mimari)", media: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Üretken Setup", tag: "#teknoloji #yazılım", type: "Görsel (Teknoloji)", media: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Sokak Modası", tag: "#moda #tarz", type: "Görsel (Moda)", media: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Geleceğin Ofisleri", tag: "#mimari #ofis", type: "Görsel (Mimari)", media: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Fitness Motivasyonu", tag: "#spor #sağlık", type: "Görsel (Spor)", media: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Odaklanmış Eğitim", tag: "#eğitim #yazılım", type: "Görsel (Eğitim)", media: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop", isVideo: false }
      ]
    },
    en: {
      heroTitlePart1: "Shape Your Content with ",
      heroTitleHighlight: "Artificial Intelligence",
      heroTitlePart2: "",
      heroSubtitle: "Architecture, fashion, tech, or hobbies... Whatever your industry, create stunning Reels and posts in seconds with ContentSense AI.",
      whyTitle: "Why ContentSense AI?",
      feat1Title: "3 Different Alternatives",
      feat1Desc: "Don't settle for a single prompt. The system always provides you with 3 distinct video or image options.",
      feat2Title: "Platform-Specific Generation",
      feat2Desc: "Choose where your content will be shared. Ready for Instagram or LinkedIn in seconds.",
      feat3Title: "Unlimited Editing",
      feat3Desc: "Instantly edit the texts and visuals of generated content directly on the platform.",
      terms: "Terms of Service",
      contact: "Contact",

      showcase: [
        { title: "Modern Interior", tag: "#architecture #interior", type: "Image (Arch)", media: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Productive Setup", tag: "#tech #software", type: "Image (Tech)", media: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Street Fashion", tag: "#fashion #style", type: "Image (Fashion)", media: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Offices of Future", tag: "#architecture #office", type: "Image (Arch)", media: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Fitness Motivation", tag: "#sports #health", type: "Image (Sports)", media: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Focused Education", tag: "#education #software", type: "Image (Edu)", media: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop", isVideo: false }
      ]
    },
    de: {
      heroTitlePart1: "Gestalten Sie Ihre Inhalte mit ",
      heroTitleHighlight: "Künstlicher Intelligenz",
      heroTitlePart2: "",
      heroSubtitle: "Architektur, Mode, Technologie oder Hobbys... Was auch immer Ihre Branche ist, erstellen Sie mit ContentSense AI in Sekundenschnelle atemberaubende Reels und Beiträge.",
      whyTitle: "Warum ContentSense AI?",
      feat1Title: "3 Verschiedene Alternativen",
      feat1Desc: "Geben Sie sich nicht mit einer einzigen Eingabeaufforderung zufrieden. Das System bietet Ihnen immer 3 verschiedene Video- oder Bildoptionen.",
      feat2Title: "Plattformspezifische Erstellung",
      feat2Desc: "Wählen Sie, wo Ihre Inhalte geteilt werden sollen. In Sekundenschnelle bereit für Instagram oder LinkedIn.",
      feat3Title: "Unbegrenzte Bearbeitung",
      feat3Desc: "Bearbeiten Sie die Texte und Grafiken der generierten Inhalte sofort direkt auf der Plattform.",
      terms: "Nutzungsbedingungen",
      contact: "Kontakt",

      showcase: [
        { title: "Modernes Interieur", tag: "#architektur #innen", type: "Bild (Arch)", media: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Produktives Setup", tag: "#tech #software", type: "Bild (Tech)", media: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Straßenmode", tag: "#mode #stil", type: "Bild (Mode)", media: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Büros der Zukunft", tag: "#architektur #büro", type: "Bild (Arch)", media: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Fitness Motivation", tag: "#sport #gesundheit", type: "Bild (Sport)", media: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", isVideo: false },
        { title: "Fokussierte Bildung", tag: "#bildung #software", type: "Bild (Bildung)", media: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop", isVideo: false }
      ]
    }
  };

  // Sunucu ve istemci uyuşmazlığını önleyen temel mantık
  const currentLang = isMounted ? language : "tr";
  const t = translations[currentLang as keyof typeof translations] || translations.tr;
    
  return (
    <div className="min-h-screen bg-transparent pt-28 pb-0 flex flex-col items-center overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-7xl px-6 flex flex-col items-center text-center">
        
        {/* GÜNCELLENDİ: Hydration hatasını önlemek için span parçalaması kaldırıldı, tek blok yapıldı */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight" suppressHydrationWarning>
          {t.heroTitlePart1}
          <span className="text-[var(--color-primary)]">{t.heroTitleHighlight}</span>
          {t.heroTitlePart2}
        </h1>
        
        <p className="text-xl text-gray-600 mb-16 max-w-2xl font-medium" suppressHydrationWarning>
          {t.heroSubtitle}
        </p>

        <div className="w-full overflow-hidden pb-20 relative select-none pointer-events-none">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#f3f4f6] to-transparent z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#f3f4f6] to-transparent z-10"></div>
          
          <div className="animate-infinite-scroll flex gap-8">
            {[...t.showcase, ...t.showcase].map((item, index) => (
              <div key={index} className="glass-panel w-[320px] h-[568px] flex-shrink-0 flex flex-col relative overflow-hidden rounded-3xl border-2 border-white/60 shadow-xl">
                
                <div className="absolute inset-0 bg-gray-900">
                  {item.isVideo ? (
                    <video src={item.media} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <img src={item.media} alt={item.title} className="w-full h-full object-cover opacity-80" />
                  )}
                </div>

                <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white text-left`}>
                  <div className="mb-3 inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-xs font-bold shadow-sm" suppressHydrationWarning>
                    {item.isVideo ? '🎬 ' : '📸 '} {item.type}
                  </div>
                  <p className="font-extrabold text-2xl leading-tight mb-2 drop-shadow-md" suppressHydrationWarning>{item.title}</p>
                  <p className="text-sm text-[var(--color-primary)] font-bold drop-shadow-md" suppressHydrationWarning>{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="w-full py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12" suppressHydrationWarning>{t.whyTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">💡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" suppressHydrationWarning>{t.feat1Title}</h3>
              <p className="text-gray-600" suppressHydrationWarning>{t.feat1Desc}</p>
            </div>
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" suppressHydrationWarning>{t.feat2Title}</h3>
              <p className="text-gray-600" suppressHydrationWarning>{t.feat2Desc}</p>
            </div>
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" suppressHydrationWarning>{t.feat3Title}</h3>
              <p className="text-gray-600" suppressHydrationWarning>{t.feat3Desc}</p>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="w-full border-t border-gray-200/50 bg-white/30 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0 font-bold text-gray-800">
            <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-white text-xs">C</div>
            ContentSense AI
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors" suppressHydrationWarning>{t.terms}</a>
            <a href="#" className="hover:text-gray-900 transition-colors" suppressHydrationWarning>{t.contact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}