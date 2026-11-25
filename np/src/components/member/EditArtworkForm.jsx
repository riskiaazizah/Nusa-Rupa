"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ArtworkFields from "./ArtworkFields";
import { updateArtworkAction } from "@/app/member/artworks/actions";

export default function EditArtworkForm({ artwork, categories }) {
  const [values, setValues] = useState({
    title: artwork.title,
    description: artwork.description,
    categoryId: String(artwork.category_id),
    tags: artwork.tags.join(", "),
  });
  const [state, formAction, pending] = useActionState(updateArtworkAction, {});

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  return (
    <form action={formAction} noValidate className="max-w-2xl space-y-6">
      <input type="hidden" name="id" value={artwork.id} />

      {state.error && (
        <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
          {state.error}
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-mute">
          Artwork Image File
        </span>
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artwork.file_url} alt={artwork.title} className="max-h-80 w-full object-contain" />
        </div>
        <p className="mt-2 text-xs text-mute">
          File cannot be replaced after upload. To change the file, delete this artwork and upload anew.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <ArtworkFields
          values={values}
          errors={state.errors ?? {}}
          onChange={handleChange}
          categories={categories}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
        <Link
          href="/member/artworks"
          className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-soft"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
