import { requireRole } from "@/lib/session";
import { listCategories } from "@/lib/categories";
import NewArtworkForm from "@/components/member/NewArtworkForm";

export const metadata = { title: "Create Artwork · TIGA" };

export default async function NewArtworkPage() {
  await requireRole("member");
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Create Artwork</h1>
        <p className="mt-1 text-sm text-mute">All fields marked with an asterisk are required.</p>
      </div>
      <NewArtworkForm categories={categories} />
    </div>
  );
}
