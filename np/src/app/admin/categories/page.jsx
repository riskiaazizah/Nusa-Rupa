import { requireRole } from "@/lib/session";
import { listCategoriesWithCount } from "@/lib/categories";
import CategoryCreateForm from "@/components/admin/CategoryCreateForm";
import CategoryRow from "@/components/admin/CategoryRow";

export const metadata = { title: "Category Management · TIGA" };

export default async function CategoriesPage() {
  await requireRole("admin");
  const categories = await listCategoriesWithCount();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Category Management</h1>
        <p className="mt-1 text-sm text-mute">
          Categories used by creators when publishing artworks. Names must be unique.
        </p>
      </div>

      <CategoryCreateForm />

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-lg text-left">
          <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-wider text-mute">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">Category Name</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Artworks</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-sm text-mute">
                  No categories defined yet. Add the first one above.
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
