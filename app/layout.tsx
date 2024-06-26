import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/Container";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bugtech Booking",
  description: "Online Booking Platform",
  icons: {  icon: '/logo.svg'}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster/>
      <main className="flex flex-col min-h-screen bg-secondary">
      <Navbar/>
      <section className='flex-grow'>
        <Container>
      {children}
      </Container>
      </section>
      </main>
      </ThemeProvider>
      </body>
    
    </html>
    </ClerkProvider>
  );
}
