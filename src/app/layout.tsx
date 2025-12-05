import localFont from 'next/font/local';
import './globals.css';
import '@/styles/nprogress.css';
import { Suspense } from 'react';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import NavigationEvents from '@/components/common/NavigationEvents';
import JobProgressTracker from '@/components/common/JobProgressTracker';

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
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
            <JobProgressTracker />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
