import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://2studs1chud.com"),
  title: "2 Studs 1 Chud",
  description: "Three boys. Two studs. One chud. Let the Selection Authority decide.",
  alternates: { canonical: "https://2studs1chud.com" },
  openGraph: {
    title: "2 Studs 1 Chud",
    description: "Three boys. Two studs. One chud. Let the Selection Authority decide.",
    url: "https://2studs1chud.com",
    siteName: "2 Studs 1 Chud",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "2 Studs 1 Chud",
    description: "Three boys. Two studs. One chud. Let the Selection Authority decide.",
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
