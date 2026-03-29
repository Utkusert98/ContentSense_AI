import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // YENİ: language parametresi eklendi. Frontend göndermezse varsayılan "tr" kabul edilir, sistem asla çökmez.
        const { email, password, language = "tr" } = body;

        // 1. Veritabanında bu e-postaya ait kullanıcı var mı?
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Kullanıcı yoksa veya şifre eşleşmiyorsa hata dön
        if (!user || user.password !== password) {
            const errorMsg = language === "en" ? "Invalid email or password!" : language === "de" ? "Falsche E-Mail oder Passwort!" : "E-posta veya şifre hatalı!";
            return NextResponse.json({ error: errorMsg }, { status: 401 });
        }

        const successMsg = language === "en" ? "Login successful!" : language === "de" ? "Anmeldung erfolgreich!" : "Giriş başarılı!";

        // 2. Başarılıysa kullanıcının bilgilerini (Plan, Kredi, Kategoriler) Frontend'e yolla
        return NextResponse.json({ 
            message: successMsg, 
            user: {
                name: user.name,
                email: user.email,
                plan: user.plan,
                credits: user.credits,
                categories: JSON.parse(user.categories)
            }
        }, { status: 200 });

    } catch (error) {
        const errorMsg = language === "en" ? "An error occurred during login." : language === "de" ? "Beim Anmelden ist ein Fehler aufgetreten." : "Giriş yapılırken bir hata oluştu.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}