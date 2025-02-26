import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Webshop',
  description: 'A minimal fashion webshop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-gray-900 font-light">
        {children}
      </body>
    </html>
  );
} 