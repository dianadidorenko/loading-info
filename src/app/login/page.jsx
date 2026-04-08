"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError("Неверный логин или пароль");
      setLoading(false);
    } else {
      router.push("/"); // Перенаправляем на главную после входа
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">
            Habitare <span className="text-blue-500">Admin</span>
          </h1>
          <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest">
            Вход в систему управления
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-black outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all text-sm"
              placeholder="admin@habitare.com"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-black outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-[10px] font-bold uppercase text-center bg-red-50 py-2 rounded-lg border border-red-100">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest mt-4"
          >
            {loading ? "Проверка..." : "Войти в систему"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[9px] text-gray-300 uppercase font-bold">
            Protected by Diana Didorenko © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
