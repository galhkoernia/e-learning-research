# Learning Platform

Aplikasi pembelajaran berbasis web untuk menyajikan materi terstruktur dan mengukur pemahaman peserta melalui assessment, sebagai pendukung proyek skripsi.

## Overview

Konten awal berfokus pada **Dasar Sistem Hidrolik**. Target pengalaman belajar mencakup materi, video, pre-test, quiz, post-test, serta hasil dan progress peserta dalam satu aplikasi dengan area student dan admin.

Saat ini tersedia landing page, authentication, CRUD materi/video/soal, dashboard berbasis hitungan database, daftar peserta dengan pencarian/pagination, export profil peserta, serta pembacaan materi terpublikasi pada `/learn`. Alur assessment dan progress belum tersedia.

## Core Features

| Area | Scope produk | Kondisi saat ini |
| --- | --- | --- |
| Public | Pengenalan pembelajaran dan akses login | Landing page dengan konten statis |
| Authentication | Login, logout, session, akses berbasis role | Terimplementasi dengan Supabase Auth dan profil aplikasi |
| Student | Materi, video, assessment, progress, hasil | `/learn` membaca course dan materi `PUBLISHED`; video dan assessment belum tersedia |
| Admin | Dashboard, konten, soal, peserta, progress, hasil, export | CRUD konten/soal, statistik konten, profil peserta, dan CSV profil terhubung database; hasil assessment unavailable |

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

Student yang berhasil login diarahkan ke `/learn` untuk membaca judul dan deskripsi materi terpublikasi. Belum ada model enrollment; semua student dapat membaca materi terpublikasi dari seluruh course. Schema belum memiliki field isi materi terpisah.

## Admin Flow

```text
Login → Dashboard → Materials / Videos / Questions / Participants / Results
```

Login tersedia di `/login`; `/admin/login` mengarahkan ke halaman yang sama. Dashboard tersedia di `/admin` dan `/admin/dashboard`, dengan halaman lain di `/admin/materials`, `/admin/videos`, `/admin/questions`, `/admin/participants`, dan `/admin/results`.

Halaman Materials, Videos, dan Questions membaca database dan mendukung tambah/edit/hapus melalui Server Actions. Penghapusan materi ditolak jika masih memiliki video atau soal; course materi yang sudah dibuat tidak dapat dipindahkan. Penghapusan metadata video tidak menghapus file Storage. Dashboard memakai hitungan database. Participants membaca profil STUDENT dengan search nama/email, pagination 20 baris, dan detail profil. CSV mengekspor halaman peserta aktif dengan filter yang sama; CSV ini bukan export hasil ujian. Preview video dan upload belum tersedia.

Results serta halaman `/learn/progress` dan `/learn/results` menampilkan status unavailable, tanpa skor, persentase, atau aktivitas fiktif. Halaman operasional admin tidak lagi mengimpor dummy data.

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

Regresi server layer menggunakan Node.js test runner (Node.js 22.15+ untuk loader hooks), tanpa dependency testing tambahan:

```bash
npm test
```

Test unit menggunakan mock Prisma dan auth. Test PostgreSQL dilewati kecuali `CONTENT_TEST_DATABASE_URL` diberikan melalui environment shell ke database uji yang telah dimigrasi; jangan gunakan database produksi. Test tersebut memakai auth stub, menjalankan CRUD melalui server layer dalam transaksi yang selalu di-rollback, dan memverifikasi pembacaan ulang serta penolakan penghapusan materi terkait video. Pengujian session Supabase dan interaksi browser tetap memerlukan verifikasi terpisah.

## Current Status

### Available

- Landing page publik dengan komponen modular dan konten statis.
- Login/logout Supabase, pembaruan session, validasi input login, dan redirect berdasarkan role.
- Proteksi server-side untuk area admin dan student.
- CRUD materi dan metadata video melalui Server Actions, validasi server, pengecekan role, pagination daftar admin, dan loading/error/empty state.
- Pembacaan course serta judul/deskripsi materi `PUBLISHED` pada `/learn`, tanpa assessment atau progress fiktif.
- CRUD soal dan opsi melalui transaksi, dengan Multiple Choice 3–4 opsi, True/False Benar/Salah, dan tepat satu jawaban benar.
- Dashboard menghitung profil STUDENT, course, materi, metadata video, dan soal melalui query agregasi database.
- Participants menggunakan search/pagination server-side, detail profil STUDENT, dan CSV halaman aktif dengan UTF-8 BOM, tanggal UTC, serta perlindungan formula injection.
- Schema dan migration untuk profil, course, materi, metadata video, soal, dan opsi jawaban; seed course/materi serta script bootstrap admin.

### In Development / Planned

- Dashboard student dan workflow pembelajaran dari pre-test hingga result.
- Isi materi terpisah dari deskripsi, playback video, dan integrasi Supabase Storage dengan akses private.
- Assessment results, progress peserta, dan export hasil ujian setelah persistence assessment tersedia. Edit/delete/ubah role peserta tidak disediakan.
- Assessment engine, submit jawaban, dan perhitungan score server-side.
- Penyimpanan attempt, jawaban peserta, progress, serta hasil; model persistence tersebut belum tersedia.
- Pelaporan dari data nyata dan export hasil sesuai PRD.
- Question bank dan learning path yang dapat dikonfigurasi sebagai roadmap lanjutan.

Konten contoh belum konsisten: landing page menampilkan tiga materi, sementara PRD, seed, dan data dummy admin menggunakan dua. Schema juga menetapkan satu video per materi, sedangkan architecture menggambarkan relasi satu materi ke banyak video. README ini mencatat kondisi tersebut tanpa mengubah implementasi atau dokumen rancangan.

### Blocker Phase 05–06

Inspeksi implementasi menemukan Phase 03–04 belum berada dalam repository ini: tidak ada model attempt, jawaban student, progress, service assessment/scoring, atau migration terkait. Hanya migration setup awal yang tersedia. Karena itu, belum dapat diimplementasikan pemilihan attempt, progress berurutan, hasil student, statistik completion, perbandingan cohort pre/post, maupun export hasil ujian dari data nyata.

Penyelesaian memerlukan implementasi Phase 03–04 beserta kebijakan attempt, penyimpanan score/submission, learning sequence, dan bukti completion materi/video. Membuka halaman tidak dianggap menyelesaikan materi atau video. Tidak ada schema atau migration yang diubah/dijalankan dalam tahap reporting ini. Halaman student yang baru hanya memverifikasi role dan menampilkan unavailable; belum merupakan integrasi progress/results.

Verifikasi tahap ini terbatas pada typecheck, lint, build, dan unit test dengan mock auth/Prisma. Database nyata dan browser E2E tidak diuji. Test perhitungan progress, pemilihan attempt, dan agregasi score ditunda karena persistence dan kebijakannya belum tersedia.
