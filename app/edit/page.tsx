"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { useRouter, useSearchParams } from "next/navigation";

function EditStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id"); 

  const [isLoading, setIsLoading] = useState(true);
  const [imageText, setImageText] = useState("");
  const [isEditingText, setIsEditingText] = useState(false);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [isDownloading, setIsDownloading] = useState(false);
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // METİN KONTROL STATE'LERİ (YENİ)
  const [textPosition, setTextPosition] = useState("items-center"); // items-start, items-center, items-end
  const [textSize, setTextSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [fontWeight, setFontWeight] = useState("font-extrabold");
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return window.location.href = "/login";

      // Önce localStorage'da kullanıcının seçtiği taze bir alternatif var mı bak
      const selectedAlt = localStorage.getItem("selectedAlternative");
      let targetContent: any = null;
      let hasUpload = false;

      if (selectedAlt && !contentId) {
          targetContent = JSON.parse(selectedAlt);
          const savedUploads = localStorage.getItem("tempUserUploads");
          hasUpload = savedUploads && JSON.parse(savedUploads).length > 0;
      } else {
          // Dashboard'dan geliyorsa DB'den çek
          try {
            const res = await fetch(`/api/contents?email=${email}`);
            if (res.ok) {
                const data = await res.json();
                targetContent = contentId ? data.contents.find((c: any) => c.id === contentId) : data.contents[0];
                const existingContents = JSON.parse(localStorage.getItem("pastContents") || "[]");
                const localContent = existingContents.find((c:any) => c.id === targetContent?.id);
                hasUpload = localContent?.hasUpload;
            }
          } catch (e) { console.error(e); }
      }

      if (targetContent) {
          setImageText(targetContent.title);
          setCaption(targetContent.caption);
          setHashtags(targetContent.hashtags);
          setPlatform(targetContent.platform || "Instagram");
      }

      // GÜNCELLENDİ: Gerçek görseli DB loguyla eşleştirme
      if (hasUpload) {
          const savedUploads = localStorage.getItem("tempUserUploads");
          if (savedUploads) setBgImages(JSON.parse(savedUploads));
      } else {
          setBgImages([`https://image.pollinations.ai/prompt/${encodeURIComponent((targetContent?.title || "aesthetic") + " high quality cinematic")}?width=800&height=800&nologo=true`]);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [contentId]);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => { setIsDownloading(false); alert("✅ İçeriğiniz yüksek kalitede cihazınıza indirildi!"); }, 2000);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bgImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bgImages.length) % bgImages.length);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex justify-center items-center">
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
          <div className="flex gap-4">
              <button onClick={() => router.push('/dashboard')} className="text-gray-500 font-semibold hover:text-gray-900 flex items-center gap-2 transition-colors border-r pr-4 border-gray-300">
                <span>←</span> İçeriklerim
              </button>
              {/* YENİ: Alternatiflere Geri Dön */}
              <button onClick={() => router.push('/generate')} className="text-[var(--color-primary)] font-bold hover:text-blue-700 transition-colors">
                Geri: 3 Alternatife Dön
              </button>
          </div>
          
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
                {platform} Boyutu
              </span>
            </div>

            {/* GÜNCELLENDİ: Blur kaldırıldı, textPosition eklendi */}
            <div className={`flex-grow bg-gray-900 rounded-xl relative overflow-hidden flex justify-center ${textPosition} min-h-[500px] group border border-gray-300 shadow-inner p-8`}>
              
              <img src={bgImages[currentSlide]} alt="Arka Plan" className="absolute inset-0 w-full h-full object-cover" />
              
              {bgImages.length > 1 && (
                  <>
                      <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all font-bold text-xl">{"<"}</button>
                      <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all font-bold text-xl">{">"}</button>
                      <div className="absolute bottom-6 z-20 flex gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                          {bgImages.map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`} />))}
                      </div>
                  </>
              )}

              {/* Sadece yazının okunmasını sağlayan çok hafif karartma, BLUR YOK */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
              
              <div className="relative z-10 w-full text-center group">
                {isEditingText ? (
                  <textarea
                    value={imageText}
                    onChange={(e) => setImageText(e.target.value)}
                    onBlur={() => setIsEditingText(false)}
                    autoFocus
                    style={{ fontSize: `${textSize}px` }}
                    className={`w-full bg-black/40 text-white text-center border-2 border-dashed border-white/80 p-2 focus:outline-none resize-none backdrop-blur-sm ${fontFamily} ${fontWeight} ${isItalic ? 'italic' : ''}`}
                    rows={3}
                  />
                ) : (
                  <h1 
                    onClick={() => setIsEditingText(true)}
                    style={{ fontSize: `${textSize}px`, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}
                    className={`text-white cursor-pointer border-2 border-transparent hover:border-dashed hover:border-white/50 p-2 transition-all drop-shadow-2xl ${fontFamily} ${fontWeight} ${isItalic ? 'italic' : ''}`}
                    title="Düzenlemek için tıklayın"
                  >
                    {imageText}
                  </h1>
                )}
              </div>
            </div>
            
            {/* YENİ: Profesyonel Metin Denetleyici (Text Inspector) Paneli */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Metin Kontrolleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Konum */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700">Konum</label>
                        <select value={textPosition} onChange={(e) => setTextPosition(e.target.value)} className="p-2 border rounded-lg text-sm bg-white focus:border-[var(--color-primary)] outline-none">
                            <option value="items-start">Üstte</option>
                            <option value="items-center">Ortada</option>
                            <option value="items-end">Altta</option>
                        </select>
                    </div>

                    {/* Font Ailesi */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700">Yazı Tipi</label>
                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="p-2 border rounded-lg text-sm bg-white focus:border-[var(--color-primary)] outline-none">
                            <option value="font-sans">Modern (Sans)</option>
                            <option value="font-serif">Klasik (Serif)</option>
                            <option value="font-mono">Kod (Mono)</option>
                        </select>
                    </div>

                    {/* Kalınlık & İtalik */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700">Stil</label>
                        <div className="flex gap-2">
                            <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} className="p-2 border rounded-lg text-sm bg-white flex-1 outline-none">
                                <option value="font-normal">İnce</option>
                                <option value="font-bold">Kalın</option>
                                <option value="font-extrabold">Çok Kalın</option>
                            </select>
                            <button onClick={() => setIsItalic(!isItalic)} className={`p-2 border rounded-lg text-sm font-serif italic ${isItalic ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-gray-700'}`}>I</button>
                        </div>
                    </div>

                    {/* Boyut Slider */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700 flex justify-between">Boyut <span>{textSize}px</span></label>
                        <input type="range" min="20" max="80" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full mt-2 accent-[var(--color-primary)]" />
                    </div>

                </div>
            </div>
          </div>

          {/* SAĞ KOLON: Caption (Açıklama) Amacını Belirttik */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">🤖</div>
              <h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center gap-2">💡 ContentSense AI Tavsiyesi</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Aşağıdaki alan, bu görseli <strong>{platform}</strong> üzerinde paylaşırken <strong>gönderinin altına yapıştıracağın</strong> gerçek açıklama metnidir (Caption).
              </p>
            </div>

            <div className="glass-panel p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Gönderi Metni (Caption)</h3>
                    <p className="text-xs text-gray-500 font-medium">Bu metni kopyalayıp Instagram/LinkedIn vb. yapıştırın.</p>
                </div>
                <button onClick={() => navigator.clipboard.writeText(`${caption}\n\n${hashtags}`)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">📋 Tümünü Kopyala</button>
              </div>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full flex-grow p-4 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-gray-700 text-sm mb-4 leading-relaxed shadow-inner" rows={6}/>
              <h3 className="font-bold text-sm text-gray-800 mb-2">Hashtag'ler</h3>
              <textarea value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-[var(--color-primary)] font-bold text-sm shadow-inner" rows={2}/>
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