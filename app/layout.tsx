import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RentalCar",
    template: "%s | RentalCar",
  },
  description:
    "Rent a car online: browse the catalog, filter by brand, price and mileage, and book in a few clicks.",
  openGraph: {
    title: "RentalCar",
    description:
      "Rent a car online: browse the catalog, filter by brand, price and mileage, and book in a few clicks.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
        </TanStackProvider>
      </body>
    </html>
  );
}
