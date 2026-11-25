import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getOwnedArtwork } from "@/lib/artworks";
import { listCategories } from "@/lib/categories";
import EditArtworkForm from "@/components/member/EditArtworkForm";

export const metadata = { title: "Edit Artwork · TIGA" };

export default async function EditArtworkPage({ params }) {
  const user = await requireRole("member");

  const { id } = await params;
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId)) notFound();

  const [artwork, categories] = await Promise.all([
    getOwnedArtwork(artworkId, user.id),
    listCategories(),
  ]);
  if (!artwork) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Edit Artwork</h1>
        <p className="mt-1 text-sm text-mute">
          Title, description, category, and issue tags can be modified.
        </p>
      </div>
      <EditArtworkForm artwork={artwork} categories={categories} />
    </div>
  );
}
