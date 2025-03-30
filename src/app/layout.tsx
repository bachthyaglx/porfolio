// ✅ src/app/layout.tsx
import '@/app/globals.css';
import NavBar from '@/components/navigation/NavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Thy',
  description: 'Personal developer portfolio built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white font-sans">
        <NavBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
