"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;
const BASE =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm sm:text-base text-ink outline-none transition placeholder:text-mute/50 focus:border-animals focus:ring-1 focus:ring-animals";

function Field({ id, label, error, hint, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold tracking-wide text-ink/80">
        {label}
        {required && <span className="ml-1 text-people">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs sm:text-sm text-mute">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs sm:text-sm font-medium text-people">
          {error}
        </p>
      )}
    </div>
  );
}

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
    if (!ACCEPTED.includes(picked.type)) {
      return resetFile(e.target, "Banner format must be JPG, PNG, WEBP, or GIF.");
    }
    if (picked.size > MAX_BYTES) return resetFile(e.target, "Maximum banner size is 5 MB.");
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
      setFormError("Unable to reach server. Please try again.");
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
    className: `${BASE} ${errors[name] ? "border-people ring-1 ring-people/30" : "border-line hover:border-ink/40"}`,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
      {formError && (
        <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
          {formError}
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <label htmlFor="ch-banner" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">
          Challenge Banner {!isEdit && <span className="text-people">*</span>}
        </label>
        {isEdit && !preview && (
          <div className="mb-4 overflow-hidden rounded-xl border border-ink/10 bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={challenge.bannerUrl} alt="Current banner" className="aspect-[3/1] w-full object-cover" />
          </div>
        )}
        <input
          id="ch-banner"
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleFile}
          aria-invalid={errors.banner ? "true" : "false"}
          aria-describedby={errors.banner ? "ch-banner-error" : "ch-banner-hint"}
          className="block w-full text-sm text-ink file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-animals file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:opacity-90 transition"
        />
        {!errors.banner && (
          <p id="ch-banner-hint" className="mt-1.5 text-xs text-mute">
            JPG, PNG, WEBP, or GIF. Max 5 MB. Aspect ratio 3:1 recommended.
            {isEdit && " Leave empty to keep the current banner."}
          </p>
        )}
        {errors.banner && (
          <p id="ch-banner-error" role="alert" className="mt-1.5 text-xs font-medium text-people">
            {errors.banner}
          </p>
        )}
        {preview && (
          <div className="mt-4 overflow-hidden rounded-xl border border-ink/10 bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Banner preview" className="aspect-[3/1] w-full object-cover" />
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <Field id="ch-title" label="Challenge Title" error={errors.title} required>
          <input type="text" placeholder="e.g. Echoes of the Peat Fires" {...props("title")} />
        </Field>

        <Field id="ch-description" label="Description" error={errors.description} required>
          <textarea
            rows={4}
            placeholder="Describe the context, themes, and prompt for creators..."
            {...props("description")}
          />
        </Field>

        <Field id="ch-rules" label="Rules & Guidelines" error={errors.rules} required>
          <textarea
            rows={4}
            placeholder="Submission requirements, original artwork policies, eligibility..."
            {...props("rules")}
          />
        </Field>

        <Field id="ch-prize" label="Prize" error={errors.prize} hint="e.g. IDR 2,500,000 + Exhibition Feature" required>
          <input type="text" placeholder="IDR 2,500,000" {...props("prize")} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="ch-startDate" label="Start Date (WITA)" error={errors.startDate} required>
            <input type="datetime-local" {...props("startDate")} />
          </Field>
          <Field id="ch-endDate" label="End Date (WITA)" error={errors.endDate} required>
            <input type="datetime-local" {...props("endDate")} />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-animals px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Challenge"}
        </button>
        <Link
          href="/curator/challenges"
          className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-soft"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
