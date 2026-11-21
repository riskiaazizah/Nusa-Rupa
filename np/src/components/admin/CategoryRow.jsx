"use client";

import { useActionState, useState } from "react";
import { editCategoryAction, removeCategoryAction } from "@/app/admin/categories/actions";

export default function CategoryRow({ category }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Tutup mode edit setelah berhasil menyimpan
  async function handleEdit(prevState, formData) {
    const result = await editCategoryAction(prevState, formData);
    if (result.success) setEditing(false);
    return result;
  }

  const [editState, editAction, editPending] = useActionState(handleEdit, {});
  const [deleteState, deleteAction, deletePending] = useActionState(removeCategoryAction, {});

  const inUse = category.artwork_count > 0;

  return (
    <tr className="border-t border-deep-forest/10">
      <td className="px-4 py-3 align-top">
        {editing ? (
          <form action={editAction} className="flex flex-col gap-2 sm:flex-row">
            <input type="hidden" name="id" value={category.id} />
            <input
              name="name"
              defaultValue={category.name}
              aria-label={`Nama baru untuk kategori ${category.name}`}
              className="w-full rounded-xl border border-deep-forest/25 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-forest"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={editPending}
                className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-ivory hover:bg-deep-forest disabled:opacity-60"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-deep-forest/25 px-4 py-2 text-sm font-semibold hover:bg-ivory"
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          <span className="text-sm font-medium text-deep-forest">{category.name}</span>
        )}
        {editState.error && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-700">
            {editState.error}
          </p>
        )}
      </td>

      <td className="px-4 py-3 align-top text-sm text-deep-forest">{category.artwork_count}</td>

      <td className="px-4 py-3 align-top">
        {!editing &&
          (confirming ? (
            <form action={deleteAction} className="space-y-2">
              <input type="hidden" name="id" value={category.id} />
              <p className="text-xs font-medium text-red-700">Hapus kategori ini?</p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={deletePending}
                  className="rounded-xl bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                >
                  Ya, hapus
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-xl border border-deep-forest/25 px-3 py-1.5 text-xs font-semibold hover:bg-ivory"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-4 text-sm font-semibold">
              <button type="button" onClick={() => setEditing(true)} className="text-forest hover:underline">
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={inUse}
                title={inUse ? "Masih dipakai karya, tidak dapat dihapus" : undefined}
                className="text-red-700 hover:underline disabled:cursor-not-allowed disabled:text-deep-forest/40 disabled:no-underline"
              >
                Hapus
              </button>
            </div>
          ))}
        {deleteState.error && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-700">
            {deleteState.error}
          </p>
        )}
      </td>
    </tr>
  );
}