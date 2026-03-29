"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    // YENİ: Şifremi Unuttum Sayfası Metinleri İçin Akıllı Sözlük
    const translations = {
        tr: {
            backToLogin: "← Giriş'e Dön",
            title: "Şifreni mi Unuttun?",
            desc: "Sorun değil. E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.",
            emailPlaceholder: "Kayıtlı E-posta Adresiniz",
            btnSending: "Gönderiliyor...",
            btnSend: "Sıfırlama Linki Gönder",
            successMsg1: "✅ Sıfırlama bağlantısı ",
            successMsg2: " adresine gönderildi. Lütfen gelen kutunuzu kontrol edin.",
            tryAnother: "Farklı bir e-posta adresi dene"
        },
        en: {
            backToLogin: "← Back to Login",
            title: "Forgot Your Password?",
            desc: "No problem. Enter your email address and we'll send you a reset link.",
            emailPlaceholder: "Registered Email Address",
            btnSending: "Sending...",
            btnSend: "Send Reset Link",
            successMsg1: "✅ A reset link has been sent to ",
            successMsg2: ". Please check your inbox.",
            tryAnother: "Try a different email address"
        },
        de: {
            backToLogin: "← Zurück zum Login",
            title: "Passwort vergessen?",
            desc: "Kein Problem. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link.",
            emailPlaceholder: "Registrierte E-Mail-Adresse",
            btnSending: "Wird gesendet...",
            btnSend: "Zurücksetzungslink senden",
            successMsg1: "✅ Ein Zurücksetzungslink wurde an ",
            successMsg2: " gesendet. Bitte überprüfen Sie Ihren Posteingang.",
            tryAnother: "Versuchen Sie eine andere E-Mail-Adresse"
        }
    };

    const t = translations[language as keyof typeof translations];

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
                    {t.backToLogin}
                </Link>

                <div className="text-center mt-6 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-2xl mb-4 shadow-sm">
                        🔒
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{t.title}</h2>
                    <p className="text-gray-500 mt-2">{t.desc}</p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--color-primary)] shadow-sm" required />
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-[var(--color-primary)] text-white px-8 py-4 mt-2 rounded-xl font-bold shadow-xl hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100">
                            {isLoading ? t.btnSending : t.btnSend}
                        </button>
                    </form>
                ) : (
                    <div className="text-center animate-fade-in">
                        <div className="bg-green-100 text-green-700 p-4 rounded-xl font-medium mb-6">
                            {t.successMsg1}<strong>{email}</strong>{t.successMsg2}
                        </div>
                        <button onClick={() => setIsSent(false)} className="text-[var(--color-primary)] font-bold hover:underline text-sm">
                            {t.tryAnother}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}