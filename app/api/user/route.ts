import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        // YENİ: language parametresi eklendi. Frontend göndermezse varsayılan olarak "tr" (Türkçe) kabul edilecek, böylece sistem ASLA çökmeyecek.
        const { email, newPassword, currentPassword, plan, categories, language = "tr" } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const errorMsg = language === "en" ? "User not found." : language === "de" ? "Benutzer nicht gefunden." : "Kullanıcı bulunamadı.";
            return NextResponse.json({ error: errorMsg }, { status: 404 });
        }

        const updateData: any = {};

        // 1. Şifre Güncelleme İsteği Varsa
        if (newPassword && currentPassword) {
            if (user.password !== currentPassword) {
                const errorMsg = language === "en" ? "Current password is incorrect!" : language === "de" ? "Aktuelles Passwort ist falsch!" : "Mevcut şifreniz yanlış!";
                return NextResponse.json({ error: errorMsg }, { status: 400 });
            }
            updateData.password = newPassword;
        }

        // 2. GÜNCELLENDİ: Plan Yükseltme İsteği Varsa (Gerçek Kredi Limitleri)
        if (plan) {
            updateData.plan = plan;
            if (plan === "Standart") updateData.credits = 3;
            else if (plan === "Pro") updateData.credits = 50;
            else if (plan === "Gold") updateData.credits = 200;
        }

        // 3. Kategori Güncelleme İsteği Varsa
        if (categories) {
            updateData.categories = JSON.stringify(categories);
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: updateData
        });

        const successMsg = language === "en" ? "Information updated successfully." : language === "de" ? "Informationen erfolgreich aktualisiert." : "Bilgiler başarıyla güncellendi.";

        return NextResponse.json({
            message: successMsg,
            user: {
                plan: updatedUser.plan,
                credits: updatedUser.credits,
                categories: JSON.parse(updatedUser.categories)
            }
        }, { status: 200 });

    } catch (error) {
        const errorMsg = language === "en" ? "An error occurred during the update." : language === "de" ? "Während der Aktualisierung ist ein Fehler aufgetreten." : "Güncelleme sırasında bir hata oluştu.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}