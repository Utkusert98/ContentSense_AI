import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // YENİ: language parametresi eklendi. Frontend göndermezse varsayılan olarak "tr" (Türkçe) kabul edilecek, böylece sistem ASLA çökmeyecek.
        const { name, email, password, plan, categories, language = "tr" } = body;

        // E-posta daha önce kayıtlı mı kontrolü
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const errorMsg = language === "en" ? "This email is already registered." : language === "de" ? "Diese E-Mail ist bereits registriert." : "Bu e-posta zaten kayıtlı.";
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        const defaultName = language === "en" ? "Anonymous User" : language === "de" ? "Anonymer Benutzer" : "İsimsiz Kullanıcı";

        // Kullanıcıyı veritabanına kaydet
        const user = await prisma.user.create({
            data: {
                name: name || defaultName,
                email,
                password, // Gerçek bir projede burası şifrelenir
                plan,
                categories: JSON.stringify(categories), // Kategorileri metne çevirip kaydediyoruz
                credits: plan === "Standart" ? 3 : 9999, // Standartsa 3 kredi, Pro/Gold ise sınırsız (9999)
            }
        });

        const successMsg = language === "en" ? "Registration successful!" : language === "de" ? "Registrierung erfolgreich!" : "Kayıt başarılı!";

        return NextResponse.json({ message: successMsg, user }, { status: 201 });
    } catch (error) {
        const errorMsg = language === "en" ? "An error occurred during registration." : language === "de" ? "Während der Registrierung ist ein Fehler aufgetreten." : "Kayıt sırasında bir hata oluştu.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}