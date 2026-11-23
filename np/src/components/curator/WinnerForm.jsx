"use client";

import { useActionState, useState } from "react";
import { selectWinnersAction } from "@/app/curator/challenges/actions";

const RANKS = [1, 2, 3];

// submissions: [{ submission_id, title, creator_name }], current: { 1: id|null, 2: ..., 3: ... }
export default function WinnerForm({ challengeId, submissions, current }) {
  const [picks, setPicks] = useState({
    rank1: current[1] ? String(current[1]) : "",
    rank2: current[2] ? String(current[2]) : "",
    rank3: current[3] ? String(current[3]) : "",
  });

  // Pilihan tetap tersimpan di form walau backend menolak (misalnya karya dobel)
  async function handleSubmit(prevState, formData) {
    return selectWinnersAction(prevState, formData);
  }
  const [state, formAction, pending] = useActionState(handleSubmit, {});

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-deep-forest/10 bg-white p-6 shadow-sm">
      <input type="hidden" name="challengeId" value={challengeId} />

      <div>
        <h2 className="text-lg font-semibold text-deep-forest">Pilih pemenang</h2>
        <p className="text-sm text-deep-forest/70">
          Maksimal 3 pemenang. Satu karya hanya satu peringkat, dan satu peringkat hanya untuk satu karya.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {RANKS.map((rank) => (
          <div key={rank}>
            <label htmlFor={`rank${rank}`} className="mb-1.5 block text-sm font-medium text-deep-forest">
              Juara {rank}
            </label>
            <select
              id={`rank${rank}`}
              name={`rank${rank}`}
              value={picks[`rank${rank}`]}
              onChange={(e) => setPicks((p) => ({ ...p, [`rank${rank}`]: e.target.value }))}
              className="w-full rounded-xl border border-deep-forest/25 bg-white px-3 py-2.5 text-sm text-deep-forest outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="">Belum dipilih</option>
              {submissions.map((s) => (
                <option key={s.submission_id} value={s.submission_id}>
                  {s.title} (oleh {s.creator_name})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-xl bg-sage/30 px-4 py-3 text-sm font-medium text-deep-forest">
          Pemenang berhasil disimpan dan tampil di halaman challenge.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan pemenang"}
      </button>
    </form>
  );
}