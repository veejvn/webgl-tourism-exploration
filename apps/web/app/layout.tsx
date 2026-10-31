import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthHydration } from "@/components/AuthHydration";

export const metadata: Metadata = {
  title: "3D Tourism - Khám phá An Giang",
  description: "Nền tảng du lịch 3D khám phá di sản An Giang, Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <AuthHydration>{children}</AuthHydration>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
