"use client";

import { useActionState, useState } from "react";

const BASE = "rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const SOLID = {
  primary: "bg-ink text-white hover:bg-forest",
  danger: "bg-people text-white hover:bg-people/90",
};
const OUTLINE = {
  primary: "border border-line bg-white text-ink hover:border-ink hover:bg-soft",
  danger: "border border-people/30 bg-people/5 text-people hover:bg-people hover:text-white",
};

export default function ActionButton({
  action,
  fields = {},
  label,
  pendingLabel = "Processing...",
  confirmMessage,
  confirmLabel = "Confirm",
  tone = "primary",
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(action, {});

  const error = state.error && (
    <p role="alert" className="mt-1 text-xs font-medium text-people">
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
        <p role="alert" className="max-w-xs text-xs font-medium text-people">
          {confirmMessage}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={pending} className={`${BASE} ${SOLID[tone]}`}>
          {pending ? pendingLabel : confirmMessage ? confirmLabel : label}
        </button>
        {confirmMessage && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className={`${BASE} border border-line bg-white text-mute hover:border-ink/30 hover:text-ink hover:bg-soft`}
          >
            Cancel
          </button>
        )}
      </div>
      {error}
    </form>
  );
}
