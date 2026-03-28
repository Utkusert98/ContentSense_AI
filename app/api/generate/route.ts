import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, type, platform, promptText, category } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

        if (user.plan === "Standart" && user.credits <= 0) {
            return NextResponse.json({ error: "Krediniz bitti! Lütfen paketinizi yükseltin." }, { status: 403 });
        }

        let newCredits = user.credits;
        if (user.plan === "Standart") {
            newCredits -= 1;
            await prisma.user.update({ where: { email }, data: { credits: newCredits } });
        }

        // --- GERÇEK YAPAY ZEKA (GEMINI) 3 ALTERNATİF ÜRETİMİ ---
        let generatedAlternatives = [
            { title: `${category} Konsept 1`, caption: `Harika bir ${platform} içeriği. ${promptText}`, hashtags: "#trend #yeni" },
            { title: `${category} Konsept 2`, caption: `Etkileşim garantili ${platform} metni.`, hashtags: "#keşfet #içerik" },
            { title: `${category} Konsept 3`, caption: `Profesyonel bir bakış açısı.`, hashtags: "#profesyonel #sosyalmedya" }
        ];

        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (apiKey) {
            try {
                // YZ'den kesinlikle bir JSON DİZİSİ (Array) istiyoruz
                const aiPrompt = `Sen profesyonel bir sosyal medya uzmanısın. Hedef platform: "${platform}". Format: "${type}". Kategori: "${category}". Kullanıcının özel notu: "${promptText}". 
                Bana bu veriler ışığında tam 3 FARKLI içerik konsepti üret. 
                SADECE JSON formatında bir DİZİ (Array) dön. Başka hiçbir açıklama yazma.
                Format şu olmalı: 
                [
                  {"title": "Görsel Üstü Kısa Çarpıcı Başlık 1", "caption": "Instagram/LinkedIn vb. için emojili, etkileşim çeken uzun gönderi açıklaması", "hashtags": "#etiket1 #etiket2"},
                  {"title": "Görsel Üstü Kısa Çarpıcı Başlık 2", "caption": "Farklı bir tonda yazılmış gönderi açıklaması", "hashtags": "#etiket3 #etiket4"},
                  {"title": "Görsel Üstü Kısa Çarpıcı Başlık 3", "caption": "Soru soran, yorumlara yönlendiren gönderi açıklaması", "hashtags": "#etiket5 #etiket6"}
                ]`;

                const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }] })
                });

                const aiData = await aiResponse.json();
                const aiText = aiData.candidates[0].content.parts[0].text;
                
                const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                generatedAlternatives = JSON.parse(cleanJson);

            } catch (e) {
                console.log("YZ Hatası, yedek alternatifler kullanılıyor.", e);
            }
        }

        // İlk (Ana) konsepti veritabanına log olarak kaydediyoruz
        const content = await prisma.content.create({
            data: {
                userId: user.id,
                type,
                platform,
                promptText,
                title: generatedAlternatives[0].title,
                caption: generatedAlternatives[0].caption,
                hashtags: generatedAlternatives[0].hashtags
            }
        });

        return NextResponse.json({ 
            message: "Üretim başarılı!", 
            newCredits: user.plan === "Standart" ? newCredits : "Sınırsız",
            content,
            alternatives: generatedAlternatives // 3 alternatifi Frontend'e yolluyoruz
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Üretim sırasında hata oluştu." }, { status: 500 });
    }
}