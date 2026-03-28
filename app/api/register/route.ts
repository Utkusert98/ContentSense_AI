import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, plan, categories } = body;

        // E-posta daha önce kayıtlı mı kontrolü
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 400 });
        }

        // Kullanıcıyı veritabanına kaydet
        const user = await prisma.user.create({
            data: {
                name: name || "İsimsiz Kullanıcı",
                email,
                password, // Gerçek bir projede burası şifrelenir
                plan,
                categories: JSON.stringify(categories), // Kategorileri metne çevirip kaydediyoruz
                credits: plan === "Standart" ? 3 : 9999, // Standartsa 3 kredi, Pro/Gold ise sınırsız (9999)
            }
        });

        return NextResponse.json({ message: "Kayıt başarılı!", user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
    }
}