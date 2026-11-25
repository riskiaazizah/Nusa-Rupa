import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white text-ink pt-12 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b border-line">
          <div className="space-y-3 max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/tiga-logo-red.svg" alt="TIGA" className="h-7 w-auto" />
            <p className="font-display italic text-lg text-ink">
              When nature loses its voice, let art speak.
            </p>
            <p className="text-xs text-mute leading-relaxed">
              An Indonesian digital art showcase platform dedicated to forests, wildlife conservation, and peatland protection.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-mute">Explore</p>
              <ul className="space-y-1.5">
                <li><Link href="/#collection" className="text-ink hover:text-people transition">Collection</Link></li>
                <li><Link href="/challenges" className="text-ink hover:text-people transition">Challenges</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-mute">Platform</p>
              <ul className="space-y-1.5">
                <li><Link href="/login" className="text-ink hover:text-people transition">Sign In</Link></li>
                <li><Link href="/register" className="text-ink hover:text-people transition">Register</Link></li>
              </ul>
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-mute">Philosophy</p>
              <p className="text-xs text-mute">Voice, Unity, Protect.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mute">
          <p>Don't let the forest end up as a painting of what once was.</p>
          <p>&copy; {new Date().getFullYear()} TIGA · Art for Earth.</p>
        </div>
      </div>
    </footer>
  );
}
