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
        className="w-full rounded-full border border-people px-6 py-2.5 text-sm font-semibold text-people transition hover:bg-people hover:text-white"
      >
        Delete Account
      </button>
    );
  }

  return (
    <form action={deleteRejectedAccount} className="space-y-3 rounded-xl border border-people/30 bg-people/5 p-4">
      <p role="alert" className="text-xs font-medium text-people">
        This account will be permanently deleted and cannot be recovered. Continue?
      </p>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-full bg-people px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Yes, delete account
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
