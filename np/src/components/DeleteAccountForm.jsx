"use client";

import { useState } from "react";
import { deleteRejectedAccount } from "@/app/(auth)/pending-curator/actions";

export default function DeleteAccountForm() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full rounded-xl border border-red-700 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        Delete Account
      </button>
    );
  }

  return (
    <form action={deleteRejectedAccount} className="space-y-3">
      <p role="alert" className="text-sm font-medium text-red-700">
        Akun akan dihapus permanen dan tidak dapat dikembalikan. Lanjutkan?
      </p>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Ya, hapus akun
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 rounded-xl border border-deep-forest/25 px-4 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-ivory"
        >
          Batal
        </button>
      </div>
    </form>
  );
}