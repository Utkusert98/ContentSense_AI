"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { useRouter, useSearchParams } from "next/navigation";

function EditStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id"); 

  const [isLoading, setIsLoading] = useState(true);
  const [imageTexts, setImageTexts] = useState<any[]>([]); 
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [isDownloading, setIsDownloading] = useState(false);
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [originalTitle, setOriginalTitle] = useState(""); 
  const [language, setLanguage] = useState("tr");

  // YENİ: Rastgele tavsiye için state
  const [adviceIndex, setAdviceIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) setLanguage(savedLang);

    // YENİ: Her girişte 0 ile 4 arasında rastgele bir tavsiye seç
    setAdviceIndex(Math.floor(Math.random() * 5));

    const intervalId = setInterval(() => {
        const currentLang = localStorage.getItem("userLanguage") || "tr";
        if (currentLang !== language) setLanguage(currentLang);
    }, 500);

    return () => clearInterval(intervalId);
  }, [language]);

  const translations = {
    tr: {
      backToContents: "İçeriklerim",
      backToAlternatives: "Geri: 3 Alternatife Dön",
      btnAddAiText: "YZ Destekli Yeni Metin",
      downloading: "İşleniyor...",
      download: "İndir (Yüksek Kalite)",
      editorTitle: "Sınırsız Metin Düzenleme",
      sizeLabel: "Boyutu",
      deleteTitle: "Bu metni sil",
      clickToEditTitle: "Düzenlemek için tıklayın",
      activeTextControl: "Aktif Metin Denetleyicisi",
      clickToEdit: "Düzenlemek için fotoğraftaki yazıya tıklayın",
      position: "Konum", top: "Üstte", center: "Ortada", bottom: "Altta",
      font: "Yazı Tipi", modern: "Modern", classic: "Klasik", code: "Kod",
      style: "Stil", thin: "İnce", bold: "Kalın", extraBold: "Ex.Kalın",
      size: "Boyut", color: "Renk",
      aiAdviceTitle: "ContentSense AI Stratejisi",
      // YENİ: Dinamik Tavsiye Havuzu (TR)
      advices: [
        `Bu görseli ${platform} üzerinde paylaşırken altına yapıştırdığın metin (Caption), takipçilerinle kurduğun asıl bağdır. Samimiyeti elden bırakma.`,
        `İpucu: ${platform} algoritması, görsele bakma süresini sever. Metnin başına "Okumadan Geçme" gibi merak uyandırıcı bir giriş eklemeyi dene.`,
        `Unutma: Görselin üzerindeki yazı (Title) dikkat çeker, açıklama metni (Caption) ise satış veya etkileşim yaptırır. İkisini birbirine bağla.`,
        `Hashtag stratejisi: Çok popüler etiketler yerine, niş ve içerikle %100 uyumlu etiketler kullanmak erişimini %40 daha fazla artırabilir.`,
        `Altın Kural: Gönderinin en sonuna mutlaka "Sen ne düşünüyorsun?" gibi bir soru ekle. Yorumlar, içeriğini keşfete taşıyan yakıttır.`
      ],
      captionTitle: "Gönderi Metni (Caption)",
      captionDesc: "Bu metni kopyalayıp Instagram/LinkedIn vb. yapıştırın.",
      copyAll: "Tümünü Kopyala",
      hashtags: "Hashtag'ler",
      alertDownloaded: "✅ İçeriğiniz yüksek kalitede cihazınıza indirildi!",
      newAiTextPrefix: "Yeni Metin: "
    },
    en: {
      backToContents: "My Contents",
      backToAlternatives: "Back: Return to 3 Alternatives",
      btnAddAiText: "AI Supported New Text",
      downloading: "Processing...",
      download: "Download (High Quality)",
      editorTitle: "Unlimited Text Editing",
      sizeLabel: "Size",
      deleteTitle: "Delete this text",
      clickToEditTitle: "Click to edit",
      activeTextControl: "Active Text Controller",
      clickToEdit: "Click the text on the photo to edit",
      position: "Position", top: "Top", center: "Center", bottom: "Bottom",
      font: "Font", modern: "Modern", classic: "Classic", code: "Code",
      style: "Style", thin: "Thin", bold: "Bold", extraBold: "Extra Bold",
      size: "Size", color: "Color",
      aiAdviceTitle: "ContentSense AI Strategy",
      // YENİ: Dinamik Tavsiye Havuzu (EN)
      advices: [
        `When sharing this on ${platform}, the caption is your primary connection with followers. Stay authentic.`,
        `Pro Tip: The ${platform} algorithm rewards "dwell time." Try starting with a hook like "Don't miss this" to keep them reading.`,
        `Remember: The text on the image grabs attention, but the caption drives the sale or engagement. Link them together.`,
        `Hashtag Strategy: Using niche tags instead of overly popular ones can boost your reach by up to 40%.`,
        `Golden Rule: Always end with a Call to Action (CTA) like "What do you think?" Comments are the fuel for the algorithm.`
      ],
      captionTitle: "Post Text (Caption)",
      captionDesc: "Copy and paste this text to Instagram/LinkedIn etc.",
      copyAll: "Copy All",
      hashtags: "Hashtags",
      alertDownloaded: "✅ Your content has been downloaded in high quality!",
      newAiTextPrefix: "New Text: "
    },
    de: {
      backToContents: "Meine Inhalte",
      backToAlternatives: "Zurück: Zu den 3 Alternativen",
      btnAddAiText: "KI-unterstützter neuer Text",
      downloading: "Verarbeitung...",
      download: "Herunterladen (Hohe Qualität)",
      editorTitle: "Unbegrenzte Textbearbeitung",
      sizeLabel: "Format",
      deleteTitle: "Diesen Text löschen",
      clickToEditTitle: "Zum Bearbeiten klicken",
      activeTextControl: "Aktiver Text-Controller",
      clickToEdit: "Klicken Sie auf den Text auf dem Foto, um ihn zu bearbeiten",
      position: "Position", top: "Oben", center: "Mitte", bottom: "Unten",
      font: "Schriftart", modern: "Modern", classic: "Klassisch", code: "Code",
      style: "Stil", thin: "Dünn", bold: "Fett", extraBold: "Extra Fett",
      size: "Größe", color: "Farbe",
      aiAdviceTitle: "ContentSense AI Strategie",
      // YENİ: Dinamik Tavsiye Havuzu (DE)
      advices: [
        `Beim Teilen auf ${platform} ist die Bildunterschrift Ihre wichtigste Verbindung zu den Followern. Bleiben Sie authentisch.`,
        `Pro-Tipp: Der ${platform}-Algorithmus liebt Verweildauer. Versuchen Sie es mit einem spannenden Einstieg, um das Interesse zu wecken.`,
        `Wichtig: Der Text auf dem Bild erregt Aufmerksamkeit, aber die Bildunterschrift führt zur Interaktion. Verbinden Sie beides.`,
        `Hashtag-Strategie: Nischen-Tags statt populärer Tags zu verwenden, kann Ihre Reichweite um bis zu 40% erhöhen.`,
        `Goldene Regel: Beenden Sie Ihren Post immer mit einer Frage. Kommentare sind der Treibstoff für den Algorithmus.`
      ],
      captionTitle: "Beitragstext (Caption)",
      captionDesc: "Kopieren Sie diesen Text und fügen Sie ihn in Instagram/LinkedIn usw. ein.",
      copyAll: "Alles kopieren",
      hashtags: "Hashtags",
      alertDownloaded: "✅ Ihr Inhalt wurde in hoher Qualität heruntergeladen!",
      newAiTextPrefix: "Neuer Text: "
    }
  };

  const t = translations[language as keyof typeof translations];

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
            }
          } catch (e) { console.error(e); }
      }

      if (targetContent) {
          setOriginalTitle(targetContent.title);
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
          setActiveTextId(initialTextId); 
          setCaption(targetContent.caption);
          setHashtags(targetContent.hashtags);
          setPlatform(targetContent.platform || "Instagram");
      }

      const savedUploads = localStorage.getItem("tempUserUploads");
      if (savedUploads && JSON.parse(savedUploads).length > 0) {
          setBgImages(JSON.parse(savedUploads));
      } else {
          setBgImages([`https://image.pollinations.ai/prompt/${encodeURIComponent((targetContent?.title || "aesthetic") + " high quality cinematic aesthetics")}?width=800&height=800&nologo=true`]);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [contentId]);

  const handleAddNewText = () => {
      const parts = originalTitle.split(',');
      const randomYZMetin = parts.length > 1 ? parts[Math.floor(Math.random() * parts.length)].trim() : parts[0].trim();
      const newText = {
          id: `yz-new-${Date.now()}`,
          text: `${t.newAiTextPrefix}${randomYZMetin}`, 
          position: "items-center",
          size: 40,
          font: "font-sans",
          weight: "font-bold",
          italic: false,
          color: "#ffffff"
      };
      setImageTexts([...imageTexts, newText]);
      setActiveTextId(newText.id); 
  };

  const handleDeleteText = (id: string) => {
      const remainingTexts = imageTexts.filter(t => t.id !== id);
      setImageTexts(remainingTexts);
      if (id === activeTextId) setActiveTextId(remainingTexts.length > 0 ? remainingTexts[0].id : null);
  };

  const handleTextUpdate = (id: string, key: string, value: any) => {
      const updatedTexts = imageTexts.map(t => t.id === id ? { ...t, [key]: value } : t);
      setImageTexts(updatedTexts);
  };

  const activeText = imageTexts.find(t => t.id === activeTextId);

  const handleDownload = async () => {
    setIsDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = bgImages[currentSlide];

    img.onload = () => {
      canvas.width = 1080;
      canvas.height = 1080;
      ctx.drawImage(img, 0, 0, 1080, 1080);
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, 1080, 1080);

      imageTexts.forEach((textObj) => {
        const fontSize = textObj.size * 2.2;
        const fontWeight = textObj.weight.includes("extrabold") ? "900" : textObj.weight.includes("bold") ? "700" : "400";
        const fontStyle = textObj.italic ? "italic" : "normal";
        const fontFamily = textObj.font.includes("serif") ? "serif" : textObj.font.includes("mono") ? "monospace" : "sans-serif";
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textObj.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 15;
        let yPos = 540;
        if (textObj.position === "items-start") yPos = 180;
        if (textObj.position === "items-end") yPos = 900;
        const lines = textObj.text.split('\n');
        lines.forEach((line: string, i: number) => {
          ctx.fillText(line, 540, yPos + (i * fontSize * 1.2));
        });
      });

      const link = document.createElement("a");
      link.download = `ContentSenseAI-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsDownloading(false);
      alert(t.alertDownloaded);
    };
    img.onerror = () => { setIsDownloading(false); };
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
      <canvas ref={canvasRef} className="hidden" />
      <main className="w-full max-w-7xl px-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
              <button onClick={() => router.push('/dashboard')} className="text-gray-500 font-semibold hover:text-gray-900 flex items-center gap-2 transition-colors border-r pr-4 border-gray-300">
                <span>←</span> {t.backToContents}
              </button>
              {!contentId && (
                  <button onClick={() => router.push('/generate?step=3')} className="text-[var(--color-primary)] font-bold hover:text-blue-700 transition-colors">
                    {t.backToAlternatives}
                  </button>
              )}
          </div>
          <button onClick={handleAddNewText} className="text-gray-900 font-bold text-sm hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-full bg-white shadow-sm hover:border-[var(--color-primary)]">
            <span>➕</span> {t.btnAddAiText}
          </button>
          <button onClick={handleDownload} disabled={isDownloading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:scale-100 ml-4">
            {isDownloading ? <span className="animate-pulse">⏳ {t.downloading}</span> : <><span>⬇️</span> {t.download}</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">🎨 {t.editorTitle}</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">{platform} {t.sizeLabel}</span>
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
              {imageTexts.map((text) => (
                  <div key={text.id} className={`absolute w-full left-0 px-8 flex justify-center z-10 group ${text.position === 'items-start' ? 'top-12' : text.position === 'items-end' ? 'bottom-12' : 'top-1/2 -translate-y-1/2'}`}>
                    {activeTextId === text.id && (
                        <button onClick={() => handleDeleteText(text.id)} className="absolute -top-6 right-8 md:right-16 w-8 h-8 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center font-bold text-sm shadow-md border border-white/50 z-20" title={t.deleteTitle}>🗑️</button>
                    )}
                    {editingTextId === text.id ? (
                        <textarea value={text.text} onChange={(e) => handleTextUpdate(text.id, 'text', e.target.value)} onBlur={() => setEditingTextId(null)} autoFocus style={{ fontSize: `${text.size}px`, color: text.color, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }} className={`w-full bg-black/40 text-center border-2 border-dashed border-white/80 p-2 focus:outline-none resize-none backdrop-blur-md rounded-lg ${text.font} ${text.weight} ${text.italic ? 'italic' : ''}`} rows={3}/>
                    ) : (
                        <h1 onClick={() => { setActiveTextId(text.id); setEditingTextId(text.id); }} style={{ fontSize: `${text.size}px`, color: text.color, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }} className={`cursor-pointer ${activeTextId === text.id ? 'border-2 border-dashed border-white/80 p-2' : 'border-2 border-transparent hover:border-dashed hover:border-white/50 p-2'} transition-all drop-shadow-2xl rounded-lg ${text.font} ${text.weight} ${text.italic ? 'italic' : ''}`} title={t.clickToEditTitle}>{text.text}</h1>
                    )}
                  </div>
              ))}
            </div>
            {activeText && (
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-200/50">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.activeTextControl}</h3>
                        <div className="flex gap-2"><span className="text-xs text-[var(--color-primary)] font-bold">✨ {t.clickToEdit}</span></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">{t.position}</label>
                            <select value={activeText.position} onChange={(e) => handleTextUpdate(activeTextId, 'position', e.target.value)} className="p-2 border rounded-lg text-sm bg-white focus:border-[var(--color-primary)] outline-none">
                                <option value="items-start">{t.top}</option>
                                <option value="items-center">{t.center}</option>
                                <option value="items-end">{t.bottom}</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">{t.font}</label>
                            <select value={activeText.font} onChange={(e) => handleTextUpdate(activeTextId, 'font', e.target.value)} className="p-2 border rounded-lg text-sm bg-white focus:border-[var(--color-primary)] outline-none">
                                <option value="font-sans">{t.modern}</option>
                                <option value="font-serif">{t.classic}</option>
                                <option value="font-mono">{t.code}</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">{t.style}</label>
                            <div className="flex gap-1">
                                <select value={activeText.weight} onChange={(e) => handleTextUpdate(activeTextId, 'weight', e.target.value)} className="p-2 border rounded-lg text-sm bg-white flex-1 outline-none">
                                    <option value="font-normal">{t.thin}</option>
                                    <option value="font-bold">{t.bold}</option>
                                    <option value="font-extrabold">{t.extraBold}</option>
                                </select>
                                <button onClick={() => handleTextUpdate(activeTextId, 'italic', !activeText.italic)} className={`p-2 border rounded-lg text-sm font-serif italic ${activeText.italic ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-gray-700'}`}>I</button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                            <label className="text-xs font-semibold text-gray-700 flex justify-between">{t.size}</label>
                            <input type="range" min="20" max="80" value={activeText.size} onChange={(e) => handleTextUpdate(activeTextId, 'size', Number(e.target.value))} className="w-full mt-2 accent-[var(--color-primary)]" />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                            <label className="text-xs font-semibold text-gray-700">{t.color}</label>
                            <input type="color" value={activeText.color} onChange={(e) => handleTextUpdate(activeTextId, 'color', e.target.value)} className="w-full h-9 rounded-lg cursor-pointer border-0 p-0" />
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">🤖</div>
              <h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center gap-2">💡 {t.aiAdviceTitle}</h3>
              {/* GÜNCELLENDİ: Dinamik Tavsiye Metni */}
              <p className="text-sm text-blue-800 leading-relaxed" suppressHydrationWarning>
                {t.advices[adviceIndex]}
              </p>
            </div>
            <div className="glass-panel p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{t.captionTitle}</h3>
                    <p className="text-xs text-gray-500 font-medium">{t.captionDesc}</p>
                </div>
                <button onClick={() => navigator.clipboard.writeText(`${caption}\n\n${hashtags}`)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">📋 {t.copyAll}</button>
              </div>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full flex-grow p-4 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-gray-700 text-sm mb-4 leading-relaxed shadow-inner" rows={6}/>
              <h3 className="font-bold text-sm text-gray-800 mb-2">{t.hashtags}</h3>
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