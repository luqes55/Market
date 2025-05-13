// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Mi App con Clerk",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
