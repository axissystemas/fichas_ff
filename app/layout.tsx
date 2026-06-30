import type { Metadata } from 'next';
import './globals.css';
import { Instrument_Serif, Inter, Almendra, Cinzel, Bangers, Share_Tech_Mono } from 'next/font/google';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const almendra = Almendra({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-almendra',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
});

const bangers = Bangers({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bangers',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-share-mono',
});

export const metadata: Metadata = {
  title: 'Aventuras Fantásticas',
  description: 'Ficha digital para Fighting Fantasy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${inter.variable} ${almendra.variable} ${cinzel.variable} ${bangers.variable} ${shareTechMono.variable}`}>
      <body suppressHydrationWarning className="text-[#2D1D16] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
