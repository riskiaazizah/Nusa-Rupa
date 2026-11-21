"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArtworkFields from "./ArtworkFields";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

export default function NewArtworkForm({ categories }) {
  const router = useRouter();
  const [values, setValues] = useState({ title: "", description: "", categoryId: "", tags: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Bebaskan memori preview saat diganti atau form ditutup
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  function handleFile(e) {
    const picked = e.target.files?.[0] ?? null;
    setErrors((prev) => ({ ...prev, file: undefined }));
    if (!picked) {
      setFile(null);
      setPreview("");
      return;
    }
    // Cek awal untuk kenyamanan. Validasi yang menentukan tetap di backend.
    if (!ACCEPTED.includes(picked.type)) {
      setErrors((prev) => ({ ...prev, file: "Format file harus JPG, PNG, WEBP, atau GIF." }));
      e.target.value = "";
      setFile(null);
      setPreview("");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setErrors((prev) => ({ ...prev, file: "Ukuran file maksimal 5 MB." }));
      e.target.value = "";
      setFile(null);
      setPreview("");
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");

    const body = new FormData();
    Object.entries(values).forEach(([k, v]) => body.append(k, v));
    if (file) body.append("file", file);

    try {
      const res = await fetch("/api/artworks", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? "");
        return;
      }
      router.push("/member/artworks");
      router.refresh();
    } catch {
      setFormError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="artwork-file" className="mb-1.5 block text-sm font-medium text-deep-forest">
          File karya
        </label>
        <input
          id="artwork-file"
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleFile}
          aria-invalid={errors.file ? "true" : "false"}
          aria-describedby={errors.file ? "artwork-file-error" : "artwork-file-hint"}
          className="block w-full text-sm text-deep-forest file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ivory hover:file:bg-deep-forest"
        />
        {!errors.file && (
          <p id="artwork-file-hint" className="mt-1 text-xs text-deep-forest/70">
            JPG, PNG, WEBP, atau GIF. Maksimal 5 MB. File tidak dapat diganti setelah diunggah.
          </p>
        )}
        {errors.file && (
          <p id="artwork-file-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
            {errors.file}
          </p>
        )}
        {preview && (
          <div className="mt-3 overflow-hidden rounded-xl border border-deep-forest/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Pratinjau karya" className="max-h-72 w-full object-contain" />
          </div>
        )}
      </div>

      <ArtworkFields values={values} errors={errors} onChange={handleChange} categories={categories} />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Mengunggah..." : "Unggah Karya"}
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