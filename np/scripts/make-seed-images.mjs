import { mkdirSync, writeFileSync } from "node:fs";

const dir = "public/uploads/seed";
mkdirSync(dir, { recursive: true });

const palet = [
  ["#172C23", "#3E6448"],
  ["#3E6448", "#A9BE8B"],
  ["#C56E4A", "#E9E8D9"],
  ["#172C23", "#C56E4A"],
  ["#A9BE8B", "#E9E8D9"],
  ["#3E6448", "#172C23"],
];

const svg = (w, h, a, b, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
  `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
  `<text x="24" y="48" font-family="sans-serif" font-size="28" fill="#E9E8D9">${label}</text></svg>`;

palet.forEach(([a, b], i) =>
  writeFileSync(`${dir}/art-${i + 1}.svg`, svg(800, 600, a, b, `TIGA seed artwork ${i + 1}`))
);
palet.slice(0, 3).forEach(([a, b], i) =>
  writeFileSync(`${dir}/banner-${i + 1}.svg`, svg(1200, 400, a, b, `TIGA seed banner ${i + 1}`))
);

console.log("Selesai: 6 gambar karya + 3 banner di", dir);