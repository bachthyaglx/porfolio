// src/app/layout.tsx
import './globals.css';
import NavBar from '../components/layout/NavBar';
import ApolloWrapper from '../lib/ApolloWrapper';

export const metadata = {
  title: 'Porfolio',
  description: 'My porfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white font-sans">
        <ApolloWrapper>
          <NavBar />
          <main className="min-h-screen">{children}</main>
        </ApolloWrapper>
      </body>
    </html>
  );
}
