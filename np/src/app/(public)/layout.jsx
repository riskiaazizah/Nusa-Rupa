import SiteHeader from "@/components/SiteHeader";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-deep-forest/10 py-6 text-center text-xs text-deep-forest/70">
        TIGA · Art for Earth. When nature loses its voice, let art speak.
      </footer>
    </div>
  );
}