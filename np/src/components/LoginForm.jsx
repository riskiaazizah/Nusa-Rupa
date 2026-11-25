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
      setFormError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1.5 text-sm text-mute">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-forest hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {formError && (
        <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
          {formError}
        </div>
      )}

      <div className="space-y-4">
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
          autoComplete="current-password"
          placeholder="••••••••"
          required
          extraLabel={
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-mute hover:text-people hover:underline transition"
            >
              Forgot password?
            </Link>
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      <div className="pt-2 text-center border-t border-line/60">
        <Link href="/" className="text-xs text-mute hover:text-ink transition">
          Return to home exhibition
        </Link>
      </div>
    </form>
  );
}
