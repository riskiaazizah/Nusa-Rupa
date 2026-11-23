"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;
const BASE =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-deep-forest outline-none transition focus:ring-2 focus:ring-forest";

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-deep-forest">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-deep-forest/70">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

// mode: "create" | "edit". Saat edit, banner opsional (kosong = tetap memakai banner lama).
export default function ChallengeForm({ mode, challenge }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState({
    title: challenge?.title ?? "",
    description: challenge?.description ?? "",
    rules: challenge?.rules ?? "",
    prize: challenge?.prize ?? "",
    startDate: challenge?.startDate ?? "",
    endDate: challenge?.endDate ?? "",
  });
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

  function resetFile(input, message) {
    if (input) input.value = "";
    setFile(null);
    setPreview("");
    setErrors((prev) => ({ ...prev, banner: message }));
  }

  function handleFile(e) {
    const picked = e.target.files?.[0] ?? null;
    setErrors((prev) => ({ ...prev, banner: undefined }));
    if (!picked) return resetFile(null, undefined);
    // Cek awal untuk kenyamanan. Validasi yang menentukan tetap di backend.
    if (!ACCEPTED.includes(picked.type)) {
      return resetFile(e.target, "Format banner harus JPG, PNG, WEBP, atau GIF.");
    }
    if (picked.size > MAX_BYTES) return resetFile(e.target, "Ukuran banner maksimal 5 MB.");
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
    if (file) body.append("banner", file);

    try {
      const res = await fetch(isEdit ? `/api/challenges/${challenge.id}` : "/api/challenges", {
        method: isEdit ? "PATCH" : "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? "");
        return;
      }
      router.push("/curator/challenges");
      router.refresh();
    } catch {
      setFormError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const props = (name) => ({
    id: `ch-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `ch-${name}-error` : undefined,
    className: `${BASE} ${errors[name] ? "border-red-600" : "border-deep-forest/25"}`,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      <Field id="ch-title" label="Judul challenge" error={errors.title}>
        <input type="text" {...props("title")} />
      </Field>

      <Field id="ch-description" label="Deskripsi" error={errors.description}>
        <textarea rows={5} {...props("description")} />
      </Field>

      <Field id="ch-rules" label="Aturan" error={errors.rules}>
        <textarea rows={5} {...props("rules")} />
      </Field>

      <Field id="ch-prize" label="Hadiah" error={errors.prize} hint="Contoh: Rp 2.000.000 + sertifikat">
        <input type="text" {...props("prize")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="ch-startDate" label="Tanggal mulai (WITA)" error={errors.startDate}>
          <input type="datetime-local" {...props("startDate")} />
        </Field>
        <Field id="ch-endDate" label="Tanggal selesai (WITA)" error={errors.endDate}>
          <input type="datetime-local" {...props("endDate")} />
        </Field>
      </div>

      <div>
        <label htmlFor="ch-banner" className="mb-1.5 block text-sm font-medium text-deep-forest">
          Gambar banner
        </label>
        {isEdit && !preview && (
          <div className="mb-3 overflow-hidden rounded-xl border border-deep-forest/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={challenge.bannerUrl} alt="Banner saat ini" className="aspect-[3/1] w-full object-cover" />
          </div>
        )}
        <input
          id="ch-banner"
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleFile}
          aria-invalid={errors.banner ? "true" : "false"}
          aria-describedby={errors.banner ? "ch-banner-error" : "ch-banner-hint"}
          className="block w-full text-sm text-deep-forest file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ivory hover:file:bg-deep-forest"
        />
        {!errors.banner && (
          <p id="ch-banner-hint" className="mt-1 text-xs text-deep-forest/70">
            JPG, PNG, WEBP, atau GIF, maksimal 5 MB.
            {isEdit && " Kosongkan untuk tetap memakai banner saat ini."}
          </p>
        )}
        {errors.banner && (
          <p id="ch-banner-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
            {errors.banner}
          </p>
        )}
        {preview && (
          <div className="mt-3 overflow-hidden rounded-xl border border-deep-forest/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Pratinjau banner" className="aspect-[3/1] w-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Challenge"}
        </button>
        <Link
          href="/curator/challenges"
          className="rounded-xl border border-deep-forest/25 px-6 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-white"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}