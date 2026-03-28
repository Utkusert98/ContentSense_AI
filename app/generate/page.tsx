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
  const [postType, setPostType] = useState(""); 
  const [promptText, setPromptText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [userCategories, setUserCategories] = useState<string[]>(["Trendler", "Genel"]);
  
  // YENİ: YZ'den gelen gerçek 3 alternatif
  const [aiAlternatives, setAiAlternatives] = useState<any[]>([]);

  const platforms = ["Instagram Reels", "TikTok", "LinkedIn", "Twitter (X)", "Instagram Post"];

  useEffect(() => {
    const savedCategories = localStorage.getItem("userCategories");
    if (savedCategories) setUserCategories(JSON.parse(savedCategories));
    
    // Eğer Edit sayfasından "Alternatiflere Dön" dediyse 4. adımdan başlat
    const savedAlts = sessionStorage.getItem("currentAlternatives");
    if (savedAlts) {
        setAiAlternatives(JSON.parse(savedAlts));
        setStep(4);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files).slice(0, 10);
        setUploadedImages(files.map(f => f.name));
        const tempUrls = files.map(f => URL.createObjectURL(f));
        localStorage.setItem("tempUserUploads", JSON.stringify(tempUrls));
    }
  };

  const handleGenerate = async () => {
    const plan = localStorage.getItem("userPlan") || "Standart";
    const email = localStorage.getItem("userEmail");
    if (!email) return router.push("/login");

    setIsGenerating(true);

    try {
        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, type: format === "Görsel/Metin" ? postType : "Video", platform, promptText, category })
        });

        if (res.ok) {
            const data = await res.json();
            
            if (plan === "Standart") {
                localStorage.setItem("userCredits", data.newCredits.toString());
                window.dispatchEvent(new Event("creditsUpdated"));
            }

            // Gelen 3 alternatifi state'e ve session'a kaydet (Geri dönüş için)
            setAiAlternatives(data.alternatives);
            sessionStorage.setItem("currentAlternatives", JSON.stringify(data.alternatives));

            const newContent = {
              id: data.content.id,
              type: data.content.type,
              platform: data.content.platform,
              title: data.content.title,
              date: "Az Önce",
              image: format === "Video" ? "🎥" : "📸",
              hasUpload: uploadedImages.length > 0 ? true : false
            };
            
            const existingContents = JSON.parse(localStorage.getItem("pastContents") || "[]");
            localStorage.setItem("pastContents", JSON.stringify([newContent, ...existingContents]));

            setIsGenerating(false);
            setStep(4);
        } else {
            const errorData = await res.json();
            alert("⚠️ " + errorData.error);
            setIsGenerating(false);
        }
    } catch (error) {
        alert("Bağlantı hatası yaşandı.");
        setIsGenerating(false);
    }
  };

  // Düzenle butonuna basınca seçilen alternatifi Edit sayfasına taşıyoruz
  const handleEditAlternative = (alt: any) => {
      localStorage.setItem("selectedAlternative", JSON.stringify(alt));
      router.push("/edit");
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-12 flex flex-col items-center">
      <DashboardNavbar />
      <main className="w-full max-w-4xl px-6 flex flex-col">
        <div className="glass-panel p-8 md:p-12 w-full relative overflow-hidden">
          
          {step < 4 && (
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200/50">
              <button onClick={() => setStep(1)} className={`font-bold transition-colors hover:text-[var(--color-primary)] ${step >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>1. Tür</button>
              <span className="text-gray-300">→</span>
              <button disabled={!category} onClick={() => setStep(2)} className={`font-bold transition-colors disabled:cursor-not-allowed ${step >= 2 ? 'text-[var(--color-primary)] hover:text-blue-600' : 'text-gray-400'}`}>2. Format</button>
              <span className="text-gray-300">→</span>
              <button disabled={!category || !format} onClick={() => setStep(3)} className={`font-bold transition-colors disabled:cursor-not-allowed ${step >= 3 ? 'text-[var(--color-primary)] hover:text-blue-600' : 'text-gray-400'}`}>3. Detaylar</button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Ne Üretiyoruz?</h2>
              <p className="text-gray-500 mb-8">Kayıt olurken seçtiğiniz ilgi alanlarınızdan birini seçin.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {userCategories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`p-6 rounded-2xl border-2 transition-all font-bold text-lg flex items-center justify-center text-center h-full min-h-[120px] hover:bg-white hover:shadow-sm ${category === cat ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] shadow-md' : 'border-gray-200 bg-white/50 text-gray-700'}`}>{cat}</button>
                ))}
              </div>
              <button disabled={!category} onClick={() => setStep(2)} className="bg-gray-900 text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 disabled:opacity-50 transition-all">Devam Et →</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Formatı Belirleyin</h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center mb-10 mt-8">
                <button onClick={() => setFormat("Video")} className={`flex-1 p-8 rounded-2xl border-2 transition-all hover:bg-white ${format === "Video" ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] shadow-md' : 'border-gray-200 bg-white/50'}`}><span className="text-5xl">🎬</span><p className="font-bold text-xl mt-4">Video</p></button>
                <button onClick={() => setFormat("Görsel/Metin")} className={`flex-1 p-8 rounded-2xl border-2 transition-all hover:bg-white ${format === "Görsel/Metin" ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] shadow-md' : 'border-gray-200 bg-white/50'}`}><span className="text-5xl">📸</span><p className="font-bold text-xl mt-4">Görsel & Metin</p></button>
              </div>
              <div className="flex justify-between items-center px-4"><button onClick={() => setStep(1)} className="text-gray-500 font-semibold hover:text-black">← Geri</button><button disabled={!format} onClick={() => setStep(3)} className="bg-gray-900 text-white px-10 py-3 rounded-full font-bold shadow-md disabled:opacity-50 hover:bg-gray-800 transition-all">Sonraki Adım →</button></div>
            </div>
          )}

          {step === 3 && !isGenerating && (
            <div className="animate-fade-in text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Detayları Anlatın</h2>
              <div className="space-y-6">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 outline-none focus:border-[var(--color-primary)]"><option value="" disabled>Platform Seçin...</option>{platforms.map(p => <option key={p} value={p}>{p}</option>)}</select>
                {format === "Görsel/Metin" && (<div className="flex gap-4"><label className="flex items-center cursor-pointer gap-2 p-3 border rounded-xl bg-white/50 hover:bg-white flex-1"><input type="radio" name="postType" value="Tekli" onChange={(e) => setPostType(e.target.value)} /> Tekli Görsel</label><label className="flex items-center gap-2 cursor-pointer p-3 border hover:bg-white rounded-xl bg-white/50 flex-1"><input type="radio" name="postType" value="Kaydırmalı" onChange={(e) => setPostType(e.target.value)} /> Kaydırmalı</label></div>)}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-white/50 transition-all"><input type="file" id="fileUpload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} /><label htmlFor="fileUpload" className="cursor-pointer text-gray-600 flex flex-col items-center"><span className="text-3xl block mb-2">📥</span>{uploadedImages.length > 0 ? <span className="text-[var(--color-primary)] font-bold">{uploadedImages.length} görsel yüklendi</span> : <span>Referans görseller yükleyin (Opsiyonel)</span>}</label></div>
                <textarea rows={4} placeholder="Sihirli Kelimeleriniz..." value={promptText} onChange={(e) => setPromptText(e.target.value)} className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 outline-none focus:border-[var(--color-primary)] resize-none"></textarea>
              </div>
              <div className="flex justify-between items-center mt-8"><button onClick={() => setStep(2)} className="text-gray-500 font-semibold hover:text-black">← Geri</button><button disabled={!platform || !promptText || (format === "Görsel/Metin" && !postType)} onClick={handleGenerate} className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50">✨ Yapay Zeka ile Üret</button></div>
            </div>
          )}

          {isGenerating && (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-pulse">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900">ContentSense AI Tasarlıyor...</h2>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">İşte Senin İçin 3 Alternatif</h2>
                <button onClick={() => { setStep(3); setAiAlternatives([]); sessionStorage.removeItem("currentAlternatives"); }} className="text-sm text-gray-500 hover:text-gray-900 underline mt-2">← Yeni Bir Şey Üret</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiAlternatives.map((alt, index) => (
                  <div key={index} className="bg-white/80 rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:border-[var(--color-primary)] transition-all group">
                    <div className="h-40 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                        <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(alt.title + " high quality cinematic")}?width=400&height=200&nologo=true`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"/>
                        <span className="text-white font-bold relative z-10 drop-shadow-md text-center px-4">{alt.title}</span>
                    </div>
                    <div className="p-5 flex-grow">
                        <h4 className="font-bold text-gray-900 mb-2">Alternatif {index + 1}</h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3" title={alt.caption}>{alt.caption}</p>
                        <p className="text-xs text-[var(--color-primary)] font-bold">{alt.hashtags}</p>
                    </div>
                    <div className="p-4 border-t flex gap-2">
                        <button onClick={() => handleEditAlternative(alt)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[var(--color-primary)] transition-colors">✨ Bunu Düzenle</button>
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