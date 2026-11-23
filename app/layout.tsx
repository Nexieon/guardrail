import type { Metadata } from "next"
import "./globals.css"
import { AlertProvider } from "@/components/util/alertprovider"
import { ModalProvider } from "@/components/util/modalprovider"
import { HeaderTitleProvider } from "@/components/util/headertitleprovider"

export const metadata: Metadata = {
  title: "GuardRail | Agency Workspace & Client Portal",
  description: "The white-labeled client operations and project workspace for modern agencies.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans">
        <AlertProvider>
          <ModalProvider>
            <HeaderTitleProvider>
              {children}
            </HeaderTitleProvider>
          </ModalProvider>
        </AlertProvider>
      </body>
    </html>
  )
}
