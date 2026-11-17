import type { Metadata } from "next";
import { Wix_Madefor_Display } from "next/font/google";

import "./globals.css";

const wix = Wix_Madefor_Display({
  subsets: ["latin"],
  variable: "--font-wix",
});

export const metadata: Metadata = {
  title: "OFICINAS COUTURE",
  description: "Presentación del proyecto OFICINAS COUTURE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${wix.variable}`}>
        {children}
      </body>
    </html>
  );
}