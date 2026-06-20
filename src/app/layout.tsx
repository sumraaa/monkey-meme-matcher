import type { Metadata } from 'next';
import './globals.css';
import { Space_Grotesk, DM_Sans } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'Meme Face Mimic',
  description: 'Match your face to monkey memes using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-[#FDFBF7]">{children}</body>
    </html>
  );
}
