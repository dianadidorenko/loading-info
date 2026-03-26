"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addOrder(formData) {
  const data = {
    factoryName: formData.get("factoryName"),
    furnitureType: formData.get("furnitureType"),
    proformaNumber: formData.get("proformaNumber"),
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"), // Добавили
    clientAddress: formData.get("clientAddress"), // Добавили
    isExpo: formData.get("isExpo") === "on",
    paidAt: formData.get("paidAt") ? new Date(formData.get("paidAt")) : null,
    readyDate: formData.get("readyDate")
      ? new Date(formData.get("readyDate"))
      : null,
    status: "todo",
  };

  await db.order.create({ data });
  revalidatePath("/");
}

// Универсальная функция обновления (для дат и статусов)
export async function updateOrderField(id, updateData) {
  const finalData = { ...updateData };

  // Список всех полей, которые являются датами в базе
  const dateFields = ["paidAt", "readyDate", "shippedDate"];

  dateFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      finalData[field] = updateData[field] ? new Date(updateData[field]) : null;
    }
  });

  await db.order.update({
    where: { id },
    data: finalData,
  });
  revalidatePath("/");
}

export async function deleteOrder(id) {
  await db.order.delete({ where: { id } });
  revalidatePath("/");
}
