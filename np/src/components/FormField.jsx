"use client";

import { useId, useState } from "react";

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  hint,
  autoComplete,
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-deep-forest">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-deep-forest outline-none transition focus:ring-2 focus:ring-forest ${
            error ? "border-red-600" : "border-deep-forest/25"
          } ${isPassword ? "pr-28" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-3 text-xs font-medium text-forest hover:underline"
          >
            {show ? "Sembunyikan" : "Tampilkan"}
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-deep-forest/70">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}