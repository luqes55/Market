import "./globals.css";
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs'



export const metadata = {
  title: 'Mi App con Clerk',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

