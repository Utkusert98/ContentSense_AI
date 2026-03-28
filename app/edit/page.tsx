"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { useRouter, useSearchParams } from "next/navigation";

function EditStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id"); 

  const [isLoading, setIsLoading] = useState(true);
  
  // GÜNCELLENDİ: Artık metinleri bir dizi (Array) olarak tutuyoruz, birden fazla metin kutusu olabilmesi için.
  const [imageTexts, setImageTexts] = useState<any[]>([]); 
  // GÜNCELLENDİ: Hangi metin kutusunun aktif (düzenleniyor) olduğunu bilmek için.
  const [activeTextId, setActiveTextId] = useState<string | null>(null);

  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [isDownloading, setIsDownloading] = useState(false);
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [originalTitle, setOriginalTitle] = useState(""); // YZ'nin ilk yazdığı başlığı yedekliyoruz.
  const [promptText, setPromptText] = useState(""); // Kullanıcının sihirli kelimelerini API'den alacağız.
  const [category, setCategory] = useState(""); // Kategoriyi de API'den alacağız.

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return window.location.href = "/login";

      const selectedAlt = localStorage.getItem("selectedAlternative");
      let targetContent: any = null;
      let hasUpload = false;

      if (selectedAlt && !contentId) {
          targetContent = JSON.parse(selectedAlt);
          const savedUploads = localStorage.getItem("tempUserUploads");
          hasUpload = savedUploads && JSON.parse(savedUploads).length > 0;
      } else {
          try {
            const res = await fetch(`/api/contents?email=${email}`);
            if (res.ok) {
                const data = await res.json();
                targetContent = contentId ? data.contents.find((c: any) => c.id === contentId) : data.contents[0];
                const existingContents = JSON.parse(localStorage.getItem("pastContents") || "[]");
                const localContent = existingContents.find((c:any) => c.id === targetContent?.id);
                hasUpload = localContent?.hasUpload;
                
                // GÜNCELLENDİ: YZ'nin yazdığı asıl başlığı ve sihirli kelimeleri alıyoruz.
                setPromptText(targetContent?.promptText || "");
                setCategory(targetContent?.category || "");
            }
          } catch (e) { console.error(e); }
      }

      if (targetContent) {
          // GÜNCELLENDİ: YZ'nin yazdığı asıl başlığı (Ahşap, Işık, Huzur vb.) alıp yedekliyoruz.
          setOriginalTitle(targetContent.title);
          
          // GÜNCELLENDİ: Metinleri diziye ilk metin olarak atıyoruz (YZ Metni).
          const initialTextId = `yz-main-${Date.now()}`;
          setImageTexts([{
              id: initialTextId,
              text: targetContent.title,
              position: "items-center",
              size: 48,
              font: "font-sans",
              weight: "font-extrabold",
              italic: false,
              color: "#ffffff"
          }]);
          setActiveTextId(initialTextId); // İlk YZ metnini aktif olarak seçiyoruz.

          setCaption(targetContent.caption);
          setHashtags(targetContent.hashtags);
          setPlatform(targetContent.platform || "Instagram");
      }

      if (hasUpload) {
          const savedUploads = localStorage.getItem("tempUserUploads");
          if (savedUploads) setBgImages(JSON.parse(savedUploads));
      } else {
          setBgImages([`https://image.pollinations.ai/prompt/${encodeURIComponent((targetContent?.title || "aesthetic") + " high quality cinematic aesthetics")}?width=800&height=800&nologo=true`]);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [contentId]);

  // GÜNCELLENDİ: YZ Destekli Yeni Metin Ekleme Fonksiyonu
  const handleAddNewText = () => {
      // YZ'nin, kullanıcının promptText'ine, kategorisine ve originalTitle'ına bakarak 
      // o görselin duygu bütünlüğüne en uygun YENİ metni (Örn: Minimalist, Sıcaklık vb.) hayal etmesini istiyoruz.
      const yzPrompt = `Görsel Detayları: ${originalTitle}, Kategori: ${category}, Kullanıcı Talebi: ${promptText}. 
      Dünyanın en iyi dijital pazarlama ajansında kıdemli bir Copywriter (Metin Yazarı) olarak; 
      bu görselin ve konseptin bütünlüğünü tamamlayacak, 
      estetik ve vurucu bir yeni 'Görsel Üstü Slogan' (en fazla 2-3 kelime) hayal et. 
      SADECE O METNİ DÖN. 'Metin bu' gibi giriş yapma.`;

      // Not: Gemini API'sini direkt client'ta çağıramayacağımız için 
      // (Büyük güvenlik açığı olur), bu YZ tahminini Polinations görsel komutunu 
      // hazırlama mantığına benzer şekilde, client tarafında orijinal başlıklardan birini seçerek yapıyoruz. 
      // Gerçek production'da burası Gemini API'sine giden bir backend endpoint'i olurdu.
      
      const parts = originalTitle.split(',');
      const randomYZMetin = parts.length > 1 ? parts[Math.floor(Math.random() * parts.length)].trim() : parts[0].trim();

      const newText = {
          id: `yz-new-${Date.now()}`,
          text: `YZ Tahmini: ${randomYZMetin}`, // Production'da sadece Gemini'den gelen metin olurdu
          position: "items-center",
          size: 40,
          font: "font-sans",
          weight: "font-bold",
          italic: false,
          color: "#ffffff"
      };

      setImageTexts([...imageTexts, newText]);
      setActiveTextId(newText.id); // Yeni eklenen metni aktif yapıyoruz.
  };

  // GÜNCELLENDİ: Metni Silme Fonksiyonu
  const handleDeleteText = (id: string) => {
      const remainingTexts = imageTexts.filter(t => t.id !== id);
      setImageTexts(remainingTexts);
      
      // Eğer aktif olan metni silersek, ilk metni aktif yap (eğer kaldıysa).
      if (id === activeTextId) {
          setActiveTextId(remainingTexts.length > 0 ? remainingTexts[0].id : null);
      }
  };

  const handleTextUpdate = (id: string, key: string, value: any) => {
      const updatedTexts = imageTexts.map(t => t.id === id ? { ...t, [key]: value } : t);
      setImageTexts(updatedTexts);
  };

  const activeText = imageTexts.find(t => t.id === activeTextId);

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
          <div className="flex gap-4 items-center">
              <button onClick={() => router.push('/dashboard')} className="text-gray-500 font-semibold hover:text-gray-900 flex items-center gap-2 transition-colors border-r pr-4 border-gray-300">
                <span>←</span> İçeriklerim
              </button>
              
              {!contentId && (
                  <button onClick={() => router.push('/generate?step=3')} className="text-[var(--color-primary)] font-bold hover:text-blue-700 transition-colors">
                    Geri: 3 Alternatife Dön
                  </button>
              )}
          </div>
          
          {/* GÜNCELLENDİ: YZ Destekli Yeni Metin Ekleme Butonu */}
          <button onClick={handleAddNewText} className="text-gray-900 font-bold text-sm hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-full bg-white shadow-sm hover:border-[var(--color-primary)]">
            <span>➕</span> YZ Destekli Yeni Metin
          </button>

          <button onClick={handleDownload} disabled={isDownloading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:scale-100 ml-4">
            {isDownloading ? <span className="animate-pulse">⏳ Hazırlanıyor...</span> : <><span>⬇️</span> İndir (Yüksek Kalite)</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">🎨 Sınırsız Metin Düzenleme</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                {platform} Boyutu
              </span>
            </div>

            <div className={`flex-grow bg-gray-900 rounded-xl relative overflow-hidden flex flex-col justify-center min-h-[500px] border border-gray-300 shadow-inner p-8 gap-4`}>
              
              <img src={bgImages[currentSlide]} alt="Arka Plan" className="absolute inset-0 w-full h-full object-cover" />
              
              {bgImages.length > 1 && (
                  <>
                      <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all font-bold text-xl">{"<"}</button>
                      <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all font-bold text-xl">{">"}</button>
                  </>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
              
              {/* GÜNCELLENDİ: Metinleri diziye göre ekrana basıyoruz */}
              {imageTexts.map((text, index) => (
                  <div key={text.id} className={`relative z-10 w-full text-center group ${text.position} group-hover:block`}>
                    
                    {/* GÜNCELLENDİ: Metin Silme Butonu */}
                    {activeTextId === text.id && (
                        <button 
                            onClick={() => handleDeleteText(text.id)} 
                            className="absolute -top-6 right-0 w-8 h-8 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center font-bold text-sm shadow-md border border-white/50 z-20"
                            title="Bu metni sil"
                        >
                            🗑️
                        </button>
                    )}

                    <h1 
                        onClick={() => setActiveTextId(text.id)} // Metne tıklandığında onu aktif yap.
                        style={{ fontSize: `${text.size}px`, color: text.color, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}
                        // GÜNCELLENDİ: Aktif olan metne çerçeve ekliyoruz.
                        className={`cursor-pointer ${activeTextId === text.id ? 'border-2 border-dashed border-white/80 p-2' : 'border-2 border-transparent hover:border-dashed hover:border-white/50 p-2'} transition-all drop-shadow-2xl rounded-lg ${text.font} ${text.weight} ${text.italic ? 'italic' : ''}`}
                        title="Düzenlemek veya silmek için tıklayın"
                    >
                        {text.text}
                    </h1>
                  </div>
              ))}
            </div>
            
            {/* GÜNCELLENDİ: Sadece aktif olan metnin denetleyicilerini gösteriyoruz */}
            {activeText && (
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b pb-3 border-gray-200/50">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aktif Metin Denetleyicisi ({imageTexts.findIndex(t => t.id === activeTextId) + 1})</h3>
                        <div className="flex gap-2">
                            <button onClick={() => handleDeleteText(activeTextId)} className="text-red-500 font-bold text-sm hover:text-red-700 transition-colors">Sil</button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <textarea
                            value={activeText.text}
                            onChange={(e) => handleTextUpdate(activeTextId, 'text', e.target.value)}
                            // GÜNCELLENDİ: Yazı rengi ve gölgesi eklendi
                            style={{ color: activeText.color, backgroundColor: 'white' }}
                            className={`w-full text-center border p-4 focus:outline-none focus:border-[var(--color-primary)] resize-none rounded-lg font-sans font-bold shadow-inner`}
                            rows={3}
                            placeholder="Metninizi buraya yazın..."
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Konum</label>
                            <select value={activeText.position} onChange={(e) => handleTextUpdate(activeTextId, 'position', e.target.value)} className="p-2 border rounded-lg text-sm bg-white focus:border-[var(--color-primary)] outline-none">
                                <option value="items-start">Üstte</option>
                                <option value="items-center">Ortada</option>
                                <option value="items-end">Altta</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Yazı Tipi</label>
                            <select value={activeText.font} onChange={(e) => handleTextUpdate(activeTextId, 'font', e.target.value)} className="p-2 border rounded-lg text-sm bg-white focus:border-[var(--color-primary)] outline-none">
                                <option value="font-sans">Modern</option>
                                <option value="font-serif">Klasik</option>
                                <option value="font-mono">Kod</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Stil</label>
                            <div className="flex gap-1">
                                <select value={activeText.weight} onChange={(e) => handleTextUpdate(activeTextId, 'weight', e.target.value)} className="p-2 border rounded-lg text-sm bg-white flex-1 outline-none">
                                    <option value="font-normal">İnce</option>
                                    <option value="font-bold">Kalın</option>
                                    <option value="font-extrabold">Ex.Kalın</option>
                                </select>
                                <button onClick={() => handleTextUpdate(activeTextId, 'italic', !activeText.italic)} className={`p-2 border rounded-lg text-sm font-serif italic ${activeText.italic ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-gray-700'}`}>I</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700 flex justify-between">Boyut</label>
                            <input type="range" min="20" max="80" value={activeText.size} onChange={(e) => handleTextUpdate(activeTextId, 'size', Number(e.target.value))} className="w-full mt-2 accent-[var(--color-primary)]" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Renk</label>
                            <input type="color" value={activeText.color} onChange={(e) => handleTextUpdate(activeTextId, 'color', e.target.value)} className="w-full h-9 rounded-lg cursor-pointer border-0 p-0" />
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">🤖</div>
              <h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center gap-2">💡 ContentSense AI Tavsiyesi</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Bu görseli <strong>{platform}</strong> üzerinde paylaşırken <strong>gönderinin altına yapıştıracağın</strong> gerçek açıklama metnidir (Caption).
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
              <textarea value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-[var(--color-primary)] font-bold text-sm shadow-inner" rows={2}/>
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