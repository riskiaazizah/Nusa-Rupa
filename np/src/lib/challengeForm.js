import { validateChallengeInput } from "./validateChallenge";
import { MAX_UPLOAD_BYTES, detectImageType } from "./uploads";

// Membaca form multipart challenge (dipakai route POST dan PATCH).
// Banner dicek dari ISI file (bukan nama/ekstensi). Hasil: { errors, data, banner }
export async function readChallengeForm(form, { bannerRequired }) {
  const { errors, data } = validateChallengeInput({
    title: form.get("title"),
    description: form.get("description"),
    rules: form.get("rules"),
    prize: form.get("prize"),
    startDate: form.get("startDate"),
    endDate: form.get("endDate"),
  });

  const file = form.get("banner");
  const hasFile = file instanceof File && file.size > 0;
  let banner = null;

  if (!hasFile) {
    if (bannerRequired) errors.banner = "Gambar banner wajib diunggah.";
  } else if (file.size > MAX_UPLOAD_BYTES) {
    errors.banner = "Ukuran banner maksimal 5 MB.";
  } else {
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectImageType(buffer);
    if (type) banner = { buffer, type };
    else errors.banner = "Format banner harus JPG, PNG, WEBP, atau GIF.";
  }

  return { errors, data, banner };
}