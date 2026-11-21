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
    <form action={formAction} noValidate className="max-w-2xl space-y-5">
      <input type="hidden" name="id" value={artwork.id} />

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <p className="mb-1.5 text-sm font-medium text-deep-forest">File karya</p>
        <div className="overflow-hidden rounded-xl border border-deep-forest/10 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artwork.file_url} alt={artwork.title} className="max-h-72 w-full object-contain" />
        </div>
        <p className="mt-1 text-xs text-deep-forest/70">
          File tidak dapat diganti. Untuk mengganti file, hapus karya ini lalu unggah ulang.
        </p>
      </div>

      <ArtworkFields
        values={values}
        errors={state.errors ?? {}}
        onChange={handleChange}
        categories={categories}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          href="/member/artworks"
          className="rounded-xl border border-deep-forest/25 px-6 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-white"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}