"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { lockState, LOCK_TIMEOUT } from "@/lib/lock-store";

export default function PrivacyWrapper({ children }) {
  const { data: session } = useSession();
  const [isLocked, setIsLocked] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showPassInput, setShowPassInput] = useState(false);
  const [passValue, setPassValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Снимаем класс и атрибут, когда React готов управлять интерфейсом
    document.documentElement.classList.remove("is-locked-server");
    document.body.removeAttribute("data-js-not-loaded");

    setIsMounted(true);

    const lastUnlock = Number(localStorage.getItem("lastUnlockTime") || 0);
    const savedLock = localStorage.getItem("isLocked");

    // Синхронизируем состояние
    if (Date.now() - lastUnlock < LOCK_TIMEOUT && savedLock === "false") {
      lockState.setLocked(false);
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }

    const unsubscribe = lockState.subscribe((val) => {
      setIsLocked(val);
      if (!val) setShowPassInput(false);
    });
    return () => unsubscribe();
  }, []);

  // ... функции lock, resetTimer, handleUnlock те же самые ...
  const lock = useCallback(() => {
    if (Date.now() - lockState.lastUnlockTime < 1000) return;
    lockState.setLocked(true);
  }, []);

  const resetTimer = useCallback(() => {
    if (Date.now() - lockState.lastUnlockTime < 1000 || lockState.isLocked)
      return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(lock, LOCK_TIMEOUT);
  }, [lock]);

  useEffect(() => {
    if (!isMounted || !session) return;
    const handleActivity = () => resetTimer();
    const handleGlobalClick = (e) => e.detail === 3 && lock();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleGlobalClick);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [isMounted, session, lock, resetTimer]);

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    const res = await fetch("/api/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: passValue }),
    });
    if (res.ok) {
      lockState.setLocked(false);
      setPassValue("");
    } else {
      alert("Неверный ПИН");
    }
    setIsVerifying(false);
  };

  if (!isMounted || !session) return <>{children}</>;

  return (
    <>
      <div
        className="lock-content-wrapper"
        style={{
          filter: isLocked ? "blur(80px) grayscale(1)" : "none",
          opacity: isLocked ? 0 : 1,
          transition: "all 0.4s ease",
        }}
      >
        {children}
      </div>

      {isLocked && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/10 backdrop-blur-3xl">
          {/* Твоя форма пароля */}
          <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center max-w-xs w-full">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-8">
              System Locked
            </h3>
            {!showPassInput ? (
              <button
                onClick={() => setShowPassInput(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold"
              >
                Unlock
              </button>
            ) : (
              <form onSubmit={handleUnlock} className="w-full space-y-4">
                <input
                  autoFocus
                  type="password"
                  value={passValue}
                  onChange={(e) => setPassValue(e.target.value)}
                  className="w-full bg-gray-50 p-4 rounded-2xl text-center text-2xl outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold"
                >
                  Confirm
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
