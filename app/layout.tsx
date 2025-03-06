import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "İlişki Kredi ve Güven Takibi",
  description: "İlişkilerinizde kredi ve güven değerlerini takip edin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable}`}>
      <body className="antialiased bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="fixed inset-0 bg-hero-pattern opacity-50 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 animate-pulse-slow"></div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">İlişki Takibi</h1>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Kredi 100'den, Güven 0'dan başlar
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 bg-white dark:bg-gray-900 mt-8">
            <div className="container mx-auto px-4">
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} İlişki Takibi Uygulaması
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
