-- =====================================================
-- TIGA · ART FOR EARTH : database/schema.sql
-- Jalankan di pgAdmin (Query Tool) pada database kosong,
-- LALU jalankan database/seed.sql
-- =====================================================

DROP TABLE IF EXISTS submissions, challenges, reports, comments, favorites,
  likes, artwork_tags, tags, artworks, categories, profile_links, profiles, users CASCADE;
DROP TYPE IF EXISTS user_role, curator_status, report_reason, report_status;

CREATE TYPE user_role      AS ENUM ('admin', 'member', 'curator');
CREATE TYPE curator_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE report_reason  AS ENUM ('sara', 'plagiat', 'konten_tidak_pantas', 'lainnya');
CREATE TYPE report_status  AS ENUM ('pending', 'dismissed');

-- -----------------------------------------------------
-- USERS & PROFILES
-- -----------------------------------------------------
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            user_role NOT NULL,
  curator_status  curator_status,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- curator_status wajib terisi untuk curator, dan wajib NULL untuk role lain
  CONSTRAINT chk_curator_status CHECK (
    (role = 'curator' AND curator_status IS NOT NULL) OR
    (role <> 'curator' AND curator_status IS NULL)
  )
);

CREATE TABLE profiles (
  user_id       INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name  VARCHAR(100) NOT NULL,
  avatar_url    VARCHAR(255),
  bio           TEXT
);

CREATE TABLE profile_links (
  id       SERIAL PRIMARY KEY,
  user_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label    VARCHAR(50)  NOT NULL,
  url      VARCHAR(255) NOT NULL
);
CREATE INDEX idx_profile_links_user ON profile_links(user_id);

-- -----------------------------------------------------
-- CATEGORIES (nama unik, case-insensitive)
-- -----------------------------------------------------
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX uq_categories_name ON categories (LOWER(name));

-- -----------------------------------------------------
-- ARTWORKS & TAGS
-- -----------------------------------------------------
CREATE TABLE artworks (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title        VARCHAR(150) NOT NULL,
  description  TEXT NOT NULL,
  file_url     VARCHAR(255) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_artworks_user     ON artworks(user_id);
CREATE INDEX idx_artworks_category ON artworks(category_id);
CREATE INDEX idx_artworks_created  ON artworks(created_at DESC);

CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE   -- simpan lowercase
);

CREATE TABLE artwork_tags (
  artwork_id  INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  tag_id      INT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (artwork_id, tag_id)
);
CREATE INDEX idx_artwork_tags_tag ON artwork_tags(tag_id);

-- -----------------------------------------------------
-- INTERACTIONS
-- -----------------------------------------------------
CREATE TABLE likes (
  user_id     INT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  artwork_id  INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artwork_id)
);
CREATE INDEX idx_likes_artwork ON likes(artwork_id);

CREATE TABLE favorites (
  user_id     INT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  artwork_id  INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artwork_id)
);

CREATE TABLE comments (
  id          SERIAL PRIMARY KEY,
  artwork_id  INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id     INT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (LENGTH(TRIM(content)) > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_artwork ON comments(artwork_id);

-- -----------------------------------------------------
-- REPORTS (MODERATION)
-- Satu Member hanya bisa melaporkan karya yang sama satu kali
-- -----------------------------------------------------
CREATE TABLE reports (
  id           SERIAL PRIMARY KEY,
  artwork_id   INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  reporter_id  INT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  reason       report_reason NOT NULL,
  details      TEXT,
  status       report_status NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_report_once UNIQUE (artwork_id, reporter_id)
);
CREATE INDEX idx_reports_status ON reports(status);

-- -----------------------------------------------------
-- CHALLENGES & SUBMISSIONS
-- -----------------------------------------------------
CREATE TABLE challenges (
  id           SERIAL PRIMARY KEY,
  curator_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(150) NOT NULL,
  description  TEXT NOT NULL,
  rules        TEXT NOT NULL,
  prize        VARCHAR(255) NOT NULL,
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ NOT NULL,
  banner_url   VARCHAR(255) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_challenge_dates CHECK (end_date > start_date)
);
CREATE INDEX idx_challenges_curator ON challenges(curator_id);

CREATE TABLE submissions (
  id            SERIAL PRIMARY KEY,
  challenge_id  INT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  artwork_id    INT NOT NULL REFERENCES artworks(id)   ON DELETE CASCADE,
  user_id       INT NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  rank          SMALLINT CHECK (rank BETWEEN 1 AND 3),  -- NULL = bukan pemenang
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_sub_user    UNIQUE (challenge_id, user_id),     -- 1 Member = 1 submisi
  CONSTRAINT uq_sub_artwork UNIQUE (challenge_id, artwork_id)
);
-- 1 peringkat hanya untuk 1 karya per challenge
CREATE UNIQUE INDEX uq_sub_rank ON submissions (challenge_id, rank) WHERE rank IS NOT NULL;