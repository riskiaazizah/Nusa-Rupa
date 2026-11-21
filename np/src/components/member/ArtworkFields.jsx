"use client";

import { useId } from "react";

const BASE =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-deep-forest outline-none transition focus:ring-2 focus:ring-forest";

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-deep-forest">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-deep-forest/70">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

// Dipakai bersama oleh form Unggah dan form Edit karya
export default function ArtworkFields({ values, errors, onChange, categories }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const props = (name) => ({
    id: id(name),
    name,
    value: values[name],
    onChange,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
    className: `${BASE} ${errors[name] ? "border-red-600" : "border-deep-forest/25"}`,
  });

  return (
    <>
      <Field id={id("title")} label="Judul karya" error={errors.title}>
        <input type="text" {...props("title")} />
      </Field>

      <Field id={id("description")} label="Deskripsi" error={errors.description}>
        <textarea rows={5} {...props("description")} />
      </Field>

      <Field id={id("categoryId")} label="Kategori" error={errors.categoryId}>
        <select {...props("categoryId")}>
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={id("tags")}
        label="Tags"
        error={errors.tags}
        hint="Pisahkan dengan koma, misalnya: forest fire, peatland. Minimal 1, maksimal 10."
      >
        <input type="text" {...props("tags")} />
      </Field>
    </>
  );
}