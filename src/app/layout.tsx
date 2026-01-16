import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google"; // Corrected import
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Prashayan | Premium Ayurvedic Store",
  description: "Pure, high-purity herbal products for a healthier life.",
};

// Razorpay script
const RazorpayScript = () => (
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-secondary text-primary",
          outfit.variable,
          playfair.variable
        )}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
