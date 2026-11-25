"use client";

import { useActionState, useState } from "react";
import { addCommentAction } from "@/app/(public)/artworks/[id]/actions";

export default function CommentForm({ artworkId }) {
  const [text, setText] = useState("");

  // Kosongkan kolom hanya jika berhasil, supaya teks tidak hilang saat error
  async function handleSubmit(prevState, formData) {
    const result = await addCommentAction(prevState, formData);
    if (result.success) setText("");
    return result;
  }

  const [state, formAction, pending] = useActionState(handleSubmit, {});

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="artworkId" value={artworkId} />
      <label htmlFor="comment-content" className="block text-sm font-medium text-deep-forest">
        Tulis komentar
      </label>
      <textarea
        id="comment-content"
        name="content"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-invalid={state.error ? "true" : "false"}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-deep-forest outline-none focus:ring-2 focus:ring-forest ${
          state.error ? "border-red-600" : "border-deep-forest/25"
        }`}
      />
      {state.error && (
        <p role="alert" className="text-xs font-medium text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-forest px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 shadow-sm"
      >
        {pending ? "Mengirim..." : "Kirim"}
      </button>
    </form>
  );
}