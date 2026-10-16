import type { Metadata } from "next";
import { themeBootstrapScript } from "@technology-ecommerce/ui";

import { StorefrontShell } from "@/features/layout/storefront-shell";

import "./globals.css";
import { StorefrontProviders } from "./providers";

export const metadata: Metadata = {
  title: "CDE - Centro de Diagnóstico Estético",
  description: "Centro de Diagnóstico Ecográfico (CDE) — ecografía dermatológica y estética de alta resolución con la Dra. Anne Kusch en Lima, Perú. Seguimiento de rellenos, bioestimuladores y diagnóstico por imagen aplicado a medicina estética.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-design-system="storefront" data-theme="light" lang="es" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrapScript("storefront") }} /></head>
      <body>
        <StorefrontProviders>
          <StorefrontShell>{children}</StorefrontShell>
        </StorefrontProviders>
      </body>
    </html>
  );
}
