import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // GÜNCELLENDİ: language değişkenini güvenli bir şekilde alıyoruz
        const { platform, promptText, category, images, language = "tr" } = body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Yapay zekaya giden dil emri
        const langCommand = language === "en" ? "Respond ONLY in English." : language === "de" ? "Respond ONLY in German." : "Sadece Türkçe cevap ver.";

        const prompt = `
            You are a professional social media content creator. 
            User Language Preference: ${langCommand}
            Category: ${category}
            Target Platform: ${platform}
            User Instructions: ${promptText}

            Please analyze the image(s) provided and generate 3 distinct content alternatives.
            For each alternative, provide:
            1. A catchy 'title' for the visual.
            2. A compelling 'caption' for the post.
            3. Relevant 'hashtags'.

            STRICT RULE: Format the response ONLY as a raw valid JSON object. Do not include markdown code blocks.
            Structure:
            {
              "alternatives": [
                { "title": "...", "caption": "...", "hashtags": "..." },
                { "title": "...", "caption": "...", "hashtags": "..." },
                { "title": "...", "caption": "...", "hashtags": "..." }
              ],
              "content": { "title": "General Topic", "platform": "${platform}", "type": "Image Post" }
            }
        `;

        const imageParts = images.map((base64Str: string) => ({
            inlineData: {
                data: base64Str.split(",")[1],
                mimeType: "image/jpeg",
            },
        }));

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        let text = response.text();

        // JSON temizleme işlemi
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const cleanJson = text.substring(jsonStart, jsonEnd);
        
        const parsedData = JSON.parse(cleanJson);

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error("AI Generation API Error:", error);
        
        // KRİTİK DÜZELTME: catch bloğu içinde tanımlı olmayan 'language' değişkenini sildik
        // Vercel'in hata verdiği 146. satırı düzelttik.
        const errorMsg = "İçerik üretilirken teknik bir hata oluştu. Lütfen tekrar deneyin.";
        
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}