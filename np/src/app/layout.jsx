import { Montserrat, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const cormorant = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: {
    default: "TIGA · Art for Earth",
    template: "%s | TIGA",
  },
  description:
    "When nature loses its voice, let art speak. A digital gallery for the forests, animals, and people living under the smoke of Indonesia's wildfires.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased selection:bg-people selection:text-white">
        {children}
      </body>
    </html>
  );
}
