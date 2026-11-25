"use client";

import { useActionState, useState } from "react";
import { editCategoryAction, removeCategoryAction } from "@/app/admin/categories/actions";

export default function CategoryRow({ category }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleEdit(prevState, formData) {
    const result = await editCategoryAction(prevState, formData);
    if (result.success) setEditing(false);
    return result;
  }

  const [editState, editAction, editPending] = useActionState(handleEdit, {});
  const [deleteState, deleteAction, deletePending] = useActionState(removeCategoryAction, {});

  const inUse = category.artwork_count > 0;

  return (
    <tr className="border-t border-line/60 transition hover:bg-soft/40">
      <td className="px-5 py-3.5 align-top">
        {editing ? (
          <form action={editAction} className="flex flex-col gap-2 sm:flex-row">
            <input type="hidden" name="id" value={category.id} />
            <input
              name="name"
              defaultValue={category.name}
              aria-label={`New name for category ${category.name}`}
              className="w-full rounded-full border border-line bg-white px-3.5 py-1.5 text-xs text-ink outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={editPending}
                className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white hover:bg-people disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-soft"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <span className="text-sm font-medium text-ink">{category.name}</span>
        )}
        {editState.error && (
          <p role="alert" className="mt-1 text-xs font-medium text-people">
            {editState.error}
          </p>
        )}
      </td>

      <td className="px-5 py-3.5 align-top text-sm text-mute">{category.artwork_count}</td>

      <td className="px-5 py-3.5 align-top">
        {!editing &&
          (confirming ? (
            <form action={deleteAction} className="space-y-2">
              <input type="hidden" name="id" value={category.id} />
              <p className="text-xs font-medium text-people">Delete this category?</p>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={deletePending}
                  className="rounded-full bg-people px-3 py-1 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {deletePending ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink hover:bg-soft"
                >
                  Cancel
                </button>
              </div>
              {deleteState.error && (
                <p role="alert" className="text-xs font-medium text-people">
                  {deleteState.error}
                </p>
              )}
            </form>
          ) : (
            <div className="flex items-center gap-4 text-xs font-semibold">
              <button type="button" onClick={() => setEditing(true)} className="text-ink hover:text-forest hover:underline">
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={inUse}
                title={inUse ? "Used by artworks, cannot be deleted" : undefined}
                className="text-people hover:underline disabled:cursor-not-allowed disabled:text-mute/40 disabled:no-underline"
              >
                Delete
              </button>
            </div>
          ))}
      </td>
    </tr>
  );
}