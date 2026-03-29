import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // YENİ: language parametresi eklendi. Frontend göndermezse varsayılan olarak "tr" kabul edilecek ve sistem asla çökmeyecek.
        const { name, email, password, language = "tr" } = body;

        // 1. Bu e-posta ile daha önce kayıt olunmuş mu kontrol et
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            const errorMsg = language === "en" ? "This email is already in use! Please log in or try a different email." : language === "de" ? "Diese E-Mail-Adresse wird bereits verwendet! Bitte melden Sie sich an oder versuchen Sie eine andere E-Mail." : "Bu e-posta adresi zaten kullanımda! Lütfen giriş yapın veya farklı bir e-posta deneyin.";
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        // 2. Şifreyi Kriptola (Güvenlik)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Kullanıcıyı Veritabanına Kaydet (Eksik olan 'categories' parçası eklendi!)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                plan: "Standart",
                credits: 3,
                categories: '["Genel", "Trendler"]' 
            }
        });

        const successMsg = language === "en" ? "Registration completed flawlessly!" : language === "de" ? "Registrierung einwandfrei abgeschlossen!" : "Kayıt işlemi kusursuz şekilde tamamlandı!";

        // 4. Başarı mesajı dön
        return NextResponse.json({ message: successMsg, user: newUser }, { status: 201 });

    } catch (error: any) {
        console.error("Kayıt API Hatası:", error);
        const errorMsg = language === "en" ? `Background Error: ${error.message}` : language === "de" ? `Hintergrundfehler: ${error.message}` : `Arka Plan Hatası: ${error.message}`;
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}