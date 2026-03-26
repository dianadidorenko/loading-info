"use client";
import { useState, useEffect } from "react";
import { updateOrderField, deleteOrder } from "./actions";

export default function TaskCard({ task }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Твоя оригинальная логика статусов
  const renderShipStatus = () => {
    if (task.shippingRequest === "sent") return "Заявка отправлена";
    if (task.shippingRequest === "requested") return "Заявка готова";
    return "Нет заявки на отгрузку";
  };

  // Твоя оригинальная функция форматирования даты
  const formatDate = (date) => {
    if (!date) return "-";
    if (!mounted) return "...";
    return new Date(date).toLocaleDateString();
  };

  // Функция для быстрого обновления текстовых полей
  const handleBlur = (fieldName, value) => {
    if (task[fieldName] !== value) {
      updateOrderField(task.id, { [fieldName]: value });
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-black hover:shadow-md transition-all flex flex-col h-full relative group">
      {/* Шапка с редактируемой фабрикой */}
      <div className="flex justify-between items-start mb-3">
        <input
          defaultValue={task.factoryName}
          onBlur={(e) => handleBlur("factoryName", e.target.value)}
          className="text-[15px] font-bold text-blue-800 uppercase text-xs tracking-wider border-b-2 border-blue-100 pb-1 bg-transparent outline-none focus:border-blue-400 w-full"
          placeholder="Название фабрики"
        />
        {task.isExpo && (
          <span className="text-[10px] bg-amber-400 text-white px-2 py-0.5 rounded-full font-bold shadow-sm ml-2 whitespace-nowrap">
            EXPO 🖼️
          </span>
        )}
      </div>

      <div className="text-[13px] space-y-2 mb-4 flex-grow">
        {/* Редактируемый тип мебели и проформа */}
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
              className="bg-gray-100 border border-gray-300 hover:bg-gray-150 focus:bg-white focus:ring-1 focus:ring-blue-100 px-1 rounded outline-none w-24 transition-all"
            />
          </div>
        </div>

        {/* Блок данных клиента */}
        <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100/50 space-y-2">
          <div className="flex items-center gap-1">
            <span>👤</span>
            <input
              defaultValue={task.clientName}
              onBlur={(e) => handleBlur("clientName", e.target.value)}
              className="font-bold text-blue-900 bg-transparent outline-none focus:bg-white rounded px-1 w-full"
              placeholder="Имя клиента"
            />
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-600">
            <span>📞</span>
            <input
              placeholder="Добавить телефон..."
              defaultValue={task.clientPhone}
              onBlur={(e) => handleBlur("clientPhone", e.target.value)}
              className="bg-transparent hover:bg-blue-100/50 focus:bg-white focus:ring-1 focus:ring-blue-200 px-1 rounded outline-none w-full font-mono transition-all"
            />
          </div>

          <div className="flex items-start gap-1 text-[11px] text-gray-500 italic">
            <span>📍</span>
            <textarea
              placeholder="Добавить адрес..."
              defaultValue={task.clientAddress}
              onBlur={(e) => handleBlur("clientAddress", e.target.value)}
              rows="2"
              className="bg-transparent hover:bg-blue-100/50 focus:bg-white focus:ring-1 focus:ring-blue-200 px-1 rounded outline-none w-full resize-none transition-all"
            />
          </div>
        </div>

        {/* Индикатор статуса заявки на отгрузку */}
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

        {/* Статусы дат */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col gap-1">
            <label
              className={`text-[10px] uppercase font-bold ml-1 ${task.paidAt ? "text-green-600" : "text-red-500"}`}
            >
              💰{" "}
              {task.paidAt
                ? `Оплачено (${formatDate(task.paidAt)})`
                : "Не оплачено"}
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
              className={`text-xs border rounded-lg px-2 py-1.5 outline-none transition-all ${
                task.paidAt
                  ? "border-green-200 bg-green-50/30 text-green-700"
                  : "border-red-100 bg-red-50/30 text-red-500"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">
              📅 Готовность: {formatDate(task.readyDate)}
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
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-300 transition-all text-black"
            />
          </div>
        </div>

        {/* Фактическая отгрузка */}
        <div className="pt-3 mt-2 border-t border-gray-50">
          <label className="text-[10px] text-gray-400 block mb-1 uppercase font-black tracking-tighter">
            Дата фактической отгрузки
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
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 w-full outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-black"
          />
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 mt-auto">
        <button
          onClick={() =>
            updateOrderField(task.id, { shippingRequest: "requested" })
          }
          className={`text-[10px] py-2 rounded-lg font-bold transition-all shadow-sm ${
            task.shippingRequest === "requested"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          Заявка ✅
        </button>
        <button
          onClick={() => updateOrderField(task.id, { shippingRequest: "sent" })}
          className={`text-[10px] py-2 rounded-lg font-bold transition-all shadow-sm ${
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

        <button
          onClick={() => {
            if (confirm("Удалить запись?")) deleteOrder(task.id);
          }}
          className="col-span-2 text-[9px] text-red-200 hover:text-red-500 mt-3 text-center uppercase font-bold transition-colors"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
