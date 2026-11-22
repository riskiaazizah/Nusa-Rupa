"use client";

import { useActionState, useState } from "react";

const BASE = "rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
const SOLID = {
  primary: "bg-forest text-ivory hover:bg-deep-forest",
  danger: "bg-red-700 text-white hover:bg-red-800",
};
const OUTLINE = {
  primary: "border border-forest text-forest hover:bg-ivory",
  danger: "border border-red-700 text-red-700 hover:bg-red-50",
};

// Tombol untuk Server Action (prevState, formData) dengan status memproses dan pesan error.
// Jika confirmMessage diisi, klik pertama meminta konfirmasi dulu (untuk aksi yang merusak).
export default function ActionButton({
  action,
  fields = {},
  label,
  pendingLabel = "Memproses...",
  confirmMessage,
  confirmLabel = "Ya, lanjutkan",
  tone = "primary",
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(action, {});

  const error = state.error && (
    <p role="alert" className="mt-1 text-xs font-medium text-red-700">
      {state.error}
    </p>
  );

  if (confirmMessage && !confirming) {
    return (
      <div>
        <button type="button" onClick={() => setConfirming(true)} className={`${BASE} ${OUTLINE[tone]}`}>
          {label}
        </button>
        {error}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={String(value)} />
      ))}
      {confirmMessage && (
        <p role="alert" className="max-w-xs text-xs font-medium text-red-700">
          {confirmMessage}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={`${BASE} ${SOLID[tone]}`}>
          {pending ? pendingLabel : confirmMessage ? confirmLabel : label}
        </button>
        {confirmMessage && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className={`${BASE} border border-deep-forest/25 text-deep-forest hover:bg-ivory`}
          >
            Batal
          </button>
        )}
      </div>
      {error}
    </form>
  );
}