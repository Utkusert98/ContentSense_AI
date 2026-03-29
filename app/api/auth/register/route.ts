import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // GÜNCELLENDİ: language değişkenini body'den güvenli bir şekilde alıyoruz
        const { name, email, password, categories, plan, language = "tr" } = body;

        if (!email || !password) {
            const missingMsg = language === "en" ? "Email and password are required." : "E-posta ve şifre gereklidir.";
            return NextResponse.json({ error: missingMsg }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const existMsg = language === "en" ? "This email is already registered." : "Bu e-posta adresi zaten kayıtlı.";
            return NextResponse.json({ error: existMsg }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Prisma String beklediği için Array'i çeviriyoruz
        const categoriesString = Array.isArray(categories) ? categories.join(", ") : (categories || "");

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                plan: plan || "Standart",
                credits: plan === "Standart" ? 3 : 9999,
                categories: categoriesString
            },
        });

        const successMsg = language === "en" ? "Registration successful!" : "Kayıt başarıyla tamamlandı!";
        return NextResponse.json({ message: successMsg, user }, { status: 201 });

    } catch (error: any) {
        console.error("Kayıt API Hatası:", error);
        
        // KRİTİK DÜZELTME: catch bloğu içinde language değişkenini artık sorgulamıyoruz 
        // Vercel'in patladığı kısım tam burasıydı.
        const errorMsg = "Kayıt sırasında teknik bir hata oluştu. Lütfen tekrar deneyin.";
        
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}