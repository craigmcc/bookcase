// app/layout.tsx

/**
 * Overall layout for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Metadata} from "next";
import {Inter} from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Internal Modules ----------------------------------------------------------

import './globals.css'
import {siteConfig} from "@/config/siteConfig";
import RootLayoutClient from "@/app/layout-client";

// Public Objects ------------------------------------------------------------

export const metadata: Metadata = {
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
}

export interface RootLayoutProps {
  children: React.ReactNode,
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en" className="bg-info-100">
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
