import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UpLoc",
  description: "Equipamento de elite para quem não aceita menos",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* bg-uploc-bg: Garante o fundo cinza quase preto.
          text-uploc-text: Garante que o texto padrão seja o cinza claro.
      */}
      <body className="bg-uploc-bg text-uploc-text min-h-screen selection:bg-uploc-gold/30">
        {children}
      </body>
    </html>
  );
}