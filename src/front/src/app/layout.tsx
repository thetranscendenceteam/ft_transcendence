import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Menu } from '@/components/menu'
import { UserProvider } from '@/components/userProvider';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../components/apolloclient';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pong Pomy',
  description: 'Project Transcendance Pomy',
}

export default function RootLayout({children}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en" className="h-full">
      <body className={inter.className + " " + "flex flex-col h-full m-0 bg-[url('../../public/space.jpg')] bg-cover bg-center backdrop-brightness-50 dark"}>
        <UserProvider>
          <Menu />
          <div className="flex-1 min-h-0">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
