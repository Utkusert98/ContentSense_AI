"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Şifre sıfırlama simülasyonu
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f3f4f6]">
            <div className="glass-panel w-full max-w-md p-10 relative overflow-hidden z-50 bg-white/80 backdrop-blur-xl">
                
                <Link href="/login" className="absolute top-6 left-6 text-gray-400 hover:text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 transition-colors">
                    ← Giriş'e Dön
                </Link>

                <div className="text-center mt-6 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-2xl mb-4 shadow-sm">
                        🔒
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Şifreni mi Unuttun?</h2>
                    <p className="text-gray-500 mt-2">Sorun değil. E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.</p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Kayıtlı E-posta Adresiniz" className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)] shadow-sm" required />
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-[var(--color-primary)] text-white px-8 py-4 mt-2 rounded-xl font-bold shadow-xl hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100">
                            {isLoading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center animate-fade-in">
                        <div className="bg-green-100 text-green-700 p-4 rounded-xl font-medium mb-6">
                            ✅ Sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi. Lütfen gelen kutunuzu kontrol edin.
                        </div>
                        <button onClick={() => setIsSent(false)} className="text-[var(--color-primary)] font-bold hover:underline text-sm">
                            Farklı bir e-posta adresi dene
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}