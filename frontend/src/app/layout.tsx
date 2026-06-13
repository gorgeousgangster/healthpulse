import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HealthPulse - AI Preventive Health Analytics",
  description: "Democratizing access to preventive health insights through data science",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
