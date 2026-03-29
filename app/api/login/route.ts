import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // 1. Veritabanında bu e-postaya ait kullanıcı var mı?
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Kullanıcı yoksa veya şifre eşleşmiyorsa hata dön
        if (!user || user.password !== password) {
            return NextResponse.json({ error: "E-posta veya şifre hatalı!" }, { status: 401 });
        }

        // 2. Başarılıysa kullanıcının bilgilerini (Plan, Kredi, Kategoriler) Frontend'e yolla
        return NextResponse.json({ 
            message: "Giriş başarılı!", 
            user: {
                name: user.name,
                email: user.email,
                plan: user.plan,
                credits: user.credits,
                categories: JSON.parse(user.categories)
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Giriş yapılırken bir hata oluştu." }, { status: 500 });
    }
}