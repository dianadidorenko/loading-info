import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db"; // твой путь к призме

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Хешируем пароль (10 - оптимальная сложность)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Сохраняем в базу
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Пользователь создан" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 },
    );
  }
}
