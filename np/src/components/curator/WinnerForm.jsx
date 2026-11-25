"use client";

import { useActionState, useState } from "react";
import { selectWinnersAction } from "@/app/curator/challenges/actions";

const RANKS = [1, 2, 3];

export default function WinnerForm({ challengeId, submissions, current }) {
  const [picks, setPicks] = useState({
    rank1: current[1] ? String(current[1]) : "",
    rank2: current[2] ? String(current[2]) : "",
    rank3: current[3] ? String(current[3]) : "",
  });

  async function handleSubmit(prevState, formData) {
    return selectWinnersAction(prevState, formData);
  }
  const [state, formAction, pending] = useActionState(handleSubmit, {});

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
      <input type="hidden" name="challengeId" value={challengeId} />

      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Select Winners</h2>
        <p className="mt-1 text-sm text-mute">
          Select up to 3 winners. Each artwork can only hold one rank, and each rank can only belong to one artwork.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {RANKS.map((rank) => (
          <div key={rank}>
            <label htmlFor={`rank${rank}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute">
              {rank === 1 ? "1st Place" : rank === 2 ? "2nd Place" : "3rd Place"}
            </label>
            <select
              id={`rank${rank}`}
              name={`rank${rank}`}
              value={picks[`rank${rank}`]}
              onChange={(e) => setPicks((p) => ({ ...p, [`rank${rank}`]: e.target.value }))}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-animals focus:ring-1 focus:ring-animals"
            >
              <option value="">Not selected</option>
              {submissions.map((s) => (
                <option key={s.submission_id} value={s.submission_id}>
                  {s.title} (by {s.creator_name})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {state.error && (
        <div role="alert" className="rounded-xl border border-people/20 bg-people/5 p-4 text-xs font-medium text-people">
          {state.error}
        </div>
      )}
      {state.success && (
        <div role="status" className="rounded-xl border border-forest/20 bg-forest/5 p-4 text-xs font-medium text-forest">
          Winners saved successfully and are now visible on the challenge page.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-animals px-7 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save winners"}
      </button>
    </form>
  );
}
