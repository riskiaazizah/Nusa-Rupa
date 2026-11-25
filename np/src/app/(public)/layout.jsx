import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
