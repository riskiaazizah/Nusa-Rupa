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
    if (!ACCEPTED.includes(picked.type)) {
      setErrors((prev) => ({ ...prev, file: "File format must be JPG, PNG, WEBP, or GIF." }));
      e.target.value = "";
      setFile(null);
      setPreview("");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setErrors((prev) => ({ ...prev, file: "Maximum file size is 5 MB." }));
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
      setFormError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
      {formError && (
        <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
          {formError}
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <label htmlFor="artwork-file" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">
          Artwork Image File <span className="text-people">*</span>
        </label>
        <input
          id="artwork-file"
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleFile}
          aria-invalid={errors.file ? "true" : "false"}
          aria-describedby={errors.file ? "artwork-file-error" : "artwork-file-hint"}
          className="block w-full text-sm text-ink file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:opacity-90 transition"
        />
        {!errors.file && (
          <p id="artwork-file-hint" className="mt-1.5 text-xs text-mute">
            JPG, PNG, WEBP, or GIF. Max 5 MB. Image ratio 4:5 recommended. File cannot be replaced after upload.
          </p>
        )}
        {errors.file && (
          <p id="artwork-file-error" role="alert" className="mt-1.5 text-xs font-medium text-people">
            {errors.file}
          </p>
        )}
        {preview && (
          <div className="mt-4 overflow-hidden rounded-xl border border-ink/10 bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Artwork preview" className="max-h-80 w-full object-contain" />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <ArtworkFields
          values={values}
          errors={errors}
          onChange={handleChange}
          categories={categories}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Artwork"}
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