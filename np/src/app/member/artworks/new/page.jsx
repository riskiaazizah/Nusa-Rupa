import { requireRole } from "@/lib/session";
import { listCategories } from "@/lib/categories";
import NewArtworkForm from "@/components/member/NewArtworkForm";

export const metadata = { title: "Unggah Karya" };

export default async function NewArtworkPage() {
  await requireRole("member");
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Unggah Karya</h1>
        <p className="mt-1 text-sm text-deep-forest/70">Semua kolom wajib diisi.</p>
      </div>
      <NewArtworkForm categories={categories} />
    </div>
  );
}