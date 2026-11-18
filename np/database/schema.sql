-- Jalankan di pgAdmin (Query Tool) pada database nusa_rupa.
-- Perhatian: baris DROP menghapus semua data.
DROP TABLE IF EXISTS challenge_winners, challenge_submissions, challenges,
  reports, comments, favorites, likes, artworks, categories, users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'member', 'curator')),
  status VARCHAR(10) NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  display_name VARCHAR(80),
  avatar_url TEXT,
  bio TEXT,
  external_links TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE artworks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id),
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT NOT NULL,
  tags TEXT[] NOT NULL CHECK (array_length(tags, 1) >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE likes (
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, artwork_id)
);

CREATE TABLE favorites (
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, artwork_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Satu member hanya boleh melaporkan karya yang sama satu kali
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  reason VARCHAR(40) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'dismissed', 'taken_down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (reporter_id, artwork_id)
);

CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  curator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  prize TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  banner_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- Satu member hanya boleh submit 1 karya per challenge
CREATE TABLE challenge_submissions (
  id SERIAL PRIMARY KEY,
  challenge_id INT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  member_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (challenge_id, member_id),
  UNIQUE (challenge_id, artwork_id)
);

-- Maksimal 3 pemenang: satu peringkat = satu karya, satu karya = satu peringkat
CREATE TABLE challenge_winners (
  challenge_id INT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  rank INT NOT NULL CHECK (rank BETWEEN 1 AND 3),
  UNIQUE (challenge_id, rank),
  UNIQUE (challenge_id, artwork_id)
);

CREATE INDEX idx_artworks_user ON artworks(user_id);
CREATE INDEX idx_artworks_category ON artworks(category_id);

-- ===== Data awal =====
INSERT INTO users (username, email, password_hash, role, status, display_name)
VALUES ('admin', 'admin@artshow.local', '$2b$10$UqCEkpZwsK04dAgtjMIofegxEXpssHacQmyeufGhsEz2mI/JcZfoW', 'admin', 'approved', 'Admin');

INSERT INTO categories (name) VALUES
  ('Flora Nusantara'),
  ('Fauna Nusantara'),
  ('Batik dan Motif Tradisional'),
  ('Arsitektur dan Landmark'),
  ('Pemandangan Alam'),
  ('Budaya dan Tradisi'),
  ('Kuliner Nusantara');