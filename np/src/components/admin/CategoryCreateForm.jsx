"use client";

import { useActionState } from "react";
import { addCategoryAction } from "@/app/admin/categories/actions";

export default function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(addCategoryAction, {});

  return (
    <form action={formAction} className="rounded-2xl border border-deep-forest/10 bg-white p-5 shadow-sm">
      <label htmlFor="category-name" className="mb-1.5 block text-sm font-medium text-deep-forest">
        Tambah kategori baru
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="category-name"
          name="name"
          defaultValue={state.name ?? ""}
          placeholder="Contoh: Marine Life"
          aria-invalid={state.error ? "true" : "false"}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-deep-forest outline-none focus:ring-2 focus:ring-forest ${
            state.error ? "border-red-600" : "border-deep-forest/25"
          }`}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Tambah"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="mt-2 text-xs font-medium text-forest">
          {state.success}
        </p>
      )}
    </form>
  );
}