import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
    try {
        // URL'den kullanıcının e-postasını alıyoruz
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "E-posta parametresi eksik." }, { status: 400 });
        }

        // Veritabanından kullanıcıyı ve ona ait içerikleri (en yeniden eskiye doğru) çekiyoruz
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                contents: {
                    orderBy: { createdAt: 'desc' } // En son üretilen en üstte görünsün
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        return NextResponse.json({ contents: user.contents }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "İçerikler getirilirken bir hata oluştu." }, { status: 500 });
    }
}