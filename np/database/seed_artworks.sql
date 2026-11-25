-- =====================================================
-- TIGA · ART FOR EARTH : database/seed_artworks.sql
-- Khusus untuk seed / re-seed data ARTWORKS & TAGS
-- Bersifat mandiri (idempotent): aman dijalankan berulang kali
-- =====================================================

-- 1. Pastikan user creator (Member) tersedia agar tidak melanggar foreign key
INSERT INTO users (id, email, password_hash, role, curator_status) VALUES
 (2, 'sari@tiga.test', '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'member', NULL),
 (3, 'bima@tiga.test', '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'member', NULL),
 (4, 'dewi@tiga.test', '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'member', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (user_id, display_name, bio) VALUES
 (2, 'Sari Kalimantan', 'Ilustrator satwa liar. Menggambar agar hutan tidak dilupakan.'),
 (3, 'Bima Gambut',     'Fotografer lingkungan yang merekam dampak kebakaran lahan.'),
 (4, 'Dewi Adat',       'Seniman digital yang mengangkat suara komunitas adat.')
ON CONFLICT (user_id) DO NOTHING;

-- 2. Pastikan kategori dan tag dasar tersedia
INSERT INTO categories (id, name) VALUES
 (1, 'Flora'),
 (2, 'Fauna'),
 (3, 'Social Impact'),
 (4, 'Environment'),
 (5, 'Culture & Heritage'),
 (6, 'Conservation & Hope')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tags (name) VALUES
 ('palm oil expansion'),
 ('forest fire'),
 ('peatland'),
 ('habitat loss'),
 ('endangered species'),
 ('indigenous rights'),
 ('climate change'),
 ('reforestation'),
 ('sustainable living')
ON CONFLICT (name) DO NOTHING;

-- 3. Insert atau Update data Artworks (id 1 s.d. 6)
-- File fisik tersimpan di: public/uploads/artworks/gambar-{n}.png
INSERT INTO artworks (id, user_id, category_id, title, description, file_url, created_at) VALUES
 (1, 2, 2, 'Mata Terakhir di Hutan Kalimantan',
  'Ilustrasi orangutan yang menatap hamparan sawit di tepi hutan yang menyusut.',
  '/uploads/artworks/gambar-1.png', NOW() - INTERVAL '10 days'),
 (2, 3, 4, 'Asap di Atas Gambut',
  'Dokumentasi digital kabut asap yang menutup lahan gambut setelah kebakaran.',
  '/uploads/artworks/gambar-2.png', NOW() - INTERVAL '9 days'),
 (3, 2, 1, 'Anggrek Hutan Hujan',
  'Studi botani anggrek endemik yang habitatnya terus berkurang.',
  '/uploads/artworks/gambar-3.png', NOW() - INTERVAL '7 days'),
 (4, 4, 3, 'Suara dari Hutan Adat',
  'Potret komunitas adat yang mempertahankan hutan sebagai ruang hidup.',
  '/uploads/artworks/gambar-4.png', NOW() - INTERVAL '5 days'),
 (5, 4, 5, 'Tenun dan Tanah',
  'Motif tenun yang terinspirasi pengetahuan lokal tentang tanah dan tanaman.',
  '/uploads/artworks/gambar-5.png', NOW() - INTERVAL '3 days'),
 (6, 3, 6, 'Menanam Kembali Mangrove',
  'Warga pesisir menanam bibit mangrove untuk memulihkan garis pantai.',
  '/uploads/artworks/gambar-6.png', NOW() - INTERVAL '1 days')
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title       = EXCLUDED.title,
  description = EXCLUDED.description,
  file_url    = EXCLUDED.file_url;

-- 4. Hapus relasi tag lama untuk karya 1-6 dan pasang tag baru
DELETE FROM artwork_tags WHERE artwork_id IN (1, 2, 3, 4, 5, 6);

INSERT INTO artwork_tags (artwork_id, tag_id)
SELECT a.artwork_id, t.id FROM (VALUES
 (1,'habitat loss'), (1,'palm oil expansion'), (1,'endangered species'),
 (2,'forest fire'),  (2,'peatland'),           (2,'climate change'),
 (3,'endangered species'), (3,'habitat loss'),
 (4,'indigenous rights'),  (4,'palm oil expansion'),
 (5,'indigenous rights'),  (5,'sustainable living'),
 (6,'reforestation'),      (6,'climate change')
) AS a(artwork_id, tag_name)
JOIN tags t ON t.name = a.tag_name;

-- 5. Sinkronkan sequence artworks ID agar upload karya baru via web tidak bentrok ID
SELECT setval(pg_get_serial_sequence('artworks','id'), COALESCE((SELECT MAX(id) FROM artworks), 1));
SELECT setval(pg_get_serial_sequence('users','id'),    COALESCE((SELECT MAX(id) FROM users), 1));
