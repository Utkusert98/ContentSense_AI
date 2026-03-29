import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
    // YENİ: Hata yakalama (catch) bloğunda da seçili dili bilebilmek için değişkeni en üstte tanımlıyoruz.
    let language = "tr"; 

    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        
        // YENİ: Frontend'den gelen URL parametreleri arasına "language" eklendiyse onu al, yoksa "tr" kabul edip sistemi koru.
        language = searchParams.get("language") || "tr"; 

        if (!email) {
            const errorMsg = language === "en" ? "Email address is required." : language === "de" ? "E-Mail-Adresse ist erforderlich." : "E-posta adresi gerekli.";
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ 
            where: { email } 
        });

        if (!user) {
            const errorMsg = language === "en" ? "User not found." : language === "de" ? "Benutzer nicht gefunden." : "Kullanıcı bulunamadı.";
            return NextResponse.json({ error: errorMsg }, { status: 404 });
        }

        // Kullanıcının tüm içeriklerini en yeniden en eskiye doğru çek
        const contents = await prisma.content.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ contents }, { status: 200 });

    } catch (error: any) {
        console.error("İçerik Çekme Hatası:", error);
        const errorMsg = language === "en" ? "A server error occurred while loading contents." : language === "de" ? "Beim Laden der Inhalte ist ein Serverfehler aufgetreten." : "İçerikler yüklenirken bir sunucu hatası oluştu.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}