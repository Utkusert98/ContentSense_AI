import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { email, newPassword, currentPassword, plan, categories } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

        const updateData: any = {};

        // 1. Şifre Güncelleme İsteği Varsa
        if (newPassword && currentPassword) {
            if (user.password !== currentPassword) {
                return NextResponse.json({ error: "Mevcut şifreniz yanlış!" }, { status: 400 });
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

        return NextResponse.json({
            message: "Bilgiler başarıyla güncellendi.",
            user: {
                plan: updatedUser.plan,
                credits: updatedUser.credits,
                categories: JSON.parse(updatedUser.categories)
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Güncelleme sırasında bir hata oluştu." }, { status: 500 });
    }
}