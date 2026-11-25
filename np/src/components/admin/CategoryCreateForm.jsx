"use client";

import { useActionState } from "react";
import { addCategoryAction } from "@/app/admin/categories/actions";

export default function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(addCategoryAction, {});

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <label htmlFor="category-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">
        Add New Category
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="category-name"
          name="name"
          defaultValue={state.name ?? ""}
          placeholder="e.g. Marine Life"
          aria-invalid={state.error ? "true" : "false"}
          className={`w-full rounded-full border bg-white px-5 py-2.5 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-ink focus:ring-1 focus:ring-ink ${
            state.error ? "border-people ring-1 ring-people/30" : "border-line hover:border-ink/40"
          }`}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-ink px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-people disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Adding..." : "Add category"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="mt-2 text-xs font-medium text-people">
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
