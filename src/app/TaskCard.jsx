"use client";
import { useState, useEffect } from "react";
import { updateOrderField, deleteOrder } from "./actions";
import { ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";

export default function TaskCard({ task }) {
  const [mounted, setMounted] = useState(false);

  // 1. Инициализируем состояние из localStorage (если оно там есть)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`collapsed_${task.id}`);
      return saved === "true"; // localStorage хранит строки, переводим в boolean
    }
    return false;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Следим за изменением isCollapsed и записываем в localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(`collapsed_${task.id}`, isCollapsed);
    }
  }, [isCollapsed, task.id, mounted]);

  // Твоя оригинальная логика статусов
  const renderShipStatus = () => {
    if (task.shippingRequest === "sent") return "Заявка отправлена";
    if (task.shippingRequest === "requested") return "Заявка готова";
    return "Нет заявки на отгрузку";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (!mounted) return "...";
    return new Date(date).toLocaleDateString();
  };

  const handleBlur = (fieldName, value) => {
    if (task[fieldName] !== value) {
      updateOrderField(task.id, { [fieldName]: value });
    }
  };

  // Отрисовываем пустой каркас или скелетон, пока компонент не "гидратировался"
  // Это предотвращает ошибку несоответствия серверного и клиентского HTML
  if (!mounted)
    return <div className="h-[100px] bg-gray-50 animate-pulse rounded-2xl" />;

  // --- РЕЖИМ 1: СВЕРНУТАЯ КАРТОЧКА ---
  if (isCollapsed) {
    return (
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex justify-between gap-6 items-center shadow-sm hover:bg-white transition-all w-full">
        <div className="flex flex-col gap-1 overflow-hidden">
          <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest truncate">
            {task.factoryName || "Завод не указан"}
          </span>
          <span className="text-[13px] text-gray-600 italic truncate">
            🪑 {task.furnitureType || "Тип мебели"}
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 px-3 shrink-0"
        >
          <span className="text-[10px] font-bold uppercase">Развернуть</span>
          <ListChevronsUpDown size={18} />
        </button>
      </div>
    );
  }

  // --- РЕЖИМ 2: РАЗВЕРНУТАЯ КАРТОЧКА ---
  return (
    <div className="relative bg-white p-4 pt-8 rounded-2xl shadow-sm border border-gray-100 text-black hover:shadow-md transition-all flex gap-4 h-full group justify-between w-full">
      <div className="flex gap-2 items-center absolute top-3 right-3">
        <button
          onClick={() => {
            if (confirm("Удалить запись?")) {
              deleteOrder(task.id);
              localStorage.removeItem(`collapsed_${task.id}`); // Чистим мусор при удалении
            }
          }}
          className="cursor-pointer text-[17px] text-red-200 hover:text-red-500 text-center uppercase font-bold transition-colors"
        >
          X
        </button>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-300 hover:text-gray-500 rounded-2xl transition-colors hover:cursor-pointer"
          title="Свернуть"
        >
          <ListChevronsDownUp size={20} />
        </button>
      </div>

      {/* Левая колонка */}
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-end mb-3">
          <input
            defaultValue={task.factoryName}
            onBlur={(e) => handleBlur("factoryName", e.target.value)}
            className="text-[15px] font-bold text-blue-800 uppercase tracking-wider border-b-2 border-blue-100 pb-1 bg-transparent outline-none focus:border-blue-400 w-full"
            placeholder="Название фабрики"
          />
          {task.isExpo && (
            <span className="text-[10px] bg-amber-400 text-white px-2 py-0.5 rounded-full font-bold shadow-sm ml-2 whitespace-nowrap">
              EXPO 🖼️
            </span>
          )}
        </div>

        <div className="text-[13px] space-y-2 flex-grow">
          <div className="pb-2 border-b border-gray-50 text-gray-800">
            <div className="flex items-center gap-1">
              <span>🪑</span>
              <input
                defaultValue={task.furnitureType}
                onBlur={(e) => handleBlur("furnitureType", e.target.value)}
                className="font-medium italic bg-transparent outline-none focus:bg-gray-50 rounded px-1 w-full"
                placeholder="Тип мебели"
              />
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 mt-1">
              <span>№ проформы:</span>
              <input
                defaultValue={task.proformaNumber}
                onBlur={(e) => handleBlur("proformaNumber", e.target.value)}
                className="bg-gray-100 border border-gray-300 px-1 rounded outline-none w-24 transition-all"
              />
            </div>
          </div>

          <div className="bg-blue-50/40 p-2 rounded-xl border border-blue-100/50 space-y-2">
            <div className="flex items-center gap-1 font-bold text-blue-900">
              <span>👤</span>
              <input
                defaultValue={task.clientName}
                onBlur={(e) => handleBlur("clientName", e.target.value)}
                className="bg-transparent outline-none w-full"
                placeholder="Имя клиента"
              />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-600">
              <span>📞</span>
              <input
                defaultValue={task.clientPhone}
                onBlur={(e) => handleBlur("clientPhone", e.target.value)}
                className="bg-transparent outline-none w-full font-mono"
                placeholder="Телефон"
              />
            </div>
          </div>

          <div
            className={`text-[11px] font-black flex items-center justify-center my-4 border border-gray-250 rounded-xl p-1 text-center ${
              task.shippingRequest === "sent"
                ? "text-blue-700"
                : task.shippingRequest === "requested"
                  ? "text-green-700"
                  : "text-gray-500"
            }`}
          >
            {renderShipStatus()}
          </div>
        </div>
      </div>

      {/* Правая колонка */}
      <div className="flex flex-col w-full">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label
              className={`text-[10px] uppercase font-bold ml-1 ${task.paidAt ? "text-green-600" : "text-red-500"}`}
            >
              💰 {task.paidAt ? `Оплачено:` : "Не оплачено"}
            </label>
            <input
              type="date"
              defaultValue={
                task.paidAt
                  ? new Date(task.paidAt).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                updateOrderField(task.id, { paidAt: e.target.value })
              }
              className="text-xs border rounded-lg px-2 py-1.5 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">
              📅 Готовность:
            </label>
            <input
              type="date"
              defaultValue={
                task.readyDate
                  ? new Date(task.readyDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                updateOrderField(task.id, { readyDate: e.target.value })
              }
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
            />
          </div>

          <div className="border-t border-gray-50">
            <label className="text-[10px] text-gray-400 block mb-1 uppercase font-black tracking-tighter">
              📅 Дата отгрузки
            </label>
            <input
              type="date"
              defaultValue={
                task.shippedDate
                  ? new Date(task.shippedDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                updateOrderField(task.id, { shippedDate: e.target.value })
              }
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 w-full outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 w-full">
          <button
            onClick={() =>
              updateOrderField(task.id, { shippingRequest: "requested" })
            }
            className={`text-[10px] py-1.5 rounded-lg font-bold transition-all shadow-sm ${
              task.shippingRequest === "requested"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Заявка ✅
          </button>
          <button
            onClick={() =>
              updateOrderField(task.id, { shippingRequest: "sent" })
            }
            className={`text-[10px] py-1.5 rounded-lg font-bold transition-all shadow-sm ${
              task.shippingRequest === "sent"
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            Отправлена 🔘
          </button>

          {task.shippingRequest && task.shippingRequest !== "" && (
            <button
              onClick={() => updateOrderField(task.id, { shippingRequest: "" })} // Заменили на ""
              className="col-span-2 text-[10px] bg-gray-50 text-gray-400 py-1.5 rounded-lg border border-dashed border-gray-200 transition-all mt-1 hover:bg-gray-100"
            >
              Сбросить статус 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
