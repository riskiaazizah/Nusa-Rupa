"use client";

export default function GlobalError({ reset }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-mute">
        An unexpected issue occurred while rendering this canvas. Please try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-people"
      >
        Try again
      </button>
    </main>
  );
}
