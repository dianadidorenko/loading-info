import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PrivacyWrapper from "@/components/PrivacyWrapper";
import Script from "next/script"; // Импортируем спец. компонент

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  // Выносим код скрипта в константу для чистоты
  const lockScript = `
    (function() {
      try {
        const LOCK_TIMEOUT = 300000; // 5 минут
        const lastUnlock = localStorage.getItem('lastUnlockTime') || 0;
        const isLocked = localStorage.getItem('isLocked');
        const now = Date.now();
        
        if (isLocked === 'true' || !lastUnlock || (now - lastUnlock > LOCK_TIMEOUT)) {
          document.documentElement.classList.add('is-locked-server');
          // Не используемsetAttribute на body здесь, так как body еще может не существовать
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .is-locked-server .lock-content-wrapper,
              .is-locked-server main {
                display: none !important;
              }
            `,
          }}
        />
        {/* Используем специальный компонент Script от Next.js */}
        <Script
          id="lock-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: lockScript }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <Providers>
          <PrivacyWrapper>{children}</PrivacyWrapper>
        </Providers>
      </body>
    </html>
  );
}
