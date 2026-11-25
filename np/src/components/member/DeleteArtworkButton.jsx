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
        className="text-xs font-semibold text-people hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2 rounded-xl border border-people/20 bg-people/5 p-3">
      <input type="hidden" name="id" value={id} />
      <p className="text-xs font-medium text-people">Permanently delete this artwork?</p>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-people px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink transition hover:bg-soft"
        >
          Cancel
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-xs font-medium text-people">
          {state.error}
        </p>
      )}
    </form>
  );
}
