import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, type, platform, promptText, category, images } = body;

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

        let generatedAlternatives = [
            { title: "Hata Oluştu", caption: "Hata tespiti yapılıyor...", hashtags: "#hata" },
            { title: "Hata Oluştu", caption: "Lütfen biraz bekleyin.", hashtags: "#hata" },
            { title: "Hata Oluştu", caption: "Simülasyon modu aktif.", hashtags: "#hata" }
        ];

        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            generatedAlternatives[0].caption = "API Key (.env) bulunamadı! Dosyayı kaydettikten sonra terminali kapatıp (Ctrl+C) tekrar 'npm run dev' yaparak sunucuyu başlattığınızdan emin olun.";
        } else {
            try {
                const aiPrompt = `Sen, dünyanın en iyi dijital pazarlama ajansında çalışan, ${category} alanında uzmanlaşmış kıdemli bir Sosyal Medya Metin Yazarısın (Copywriter). 
                Görevin; ekte sana sunulan görseli/görselleri detaylıca analiz etmek ve kullanıcının "${promptText}" şeklindeki özel talimatını bu analizle harmanlayarak ${platform} platformu için tam 3 FARKLI içerik konsepti üretmektir.
                Sistemden gelen İçerik Türü: "${type}".

                SADECE VE SADECE JSON FORMATINDA BİR DİZİ (ARRAY) DÖN. Başka hiçbir açıklama metni yazma.

                ### ANALİZ VE ÜRETİM KURALLARI:
                1. GÖRSEL ANALİZİ ŞARTTIR: Görseldeki mimariyi, tasarımı, renkleri analiz et ve yazılarında bu detaylardan bahset.
                2. BAŞLIK (title): Bu başlık doğrudan FOTOĞRAFIN ÜSTÜNE yazılacak! Bu yüzden gönderi metninden (caption) TAMAMEN FARKLI olmalıdır. En fazla 3-6 kelimelik, kısa ve vurucu bir manşet yaz.
                3. AÇIKLAMA (caption) VE KAYDIRMALI MANTIĞI:
                   -> Eğer sana birden fazla görsel verildiyse (İçerik türü "Kaydırmalı (Carousel)" ise); mutlaka okuyucuyu kaydırmaya teşvik et ("Kaydırarak diğer açıları incele 👉" gibi). Görseller arasında bir hikaye köprüsü kur, "İlk karedeki ahşap sıcaklığı, ikinci karedeki aydınlatmayla buluşuyor..." tarzı bağlantılı uzun bir kurgu yarat.
                   -> Eğer tek görselse, o kareye odaklanan derin bir hikaye yaz.

                ### ÇIKTI FORMATI:
                [
                  {"title": "Görselin Üstüne Yazılacak Slogan 1", "caption": "Detaylı, emojili ve hikaye kuran gönderi açıklaması 1", "hashtags": "#etiket1 #etiket2"},
                  {"title": "Farklı Bir Slogan 2", "caption": "Farklı bir hikaye açısıyla yazılmış gönderi açıklaması 2", "hashtags": "#etiket3 #etiket4"},
                  {"title": "Soru Soran Vurucu Slogan 3", "caption": "Yorumlara yönlendiren gönderi açıklaması 3", "hashtags": "#etiket5 #etiket6"}
                ]`;

                let parts: any[] = [{ text: aiPrompt }];

                if (images && images.length > 0) {
                    images.forEach((base64Image: string) => {
                        const mimeType = base64Image.split(';')[0].split(':')[1];
                        const base64Data = base64Image.split(',')[1];
                        parts.push({
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        });
                    });
                }

                const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        contents: [{ parts: parts }],
                        generationConfig: {
                            responseMimeType: "application/json"
                        }
                    })
                });

                const aiData = await aiResponse.json();
                
                if (!aiResponse.ok) {
                    throw new Error(aiData.error?.message || "Google API isteği reddetti.");
                }

                if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
                    const aiText = aiData.candidates[0].content.parts[0].text;
                    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        const parsedAlternatives = JSON.parse(jsonMatch[0]);
                        generatedAlternatives = [
                            ...parsedAlternatives,
                            ...generatedAlternatives.slice(parsedAlternatives.length)
                        ].slice(0, 3);
                    } else {
                        throw new Error("Yapay zeka istenilen JSON formatında yanıt vermedi.");
                    }
                } else {
                    throw new Error("Yapay zeka boş yanıt döndürdü.");
                }

            } catch (e: any) {
                console.log("YZ Hatası:", e);
                generatedAlternatives[0].caption = `Teknik Hata: ${e.message}`;
            }
        }

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
            alternatives: generatedAlternatives 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Üretim sırasında sunucuda hata oluştu." }, { status: 500 });
    }
}