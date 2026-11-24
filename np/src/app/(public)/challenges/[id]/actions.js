"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { submitArtwork, withdrawSubmission } from "@/lib/submissions";

const SERVER_ERROR = "Terjadi kesalahan pada server.";

// Guest -> halaman login. Admin/Curator -> null (tidak boleh mengikuti challenge).
async function getMember() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user.role === "member" ? user : null;
}

function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function refresh(challengeId) {
  revalidatePath(`/challenges/${challengeId}`);
  revalidatePath("/member/submissions");
  revalidatePath(`/curator/challenges/${challengeId}/submissions`);
}

const SUBMIT_MESSAGES = {
  already_submitted: "Anda sudah mengirim karya ke challenge ini. Tarik submisi dulu jika ingin mengganti.",
  challenge_not_found: "Challenge tidak ditemukan.",
  artwork_not_owned: "Karya tidak ditemukan atau bukan milik Anda.",
  not_started: "Challenge belum dimulai.",
  ended: "Challenge sudah berakhir.",
};

export async function submitWorkAction(prevState, formData) {
  const user = await getMember();
  if (!user) return { error: "Hanya Member yang dapat mengikuti challenge." };

  const challengeId = toId(formData.get("challengeId"));
  const artworkId = toId(formData.get("artworkId"));
  if (!challengeId) return { error: "Challenge tidak valid." };
  if (!artworkId) return { error: "Pilih satu karya dari portofolio Anda." };

  let result;
  try {
    result = await submitArtwork(user.id, challengeId, artworkId); // waktu dicek di database
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }
  if (result.status !== "created") return { error: SUBMIT_MESSAGES[result.status] ?? SERVER_ERROR };

  refresh(challengeId);
  return { success: true };
}

export async function withdrawSubmissionAction(prevState, formData) {
  const user = await getMember();
  if (!user) return { error: "Hanya Member yang dapat menarik submisi." };

  const challengeId = toId(formData.get("challengeId"));
  if (!challengeId) return { error: "Challenge tidak valid." };

  let result;
  try {
    result = await withdrawSubmission(user.id, challengeId); // hanya submisi sendiri
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }
  if (result.status === "ended") {
    return { error: "Challenge sudah berakhir, submisi tidak dapat ditarik." };
  }
  if (result.status === "not_submitted") return { error: "Anda belum mengirim karya ke challenge ini." };

  refresh(challengeId);
  return { success: true };
}
