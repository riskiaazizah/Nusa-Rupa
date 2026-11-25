# Dokumentasi Resmi Proyek: TIGA · Art for Earth

![TIGA Banner](/logo/tiga-logo-red.svg)

---

## 1. Judul Proyek & Identitas Visual

* **Nama Resmi Proyek:** **TIGA · Art for Earth**
* **Tagline:** *"When nature loses its voice, let art speak."*
* **Filosofi TIGA:**
  * **Voice (Suara):** Memberikan panggung ekspresi bagi seniman dan pegiat lingkungan untuk menyuarakan krisis ekologis yang kerap tak terdengar.
  * **Unity (Persatuan):** Menghubungkan seniman, kurator independen, komunitas lokal, dan masyarakat luas dalam satu ekosistem kepedulian bersama.
  * **Protect (Perlindungan):** Mengonversi kesadaran artistik menjadi aksi nyata untuk melindungi hutan, lahan gambut, satwa endemik, dan hak masyarakat adat.
* **Tiga Pilar Isu Lingkungan & Sistem Warna:**
  * **For the Forest (`#1f6b45` - Forest Green):** Flora endemik, pencegahan kebakaran hutan (karhutla), restorasi gambut, dan reboisasi.
  * **For the Animals (`#2f3fa8` - Animals Blue):** Fauna terancam punah, perlindungan habitat satwa liar, dan konservasi biodiversitas.
  * **For the People (`#d92e1c` - People Red):** Hak-hak masyarakat adat, dampak kesehatan kabut asap pada warga, keadilan iklim, dan kearifan budaya lokal.

---

## 2. Deskripsi Singkat & Latar Belakang Masalah

### Latar Belakang Masalah
Indonesia merupakan rumah bagi hutan hujan tropis dan lahan gambut terluas di Asia Tenggara yang menyimpan miliaran ton cadangan karbon bumi. Namun, bencana Kebakaran Hutan dan Lahan (Karhutla) serta ekspansi lahan tanpa izin terus berulang setiap tahun. Berdasarkan data pemantauan ekologis terkini:
* Lebih dari **243.241 hektare** lahan gambut terbakar, melepaskan cadangan karbon puluhan tahun ke atmosfer (*Sumber: Pantau Gambut, 2026*).
* Lebih dari **41,1 juta orang** di wilayah Sumatra dan Kalimantan terpapar kabut asap berbahaya berkepanjangan (*Sumber: Greenpeace Indonesia*).
* Diestimasikan lebih dari **31 juta ton emisi CO2** terlepas dari pembakaran hutan dan gambut (*Sumber: WALHI Indonesia*).

Narasi angka dan data ilmiah sering kali terasa abstrak bagi publik umum. Akibatnya, perhatian masyarakat kerap mereda begitu musim hujan tiba, padahal kerusakan ekosistem dan penderitaan warga terus berlanjut.

### Solusi yang Diusung: TIGA
**TIGA** hadir sebagai platform galeri digital dan kurasi karya seni terbuka (*open call challenges*) bertema krisis ekologis. Platform ini mengubah data dingin bencana menjadi karya visual yang menggugah empati dan kesadaran. Melalui TIGA, seniman digital, fotografer dokumenter, dan ilustrator dapat memamerkan karya konservasi, mengikuti tantangan kreatif berhadiah yang diprakarsai kurator terverifikasi, serta berinteraksi secara sehat dan transparan di bawah moderasi ketat.

---

## 3. Fitur-Fitur Sistem & Flowchart

### Rincian Fitur Utama

| Modul | Nama Fitur | Deskripsi |
|---|---|---|
| **Publik** | **Fullscreen Hero Media** | Video dokumenter sinematik karhutla bersuara hening dengan teks editorial pembuka. |
| **Publik** | **Animated Impact Stats** | 3 kartu data dampak lingkungan beranimasi *count-up* halus berbasis *scroll into view*. |
| **Publik** | **The Collection Catalog** | Eksplorasi karya publik dengan filter 6 kategori, tags isu, artis, dan pengurutan (Newest, Most Liked, A–Z). |
| **Publik** | **Public Challenges** | Direktori tantangan terbuka yang sedang aktif maupun selesai untuk diikuti seniman. |
| **Member** | **Artwork Upload & Management** | Unggah karya seni dengan validasi tipe gambar (*magic bytes*), judul, deskripsi, kategori, dan multiple tags. |
| **Member** | **Interactive Engagement** | Fitur Like, Bookmark (Favorit), dan Komentar diskusi terarah pada karya seni. |
| **Member** | **Challenge Submissions** | Mendaftarkan karya ke *open call challenge* aktif (1 karya per member per challenge). |
| **Member** | **Profile & Security Settings** | Kelola avatar, bio, nama tampilan, tautan medsos, email, dan kata sandi dengan notifikasi *floating toast*. |
| **Curator** | **Open Call Challenge Builder** | Pembuatan challenge baru dengan aturan, tenggat waktu, deskripsi, hadiah (*prize*), dan banner visual. |
| **Curator** | **Submission Evaluation & Winner Ranking** | Peninjauan karya kiriman peserta dan penetapan Juara 1, 2, dan 3. |
| **Admin** | **Moderation Queue** | Meninjau laporan karya bermasalah (SARA, plagiarisme, konten tidak pantas) dengan tindakan Hapus Karya atau Abaikan Laporan. |
| **Admin** | **Curator Verification** | Tinjau pengajuan akun kurator baru (*Approve* / *Reject*). |
| **Admin** | **User Management** | Direktori seluruh pengguna, monitor status akun, dan pencabutan hak akses jika melanggar ketentuan. |
| **Admin** | **Category Management** | Tambah dan kelola kategori pilar konservasi. |

### Flowchart Alur Sistem (Mermaid)

```mermaid
flowchart TD
    Start(["Mulai Akses TIGA"]) --> Landing["Landing Page: Hero Video & Animated Stats"]
    Landing --> ExploreCat["Eksplorasi Koleksi & Open Call"]
    
    ExploreCat --> AuthCheck{"Pengguna Sudah Login?"}
    AuthCheck -- Belum --> LoginGate["Halaman Autentikasi: Login / Register"]
    LoginGate --> RoleCheck{"Peran (Role) Pengguna"}
    
    AuthCheck -- Sudah --> RoleCheck
    
    %% Member Flow
    RoleCheck -- "Member" --> MemberNav["RoleNavbar: Member Profile Dropdown"]
    MemberNav --> MemberAction{"Pilih Menu Member"}
    MemberAction --> M1["Unggah Karya Baru (Magic Bytes Check)"]
    MemberAction --> M2["Koleksi Favorit & Submisi Saya"]
    MemberAction --> M3["Kirim Karya ke Challenge Aktif"]
    MemberAction --> M4["Edit Profil & Akun (Floating Toast Notif)"]
    
    %% Curator Flow
    RoleCheck -- "Curator (Approved)" --> CuratorNav["RoleNavbar: Curator Profile Dropdown"]
    CuratorNav --> CuratorAction{"Pilih Menu Kurator"}
    CuratorAction --> C1["Buat Open Call Challenge Baru"]
    CuratorAction --> C2["Tinjau Submisi & Tentukan Peringkat 1-3"]
    CuratorAction --> C3["Kelola Challenge Aktif & Arsip"]
    
    %% Curator Pending Flow
    RoleCheck -- "Curator (Pending/Rejected)" --> PendingScreen["Halaman Pending Curator: Menunggu Verifikasi Admin"]
    
    %% Admin Flow
    RoleCheck -- "Admin" --> AdminDashboard["Admin Dashboard & Sidebar"]
    AdminDashboard --> AdminAction{"Pilih Menu Admin"}
    AdminAction --> A1["Moderation Queue: Tinjau Laporan & Hapus Karya"]
    AdminAction --> A2["Verifikasi Kurator: Setujui / Tolak"]
    AdminAction --> A3["Manajemen Pengguna & Kategori"]
    
    %% Interaksi Publik
    M1 --> GalleryDB[("PostgreSQL Database")]
    C1 --> GalleryDB
    A1 --> GalleryDB
```

---

## 4. Daftar dan Peran Pengguna serta RBAC (Role-Based Access Control)

Platform TIGA mengimplementasikan RBAC ketat berbasis sesi aman di level server (*Server-Side Authorization*) menggunakan helper `requireRole(role)` dan `getSession()`.

```mermaid
classDiagram
    class User {
        +Int id
        +String email
        +String password_hash
        +UserRole role
        +CuratorStatus curator_status
    }
    class Guest {
        +Lihat Koleksi Karya
        +Lihat Daftar Tantangan
        +Registrasi & Login
    }
    class Member {
        +Unggah Karya Konservasi
        +Beri Like & Simpan Favorit
        +Beri Komentar & Laporkan Karya
        +Ikuti Challenge Kurator
        +Edit Profil & Akun Pribadi
    }
    class Curator {
        +Buat Challenge Terbuka
        +Tinjau Karya Peserta
        +Tetapkan Pemenang Rank 1-3
        +Edit Profil Kurator
    }
    class Admin {
        +Moderasi Laporan Karya
        +Setujui / Tolak Permohonan Kurator
        +Kelola Pengguna
        +Kelola Kategori Konservasi
    }

    User <|-- Guest
    User <|-- Member
    User <|-- Curator
    User <|-- Admin
```

### Matriks Akses RBAC

| Fitur / Halaman | Guest | Member | Curator (Pending) | Curator (Approved) | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Akses Landing Page & Koleksi Publik | Ya | Ya | Ya | Ya | Ya |
| Memberikan Like / Favorit | Tidak | Ya | Tidak | Tidak | Ya |
| Mengunggah Karya Seni Baru | Tidak | Ya | Tidak | Tidak | Tidak |
| Mengirimkan Karya ke Challenge | Tidak | Ya | Tidak | Tidak | Tidak |
| Membuat Open Call Challenge Baru | Tidak | Tidak | Tidak | Ya | Tidak |
| Menilai & Menetapkan Juara Challenge | Tidak | Tidak | Tidak | Ya | Tidak |
| Halaman Pending Approval Kurator | Tidak | Tidak | Ya | Tidak | Tidak |
| Meninjau Antrean Moderasi Laporan | Tidak | Tidak | Tidak | Tidak | Ya |
| Menyetujui Akun Kurator | Tidak | Tidak | Tidak | Tidak | Ya |
| Mengelola Direktori Pengguna | Tidak | Tidak | Tidak | Tidak | Ya |
| Mengubah Profil & Kredensial Akun | Tidak | Ya | Ya | Ya | Ya |

---

## 5. Arsitektur Kode & Keamanan

### Pola Arsitektur Sistem
TIGA dibangun menggunakan pola modern **Next.js 16 (App Router)** dengan arsitektur hibrida *Server Components* dan *Client Components*:
1. **Server Components by Default:** Fetching data langsung ke PostgreSQL via *connection pool* tanpa lapisan REST overhead yang tidak perlu, memastikan performa *Initial Server Rendering (ISR/SSR)* yang sangat cepat.
2. **Client Components:** Digunakan khusus pada elemen interaktif yang membutuhkan *state*, *gestures*, dan *event handling* (seperti `ProfileDropdown`, `AnimatedStats`, `RoleNavbar`, `CardInteractionButtons`, dan `ProfileForm`).
3. **Server Actions & Route Handlers:**
   * Operasi mutasi data ringan menggunakan Server Actions (`"use server"`).
   * Operasi unggah file multi-bagian (*multipart/form-data*) ditangani Route Handler API untuk menghindari batasan memory payload Server Action bawaan.

### Mekanisme Keamanan (Security Hardening)
* **Autentikasi Stateful-Token:** Menggunakan JSON Web Token (JWT) terenkripsi via library `jose`, disimpan dalam **HTTP-Only, Secure, SameSite=Lax Cookie** (`tiga_session`). Cookie tidak dapat diakses melalui JavaScript peramban (*menangkal serangan XSS*).
* **Pencegahan Password Leakage:** Seluruh kata sandi di-hash menggunakan algoritma **bcrypt** dengan *salt round* standar industri (10 putaran).
* **Validasi File Magic Bytes (Deep Inspection):** Unggahan file tidak hanya memvalidasi ekstensi URL/nama file, melainkan membaca buffer biner byte awal (*magic numbers*) untuk memastikan file adalah JPEG, PNG, WEBP, atau GIF asli guna mencegah serangan eksekusi skrip berbahaya (*Arbitrary File Upload Attack*).
* **Sanitasi SQL & Parameterized Queries:** Semua query database menggunakan placeholder parameter `$1, $2, ...` melalui driver `pg`, sepenuhnya menutup celah *SQL Injection*.
* **Penanganan File Yatim (Orphan File Prevention):** Jika operasi database gagal setelah file tersimpan di disk, sistem secara otomatis mengeksekusi *rollback cleanup* untuk menghapus file tersebut dari media storage.

---

## 6. Skema Database (PostgreSQL)

### Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o| profiles : "memiliki (1:1)"
    users ||--o{ profile_links : "memiliki (1:N)"
    users ||--o{ artworks : "mengunggah (1:N)"
    categories ||--o{ artworks : "mengelompokkan (1:N)"
    artworks ||--o{ artwork_tags : "memiliki (N:M)"
    tags ||--o{ artwork_tags : "dimiliki (N:M)"
    users ||--o{ likes : "menyukai (N:M)"
    artworks ||--o{ likes : "disukai (N:M)"
    users ||--o{ favorites : "menyimpan (N:M)"
    artworks ||--o{ favorites : "disimpan (N:M)"
    users ||--o{ comments : "menulis (1:N)"
    artworks ||--o{ comments : "menerima (1:N)"
    users ||--o{ reports : "melaporkan (1:N)"
    artworks ||--o{ reports : "dilaporkan (1:N)"
    users ||--o{ challenges : "mengkurasi (1:N)"
    challenges ||--o{ submissions : "menerima (1:N)"
    artworks ||--o{ submissions : "didaftarkan (1:N)"
    users ||--o{ submissions : "mengirim (1:N)"

    users {
        int id PK
        string email UK
        string password_hash
        user_role role
        curator_status curator_status
        timestamptz created_at
    }

    profiles {
        int user_id PK,FK
        string display_name
        string avatar_url
        text bio
    }

    artworks {
        int id PK
        int user_id FK
        int category_id FK
        string title
        text description
        string file_url
        timestamptz created_at
    }

    categories {
        int id PK
        string name UK
        timestamptz created_at
    }

    challenges {
        int id PK
        int curator_id FK
        string title
        text description
        text rules
        string prize
        timestamptz start_date
        timestamptz end_date
        string banner_url
        timestamptz created_at
    }

    submissions {
        int id PK
        int challenge_id FK
        int artwork_id FK
        int user_id FK
        smallint rank
        timestamptz submitted_at
    }

    reports {
        int id PK
        int artwork_id FK
        int reporter_id FK
        report_reason reason
        text details
        report_status status
        timestamptz created_at
    }
```

### Kamus Data Tabel Inti
1. **`users`**: Akun pengguna, peran (`admin`, `member`, `curator`), dan status kurator (`pending`, `approved`, `rejected`).
2. **`profiles`**: Detail profil publik pengguna (nama tampilan, avatar, dan biografi).
3. **`profile_links`**: Tautan sosial media eksternal (Instagram, Behance, Website pribadi).
4. **`categories`**: Kategori konservasi terstandarisasi (Flora, Fauna, Social Impact, Environment, Culture & Heritage, Conservation & Hope).
5. **`artworks`**: Rekaman karya seni yang diunggah member, berelasi dengan kategori dan pengguna.
6. **`tags` & `artwork_tags`**: Tag isu konservasi spesifik per karya (*many-to-many*).
7. **`likes` & `favorites`**: Interaksi sosial pengguna pada karya.
8. **`comments`**: Ulasan dan diskusi apresiatif per karya seni.
9. **`reports`**: Laporan konten mencurigakan/pelanggaran etika untuk antrean moderasi Admin.
10. **`challenges`**: Open call challenge konservasi yang digagas oleh Curator terverifikasi.
11. **`submissions`**: Pengajuan karya seni ke challenge, dilengkapi kolom ranking pemenang (1–3).

---

## 7. Struktur Folder Proyek

```text
Nusa-Rupa/np/
├── database/
│   ├── schema.sql              # Definisi DDL tabel, ENUM, relasi, dan indeks PostgreSQL
│   └── seed.sql                # Data awal demo (akun pengujian, kategori, karya awal)
├── public/
│   ├── categories/             # Aset visual background 6 pilar kategori
│   ├── hero/                   # Video sinematik latar hero karhutla
│   ├── logo/                   # Logo resmi TIGA (SVG Merah & Putih)
│   └── uploads/                # Direktori penyimpanan media (artworks, avatars, banners)
├── scripts/
│   ├── seed.js                 # Eksekutor otomasi database seed
│   └── seed-artworks.js        # Script pengisian karya sampel sekunder
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rute publik autentikasi (login, register, pending-curator)
│   │   ├── (public)/           # Halaman publik (beranda, karya [id], creator [id], challenges)
│   │   ├── admin/              # Dashboard dan fitur manajemen Admin
│   │   ├── api/                # API Route Handlers (auth, profile, artworks, challenges)
│   │   ├── curator/            # Dashboard manajemen kurasi & pembuatan challenge
│   │   └── member/             # Dashboard member (karya saya, favorit, submisi, profil)
│   ├── components/             # Reusable UI Components
│   │   ├── admin/              # Komponen tabel dan formulir Admin
│   │   ├── artwork/            # Komponen kartu dan tombol interaksi karya
│   │   ├── curator/            # Formulir challenge dan evaluasi submisi
│   │   ├── home/               # Komponen beranda (HeroVideo, CollectionCatalog, AnimatedStats)
│   │   ├── member/             # Formulir profil dan karya member
│   │   ├── ui/                 # Primitif UI (gallery, zoom, utils)
│   │   ├── NavbarClient.jsx    # Navbar publik responsif
│   │   ├── ProfileDropdown.jsx # Dropdown profil serbaguna (semua role)
│   │   └── RoleNavbar.jsx      # Top Navbar terpadu untuk Member & Kurator
│   └── lib/                    # Logika Inti & Utilitas Server
│       ├── account.js          # Pengubahan kredensial email & password
│       ├── categories.js       # Kueri data kategori
│       ├── challenges.js       # Logika open call challenge & submisi
│       ├── db.js               # Konfigurasi PostgreSQL Connection Pool
│       ├── format.js           # Format mata uang, angka, dan tanggal lokal
│       ├── gallery.js          # Kueri kurasi karya & agregasi like/favorit
│       ├── jwt.js              # Enkripsi & verifikasi token sesi
│       ├── profile.js          # Pengambilan & pembaruan profil pengguna
│       ├── session.js          # Manajemen sesi peramban & verifikasi role
│       └── uploads.js          # Deteksi magic bytes & penyimpanan aman
├── .env.local                  # Konfigurasi environment rahasia lokal
├── AGENTS.md                   # Pedoman agen AI & aturan anti-slop
├── DESIGN.md                   # Desain sistem & filosofi visual TIGA v2
├── package.json                # Daftar pustaka & script eksekusi
└── tailwind.config.mjs         # Konfigurasi Tailwind CSS tema TIGA
```

---

## 8. Struktur API Endpoint & Fungsinya

### Endpoint Autentikasi (`/api/auth`)
* `POST /api/auth/register`: Mendaftarkan akun Member baru atau mengajukan akun Curator (status `pending`).
* `POST /api/auth/login`: Verifikasi kredensial pengguna dan menginjeksikan cookie sesi JWT (`tiga_session`).
* `POST /api/auth/logout`: Menghapus cookie sesi dan mengembalikan pengguna ke halaman publik.
* `POST /api/auth/forgot-password`: Mengirimkan tautan penyetelan ulang kata sandi (token kedaluwarsa 1 jam).
* `POST /api/auth/reset-password`: Memperbarui kata sandi pengguna berdasarkan token yang valid.

### Endpoint Profil Pengguna (`/api/profile`)
* `PATCH /api/profile`: Mengubah foto avatar, nama tampilan, biografi, dan tautan sosial media pengguna. Berlaku universal untuk seluruh role yang sedang login.

### Endpoint Karya Seni (`/api/artworks`)
* `GET /api/artworks`: Mengambil daftar karya terpublikasi dengan parameter paginasi, kategori, dan kata kunci.
* `POST /api/artworks`: Mengunggah karya konservasi baru beserta validasi file biner dan asosiasi tags.

### Endpoint Tantangan (`/api/challenges`)
* `GET /api/challenges`: Mendapatkan katalog tantangan kurasi (aktif/berakhir).
* `POST /api/challenges`: (*Khusus Kurator*) Menerbitkan open call challenge baru ke platform.
* `GET /api/challenges/[id]`: Mendapatkan detail lengkap satu challenge dan daftar submisi yang masuk.

---

## 9. Panduan Instalasi dan Penggunaan

### Prasyarat Sistem
* **Node.js**: Versi `v20.x` atau lebih baru
* **Package Manager**: `npm` atau `pnpm`
* **Database Engine**: `PostgreSQL 14+`

### Langkah-Langkah Instalasi

1. **Clone Repositori Proyek:**
   ```bash
   git clone <URL_REPOSITORY>
   cd Nusa-Rupa/np
   ```

2. **Pasang Dependensi Node.js:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env.local`):**
   Salin atau buat file `.env.local` di direktori `np/` dengan konfigurasi:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/tiga_db
   SESSION_SECRET=kunci_rahasia_jwt_minimal_32_karakter_acak_dan_aman
   NODE_ENV=development
   ```

4. **Inisialisasi Skema & Data Awal Database:**
   * Buka Query Tool di PostgreSQL (pgAdmin/DBeaver) dan jalankan file:
     ```sql
     database/schema.sql
     ```
   * Eksekusi script seeding otomatis:
     ```bash
     npm run seed
     ```

5. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

### Kredensial Akun Pengujian (Demo Seed)
Semua akun demo di bawah menggunakan kata sandi default: **`TigaDemo123`**
* **Admin:** `admin@tiga.test`
* **Member (Seniman):** `dewi@tiga.test` atau `bima@tiga.test`
* **Curator (Disetujui):** `rimba@tiga.test`
* **Curator (Menunggu Verifikasi):** `gambut@tiga.test`

---

## 10. Daftar Script Proyek

Script otomasi yang didefinisikan dalam `package.json`:

| Perintah Script | Deskripsi & Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js lokal pada `localhost:3000` dengan *Hot Module Replacement (HMR)*. |
| `npm run build` | Melakukan kompilasi produksi, optimalisasi bundel aset, dan validasi tipe halaman Next.js. |
| `npm run start` | Menjalankan server aplikasi produksi setelah proses `build` selesai. |
| `npm run lint` | Menjalankan *linter* ESLint untuk memeriksa standar penulisan kode dan kebersihan sintaks. |
| `npm run seed` | Mengeksekusi `scripts/seed.js` untuk mereset dan menginjeksi data contoh lengkap (pengguna, kategori, tags, challenge, dan interaksi). |
| `npm run seed:artworks` | Mengeksekusi `scripts/seed-artworks.js` untuk mengisi sampel karya seni konservasi tambahan ke dalam galeri. |
