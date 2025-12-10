import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyStore",
  description: "Online Market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
<<<<<<< HEAD
        {/* <Navbar /> */}
=======
        <Navbar />  
>>>>>>> e987ab83014acac397f4fa9b8e32c050a7b738dc
        {children}
      </body>
    </html>
  );
}
