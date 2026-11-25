-- =====================================================
-- TIGA · ART FOR EARTH : database/seed.sql
-- Jalankan SETELAH schema.sql
-- Password SEMUA akun demo: TigaDemo123
-- =====================================================

-- USERS (id eksplisit agar relasi di bawah mudah dibaca)
INSERT INTO users (id, email, password_hash, role, curator_status) VALUES
 (1, 'admin@tiga.test',   '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'admin',   NULL),
 (2, 'sari@tiga.test',    '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'member',  NULL),
 (3, 'bima@tiga.test',    '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'member',  NULL),
 (4, 'dewi@tiga.test',    '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'member',  NULL),
 (5, 'rimba@tiga.test',   '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'curator', 'approved'),
 (6, 'gambut@tiga.test',  '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'curator', 'pending'),
 (7, 'ditolak@tiga.test', '$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy', 'curator', 'rejected');

INSERT INTO profiles (user_id, display_name, avatar_url, bio) VALUES
 (1, 'Administrator TIGA', NULL, 'Menjaga integritas platform.'),
 (2, 'Sari Kalimantan',    NULL, 'Ilustrator satwa liar. Menggambar agar hutan tidak dilupakan.'),
 (3, 'Bima Gambut',        NULL, 'Fotografer lingkungan yang merekam dampak kebakaran lahan.'),
 (4, 'Dewi Adat',          NULL, 'Seniman digital yang mengangkat suara komunitas adat.'),
 (5, 'Komunitas Rimba Lestari', NULL, 'Komunitas konservasi yang menggelar challenge seni untuk hutan Indonesia.'),
 (6, 'Studio Gambut Muda', NULL, 'Menunggu persetujuan Admin.'),
 (7, 'Brand Tidak Jelas',  NULL, 'Pendaftaran ditolak (contoh data).');

INSERT INTO profile_links (user_id, label, url) VALUES
 (2, 'Instagram', 'https://instagram.com/sari.kalimantan'),
 (3, 'Behance',   'https://behance.net/bimagambut'),
 (4, 'Website',   'https://dewiadat.example.com');

-- KATEGORI UTAMA TIGA (1 kategori per karya)
INSERT INTO categories (id, name) VALUES
 (1, 'Flora'),
 (2, 'Fauna'),
 (3, 'Social Impact'),
 (4, 'Environment'),
 (5, 'Culture & Heritage'),
 (6, 'Conservation & Hope');

-- TAG ISU AWAL (lowercase, boleh lebih dari satu per karya)
INSERT INTO tags (name) VALUES
 ('palm oil expansion'),
 ('forest fire'),
 ('peatland'),
 ('habitat loss'),
 ('endangered species'),
 ('indigenous rights'),
 ('climate change'),
 ('reforestation'),
 ('sustainable living');

-- ARTWORKS (tersedia di public/uploads/artworks/)
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
  '/uploads/artworks/gambar-6.png', NOW() - INTERVAL '1 days');

-- TAGS PER KARYA (mengambil id tag berdasarkan nama)
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

-- INTERAKSI
INSERT INTO likes (user_id, artwork_id) VALUES
 (3,1), (4,1), (2,2), (4,2), (3,4), (2,4), (3,5), (2,6), (4,6), (4,3);
INSERT INTO favorites (user_id, artwork_id) VALUES
 (3,1), (2,6), (4,2), (3,4);
INSERT INTO comments (artwork_id, user_id, content) VALUES
 (1, 3, 'Detail matanya kuat sekali. Pesannya sampai.'),
 (1, 4, 'Karya ini mengingatkan pada hutan yang makin sempit.'),
 (2, 2, 'Warna asapnya terasa nyata dan menyesakkan.'),
 (6, 4, 'Semoga makin banyak yang menanam kembali.');

-- LAPORAN (contoh untuk Moderation Queue; pelapor bukan pemilik karya)
INSERT INTO reports (artwork_id, reporter_id, reason, details) VALUES
 (4, 3, 'plagiat', 'Mirip dengan karya yang pernah saya lihat di tempat lain.'),
 (4, 2, 'lainnya', 'Mohon ditinjau sumber referensi gambarnya.'),
 (3, 3, 'konten_tidak_pantas', 'Contoh laporan tunggal.');

-- CHALLENGES (tanggal relatif ke NOW() agar demo selalu valid)
-- 1 = aktif | 2 = sudah berakhir (untuk demo Select Winners) | 3 = belum dimulai
INSERT INTO challenges (id, curator_id, title, description, rules, prize, start_date, end_date, banner_url) VALUES
 (1, 5, 'Suara Hutan Kalimantan',
  'Ciptakan karya yang menyuarakan hutan Kalimantan dan satwa di dalamnya.',
  'Karya orisinal. Satu karya per peserta. Tema: hutan, satwa, dan dampak sosial.',
  'Rp 2.000.000 + sertifikat',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '14 days', '/uploads/seed/banner-1.svg'),
 (2, 5, 'Gambut Menyala',
  'Visualisasikan dampak kebakaran lahan gambut bagi iklim dan masyarakat.',
  'Karya orisinal. Satu karya per peserta.',
  'Rp 1.500.000 + merchandise',
  NOW() - INTERVAL '30 days', NOW() - INTERVAL '2 days', '/uploads/seed/banner-2.svg'),
 (3, 5, 'Pulihkan Pesisir',
  'Tunjukkan harapan lewat restorasi mangrove dan ekosistem pesisir.',
  'Karya orisinal. Satu karya per peserta.',
  'Paket workshop konservasi',
  NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', '/uploads/seed/banner-3.svg');

-- SUBMISSIONS (challenge 2 sengaja tanpa pemenang agar bisa didemokan)
INSERT INTO submissions (challenge_id, artwork_id, user_id, rank) VALUES
 (1, 1, 2, NULL),
 (2, 2, 3, NULL),
 (2, 4, 4, NULL);

-- SINKRONKAN SEQUENCE setelah insert dengan id eksplisit
SELECT setval(pg_get_serial_sequence('users','id'),      (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('categories','id'), (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('artworks','id'),   (SELECT MAX(id) FROM artworks));
SELECT setval(pg_get_serial_sequence('challenges','id'), (SELECT MAX(id) FROM challenges));