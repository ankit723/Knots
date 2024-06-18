import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Knots",
    description: "A NextJS 14 Social App like Knots and Twiter Application",
    icons:"/assets/logo.png"
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [dark]
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-black-3`}>
            {children}
        </body>
      </html>
    </ClerkProvider>
  );
}