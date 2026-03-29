import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // GÜNCELLENDİ: language değişkenini body'den güvenli bir şekilde alıyoruz
        const { email, password, language = "tr" } = body;

        if (!email || !password) {
            const missingMsg = language === "en" ? "Email and password are required." : "E-posta ve şifre gereklidir.";
            return NextResponse.json({ error: missingMsg }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const userMsg = language === "en" ? "User not found." : "Kullanıcı bulunamadı.";
            return NextResponse.json({ error: userMsg }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const passMsg = language === "en" ? "Invalid password." : "Geçersiz şifre.";
            return NextResponse.json({ error: passMsg }, { status: 401 });
        }

        const successMsg = language === "en" ? "Login successful!" : "Giriş başarılı!";
        return NextResponse.json({ message: successMsg, user }, { status: 200 });

    } catch (error) {
        console.error("Giriş API Hatası:", error);
        
        // KRİTİK DÜZELTME: Vercel'in hata verdiği o 36. satırdaki 'language' belirsizliğini sildik.
        const errorMsg = "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.";
        
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}