import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, categories, plan, language = "tr" } = body;

        if (!email || !password) {
            const missingMsg = language === "en" ? "Email and password are required." : language === "de" ? "E-Mail und Passwort sind erforderlich." : "E-posta ve şifre gereklidir.";
            return NextResponse.json({ error: missingMsg }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const existMsg = language === "en" ? "This email is already registered." : language === "de" ? "Diese E-Mail ist bereits registriert." : "Bu e-posta adresi zaten kayıtlı.";
            return NextResponse.json({ error: existMsg }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // GÜNCELLENDİ: Prisma 'String' beklediği için Array'i virgülle ayrılmış metne çeviriyoruz
        const categoriesString = Array.isArray(categories) ? categories.join(", ") : (categories || "");

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                plan: plan || "Standart",
                credits: plan === "Standart" ? 3 : 9999,
                categories: categoriesString // Artık hata vermeyecek
            },
        });

        const successMsg = language === "en" ? "Registration successful!" : language === "de" ? "Registrierung erfolgreich!" : "Kayıt başarıyla tamamlandı!";
        return NextResponse.json({ message: successMsg, user }, { status: 201 });

    } catch (error) {
        console.error("Registration API Error:", error);
        const errorMsg = "Kayıt sırasında bir hata oluştu.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}