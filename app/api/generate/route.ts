import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, type, platform, promptText, category } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı, lütfen tekrar giriş yapın." }, { status: 404 });

        if (user.plan === "Standart" && user.credits <= 0) {
            return NextResponse.json({ error: "Krediniz bitti! Lütfen paketinizi Pro veya Gold'a yükseltin." }, { status: 403 });
        }

        // Krediyi düşür
        let newCredits = user.credits;
        if (user.plan === "Standart") {
            newCredits -= 1;
            await prisma.user.update({
                where: { email },
                data: { credits: newCredits }
            });
        }

        // --- GERÇEK YAPAY ZEKA (GEMINI) ENTEGRASYONU ---
        let generatedTitle = `${category} İçin Harika Bir İçerik`;
        let generatedCaption = `Merhaba! ${platform} platformu için hazırladığımız bu özel ${type.toLowerCase()} içeriğiyle hedef kitlenizi etkilemeye hazır olun. İçerik notu: ${promptText}`;
        let generatedHashtags = `#${category.replace(/\s+/g, '').toLowerCase()} #sosyalmedya #trend`;

        // Eğer .env dosyasında GEMINI_API_KEY varsa Gerçek YZ'ye bağlanır
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (apiKey) {
            try {
                const aiPrompt = `Sen profesyonel bir sosyal medya uzmanısın. Kullanıcı benden şu platform için: "${platform}", şu formatta: "${type}", şu kategoride: "${category}" bir içerik üretmemi istiyor. Kullanıcının özel notu: "${promptText}". Bana SADECE JSON formatında bir cevap dön. JSON formatı şu şekilde olmalı: {"title": "çarpıcı 3-4 kelimelik başlık", "caption": "platforma uygun, emojiler barındıran etkileyici bir açıklama metni", "hashtags": "#etiket1 #etiket2 #etiket3"}`;

                const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: aiPrompt }] }]
                    })
                });

                const aiData = await aiResponse.json();
                const aiText = aiData.candidates[0].content.parts[0].text;
                
                // YZ'den dönen Markdown (```json) yapısını temizleyip objeye çeviriyoruz
                const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                
                generatedTitle = parsed.title;
                generatedCaption = parsed.caption;
                generatedHashtags = parsed.hashtags;

            } catch (e) {
                console.log("Yapay zeka servisine ulaşılamadı, yedek içerik kullanılıyor.");
            }
        }

        // Üretilen GERÇEK içeriği veritabanına kaydet
        const content = await prisma.content.create({
            data: {
                userId: user.id,
                type,
                platform,
                promptText,
                title: generatedTitle,
                caption: generatedCaption,
                hashtags: generatedHashtags
            }
        });

        return NextResponse.json({ 
            message: "Üretim başarılı!", 
            newCredits: user.plan === "Standart" ? newCredits : "Sınırsız",
            content 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Üretim sırasında sunucuda bir hata oluştu." }, { status: 500 });
    }
}