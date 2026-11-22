// Membuat query string dari objek. Nilai kosong/null/undefined dilewati,
// jadi override { page: null } berarti "hapus parameter page".
export function buildQuery(params, overrides = {}) {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}