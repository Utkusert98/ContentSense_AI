"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Standart");
  const [credits, setCredits] = useState<string | number>("...");
  const [categories, setCategories] = useState<string[]>([]);
  
  const [activeTab, setActiveTab] = useState("profil"); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const availableCategories = [
    "Mimari & Tasarım", "Sağlık & Besin Takviyesi",
    "Teknoloji & Yazılım", "Moda", "Hobi", "Spor", "Eğlence", "Eğitim"
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
            alert("✅ İlgi alanlarınız başarıyla güncellendi.");
        } else {
            alert("Hata oluştu.");
        }
    } catch (error) { alert("Bağlantı hatası!"); }
    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword !== confirmPassword) return alert("Yeni şifreler uyuşmuyor!");
    
    // GÜNCELLENDİ: Şifre Değiştirme Kısıtlaması (En az 8 karakter)
    if(newPassword.length < 8) return alert("Yeni şifreniz en az 8 karakterden oluşmalıdır!");
    
    setIsLoading(true);
    try {
        const res = await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, currentPassword, newPassword })
        });

        if (res.ok) {
            alert("✅ Şifreniz başarıyla değiştirildi.");
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        } else {
            const data = await res.json();
            alert("⚠️ " + data.error);
        }
    } catch (error) { alert("Bağlantı hatası!"); }
    setIsLoading(false);
  };

  const handleUpgradePlan = async (targetPlan: string) => {
    if(confirm(`Emin misiniz? Hesabınız ${targetPlan} paketine geçirilecektir.`)) {
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
                alert(`🎉 Tebrikler! Hesabınız başarıyla ${targetPlan} paketine yükseltildi. Yeni kredileriniz tanımlandı.`);
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
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Ayarlar ⚙️</h1>
          <p className="text-gray-600 font-medium">Hesap bilgilerinizi ve aboneliğinizi buradan yönetebilirsiniz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col gap-2">
            <button onClick={() => setActiveTab("profil")} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === "profil" ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-white/60'}`}>👤 Profil Bilgileri</button>
            <button onClick={() => setActiveTab("abonelik")} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === "abonelik" ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-white/60'}`}>💳 Abonelik & Kredi</button>
            <button onClick={() => setActiveTab("sifre")} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${activeTab === "sifre" ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-600 hover:bg-white/60'}`}>🔒 Şifre Değiştir</button>
          </div>

          <div className="md:col-span-3 glass-panel p-8 min-h-[400px]">
            {activeTab === "profil" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Profil Bilgileri</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresi (Değiştirilemez)</label>
                  <input type="email" value={email} disabled className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">İlgi Alanlarım (En fazla 3 kategori seçin)</label>
                  <div className="flex flex-wrap gap-3">
                      {availableCategories.map((cat) => (
                          <button type="button" key={cat} onClick={() => toggleCategory(cat)} className={`px-5 py-3 rounded-full font-medium transition-all duration-200 border text-sm ${categories.includes(cat) ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md hover:opacity-90' : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white'}`}>{cat}</button>
                      ))}
                  </div>
                </div>
                <div className="pt-6">
                  <button type="submit" disabled={isLoading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all hover:scale-105 disabled:opacity-50">{isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</button>
                </div>
              </form>
            )}

            {activeTab === "abonelik" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Abonelik Yönetimi</h2>
                <div className={`mb-10 p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white transition-all ${plan === 'Gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-xl shadow-yellow-400/30' : plan === 'Pro' ? 'bg-[var(--color-primary)] border-blue-400 shadow-xl shadow-blue-400/30' : 'bg-gray-800 border-gray-700 shadow-xl shadow-gray-900/30'}`}>
                  <div className="flex-1">
                    <p className="text-sm opacity-80 mb-1 font-medium">Mevcut Planınız</p>
                    <h3 className="text-3xl font-extrabold mb-4">{plan.toUpperCase()} PAKET</h3>
                    <ul className="text-sm space-y-2 opacity-90 mb-6">
                      {plan === "Standart" && (<><li className="flex items-center gap-2"><span>✔️</span> Ayda 3 İçerik Kredisi</li><li className="flex items-center gap-2"><span>✔️</span> Standart Çözünürlük (720p)</li><li className="flex items-center gap-2 text-gray-400"><span className="opacity-50">❌</span> Filigranlı Çıktı</li></>)}
                      {plan === "Pro" && (<><li className="flex items-center gap-2"><span>✔️</span> Ayda 50 İçerik Kredisi</li><li className="flex items-center gap-2"><span>✔️</span> Yüksek Çözünürlük (1080p)</li><li className="flex items-center gap-2"><span>✔️</span> Öncelikli YZ Hızı & Filigransız</li></>)}
                      {plan === "Gold" && (<><li className="flex items-center gap-2"><span>✔️</span> Ayda 200 İçerik Kredisi</li><li className="flex items-center gap-2"><span>✔️</span> Ultra Çözünürlük (4K) & Marka Kiti</li><li className="flex items-center gap-2"><span>✔️</span> Özel Destek & Ekip Yönetimi</li></>)}
                    </ul>
                    <div className="inline-block bg-black/20 px-5 py-2.5 rounded-xl border border-white/10">
                      <p className="text-base flex items-center gap-2"><span className="text-yellow-300 text-xl">⚡</span> Kalan Kredi: <strong className="text-xl">{credits}</strong></p>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-xl text-gray-800 mb-6">Planınızı Değiştirin</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan === "Standart" ? 'bg-gray-50 border-gray-300 opacity-60' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                        <h4 className="font-bold text-xl text-gray-800">Standart</h4><p className="text-sm text-gray-500 mb-4">Ücretsiz Deneme</p>
                        <div className="mt-auto">{plan === "Standart" ? <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed">Mevcut Plan</button> : <button onClick={() => handleUpgradePlan("Standart")} disabled={isLoading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50">Seç</button>}</div>
                    </div>
                    <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan === "Pro" ? 'bg-blue-50 border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-md' : 'bg-white border-gray-300 hover:border-[var(--color-primary)]'}`}>
                        <h4 className="font-bold text-xl text-gray-800">Pro</h4><p className="text-sm text-[var(--color-primary)] font-bold mb-4">₺199 / Ay</p>
                        <div className="mt-auto">{plan === "Pro" ? <button disabled className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold cursor-not-allowed opacity-80">Mevcut Plan</button> : <button onClick={() => handleUpgradePlan("Pro")} disabled={isLoading} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50">Yükselt</button>}</div>
                    </div>
                    <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan === "Gold" ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400/50 shadow-md' : 'bg-white border-gray-300 hover:border-yellow-500'}`}>
                        <h4 className="font-bold text-xl text-gray-800">Gold</h4><p className="text-sm text-yellow-600 font-bold mb-4">₺499 / Ay</p>
                        <div className="mt-auto">{plan === "Gold" ? <button disabled className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold cursor-not-allowed opacity-80">Mevcut Plan</button> : <button onClick={() => handleUpgradePlan("Gold")} disabled={isLoading} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-md disabled:opacity-50">Yükselt</button>}</div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === "sifre" && (
              <form onSubmit={handleChangePassword} className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Şifre Değiştir</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mevcut Şifreniz</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre (En az 8 karakter)</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isLoading} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50">{isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}</button>
                </div>
              </form>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}