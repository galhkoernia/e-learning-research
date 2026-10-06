# Learning Platform

Aplikasi pembelajaran berbasis web untuk menyajikan materi terstruktur dan mengukur pemahaman peserta melalui assessment, sebagai pendukung proyek skripsi.

## Overview

Konten awal berfokus pada **Dasar Sistem Hidrolik**. Target pengalaman belajar mencakup materi, video, pre-test, quiz, post-test, serta hasil dan progress peserta dalam satu aplikasi dengan area student dan admin.

Saat ini tersedia landing page, integrasi authentication, fondasi database, dan prototipe UI admin. Alur pembelajaran lengkap belum tersedia.

## Core Features

| Area | Scope produk | Kondisi saat ini |
| --- | --- | --- |
| Public | Pengenalan pembelajaran dan akses login | Landing page dengan konten statis |
| Authentication | Login, logout, session, akses berbasis role | Terimplementasi dengan Supabase Auth dan profil aplikasi |
| Student | Materi, video, assessment, progress, hasil | Route `/learn` terlindungi, masih placeholder |
| Admin | Dashboard, konten, soal, peserta, progress, hasil, export | UI dengan data dummy; CRUD dan export belum berfungsi |

## User Roles

- **ADMIN**: mengelola konten dan assessment, memantau peserta, serta melihat dan mengekspor hasil sesuai target PRD.
- **STUDENT**: mengikuti pembelajaran, mengerjakan assessment, dan melihat progress serta hasil sesuai target PRD.

Identitas diverifikasi melalui Supabase Auth. Role dibaca dari model `Profile` melalui Prisma di server; akses admin dan area student diperiksa server-side.

## Learning Flow

Alur target produk, belum menjadi workflow yang dapat dijalankan:

```text
Login → Pre-Test → [Material → Video → Quiz] → Post-Test → Result
```

Bagian dalam kurung diulang untuk setiap materi. PRD awal menargetkan dua materi; schema mendukung daftar materi per course, tetapi tipe quiz masih terbatas pada `QUIZ_1` dan `QUIZ_2`. Alur dinamis penuh belum diimplementasikan.

Saat ini student yang berhasil login diarahkan ke `/learn` dengan pesan “Learning area coming soon”.

## Admin Flow

```text
Login → Dashboard → Materials / Videos / Questions / Participants / Results
```

Login tersedia di `/login`; `/admin/login` mengarahkan ke halaman yang sama. Dashboard tersedia di `/admin` dan `/admin/dashboard`, dengan halaman lain di `/admin/materials`, `/admin/videos`, `/admin/questions`, `/admin/participants`, dan `/admin/results`.

Halaman tersebut menampilkan prototipe pengelolaan konten dan pelaporan. Data belum dibaca dari database, dan tombol tambah/edit/hapus, preview video, serta export belum memiliki handler.

## Tech Stack

Stack berdasarkan dependencies dan konfigurasi repository:

- **Next.js 16 + React 19**: App Router, Server Components, Server Actions, dan React Compiler.
- **TypeScript 5**: strict mode.
- **Tailwind CSS 4**: styling melalui PostCSS.
- **Prisma ORM 7 + PostgreSQL**: akses server-side menggunakan adapter PostgreSQL, schema, migration, dan seed.
- **Supabase Auth + Supabase SSR**: login email/password dan session berbasis cookie.
- **ESLint 9**: linting dengan konfigurasi Next.js.

Supabase menjadi layanan identity dan target PostgreSQL sesuai dokumen arsitektur. **Supabase Storage masih direncanakan** untuk video private; schema menyimpan referensi storage, tetapi upload, playback, dan signed URL belum tersedia.

## Architecture

Arsitektur mengikuti **modular monolith** dengan Next.js sebagai batas aplikasi:

```text
Browser / React UI
        ↓
Next.js server boundary
        ↓
Authentication / Authorization / Validation / Business logic
        ↓
Prisma → PostgreSQL

Identity → Supabase Auth
Video files → Supabase Storage (planned)
```

Presentasi dan interaksi berada pada komponen UI; akses database serta logika sensitif tetap server-side. Modul authentication dan database menggunakan `server-only`. Proxy menangani pembaruan session, sedangkan pemeriksaan profil dan role dilakukan di server.

Setiap mutation sensitif harus memverifikasi authentication, authorization, dan input secara mandiri. Perhitungan score harus dilakukan server-side saat assessment diimplementasikan. Credential database dan key administratif tidak boleh masuk ke browser atau log.

## Project Structure

```text
src/
├── app/                 # Public, login, learn, auth, dan route admin
├── components/ui/       # Komponen UI bersama
├── features/            # landing, auth, admin
├── lib/supabase/        # Client server dan pembaruan session
├── server/              # Pemeriksaan auth/role dan akses Prisma
└── proxy.ts             # Next.js session proxy

prisma/                  # Schema, migrations, seed
scripts/                 # Bootstrap admin dan pemeriksaan HTTP auth
public/                  # Asset statis
architecture.md
design-system.md
prd.md
AGENTS.md
```

## Documentation

Dokumen saat ini berada di root repository; folder `docs/` belum tersedia.

- [Design System](design-system.md): bahasa visual, komponen, dan aturan UX.
- [Architecture](architecture.md): batas modul, keamanan, dan rancangan aliran data.
- [PRD](prd.md): kebutuhan produk, scope MVP, dan target alur pengguna.
- [AGENTS.md](AGENTS.md): aturan pengembangan dan batasan coding agent.

PRD dan architecture menjelaskan target implementasi; keberadaan fitur dalam dokumen tersebut tidak berarti fitur sudah selesai.

## Development

Gunakan Node.js yang mendukung `--experimental-strip-types` dan `process.loadEnvFile`, karena script database dan bootstrap admin memakai keduanya.

Salin `.env.example` menjadi `.env.local`, lalu isi konfigurasi untuk lingkungan pengembangan. Gunakan template sebagai referensi; jangan commit credential.

```bash
npm install
```

Script `postinstall` menghasilkan Prisma Client secara otomatis. Untuk database pengembangan yang telah dikonfigurasi, terapkan migration dan seed konten awal:

```bash
npm run db:migrate
npm run db:seed
```

Jika diperlukan, siapkan akun admin menggunakan konfigurasi bootstrap pada template environment:

```bash
npm run admin:bootstrap
```

Script membuat akun Supabase Auth jika belum ada dan membuat atau memperbarui profil menjadi `ADMIN`. Login membutuhkan akun Auth dan profil aplikasi yang sesuai; registrasi student belum tersedia.

Jalankan aplikasi:

```bash
npm run dev
```

Buka [localhost:3000](http://localhost:3000). Pemeriksaan kode dan build tersedia melalui:

```bash
npm run typecheck
npm run lint
npm run build
```

## Current Status

### Available

- Landing page publik dengan komponen modular dan konten statis.
- Login/logout Supabase, pembaruan session, validasi input login, dan redirect berdasarkan role.
- Proteksi server-side untuk area admin dan student.
- UI admin untuk dashboard, materi, video, soal, peserta, dan hasil, termasuk tampilan loading/error; seluruh data operasional masih dummy.
- Schema dan migration untuk profil, course, materi, metadata video, soal, dan opsi jawaban; seed course/materi serta script bootstrap admin.

### In Development / Planned

- Dashboard student dan workflow pembelajaran dari pre-test hingga result.
- Akses materi, playback video, dan integrasi Supabase Storage dengan akses private.
- Pengelolaan konten, soal, opsi jawaban, dan peserta melalui mutation server-side.
- Assessment engine, submit jawaban, dan perhitungan score server-side.
- Penyimpanan attempt, jawaban peserta, progress, serta hasil; model persistence tersebut belum tersedia.
- Pelaporan dari data nyata dan export hasil sesuai PRD.
- Question bank dan learning path yang dapat dikonfigurasi sebagai roadmap lanjutan.

Konten contoh belum konsisten: landing page menampilkan tiga materi, sementara PRD, seed, dan data dummy admin menggunakan dua. Schema juga menetapkan satu video per materi, sedangkan architecture menggambarkan relasi satu materi ke banyak video. README ini mencatat kondisi tersebut tanpa mengubah implementasi atau dokumen rancangan.
