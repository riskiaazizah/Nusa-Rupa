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
  placeholder,
  required,
  extraLabel,
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <label htmlFor={id} className="block text-sm font-semibold tracking-wide text-ink/80">
            {label}
            {required && <span className="ml-1 text-people">*</span>}
          </label>
          {extraLabel}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm sm:text-base text-ink outline-none transition placeholder:text-mute/50 focus:border-ink focus:ring-1 focus:ring-ink ${
            error ? "border-people ring-1 ring-people/30" : "border-line hover:border-ink/40"
          } ${isPassword ? "pr-20" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-3 text-sm font-medium text-mute hover:text-ink"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs sm:text-sm text-mute">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs sm:text-sm font-medium text-people">
          {error}
        </p>
      )}
    </div>
  );
}
