import { requireRole } from "@/lib/session";
import { listCategoriesWithCount } from "@/lib/categories";
import CategoryCreateForm from "@/components/admin/CategoryCreateForm";
import CategoryRow from "@/components/admin/CategoryRow";

export const metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  await requireRole("admin");
  const categories = await listCategoriesWithCount();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Kategori Karya</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          Kategori dipakai Member saat mengunggah karya. Nama harus unik.
        </p>
      </div>

      <CategoryCreateForm />

      <div className="overflow-x-auto rounded-2xl border border-deep-forest/10 bg-white shadow-sm">
        <table className="w-full min-w-lg text-left">
          <thead className="bg-sage/30 text-xs uppercase tracking-wide text-deep-forest">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Nama</th>
              <th scope="col" className="px-4 py-3 font-semibold">Karya</th>
              <th scope="col" className="px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-deep-forest/70">
                  Belum ada kategori. Tambahkan yang pertama di atas.
                </td>
              </tr>
            ) : (
              categories.map((c) => <CategoryRow key={c.id} category={c} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}