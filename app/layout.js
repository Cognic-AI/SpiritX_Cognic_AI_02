import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Spirit11 Fantasy Cricket Game',
  description: 'Create and manage your fantasy cricket team',
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
