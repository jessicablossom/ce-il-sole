import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, IBM_Plex_Sans } from "next/font/google";
import { getMetadataBaseOrigin } from "@/lib/siteOrigin";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const defaultTitle = "C’è il sole?";
const defaultDescription = "La previsione più inutile d’Italia.";

export const viewport: Viewport = {
  themeColor: "#e9edf0",
};

export const metadata: Metadata = {
  metadataBase: new URL(getMetadataBaseOrigin()),
  manifest: "/site.webmanifest",
  title: {
    default: defaultTitle,
    template: `%s · ${defaultTitle}`,
  },
  description: defaultDescription,
  applicationName: defaultTitle,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    siteName: defaultTitle,
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
};

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="it"
      className={`${ibmPlexSans.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
};

export default RootLayout;
