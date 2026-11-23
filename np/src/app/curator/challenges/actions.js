"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { validateWinnerPicks } from "@/lib/validateChallenge";
import { deleteChallenge, setWinners } from "@/lib/curatorChallenges";
import { removeUploadedFile } from "@/lib/uploads";

const SERVER_ERROR = "Terjadi kesalahan pada server.";

function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function deleteChallengeAction(prevState, formData) {
  const user = await requireRole("curator"); // hanya Curator yang sudah disetujui
  const challengeId = toId(formData.get("challengeId"));
  if (!challengeId) return { error: "Challenge tidak valid." };

  let result;
  try {
    result = await deleteChallenge(challengeId, user.id); // WHERE curator_id: hanya milik sendiri
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }
  if (!result) return { error: "Challenge tidak ditemukan." };

  await removeUploadedFile(result.bannerUrl); // banner seed tidak ikut terhapus
  revalidatePath("/curator/challenges");
  revalidatePath("/challenges");
  revalidatePath("/");
  return { success: true };
}

export async function selectWinnersAction(prevState, formData) {
  const user = await requireRole("curator");
  const challengeId = toId(formData.get("challengeId"));
  if (!challengeId) return { error: "Challenge tidak valid." };

  const check = validateWinnerPicks([formData.get("rank1"), formData.get("rank2"), formData.get("rank3")]);
  if (!check.ok) return { error: check.error };

  let result;
  try {
    result = await setWinners(challengeId, user.id, check.picks);
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }

  if (result.status === "not_found") return { error: "Challenge tidak ditemukan." };
  if (result.status === "not_ended") {
    return { error: "Pemenang hanya dapat dipilih setelah challenge berakhir." };
  }
  if (result.status === "invalid_submission") {
    return { error: "Karya yang dipilih bukan submisi challenge ini." };
  }

  revalidatePath(`/curator/challenges/${challengeId}/submissions`);
  revalidatePath(`/challenges/${challengeId}`);
  revalidatePath("/curator/challenges");
  return { success: true };
}