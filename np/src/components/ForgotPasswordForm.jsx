"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormField from "./FormField";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  // step: 1 = Enter Email, 2 = Enter New Password, 3 = Success
  const [step, setStep] = useState(initialToken ? 2 : 1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(initialToken);
  const [passwordValues, setPasswordValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
      setStep(2);
    }
  }, [initialToken]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? "Failed to verify email address.");
        return;
      }

      setToken(data.token);
      setStep(2);
    } catch {
      setFormError("Unable to reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: passwordValues.password,
          confirmPassword: passwordValues.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? "Failed to update password.");
        return;
      }

      setStep(3);
    } catch {
      setFormError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} noValidate className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Reset Password</h1>
            <p className="mt-1.5 text-sm text-mute">
              Enter your registered email address to set a new password.
            </p>
          </div>

          {formError && (
            <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <FormField
              label="Registered Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

          <p className="text-center text-sm text-mute">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-forest hover:underline">
              Back to log in
            </Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePasswordSubmit} noValidate className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">New Password</h1>
            <p className="mt-1.5 text-sm text-mute">
              Create a secure password with at least 8 characters.
            </p>
            {email && (
              <p className="mt-1 text-xs font-medium text-forest">
                Account: {email}
              </p>
            )}
          </div>

          {formError && (
            <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-sm font-medium text-people">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <FormField
              label="New Password"
              name="password"
              type="password"
              value={passwordValues.password}
              onChange={(e) =>
                setPasswordValues((v) => ({ ...v, password: e.target.value }))
              }
              error={errors.password}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              required
            />
            <FormField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordValues.confirmPassword}
              onChange={(e) =>
                setPasswordValues((v) => ({ ...v, confirmPassword: e.target.value }))
              }
              error={errors.confirmPassword}
              autoComplete="new-password"
              placeholder="Re-enter new password"
              required
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || !passwordValues.password || !passwordValues.confirmPassword}
              className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving password..." : "Save New Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setFormError("");
                setErrors({});
              }}
              className="w-full rounded-full border border-line bg-white py-2.5 text-xs font-semibold text-ink transition hover:border-ink hover:bg-soft"
            >
              Change Email
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center py-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Password Updated</h1>
            <p className="mt-2 text-sm text-mute">
              Your password has been successfully updated. You can now log in using your new credentials.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-block w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest"
          >
            Log in to TIGA
          </Link>
        </div>
      )}
    </div>
  );
}
