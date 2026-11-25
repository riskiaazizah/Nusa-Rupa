"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import FormField from "@/components/FormField";
import { updateAccountAction } from "@/app/member/account/actions";

const EMPTY = { currentPassword: "", newEmail: "", newPassword: "", confirmPassword: "" };

export default function AccountForm({ currentEmail }) {
  const [values, setValues] = useState(EMPTY);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Kosongkan isian hanya jika berhasil, supaya input tidak hilang saat ada error
  async function handleSubmit(prevState, formData) {
    const result = await updateAccountAction(prevState, formData);
    if (result.success) setValues(EMPTY);
    return result;
  }

  const [state, formAction, pending] = useActionState(handleSubmit, {});
  const errors = state.errors ?? {};

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  useEffect(() => {
    if (errors.form) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.form]);

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  return (
    <form action={formAction} noValidate className="max-w-xl space-y-5">
      {/* Floating Pop-Up Error Notification */}
      {showError && errors.form && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-24 right-4 sm:right-8 z-50 flex items-start gap-3.5 rounded-2xl border border-people/20 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-top-4 fade-in-0 duration-300 max-w-sm w-full"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-people/10 text-people mt-0.5">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-sm font-semibold text-ink">Gagal memperbarui akun</p>
            <p className="mt-0.5 text-xs text-mute leading-relaxed">{errors.form}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowError(false)}
            className="text-mute hover:text-ink p-1 rounded-lg hover:bg-soft transition cursor-pointer shrink-0"
            aria-label="Tutup pemberitahuan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Floating Pop-Up Success Notification */}
      {showSuccess && state.success && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 sm:right-8 z-50 flex items-start gap-3.5 rounded-2xl border border-forest/20 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-in slide-in-from-top-4 fade-in-0 duration-300 max-w-sm w-full"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest mt-0.5">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-sm font-semibold text-ink">Akun berhasil diperbarui</p>
            <p className="mt-0.5 text-xs text-mute leading-relaxed">
              Kredensial akun Anda telah berhasil disimpan dan diperbarui.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="text-mute hover:text-ink p-1 rounded-lg hover:bg-soft transition cursor-pointer shrink-0"
            aria-label="Tutup pemberitahuan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="text-sm text-deep-forest/70">
        Email saat ini: <span className="font-semibold text-deep-forest">{currentEmail}</span>
      </p>

      <FormField
        label="Email baru (opsional)"
        name="newEmail"
        type="email"
        value={values.newEmail}
        onChange={handleChange}
        error={errors.newEmail}
        autoComplete="email"
      />
      <FormField
        label="Password baru (opsional)"
        name="newPassword"
        type="password"
        value={values.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        hint="Minimal 8 karakter."
        autoComplete="new-password"
      />
      <FormField
        label="Konfirmasi password baru"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <div className="border-t border-deep-forest/10 pt-5">
        <FormField
          label="Password saat ini"
          name="currentPassword"
          type="password"
          value={values.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          hint="Diperlukan untuk mengubah email atau password."
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
      >
        {pending ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
