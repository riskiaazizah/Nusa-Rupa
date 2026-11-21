"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "./FormField";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");
    try {
      const res = await fetch("/api/auth/login", {
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
        <h1 className="text-xl font-semibold text-deep-forest">Masuk ke TIGA</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          When nature loses its voice, let art speak.
        </p>
      </div>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

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
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>

      <p className="text-center text-sm text-deep-forest/80">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-forest hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}