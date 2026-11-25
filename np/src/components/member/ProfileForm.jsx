"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import FormField from "@/components/FormField";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_LINKS = 5;
const INPUT =
  "w-full rounded-xl border border-deep-forest/25 bg-white px-4 py-2.5 text-sm sm:text-base text-deep-forest outline-none focus:ring-2 focus:ring-forest";

export default function ProfileForm({ profile }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [links, setLinks] = useState(profile.links);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      setSuccess(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(e) {
    const picked = e.target.files?.[0] ?? null;
    setErrors((prev) => ({ ...prev, avatar: undefined }));
    if (!picked) {
      setFile(null);
      setPreview("");
      return;
    }
    // Cek awal untuk kenyamanan. Validasi yang menentukan tetap di backend.
    const problem = !ACCEPTED.includes(picked.type)
      ? "Format foto harus JPG, PNG, WEBP, atau GIF."
      : picked.size > MAX_BYTES
        ? "Ukuran foto maksimal 5 MB."
        : null;
    if (problem) {
      e.target.value = "";
      setFile(null);
      setPreview("");
      setErrors((prev) => ({ ...prev, avatar: problem }));
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setRemoveAvatar(false);
  }

  function updateLink(index, field, value) {
    setLinks((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");
    setSuccess(false);

    const body = new FormData();
    body.append("displayName", displayName);
    body.append("bio", bio);
    body.append("links", JSON.stringify(links));
    if (file) body.append("avatar", file);
    if (removeAvatar && !file) body.append("removeAvatar", "1");

    try {
      const res = await fetch("/api/profile", { method: "PATCH", body });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? "");
        return;
      }
      setSuccess(true);
      setFile(null);
      setPreview("");
      setRemoveAvatar(false);
      router.refresh();
    } catch {
      setFormError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const currentAvatar = removeAvatar ? "" : profile.avatarUrl;
  const shownAvatar = preview || currentAvatar;

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
      {/* Floating Pop-Up Error Notification */}
      {formError && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-24 right-4 sm:right-8 z-50 flex items-start gap-3.5 rounded-2xl border border-people/20 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-top-4 fade-in-0 duration-300 max-w-sm w-full"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-people/10 text-people mt-0.5">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-sm font-semibold text-ink">Gagal menyimpan profil</p>
            <p className="mt-0.5 text-xs text-mute leading-relaxed">{formError}</p>
          </div>
          <button
            type="button"
            onClick={() => setFormError("")}
            className="text-mute hover:text-ink p-1 rounded-lg hover:bg-soft transition cursor-pointer shrink-0"
            aria-label="Tutup pemberitahuan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Floating Pop-Up Success Notification */}
      {success && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 sm:right-8 z-50 flex items-start gap-3.5 rounded-2xl border border-forest/20 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-top-4 fade-in-0 duration-300 max-w-sm w-full"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest mt-0.5">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-sm font-semibold text-ink">Perubahan berhasil disimpan</p>
            <p className="mt-0.5 text-xs text-mute leading-relaxed">
              Informasi profil Anda telah berhasil diperbarui dan tersimpan di sistem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-mute hover:text-ink p-1 rounded-lg hover:bg-soft transition cursor-pointer shrink-0"
            aria-label="Tutup pemberitahuan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-deep-forest">Foto profil</p>
        <div className="flex items-center gap-4">
          {shownAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownAvatar} alt="Foto profil" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-forest text-3xl font-bold text-white shadow-xs"
            >
              {(displayName || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-2">
            <input
              id="avatar-file"
              type="file"
              accept={ACCEPTED.join(",")}
              onChange={handleFile}
              aria-label="Pilih foto profil"
              aria-invalid={errors.avatar ? "true" : "false"}
              className="block text-sm text-ink file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:opacity-90 transition"
            />
            {profile.avatarUrl && !file && (
              <label className="flex items-center gap-2 text-sm text-deep-forest">
                <input
                  type="checkbox"
                  checked={removeAvatar}
                  onChange={(e) => setRemoveAvatar(e.target.checked)}
                  className="h-4 w-4 accent-forest"
                />
                Hapus foto saat ini
              </label>
            )}
          </div>
        </div>
        <p className="text-xs text-deep-forest/70">JPG, PNG, WEBP, atau GIF, maksimal 5 MB.</p>
        {errors.avatar && <p role="alert" className="text-xs font-medium text-red-700">{errors.avatar}</p>}
      </div>

      <FormField
        label="Nama tampilan"
        name="displayName"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        error={errors.displayName}
        autoComplete="nickname"
      />

      <div>
        <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium text-deep-forest">
          Bio / deskripsi singkat
        </label>
        <textarea
          id="profile-bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          aria-invalid={errors.bio ? "true" : "false"}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-deep-forest outline-none focus:ring-2 focus:ring-forest ${errors.bio ? "border-red-600" : "border-deep-forest/25"
            }`}
        />
        <p className="mt-1 text-xs text-deep-forest/70">{bio.length}/500 karakter</p>
        {errors.bio && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.bio}</p>}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-deep-forest">Tautan eksternal</legend>
        <p className="text-xs text-deep-forest/70">
          Contoh: Instagram, Behance, atau website pribadi. Gunakan alamat lengkap (https://...). Maksimal {MAX_LINKS}.
        </p>
        <datalist id="link-labels">
          <option value="Instagram" />
          <option value="Behance" />
          <option value="Website" />
        </datalist>

        {links.map((link, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row">
            <input
              list="link-labels"
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="Nama (mis. Instagram)"
              aria-label={`Nama tautan ${i + 1}`}
              maxLength={50}
              className={`${INPUT} sm:w-44`}
            />
            <input
              value={link.url}
              onChange={(e) => updateLink(i, "url", e.target.value)}
              placeholder="https://..."
              aria-label={`Alamat tautan ${i + 1}`}
              inputMode="url"
              className={INPUT}
            />
            <button
              type="button"
              onClick={() => setLinks((rows) => rows.filter((_, idx) => idx !== i))}
              className="rounded-xl border border-red-700 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Hapus
            </button>
          </div>
        ))}

        {links.length < MAX_LINKS && (
          <button
            type="button"
            onClick={() => setLinks((rows) => [...rows, { label: "", url: "" }])}
            className="rounded-xl border border-forest px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest/10"
          >
            + Tambah tautan
          </button>
        )}
        {errors.links && <p role="alert" className="text-xs font-medium text-red-700">{errors.links}</p>}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
      >
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
