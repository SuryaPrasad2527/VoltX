import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'VOLTX | Unleash Your Energy – Premium Hyper Energy Drink',
  description:
    'Engineered with clean bio-available caffeine, active nootropics, and a 4-salt electrolyte matrix. Zero sugar. Zero crash. High-voltage performance in every can.',
  icons: {
    icon: '/images/voltx-original.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-volt-bg text-white min-h-screen flex flex-col antialiased selection:bg-volt-accent selection:text-black">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
