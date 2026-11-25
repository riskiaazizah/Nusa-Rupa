"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "./FormField";

const ROLES = [
  { value: "member", label: "Member", desc: "Upload and share your artworks" },
  { value: "curator", label: "Curator", desc: "Create community challenges" },
];

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    role: "member",
    displayName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCurator = values.role === "curator";

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? "");
        return;
      }
      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setFormError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Get started</h1>
        <p className="mt-1.5 text-sm text-mute">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-forest hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {formError && (
        <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
          {formError}
        </div>
      )}

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-mute">
          Account Role
        </span>
        <div role="radiogroup" aria-label="Account role" className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const active = values.role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setValues((v) => ({ ...v, role: r.value }))}
                className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${
                  active
                    ? "border-forest bg-forest text-white shadow-sm"
                    : "border-line bg-white text-ink hover:border-ink/40"
                }`}
              >
                <span className="block text-sm font-semibold">{r.label}</span>
                <span className={`block text-xs mt-0.5 ${active ? "text-white/85" : "text-mute"}`}>
                  {r.desc}
                </span>
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-people">
            {errors.role}
          </p>
        )}
      </div>

      {isCurator && (
        <div className="rounded-xl border border-animals/30 bg-animals/5 p-3.5 text-xs text-ink">
          Curator accounts will be reviewed by an Admin before access is granted to create challenges.
        </div>
      )}

      <div className="space-y-4">
        <FormField
          label={isCurator ? "Organization / Community Name" : "Display Name"}
          name="displayName"
          value={values.displayName}
          onChange={handleChange}
          error={errors.displayName}
          autoComplete="name"
          placeholder={isCurator ? "e.g. Borneo Art Collective" : "e.g. Sari Mahardika"}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          placeholder="your@email.com"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 8 characters."
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
      >
        {loading ? "Creating account..." : `Sign up as ${isCurator ? "Curator" : "Member"}`}
      </button>

      <div className="pt-2 text-center border-t border-line/60">
        <Link href="/" className="text-xs text-mute hover:text-ink transition">
          Return to home exhibition
        </Link>
      </div>
    </form>
  );
}
