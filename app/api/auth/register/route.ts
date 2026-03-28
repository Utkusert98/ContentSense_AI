import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        // 1. Bu e-posta ile daha önce kayıt olunmuş mu kontrol et
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda! Lütfen giriş yapın veya farklı bir e-posta deneyin." }, { status: 400 });
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
                categories: '["Genel", "Trendler"]' // İŞTE ÇÖZÜM BURADA!
            }
        });

        // 4. Başarı mesajı dön
        return NextResponse.json({ message: "Kayıt işlemi kusursuz şekilde tamamlandı!", user: newUser }, { status: 201 });

    } catch (error: any) {
        console.error("Kayıt API Hatası:", error);
        return NextResponse.json({ error: `Arka Plan Hatası: ${error.message}` }, { status: 500 });
    }
}