<div align="center">

  <img src="./np/public/logo/tiga-logo-white.svg" alt="TIGA Logo" width="220" />

  # TIGA · Art for Earth
  
  **When nature loses its voice, let art speak.**

  [![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.3.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
  [![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)

  <p align="center">
    Platform pameran seni digital terkurasi dan <i>open-call creative challenges</i> yang didedikasikan untuk mengangkat realitas krisis kebakaran hutan dan lahan (karhutla), pelestarian gambut, satwa terancam punah, serta keadilan iklim bagi masyarakat adat di Indonesia.
  </p>

  <p align="center">
    <a href="#-tentang-proyek">Tentang Proyek</a> •
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-teknologi--arsitektur">Arsitektur</a> •
    <a href="#-memulai-instalasi">Panduan Instalasi</a> •
    <a href="#-kredensial-demo">Akun Demo</a> •
    <a href="#-skema-database">Skema Database</a> •
    <a href="#-struktur-folder">Struktur Folder</a>
  </p>

</div>

---

## 🌿 Tentang Proyek

Setiap tahun, ribuan hektare hutan hujan dan lahan gambut tropis di Sumatra dan Kalimantan hangus terbakar. Bencana ini bukan sekadar statistik angka atau berita musiman, melainkan ancaman eksistensial bagi satwa liar yang kehilangan habitatnya serta jutaan warga yang bernapas di bawah kepungan kabut asap beracun.

**TIGA · Art for Earth** lahir sebagai jembatan empati antara data ekologis dan kesadaran publik. Dengan filosofi **Voice, Unity, Protect**, platform ini memberdayakan para seniman digital, fotografer dokumenter, dan ilustrator untuk mengubah data dingin bencana menjadi karya visual yang menggerakkan aksi nyata.

### Tiga Pilar Isu Utama (Three Conservation Pillars)
* 🌲 **For the Forest (`#1f6b45`)**: Restorasi lahan gambut, pencegahan karhutla, perlindungan flora endemik, dan inisiatif reboisasi.
* 🐾 **For the Animals (`#2f3fa8`)**: Konservasi satwa terancam punah (Orangutan, Harimau Sumatra, Rangkong Gading) dan restorasi koridor satwa.
* 👥 **For the People (`#d92e1c`)**: Pengakuan hak wilayah adat, mitigasi dampak kesehatan kabut asap, dan kearifan lokal penjaga hutan.

---

## ✨ Fitur Utama

### 1. Pameran Digital & Katalog Koleksi (Public Exhibition)
* **Fullscreen Hero Cinematic Canvas**: Video pembuka hening beresolusi tinggi yang merekam situasi nyata di garis depan karhutla.
* **Live Impact Counters**: Kartu statistik dampak lingkungan beranimasi *count-up* halus berbasis *Intersection Observer* (luas kebakaran gambut, warga terdampak asap, dan tonase emisi CO₂).
* **Multi-Filter Artwork Catalog**: Eksplorasi ratusan karya seni dengan filter instan berbasis kategori pilar, tag isu spesifik, profil kreator, serta pengurutan (Terbaru, Terpopuler/Paling Banyak Disukai, dan A–Z).
* **Interactive Engagement**: Fitur Like real-time, Bookmark koleksi favorit, dan ruang diskusi komentar yang konstruktif.

### 2. Tantangan Seni Terbuka (Open Call Challenges)
* **Inisiatif Kurasi Independen**: Kurator terverifikasi dapat menggagas kompetisi bertema spesifik dengan rincian hadiah, aturan, dan tenggat waktu.
* **Sistem Submisi Terintegrasi**: Member dapat mendaftarkan karya terbaik mereka ke dalam challenge aktif (aturan ketat: 1 karya per member per challenge).
* **Evaluasi & Penetapan Pemenang**: Kurator meninjau karya kiriman secara transparan dan menetapkan peringkat Juara 1, 2, dan 3.

### 3. Ruang Kerja Berbasis Peran (Unified Role Workspaces)
* **Modern Top Navigation**: Tata letak navbar horizontal yang konsisten di semua peran pengguna, menggantikan sidebar lama yang sempit.
* **Universal Profile Dropdown**: Akses cepat menuju dashboard karya, favorit, submisi tantangan, dan pengaturan profil.
* **Floating Glassmorphic Popups**: Notifikasi konfirmasi pembaruan profil dan kredensial akun yang elegan tanpa menggeser tata letak formulir.

### 4. Moderasi & Tata Kelola Admin (Administration & Security)
* **Antrean Moderasi Laporan (Moderation Queue)**: Tinjau laporan dugaan pelanggaran (SARA, plagiarisme, konten tidak pantas) dengan aksi hapus karya atau abaikan laporan.
* **Verifikasi Kurator**: Validasi pendaftaran akun kurator baru (*Approve* / *Reject*).
* **Manajemen Pengguna & Kategori**: Monitoring direktori akun pengguna dan standarisasi taksonomi kategori lingkungan.

---

## 🛠️ Teknologi & Arsitektur

Platform ini dikembangkan dengan arsitektur modern berstandar enterprise yang menitikberatkan pada kecepatan *initial load*, keamanan data, dan performa tinggi:

```
[ Browser / Client ]
        │  HTTPS + HTTP-Only Session Cookie
        ▼
[ Next.js 16 (App Router Server Components) ]
        │
   ┌────┴───────────────────────────┐
   │                                │
[ Route Handlers (Uploads API) ] [ Server Actions (Mutations) ]
   │                                │
   │  Magic-Bytes File Validation   │  Role-Based Guard (requireRole)
   │  Local Disk Storage            │  Connection Pooling (pg Pool)
   ▼                                ▼
[ /public/uploads/ ]          [ PostgreSQL Database ]
```

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) dengan React 19 Compiler ready.
* **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) dengan palet kustom TIGA (*ink, forest, animals, people, soft, line*).
* **Tipografi:** *Cormorant Garamond* (Editorial Display Serif) & *Montserrat* (Clean UI Sans).
* **Database Engine:** [PostgreSQL 14+](https://www.postgresql.org/) dengan *Native Parameterized Queries* via `pg` pool.
* **Autentikasi & Keamanan:**
  * JWT terenkripsi via library `jose` yang disimpan di **HTTP-Only, SameSite=Lax Cookie**.
  * Password hashing standar industri menggunakan **bcryptjs** (10 salt rounds).
  * Validasi unggahan gambar dengan inspeksi biner *magic numbers* (mencegah eksploitasi file polyglot).
* **Animasi:** `requestAnimationFrame` dengan kurva *ease-out* eksponensial dan `framer-motion`.

---

## 🚀 Memulai (Instalasi Lokal)

### Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
* **Node.js** versi `20.x` atau lebih baru
* **npm** (atau `pnpm`)
* **PostgreSQL** instance aktif (lokal atau cloud seperti Supabase/Neon)

### 1. Kloning Repositori
```bash
git clone https://github.com/username/nusa-rupa.git
cd nusa-rupa/np
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Buat file `.env.local` pada direktori root proyek (`np/`):
```env
# Koneksi Database PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/tiga_db

# Kunci Rahasia Sesi JWT (Minimal 32 Karakter)
SESSION_SECRET=kunci_rahasia_super_aman_tiga_art_for_earth_2026

# Lingkungan Aplikasi
NODE_ENV=development
```

### 4. Setup Database & Seeding
Buka query tool database (pgAdmin, DBeaver, atau `psql`) dan jalankan skema awal:
```sql
-- Jalankan file: database/schema.sql
```
Setelah tabel terbentuk, jalankan script seed data pengujian:
```bash
npm run seed
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## 👥 Kredensial Akun Pengujian (Demo)

Seluruh akun demo pengujian menggunakan kata sandi default: **`TigaDemo123`**

| Role | Email Demo | Deskripsi & Hak Akses |
|---|---|---|
| **Admin** | `admin@tiga.test` | Akses penuh dashboard moderasi, verifikasi kurator, direktori pengguna, dan kategori. |
| **Curator (Approved)** | `rimba@tiga.test` | Membuat challenge konservasi, mengevaluasi submisi, dan menentukan pemenang. |
| **Curator (Pending)** | `gambut@tiga.test` | Akun kurator yang sedang menunggu persetujuan verifikasi dari Administrator. |
| **Member (Seniman)** | `dewi@tiga.test` | Mengunggah karya seni, memberi like/komentar/favorit, dan mengikuti challenge. |
| **Member (Seniman)** | `bima@tiga.test` | Akun member alternatif untuk pengujian interaksi sosial antar-pengguna. |

---

## 📊 Skema Database Inti

```
users (id, email, password_hash, role, curator_status, created_at)
 ├── profiles (user_id, display_name, avatar_url, bio)
 ├── profile_links (id, user_id, label, url)
 ├── artworks (id, user_id, category_id, title, description, file_url, created_at)
 │    ├── artwork_tags (artwork_id, tag_id) ──── tags (id, name)
 │    ├── likes (user_id, artwork_id, created_at)
 │    ├── favorites (user_id, artwork_id, created_at)
 │    ├── comments (id, artwork_id, user_id, content, created_at)
 │    └── reports (id, artwork_id, reporter_id, reason, details, status)
 └── challenges (id, curator_id, title, description, rules, prize, banner_url, dates)
      └── submissions (id, challenge_id, artwork_id, user_id, rank, submitted_at)
```

---

## 📁 Struktur Folder Proyek

```text
np/
├── database/                   # File skema DDL & data seed awal PostgreSQL
├── public/                     # Aset statis publik (video hero, logo SVG, gambar kategori)
│   └── uploads/                # Direktori penyimpanan media pengguna (artworks, avatars)
├── scripts/                    # Script CLI otomasi (database seeding)
├── src/
│   ├── app/                    # Next.js App Router (Rute halaman & API Route Handlers)
│   │   ├── (auth)/             # Login, registrasi, & status pending curator
│   │   ├── (public)/           # Beranda publik, detail karya, & eksplorasi challenge
│   │   ├── admin/              # Dashboard moderasi & manajemen Admin
│   │   ├── curator/            # Dashboard inisiasi challenge Kurator
│   │   ├── member/             # Dashboard karya, favorit, & profil Member
│   │   └── api/                # REST Route Handlers (Auth, Profile, Artworks, Challenges)
│   ├── components/             # Komponen UI modular & reusable
│   │   ├── home/               # HeroVideo, CollectionCatalog, AnimatedStats
│   │   ├── member/             # Formulir profil & unggah karya
│   │   ├── curator/            # Formulir pembuatan challenge
│   │   ├── artwork/            # Kartu galeri & tombol interaksi sosial
│   │   ├── RoleNavbar.jsx      # Top navbar seragam untuk role terotentikasi
│   │   └── ProfileDropdown.jsx # Menu dropdown profil pengguna di navbar
│   └── lib/                    # Logika bisnis, kueri database, & autentikasi server
│       ├── db.js               # PostgreSQL connection pool singleton
│       ├── session.js          # Pengambilan sesi & RBAC role guards
│       ├── jwt.js              # Enkripsi & verifikasi token sesi
│       └── uploads.js          # Validasi biner magic-bytes & handler disk
├── DOCUMENTATION.md            # Dokumentasi teknis & arsitektur komprehensif
└── package.json                # Dependensi proyek & daftar script npm
```

---

## 📜 Perintah Script (Available Scripts)

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server development Next.js lokal pada `localhost:3000` dengan HMR. |
| `npm run build` | Melakukan proses kompilasi kode dan optimasi bundel aset untuk produksi. |
| `npm run start` | Menjalankan server aplikasi Next.js dalam mode produksi. |
| `npm run lint` | Menjalankan ESLint untuk memeriksa standar penulisan dan sintaks kode. |
| `npm run seed` | Mengeksekusi database seeder utama untuk mengisi seluruh data awal platform. |
| `npm run seed:artworks` | Mengisi sampel karya seni tambahan ke dalam database galeri. |

---

## 📄 Lisensi & Hak Cipta

Proyek ini didistribusikan di bawah lisensi **MIT**. Lihat berkas `LICENSE` untuk rincian selengkapnya.

<div align="center">
  <sub>Dibangun dengan kepedulian ekologis oleh Tim Pengembang <b>TIGA · Art for Earth</b> (2026).</sub>
</div>
