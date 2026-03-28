"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
    const [step, setStep] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPlan, setSelectedPlan] = useState("Standart");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Göz ikonu durumları (Zaten eklemişsin, kusursuz çalışıyor)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const categories = [
        "Mimari & Tasarım", "Sağlık & Besin Takviyesi",
        "Teknoloji & Yazılım", "Moda", "Hobi", "Spor", "Eğlence", "Eğitim"
    ];

    // GÜNCELLENDİ: Şifre gücü tam olarak senin istediğin katı kurallara göre hesaplanıyor
    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length >= 8) score += 25; // Uzunluk şartı (En az 8)
        if (/[A-Z]/.test(pass)) score += 25; // Büyük harf şartı
        if (/[0-9]/.test(pass)) score += 25; // Sayı şartı
        if (/[^A-Za-z0-9]/.test(pass)) score += 25; // Özel karakter şartı
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

    // YENİ: İleri butonuna basıldığında kuralları kontrol eden zeki dedektif
    const handleNextStep = () => {
        if (step === 1) {
            // İsim Doğrulama (Sadece harf ve boşluk)
            const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
            if (!name || !nameRegex.test(name)) {
                return alert("⚠️ İsim alanına sadece harf girebilirsiniz. (Sayı ve özel karakter kullanılamaz)");
            }
            if (!email) {
                return alert("⚠️ Lütfen geçerli bir e-posta adresi girin.");
            }
            if (password !== confirmPassword) {
                return alert("⚠️ Şifreleriniz birbiriyle uyuşmuyor!");
            }
            // Şifre Gücü Doğrulama (Bar %100 olmadan geçemez)
            if (strength < 100) {
                return alert("⚠️ Lütfen daha güçlü bir şifre belirleyin. Şifreniz en az 8 karakter olmalı, büyük harf, sayı ve özel karakter (!@#$% vb.) içermelidir.");
            }
        }
        setStep(step + 1);
    };

    // GERÇEK API BAĞLANTISI VE HAFIZA KAYDI
    const handleRegisterAndStart = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        
        if(password !== confirmPassword) {
            alert("Şifreler uyuşmuyor!");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, plan: selectedPlan, categories: selectedCategories }),
            });

            if (res.ok) {
                if (selectedCategories.length > 0) localStorage.setItem("userCategories", JSON.stringify(selectedCategories));
                localStorage.setItem("userPlan", selectedPlan);
                localStorage.setItem("userCredits", selectedPlan === "Standart" ? "3" : "9999");
                localStorage.setItem("userEmail", email); 
                
                window.location.href = "/dashboard";
            } else {
                const errorData = await res.json();
                alert("Hata: " + errorData.error);
                setIsLoading(false);
            }
        } catch (error) {
            alert("Bağlantı hatası yaşandı.");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem("userPlan", "Standart");
            localStorage.setItem("userCredits", "3");
            window.location.href = "/dashboard";
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f3f4f6]">
            <div className="glass-panel w-full max-w-2xl p-10 relative overflow-hidden z-50 bg-white/80 backdrop-blur-xl">
                
                <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 transition-colors">
                    ← Ana Sayfa
                </Link>

                <div className="flex justify-between mb-8 mt-4 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>{num}</div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Hesap Oluştur</h2>
                        <p className="text-gray-500 mb-6">İçerik üretmeye başlamak için temel bilgilerinizi girin.</p>
                        <div className="space-y-4">
                            <div>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)]" />
                                {/* GÜNCELLENDİ: İsim altı uyarı metni */}
                                <p className="text-xs text-gray-500 mt-1 font-medium ml-1">Sayı ve özel karakter yazmayın.</p>
                            </div>
                            
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta Adresi (Zorunlu)" className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)]" required />
                            
                            <div>
                                <div className="relative">
                                    {/* GÜNCELLENDİ: Şifre Göz İkonu Aktif */}
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre (Zorunlu)" className="w-full p-4 pr-12 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)]" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                        {showPassword ? "👁️‍🗨️" : "👁️"}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                            {/* GÜNCELLENDİ: Güç barı renkleri hassaslaştırıldı */}
                                            <div className="h-full transition-all duration-300" style={{ width: `${strength}%`, backgroundColor: strength <= 25 ? '#ef4444' : strength === 50 ? '#f97316' : strength === 75 ? '#eab308' : '#22c55e' }}></div>
                                        </div>
                                        <p className="text-xs mt-1 font-bold text-right" style={{ color: strength <= 25 ? '#ef4444' : strength === 50 ? '#f97316' : strength === 75 ? '#eab308' : '#22c55e' }}>
                                            {strength <= 25 ? 'Çok Zayıf' : strength === 50 ? 'Zayıf' : strength === 75 ? 'Orta' : 'Çok Güçlü'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="relative">
                                {/* GÜNCELLENDİ: Şifre Tekrar Göz İkonu Aktif ve Eşleşmezse Kırmızı Çerçeve */}
                                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Şifreyi Onayla (Zorunlu)" className={`w-full p-4 pr-12 rounded-xl border focus:outline-none focus:ring-2 transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 bg-white focus:ring-[var(--color-primary)]'}`} required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                    {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                                </button>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1 font-bold ml-1 absolute -bottom-5 left-0">Şifreler uyuşmuyor</p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium pt-4">
                                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 text-[var(--color-primary)]" />
                                Hesabımı açık tut (Beni Hatırla)
                            </label>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">veya</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <button onClick={handleGoogleLogin} disabled={isLoading} type="button" className="w-full p-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 font-bold text-gray-700 transition-all shadow-sm disabled:opacity-50">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Google ile Devam Et
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">İlgi Alanlarınızı Seçin</h2>
                        <p className="text-gray-500 mb-6">Lütfen en az 1 kategori seçin. ({selectedCategories.length}/3)</p>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => toggleCategory(cat)} className={`px-5 py-3 rounded-full font-medium transition-all duration-200 border ${selectedCategories.includes(cat) ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Sistem Nasıl Çalışır?</h2>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-left space-y-4 shadow-sm">
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">1.</span> Seçtiğiniz kategorilere göre yapay zeka fikir sunar.</p>
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">2.</span> Video mu yoksa metin/görsel mi istediğinizi seçersiniz.</p>
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">3.</span> Hedef platformunuzu belirtirsiniz.</p>
                            <p className="flex items-center gap-3"><span className="text-[var(--color-primary)] font-bold text-xl">4.</span> Yapay zeka anında 3 farklı alternatif üretir!</p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Planınızı Seçin</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            <div onClick={() => setSelectedPlan("Standart")} className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col ${selectedPlan === "Standart" ? 'bg-white border-[var(--color-primary)] shadow-xl transform scale-105 ring-2 ring-[var(--color-primary)]/40 z-20' : 'bg-white/80 border-gray-300 scale-100 opacity-80 hover:opacity-100'}`}>
                                <h3 className="font-bold text-xl text-gray-800">Standart</h3><p className="text-sm text-gray-500 mb-4">Ücretsiz Deneme</p>
                                <ul className="text-sm text-gray-600 space-y-3 flex-grow">
                                    <li className="flex items-center gap-2"><span>✔️</span> Ayda 3 İçerik Kredisi</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Standart Çözünürlük</li>
                                    <li className="flex items-center gap-2 text-gray-400"><span className="opacity-50">❌</span> Filigranlı İndirme</li>
                                </ul>
                            </div>
                            
                            <div onClick={() => setSelectedPlan("Pro")} className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-white flex flex-col ${selectedPlan === "Pro" ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-xl transform scale-105 ring-2 ring-[var(--color-primary)]/40 z-20' : 'bg-[var(--color-primary)]/80 border-transparent scale-100 opacity-80 hover:opacity-100'}`}>
                                <h3 className="font-bold text-xl">Pro</h3><p className="text-sm text-blue-200 mb-4">₺199 / Ay</p>
                                <ul className="text-sm space-y-3 flex-grow">
                                    <li className="flex items-center gap-2"><span>✔️</span> Sınırsız Üretim</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Yüksek Çözünürlük (4K)</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Filigransız İndirme</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Öncelikli YZ Hızı</li>
                                </ul>
                            </div>
                            
                            <div onClick={() => setSelectedPlan("Gold")} className={`bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-white flex flex-col ${selectedPlan === "Gold" ? 'border-yellow-300 shadow-xl transform scale-105 ring-2 ring-yellow-400/50 z-20' : 'border-yellow-500 scale-100 opacity-80 hover:opacity-100'}`}>
                                <h3 className="font-bold text-xl">Gold</h3><p className="text-sm text-yellow-100 mb-4">₺499 / Ay</p>
                                <ul className="text-sm space-y-3 flex-grow">
                                    <li className="flex items-center gap-2"><span>✔️</span> Tüm Pro Özellikleri</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Marka Kiti (Logo/Font)</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Çoklu Ekip Yönetimi</li>
                                    <li className="flex items-center gap-2"><span>✔️</span> Özel API Erişimi</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                )}

                <div className="mt-10 flex justify-between items-center">
                    {step > 1 ? <button onClick={() => setStep(step - 1)} className="text-gray-500 font-semibold hover:text-gray-800 transition-colors">Geri</button> : <div></div>}

                    {/* GÜNCELLENDİ: "İleri" butonu artık handleNextStep fonksiyonuna gidiyor, güvenlikten geçmeyen adım atlayamaz! */}
                    {step < 4 ? <button disabled={step === 2 && selectedCategories.length === 0} onClick={handleNextStep} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 disabled:opacity-50">İleri</button> : 
                    <button onClick={handleRegisterAndStart} disabled={isLoading} className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-800 transition-all text-center hover:scale-105 disabled:opacity-50 disabled:scale-100">
                        {isLoading ? "Kaydediliyor..." : "Kayıt Ol ve Başla"}
                    </button>}
                </div>

            </div>
        </div>
    );
}