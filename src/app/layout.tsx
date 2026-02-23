import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "The Bean Route — Melbourne's Mobile Coffee Cart Marketplace",
  description: "Find and book mobile coffee carts for your next event in Melbourne. Corporate mornings, weddings, festivals — free to inquire.",
  openGraph: {
    title: "The Bean Route — Melbourne's Mobile Coffee Cart Marketplace",
    description: "Find and book mobile coffee carts for your next event in Melbourne. Corporate mornings, weddings, festivals — free to inquire.",
    type: "website",
    url: "https://thebeanroute.com.au",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Bean Route",
  url: "https://thebeanroute.com.au",
  description:
    "Melbourne's mobile coffee cart marketplace. Find and book coffee carts for your next event.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@thebeanroute.com.au",
    contactType: "customer service",
  },
  areaServed: {
    "@type": "City",
    name: "Melbourne",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <JsonLd data={organizationSchema} />
        {children}
      </body>
    </html>
  );
}