import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://2studs1chud.com"),
  title: "2 Studs 1 Chud | Spin the Boys",
  description:
    "Three boys enter. Two studs leave. One is legally recognized as the Chud.",
  openGraph: {
    title: "2 Studs 1 Chud",
    description: "Spin the boys. Crown two Studs. Humiliate one Chud.",
    url: "https://2studs1chud.com",
    siteName: "2 Studs 1 Chud",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "2 Studs 1 Chud",
    description: "The only randomized authority on Stud-to-Chud allocation.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f4e900",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
