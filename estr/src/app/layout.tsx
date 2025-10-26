import localFont from 'next/font/local';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Load the local Outfit font
const outfit = localFont({
  src: '../../public/fonts/Outfit-VariableFont_wght.ttf', // adjust if path is different
  display: 'swap',
  variable: '--font-outfit', // optional
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
