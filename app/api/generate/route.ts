import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // YENİ: language parametresi eklendi. Frontend göndermezse "tr" kabul edip sistemi korur.
        const { email, type, platform, promptText, category, images, language = "tr" } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const errorMsg = language === "en" ? "User not found." : language === "de" ? "Benutzer nicht gefunden." : "Kullanıcı bulunamadı.";
            return NextResponse.json({ error: errorMsg }, { status: 404 });
        }

        if (user.plan === "Standart" && user.credits <= 0) {
            const errorMsg = language === "en" ? "Out of credits! Please upgrade your plan." : language === "de" ? "Kein Guthaben mehr! Bitte aktualisieren Sie Ihren Plan." : "Krediniz bitti! Lütfen paketinizi yükseltin.";
            return NextResponse.json({ error: errorMsg }, { status: 403 });
        }

        let newCredits = user.credits;
        if (user.plan === "Standart") {
            newCredits -= 1;
            await prisma.user.update({ where: { email }, data: { credits: newCredits } });
        }

        // YENİ: Hata durumundaki yedek metinler bile seçilen dile göre uyarlandı
        const errTitle = language === "en" ? "Error Occurred" : language === "de" ? "Fehler Aufgetreten" : "Hata Oluştu";
        const errCaption1 = language === "en" ? "AI couldn't craft the text feast..." : language === "de" ? "KI konnte das Textfest nicht gestalten..." : "Yapay zeka metin şölenini kurgulayamadı...";
        const errCaption2 = language === "en" ? "Loading backup texts." : language === "de" ? "Backup-Texte werden geladen." : "Yedek metinler yükleniyor.";
        const errCaption3 = language === "en" ? "Please check the terminal." : language === "de" ? "Bitte überprüfen Sie das Terminal." : "Lütfen terminali kontrol edin.";
        const errHashtags = language === "en" ? "#error #textfeast" : language === "de" ? "#fehler #textfest" : "#hata #metinsoeleni";

        let generatedAlternatives = [
            { title: errTitle, caption: errCaption1, hashtags: errHashtags },
            { title: errTitle, caption: errCaption2, hashtags: errHashtags },
            { title: errTitle, caption: errCaption3, hashtags: errHashtags }
        ];

        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            generatedAlternatives[0].caption = language === "en" ? "API Key (.env) not found! After saving the file, press (Ctrl+C) in the terminal and run 'npm run dev' to restart the server." : language === "de" ? "API Key (.env) nicht gefunden! Drücken Sie nach dem Speichern der Datei (Strg+C) im Terminal und führen Sie 'npm run dev' aus, um den Server neu zu starten." : "API Key (.env) bulunamadı! Dosyayı kaydettikten sonra terminali kapatıp (Ctrl+C) tekrar 'npm run dev' yaparak sunucuyu başlattığınızdan emin olun.";
        } else {
            try {
                // YENİ: Gemini'ye verilecek DİL EMRİ için hedef dilin tam adını belirliyoruz
                const targetLangName = language === "en" ? "İngilizce (English)" : language === "de" ? "Almanca (Deutsch)" : "Türkçe";

                // GÜNCELLENDİ: "DİL KURALI" eklendi! Geri kalan muazzam prompt yapısına ve kurallara zerre dokunulmadı!
                const aiPrompt = `Sen, dünyanın en iyi dijital pazarlama ajansında çalışan, ${category} alanında uzmanlaşmış kıdemli bir Sosyal Medya Metin Yazarısın (Copywriter). 
                Görevin; ekte sana sunulan görseli/görselleri detaylıca analiz etmek ve kullanıcının "${promptText}" şeklindeki özel talimatını bu analizle harmanlayarak ${platform} platformu için tam 3 FARKLI metin şöleni konsepti üretmektir.
                Gelen İçerik Türü: "${type}". (Eğer birden fazla görsel varsa, bunun bir kaydırmalı post olduğunu bil ve görseller arası bağlantı kur).

                SADECE VE SADECE JSON FORMATINDA BİR DİZİ (ARRAY) DÖN. Başka hiçbir açıklama metni yazma.

                ### ANALİZ VE ÜRETİM KURALLARI:
                1. GÖRSEL ANALİZİ ŞARTTIR: Görsellerdeki detayları (tasarım, renk, stil vb.) analiz et. Eğer birden fazla görsel (max 3) geldiyse, her birinin anlattığı hikayenin birbiriyle bağlantılı olduğunu unutma.
                2. GÖRSEL ÜSTÜ METNİ (title): Bu metin doğrudan FOTOĞRAFIN ÜSTÜNE yazılacak! Sadece kısa ve kuru bir slogan OLMAYACAK. Vurucu bir girişin ardından, samimi ve etkileyici bir "metin şöleni" (1-2 cümlelik duygu aktarımı) içerecek. (Örn: "Işığın peşinden git. Ahşabın o sıcak dokusunda kaybolurken, ruhunu dinlendiren o ince detayı hisset...")
                3. GÖNDERİ METNİ (caption): Bu metin gönderinin altında okunacak uzun kısımdır. GÖRSELİN ÜSTÜNDEKİ YAZIYLA (title) doğrudan bağlantılı olmalı! Görselin üstünde yazdığın o metin şölenini alıp, hikayeyi daha da derinleştiren, tamamen farklı ama o yazıyı destekleyen BÜYÜK bir metin şöleni sunmalıdır. Görselin üstündeki yazıyı asla birebir tekrar etme, onu açıkla ve genişlet.
                4. DİL KURALI: Üreteceğin tüm içerikler (title, caption ve hashtags) KESİNLİKLE VE SADECE ${targetLangName} dilinde yazılmalıdır!

                ### ÇIKTI FORMATI (Örnek Şablondur, İçeriği Sen Üreteceksin):
                [
                  {"title": "Vurucu giriş! Devamında samimi, etkileyici ve görselin ruhunu yansıtan harika bir mini metin şöleni...", "caption": "Görselin üzerindeki o duyguyu alıp daha da derinleştiren, okuyucuyu içine çeken, emojilerle süslenmiş ve o yazıyla bağlantılı upuzun bir gönderi açıklaması...", "hashtags": "#etiket1 #etiket2 #metinsoeleni"},
                  {"title": "Farklı bir vurucu giriş! Görseldeki diğer detayı öne çıkaran şairane bir metin...", "caption": "İkinci görsel metninin hikayesini anlatan, ona atıfta bulunan yepyeni bir bakış açısı...", "hashtags": "#etiket3 #etiket4 #metinsoeleni"},
                  {"title": "Soru soran vurucu giriş! Takipçiyle bağ kuran samimi bir görsel yazısı...", "caption": "Görselin üzerindeki soruyu destekleyen, yorumlara yönlendiren ve hikayeyi bağlayan detaylı açıklama...", "hashtags": "#etiket5 #etiket6 #metinsoeleni"}
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
                const techErr = language === "en" ? "Technical Error: " : language === "de" ? "Technischer Fehler: " : "Teknik Hata: ";
                generatedAlternatives[0].caption = `${techErr}${e.message}`;
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

        const successMsg = language === "en" ? "Generation successful!" : language === "de" ? "Erstellung erfolgreich!" : "Üretim başarılı!";

        return NextResponse.json({ 
            message: successMsg, 
            newCredits: user.plan === "Standart" ? newCredits : "Sınırsız",
            content,
            alternatives: generatedAlternatives 
        }, { status: 200 });

    } catch (error) {
        const errorMsg = language === "en" ? "An error occurred on the server during generation." : language === "de" ? "Während der Generierung ist ein Serverfehler aufgetreten." : "Üretim sırasında sunucuda hata oluştu.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}