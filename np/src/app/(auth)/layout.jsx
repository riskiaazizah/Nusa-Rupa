import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="text-3xl font-bold tracking-[0.3em] text-deep-forest">
        TIGA
      </Link>
      <p className="mb-8 mt-1 text-sm text-forest">Art for Earth</p>
      <div className="w-full max-w-md rounded-2xl border border-deep-forest/10 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </main>
  );
}