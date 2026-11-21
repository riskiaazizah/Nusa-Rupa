"use client";

import { useActionState, useState } from "react";
import { deleteArtworkAction } from "@/app/member/artworks/actions";

export default function DeleteArtworkButton({ id }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteArtworkAction, {});

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-red-700 hover:underline"
      >
        Hapus
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <p className="text-xs font-medium text-red-700">Hapus karya ini secara permanen?</p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-60"
        >
          {pending ? "Menghapus..." : "Ya, hapus"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-deep-forest/25 px-3 py-1.5 text-xs font-semibold text-deep-forest hover:bg-ivory"
        >
          Batal
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}