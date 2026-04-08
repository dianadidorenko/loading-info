import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { pin } = await req.json();
    const SECRET_PIN = "1234";

    console.log("\n--- [SERVER] ПРОВЕРКА ПИН-КОДА ---");
    if (pin === SECRET_PIN) {
      console.log("✅ ДОСТУП РАЗРЕШЕН: Очищаю блокировку...");
      return NextResponse.json({ success: true });
    } else {
      console.log("❌ ОТКАЗ: Неверный ввод.");
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
