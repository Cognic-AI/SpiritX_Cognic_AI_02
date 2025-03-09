import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Spirit11 Fantasy Cricket Game',
  description: 'Create and manage your fantasy cricket team',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/favicon-16x16.png',
    // Adding favicon sizes to fix 500 error
    '16x16': '/favicon-16x16.png',
    '32x32': '/favicon-32x32.png',
    '192x192': '/android-chrome-192x192.png',
    '512x512': '/android-chrome-512x512.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
