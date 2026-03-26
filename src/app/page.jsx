import { db } from "@/lib/db";
import { addOrder } from "./actions";
import TaskCard from "./TaskCard";

export default async function Home() {
  // Получаем все заказы из базы, самые новые будут вверху
  const allOrders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-10 bg-gray-50 min-h-screen text-black font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-blue-800">
            Система учета заказов 📦
          </h1>
          <p className="text-gray-500 mt-2 text-sm italic">
            Управление поставками мебели из Европы
          </p>
        </header>

        {/* Форма добавления заказа */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Новый заказ
          </h2>
          <form
            action={addOrder}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[12px]"
          >
            <input
              name="factoryName"
              placeholder="Название фабрики"
              className="border p-2.5 rounded-lg text-black outline-none focus:border-blue-400"
              required
            />
            <input
              name="furnitureType"
              placeholder="Тип мебели"
              className="border p-2.5 rounded-lg text-black outline-none focus:border-blue-400"
              required
            />
            <input
              name="proformaNumber"
              placeholder="№ проформы"
              className="border p-2.5 rounded-lg text-black outline-none focus:border-blue-400"
              required
            />
            <input
              name="clientName"
              placeholder="Имя клиента"
              className="border p-2.5 rounded-lg text-black outline-none focus:border-blue-400"
              required
            />

            {/* НОВЫЕ ПОЛЯ */}
            <input
              name="clientPhone"
              placeholder="Номер телефона"
              className="border p-2.5 rounded-lg text-black outline-none focus:border-blue-400"
            />
            <input
              name="clientAddress"
              placeholder="Адрес доставки"
              className="border p-2.5 rounded-lg text-black outline-none focus:border-blue-400"
            />

            <div className="flex flex-col">
              <label className="text-[10px] text-gray-400 ml-1 uppercase font-bold">
                Дата оплаты
              </label>
              <input
                type="date"
                name="paidAt"
                className="border p-2 rounded-lg text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-gray-400 ml-1 uppercase font-bold">
                Дата готовности
              </label>
              <input
                type="date"
                name="readyDate"
                className="border p-2 rounded-lg text-black"
              />
            </div>

            <div className="flex items-center gap-2 px-2 bg-gray-50 rounded-lg border border-dashed h-[42px] mt-auto">
              <input
                type="checkbox"
                name="isExpo"
                id="expo"
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="expo"
                className="text-sm font-medium text-gray-600 cursor-pointer"
              >
                ЭКСПО 🖼️
              </label>
            </div>

            <button className="lg:col-span-3 bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
              Создать запись
            </button>
          </form>
        </section>

        {/* Общий список карточек без колонок */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Все заказы</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              Всего: {allOrders.length}
            </span>
          </div>

          {allOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-400">
                Список пуст. Добавьте первый заказ выше! 👆
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOrders.map((order) => (
                <TaskCard key={order.id} task={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
