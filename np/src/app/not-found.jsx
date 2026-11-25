import Link from "next/link";

export const metadata = { title: "Page Not Found · TIGA" };

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-20 text-center">
      <span className="font-display text-8xl font-semibold tracking-wider text-ink/20">404</span>
      <h1 className="font-display mt-2 text-3xl font-semibold text-ink">Page Not Found</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-mute">
        The canvas you are looking for does not exist, has been moved, or is inaccessible.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-people"
      >
        Return to Exhibition
      </Link>
    </main>
  );
}
