import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getOwnedArtwork } from "@/lib/artworks";
import { listCategories } from "@/lib/categories";
import EditArtworkForm from "@/components/member/EditArtworkForm";

export const metadata = { title: "Edit Karya" };

export default async function EditArtworkPage({ params }) {
  const user = await requireRole("member");

  const { id } = await params;
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId)) notFound();

  const [artwork, categories] = await Promise.all([
    getOwnedArtwork(artworkId, user.id), // hanya karya milik sendiri
    listCategories(),
  ]);
  if (!artwork) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Edit Karya</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          Judul, deskripsi, kategori, dan tags dapat diubah.
        </p>
      </div>
      <EditArtworkForm artwork={artwork} categories={categories} />
    </div>
  );
}