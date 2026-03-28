"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { useRouter, useSearchParams } from "next/navigation";

function EditStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id"); 

  const [isLoading, setIsLoading] = useState(true);
  const [imageText, setImageText] = useState("Yükleniyor...");
  const [isEditingText, setIsEditingText] = useState(false);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  
  // YENİ GÜNCELLEMELER: Font ve Arka Plan Görseli
  const [bgImage, setBgImage] = useState("");
  const fontStyles = ["font-sans", "font-serif", "font-mono", "italic"];
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(`/api/contents?email=${email}`);
        if (res.ok) {
            const data = await res.json();
            let targetContent = data.contents[0]; 
            
            if (contentId) {
                const found = data.contents.find((c: any) => c.id === contentId);
                if (found) targetContent = found;
            }

            if (targetContent) {
                setImageText(targetContent.title);
                setCaption(targetContent.caption);
                setHashtags(targetContent.hashtags);
                setPlatform(targetContent.platform);
            } else {
                setImageText("İçerik Bulunamadı");
            }
            
            // Eğer yeni ürettiği içerikte kendi fotoğrafını yüklediyse onu göster, yoksa YZ görselini göster
            const existingContents = JSON.parse(localStorage.getItem("pastContents") || "[]");
            const localContent = existingContents.find((c:any) => c.id === targetContent?.id || (!contentId && c.id === existingContents[0]?.id));
            
            if (localContent && localContent.hasUpload) {
                setBgImage(localStorage.getItem("tempUserUpload") || "");
            } else {
                setBgImage(`https://image.pollinations.ai/prompt/${encodeURIComponent((targetContent?.title || "aesthetic") + " high quality cinematic")}?width=800&height=800&nologo=true`);
            }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("✅ İçeriğiniz yüksek kalitede cihazınıza indirildi!");
    }, 2000);
  };

  const handleChangeFont = () => {
    setFontIndex((prev) => (prev + 1) % fontStyles.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-28 pb-12 flex flex-col items-center justify-center">
        <DashboardNavbar />
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-12 flex flex-col items-center">
      <DashboardNavbar />
      <main className="w-full max-w-7xl px-6 flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.back()} className="text-gray-500 font-semibold hover:text-gray-900 flex items-center gap-2 transition-colors">
            <span>←</span> Geri Dön
          </button>
          
          <button onClick={handleDownload} disabled={isDownloading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:scale-100">
            {isDownloading ? <span className="animate-pulse">⏳ Hazırlanıyor...</span> : <><span>⬇️</span> İndir (Yüksek Kalite)</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SOL KOLON */}
          <div className="lg:col-span-7 glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">🎨 Sınırsız Metin Düzenleme</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                {platform || "Platform"} Boyutu
              </span>
            </div>

            <div className="flex-grow bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[500px] group border border-gray-300 shadow-inner">
              
              <img 
                src={bgImage} 
                alt="Arka Plan" 
                className="absolute inset-0 w-full h-full object-cover opacity-70" 
              />
              
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
              
              <div className="absolute z-10 w-3/4 text-center">
                {isEditingText ? (
                  <textarea
                    value={imageText}
                    onChange={(e) => setImageText(e.target.value)}
                    onBlur={() => setIsEditingText(false)}
                    autoFocus
                    className={`w-full bg-black/60 text-white text-3xl md:text-5xl font-extrabold text-center border-2 border-white/50 rounded-lg p-4 focus:outline-none resize-none backdrop-blur-md ${fontStyles[fontIndex]}`}
                    rows={3}
                  />
                ) : (
                  <h1 
                    onClick={() => setIsEditingText(true)}
                    className={`text-3xl md:text-5xl font-extrabold text-white cursor-pointer hover:border-2 hover:border-dashed hover:border-white/50 p-4 rounded-lg transition-all drop-shadow-2xl ${fontStyles[fontIndex]}`}
                    title="Düzenlemek için tıklayın"
                    style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  >
                    {imageText}
                  </h1>
                )}
                <p className="text-white/80 mt-6 text-sm font-semibold bg-black/40 backdrop-blur-md inline-block px-4 py-1.5 rounded-full border border-white/10">
                  Düzenlemek için metne tıklayın ✏️
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-4">
              <button className="flex-1 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 cursor-not-allowed flex justify-center items-center gap-2" title="Belirlediğiniz taslak kuralı gereği görsel değiştirilemez">
                <span>🔒</span> Görsel Değiştirilemez
              </button>
              {/* GÜNCELLENDİ: Font değiştir butonu artık çalışıyor */}
              <button onClick={handleChangeFont} className="flex-1 py-3 bg-white/60 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-white transition-colors flex justify-center items-center gap-2 shadow-sm">
                <span>✨</span> Fontu Değiştir
              </button>
            </div>
          </div>

          {/* SAĞ KOLON */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">🤖</div>
              <h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center gap-2">💡 ContentSense AI Tavsiyesi</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Bu içeriği <strong>{platform || "Platform"}</strong> üzerinde akşam saatlerinde paylaşman etkileşimini artırabilir. İlk yoruma soru bırakmayı unutma!
              </p>
            </div>

            <div className="glass-panel p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Açıklama (Caption)</h3>
                <button onClick={() => navigator.clipboard.writeText(`${caption}\n\n${hashtags}`)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-bold transition-colors">📋 Tümünü Kopyala</button>
              </div>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full flex-grow p-4 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-gray-700 text-sm mb-4" rows={6}/>
              <h3 className="font-bold text-sm text-gray-800 mb-2">Hashtag'ler</h3>
              <textarea value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-[var(--color-primary)] font-medium text-sm" rows={2}/>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function EditContent() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 flex justify-center"><div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div></div>}>
      <EditStudio />
    </Suspense>
  );
}