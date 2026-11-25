"use client";

import { useActionState, useState } from "react";
import FormField from "@/components/FormField";
import { updateAccountAction } from "@/app/member/account/actions";

const EMPTY = { currentPassword: "", newEmail: "", newPassword: "", confirmPassword: "" };

export default function AccountForm({ currentEmail }) {
  const [values, setValues] = useState(EMPTY);

  // Kosongkan isian hanya jika berhasil, supaya input tidak hilang saat ada error
  async function handleSubmit(prevState, formData) {
    const result = await updateAccountAction(prevState, formData);
    if (result.success) setValues(EMPTY);
    return result;
  }

  const [state, formAction, pending] = useActionState(handleSubmit, {});
  const errors = state.errors ?? {};

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  return (
    <form action={formAction} noValidate className="max-w-xl space-y-5">
      {errors.form && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errors.form}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-xl bg-sage/30 px-4 py-3 text-sm font-medium text-deep-forest">
          Akun berhasil diperbarui.
        </p>
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
