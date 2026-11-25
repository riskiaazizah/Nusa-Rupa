import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readChallengeForm } from "@/lib/challengeForm";
import { saveUpload, removeUploadedFile } from "@/lib/uploads";
import { createChallenge } from "@/lib/curatorChallenges";

// Upload banner lewat Route Handler (Server Action dibatasi 1 MB secara default)
export async function POST(request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  if (user.role !== "curator" || user.curator_status !== "approved") {
    return NextResponse.json({ error: "Hanya Curator yang sudah disetujui yang dapat membuat challenge." }, { status: 403 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Data form tidak valid." }, { status: 400 });
  }

  const { errors, data, banner } = await readChallengeForm(form, { bannerRequired: true });
  if (Object.keys(errors).length > 0) return NextResponse.json({ errors }, { status: 400 });

  const bannerUrl = await saveUpload(banner.buffer, banner.type.ext, "banners", data.title);
  try {
    const challenge = await createChallenge(user.id, data, bannerUrl);
    return NextResponse.json({ ok: true, id: challenge.id }, { status: 201 });
  } catch (err) {
    await removeUploadedFile(bannerUrl); // jangan tinggalkan file yatim
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}