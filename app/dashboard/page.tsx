"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import Link from "next/link";

export default function Dashboard() {
  const [pastContents, setPastContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // YENİ: Seçilen dili hafızadan okuyan state
  const [language, setLanguage] = useState("tr");

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

  // YENİ: Dashboard Metinleri İçin Akıllı Sözlük
  const translations = {
    tr: {
      welcomeTitle: "Hoş Geldin! 👋",
      welcomeDesc: "Paneline ulaştın. Sağ üstten kredilerini kontrol edebilirsin.",
      btnNewContentMobile: "Yeni İçerik Üret",
      recentContents: "📂 Son Üretilen İçerikler",
      btnEdit: "Düzenle",
      noContentTitle: "Henüz İçerik Yok",
      noContentDesc: "İlk içeriğini üretmek için sağdaki butona tıkla!",
      newContentCardTitle: "Yeni İçerik",
      newContentCardDesc: "Yapay zeka ile sihir yarat"
    },
    en: {
      welcomeTitle: "Welcome! 👋",
      welcomeDesc: "You've reached your dashboard. You can check your credits from the top right.",
      btnNewContentMobile: "Create New Content",
      recentContents: "📂 Recently Generated Contents",
      btnEdit: "Edit",
      noContentTitle: "No Content Yet",
      noContentDesc: "Click the button on the right to create your first content!",
      newContentCardTitle: "New Content",
      newContentCardDesc: "Create magic with AI"
    },
    de: {
      welcomeTitle: "Willkommen! 👋",
      welcomeDesc: "Sie haben Ihr Dashboard erreicht. Oben rechts können Sie Ihr Guthaben prüfen.",
      btnNewContentMobile: "Neuen Inhalt erstellen",
      recentContents: "📂 Kürzlich generierte Inhalte",
      btnEdit: "Bearbeiten",
      noContentTitle: "Noch keine Inhalte",
      noContentDesc: "Klicken Sie auf die Schaltfläche rechts, um Ihren ersten Inhalt zu erstellen!",
      newContentCardTitle: "Neuer Inhalt",
      newContentCardDesc: "Erschaffe Magie mit KI"
    }
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const fetchContents = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
          window.location.href = "/login";
          return;
      }

      try {
        const res = await fetch(`/api/contents?email=${email}`);
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.contents && Array.isArray(data.contents)) {
              const localContents = JSON.parse(localStorage.getItem("pastContents") || "[]");
              const merged = data.contents.map((dbItem: any) => {
                  const match = localContents.find((lc: any) => lc.id === dbItem.id);
                  return { ...dbItem, hasUpload: match?.hasUpload || false };
              });
              setPastContents(merged);
          } else {
              setPastContents([]);
          }
        }
      } catch (error) {
        console.error("İçerikler çekilemedi:", error);
        setPastContents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  // GÜNCELLENDİ: Tarih formatı da seçilen dile göre (tr-TR, en-US, de-DE) şekilleniyor!
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    const locale = language === 'en' ? 'en-US' : language === 'de' ? 'de-DE' : 'tr-TR';
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  const getDisplayImage = (content: any) => {
      if (content.hasUpload) {
          const uploads = JSON.parse(localStorage.getItem("tempUserUploads") || "[]");
          if (uploads.length > 0) return uploads[0]; 
      }
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(content.title + " high quality aesthetic modern")}?width=400&height=250&nologo=true`;
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-12 flex flex-col items-center">
      <DashboardNavbar />
      <main className="w-full max-w-7xl px-6 flex flex-col">
        
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{t.welcomeTitle}</h1>
            <p className="text-gray-600 font-medium">{t.welcomeDesc}</p>
          </div>
          <Link href="/generate" className="md:hidden bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-all w-full text-center flex justify-center items-center gap-2">
            <span>✨</span> {t.btnNewContentMobile}
          </Link>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">{t.recentContents}</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {pastContents.length > 0 ? (
                pastContents.map((content) => (
                  <div key={content.id} className="glass-panel p-0 hover:border-[var(--color-primary)] transition-colors cursor-pointer group flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md">
                    
                    <div className="h-48 w-full bg-gray-900 relative overflow-hidden">
                        <img 
                            src={getDisplayImage(content)} 
                            alt={content.title} 
                            onError={(e) => { e.currentTarget.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(content.title)}?width=400&height=250&nologo=true`; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                        />
                        <div className="absolute top-3 right-3">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-sm border border-white/50">
                                {content.platform}
                            </span>
                        </div>
                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-sm shadow-sm border border-white/50">
                            {content.type.includes("Video") ? "🎬" : "📸"}
                        </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col bg-white/40">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1" title={content.title}>{content.title}</h3>
                      <p className="text-sm text-[var(--color-primary)] font-medium mb-4">{content.type}</p>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200/50">
                        <span className="text-xs text-gray-500 font-medium">{formatDate(content.createdAt)}</span>
                        <Link href={`/edit?id=${content.id}`} className="text-gray-900 font-bold text-sm hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                            {t.btnEdit} <span className="text-lg">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center h-full opacity-70 min-h-[250px]">
                  <div className="text-4xl mb-3">👻</div>
                  <h3 className="font-bold text-gray-800">{t.noContentTitle}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t.noContentDesc}</p>
                </div>
              )}

              <Link href="/generate" className="glass-panel p-0 border-dashed border-2 border-gray-300 hover:border-[var(--color-primary)] bg-white/20 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[300px] opacity-80 hover:opacity-100 group">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-[var(--color-primary)] text-3xl font-light">+</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">{t.newContentCardTitle}</h3>
                <p className="text-sm text-gray-500 mt-1">{t.newContentCardDesc}</p>
              </Link>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}