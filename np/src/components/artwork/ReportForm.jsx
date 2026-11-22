"use client";

import { useActionState } from "react";
import { reportArtworkAction } from "@/app/(public)/artworks/[id]/actions";
import { REPORT_REASONS } from "@/lib/constants";

export default function ReportForm({ artworkId }) {
  const [state, formAction, pending] = useActionState(reportArtworkAction, {});
  const errors = state.errors ?? {};

  return (
    <details className="rounded-xl border border-deep-forest/15 bg-white">
      <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-red-700">
        Laporkan karya ini
      </summary>
      <form action={formAction} className="space-y-3 border-t border-deep-forest/10 p-4">
        <input type="hidden" name="artworkId" value={artworkId} />

        <div>
          <label htmlFor="report-reason" className="mb-1 block text-sm font-medium text-deep-forest">
            Alasan
          </label>
          <select
            id="report-reason"
            name="reason"
            defaultValue=""
            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-forest ${
              errors.reason ? "border-red-600" : "border-deep-forest/25"
            }`}
          >
            <option value="">Pilih alasan</option>
            {REPORT_REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.reason && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.reason}</p>}
        </div>

        <div>
          <label htmlFor="report-details" className="mb-1 block text-sm font-medium text-deep-forest">
            Detail (opsional)
          </label>
          <textarea
            id="report-details"
            name="details"
            rows={3}
            className="w-full rounded-xl border border-deep-forest/25 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-forest"
          />
          {errors.details && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.details}</p>}
        </div>

        {state.error && <p role="alert" className="text-xs font-medium text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-60"
        >
          {pending ? "Mengirim..." : "Kirim laporan"}
        </button>
      </form>
    </details>
  );
}