"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "./FormField";

const ROLES = [
  { value: "member", label: "Member", desc: "Unggah dan bagikan karya" },
  { value: "curator", label: "Curator", desc: "Buat challenge komunitas" },
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
      setFormError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-deep-forest">Daftar ke TIGA</h1>
        <p className="mt-1 text-sm text-deep-forest/70">Pilih peran Anda di platform.</p>
      </div>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      <div>
        <div role="radiogroup" aria-label="Tipe akun" className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const active = values.role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setValues((v) => ({ ...v, role: r.value }))}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-forest bg-forest text-ivory"
                    : "border-deep-forest/25 bg-white text-deep-forest hover:border-forest"
                }`}
              >
                <span className="block text-sm font-semibold">{r.label}</span>
                <span className="block text-xs opacity-80">{r.desc}</span>
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-700">
            {errors.role}
          </p>
        )}
      </div>

      {isCurator && (
        <p className="rounded-xl bg-sage/30 px-4 py-3 text-xs text-deep-forest">
          Akun Curator akan ditinjau Admin lebih dulu. Dashboard baru dapat dipakai setelah akun
          disetujui.
        </p>
      )}

      <FormField
        label={isCurator ? "Nama organisasi / komunitas" : "Nama tampilan"}
        name="displayName"
        value={values.displayName}
        onChange={handleChange}
        error={errors.displayName}
        autoComplete="name"
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        hint="Minimal 8 karakter."
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : `Daftar sebagai ${isCurator ? "Curator" : "Member"}`}
      </button>

      <p className="text-center text-sm text-deep-forest/80">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-forest hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}