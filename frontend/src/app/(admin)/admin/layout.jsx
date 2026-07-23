import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/components/admin/Header";
import { Toaster } from "react-hot-toast";
import Providers from "../../Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
console.log("working");
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sartaj Ashraf Admin Portal",
  description: "Admin dashboard for portfolio management",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-gradient-to-br from-gray-900 via-gray-800 to-black`}
      >
        <div className="grid grid-cols-12">
        <aside className="col-span-2">
          <Header />
        </aside>
        <Providers>
        <div className="flex-1 col-span-10">{children}</div>
        </Providers>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
