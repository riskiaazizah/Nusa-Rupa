"use client";

import { useActionState, useState } from "react";
import { submitWorkAction } from "@/app/(public)/challenges/[id]/actions";

// Tombol "Submit Your Work": saat diklik, Member memilih satu karya dari portofolionya
export default function SubmitWorkForm({ challengeId, artworks }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [state, formAction, pending] = useActionState(submitWorkAction, {});

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest"
      >
        Submit Your Work
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="challengeId" value={challengeId} />

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-deep-forest">Pilih satu karya dari portofolio Anda</legend>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {artworks.map((a) => {
            const active = selected === String(a.id);
            return (
              <li key={a.id}>
                <label
                  className={`block cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition ${
                    active ? "border-forest ring-2 ring-forest/30" : "border-deep-forest/15 hover:border-forest"
                  }`}
                >
                  <input
                    type="radio"
                    name="artworkId"
                    value={a.id}
                    checked={active}
                    onChange={(e) => setSelected(e.target.value)}
                    className="sr-only"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.file_url} alt="" className="aspect-[4/3] w-full object-cover" />
                  <span className="block truncate px-3 py-2 text-xs font-medium text-deep-forest">{a.title}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Mengirim..." : "Kirim karya"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-deep-forest/25 px-6 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-white"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
