import type { Metadata } from 'next';
import './globals.css';
import { Instrument_Serif, Inter } from 'next/font/google';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Aventuras Fantásticas',
  description: 'Ficha digital para Fighting Fantasy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="text-[#2D1D16] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
