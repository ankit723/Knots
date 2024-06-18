import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/topbar";
import Leftsidebar from "@/components/shared/leftsidebar";
import Rightsidebar from "@/components/shared/rightsidebar";
import Bottombar from "@/components/shared/bottombar";

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
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        <main className="flex flex-row ">
          <Leftsidebar />
          <section className="main-container">
            <div className="w-full max-w-4xl">{children}</div>
          </section>
          <Rightsidebar />
        </main>
        <Bottombar />
      </body>
    </html>
  );
}
