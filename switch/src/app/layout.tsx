import './globals.css'
import { Inter } from 'next/font/google'
import ThemeProvider from '@/components/theme-provider'
import MainNav from '@/components/main-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Brand Recommender',
  description: 'Discover brands you\'ll love',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <MainNav />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}