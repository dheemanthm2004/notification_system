import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "DheeNotifications - Professional Notification Platform",
  description: "A comprehensive notification management system with email and SMS messaging capabilities",
  icons: {
    icon: "/favicon.ico", // Place your favicon at /public/favicon.ico
  },
  openGraph: {
    title: "DheeNotifications - Professional Notification Platform",
    description: "A comprehensive notification management system with email and SMS messaging capabilities",
    url: "https://dheenotifications.vercel.app",
    siteName: "DheeNotifications",
    images: [
      {
        url: "https://i.ibb.co/4RvYWc4d/image.png", // External OG image link
        width: 1200,
        height: 630,
        alt: "DheeNotifications Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DheeNotifications - Professional Notification Platform",
    description: "A comprehensive notification management system with email and SMS messaging capabilities",
    images: ["https://i.ibb.co/4RvYWc4d/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased">
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
