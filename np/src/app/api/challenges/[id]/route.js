import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readChallengeForm } from "@/lib/challengeForm";
import { saveUpload, removeUploadedFile } from "@/lib/uploads";
import { updateChallenge } from "@/lib/curatorChallenges";

export async function PATCH(request, { params }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  if (user.role !== "curator" || user.curator_status !== "approved") {
    return NextResponse.json({ error: "Hanya Curator yang sudah disetujui yang dapat mengubah challenge." }, { status: 403 });
  }

  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) {
    return NextResponse.json({ error: "Challenge tidak ditemukan." }, { status: 404 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Data form tidak valid." }, { status: 400 });
  }

  // Banner opsional saat edit: kosong = tetap memakai banner lama
  const { errors, data, banner } = await readChallengeForm(form, { bannerRequired: false });
  if (Object.keys(errors).length > 0) return NextResponse.json({ errors }, { status: 400 });

  const newBannerUrl = banner ? await saveUpload(banner.buffer, banner.type.ext, "banners", data.title) : null;
  try {
    const result = await updateChallenge(challengeId, user.id, data, newBannerUrl); // WHERE curator_id: cek pemilik
    if (result.status !== "updated") {
      if (newBannerUrl) await removeUploadedFile(newBannerUrl);
      if (result.status === "dates_locked") {
        return NextResponse.json(
          { error: "Tanggal mulai dan selesai tidak dapat diubah setelah pemenang dipilih." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Challenge tidak ditemukan." }, { status: 404 });
    }
    if (result.oldBannerUrl) await removeUploadedFile(result.oldBannerUrl);
    return NextResponse.json({ ok: true, id: challengeId });
  } catch (err) {
    if (newBannerUrl) await removeUploadedFile(newBannerUrl);
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}