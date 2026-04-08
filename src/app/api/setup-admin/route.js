import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db"; // Проверь этот путь!

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "База данных (db) не найдена. Проверь импорт." },
        { status: 500 },
      );
    }

    // Проверяем таблицу User (в Prisma она обычно с маленькой буквы в коде)
    const userExists = await db.user.findFirst();

    if (userExists) {
      return NextResponse.json({ error: "Админ уже существует в базе." });
    }

    const hashedPassword = await bcrypt.hash("11Edollar11E", 10);

    const newAdmin = await db.user.create({
      data: {
        email: "diana.didorenko@ukr.net", // Твой мейл
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Админ успешно создан!",
      user: newAdmin.email,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e.message,
        stack: "Проверь, что в schema.prisma модель называется 'User'",
      },
      { status: 500 },
    );
  }
}
