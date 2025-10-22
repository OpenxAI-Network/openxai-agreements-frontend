import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";
import { headers } from "next/headers";
import { Providers } from "@/components/context/providers";
import { Header } from "@/components/header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <>
      <html>
        <head />
        <body>
          <Providers cookies={cookies}>
            <Header />
            {children}
          </Providers>
        </body>
      </html>
    </>
  );
}
