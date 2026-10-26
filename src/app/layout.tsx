import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth/session";
import { MedicalAtmosphere } from "@/components/common/MedicalAtmosphere";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "CodeRx — Turn Medical Records Into One Clear Patient Story",
  description:
    "Desktop-first professional healthcare management platform that converts scattered medical records into a structured timeline and helps doctors instantly understand WHAT CHANGED.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-[#F0F6F8] via-white to-[#EAF3F6] text-[#0B1928] font-sans antialiased selection:bg-teal-600 selection:text-white relative" suppressHydrationWarning>
        <LanguageProvider>
          <div id="google_translate_element" style={{ display: "none" }} />
          <Script id="google-translate-init" strategy="afterInteractive">
            {`
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'hi,mr,gu,bn,ta,te,kn,ml,pa,en',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `}
          </Script>
          <Script
            src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
          />
          <MedicalAtmosphere />
          <Navbar currentUser={currentUser} />
          <main className="flex-1 w-full flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

