import type { Metadata } from "next";
import "../globals.css";
import { getSession } from "next-auth/react";
import NextSessionProvider from "@/provider/NextSessionProvider";
import QueryProvider from "@/provider/QueryProvider";
import Navbar from "@/components/ui/Navbar";
import "@uploadthing/react/styles.css";

export const metadata: Metadata = {
  title: "Stox | Admin",
  description: "Admin Panel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <NextSessionProvider session={session}>
      <html lang="en">
        <body>
            <QueryProvider>
              <Navbar />
               {children}
            </QueryProvider>
        </body>
      </html>
    </NextSessionProvider>
  );
}