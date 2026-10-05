# Design System — Learning Platform

## 1. Purpose

Design system untuk website pembelajaran. Produk berfungsi sebagai wadah pembelajaran dua materi dengan video visual berbasis AI, quiz, pre-test, post-test, progress, dan dashboard admin.

Prinsip utama:

- sederhana dan akademik;
- fokus pada materi dan pembelajaran;
- minim distraksi;
- responsif;
- accessible secara dasar;
- komponen reusable tanpa over-engineering;
- visual konsisten antara admin dan siswa.

## 2. Design Principles

### Clarity
Setiap halaman harus memiliki satu tujuan utama.

### Progressive Disclosure
Tampilkan informasi yang dibutuhkan pada tahap tersebut. Jangan memenuhi halaman dengan data yang belum relevan.

### Consistency
Gunakan komponen, spacing, typography, dan pola interaksi yang sama.

### Feedback
Setiap aksi penting harus memiliki feedback: loading, success, error, atau validation state.

### Learning First
Pada sisi siswa, materi, video, quiz, dan navigasi pembelajaran harus menjadi prioritas visual.

## 3. Visual Language

Gunakan tampilan modern, bersih, profesional, dan cocok untuk konteks pendidikan teknik.

### Color Tokens

- `background`: neutral sangat terang
- `foreground`: neutral gelap
- `muted`: neutral untuk secondary text
- `primary`: warna utama brand/proyek
- `primary-foreground`: teks di atas primary
- `border`: neutral ringan
- `success`: status berhasil
- `warning`: status peringatan
- `destructive`: error atau aksi berbahaya

Warna konkret disimpan sebagai Tailwind theme tokens. Jangan hard-code warna berulang di komponen.

### Typography

Gunakan satu keluarga sans-serif utama.

Hierarchy:

- `display`: hanya untuk hero jika diperlukan
- `h1`: judul halaman
- `h2`: section utama
- `h3`: subsection/card title
- `body`: isi utama
- `small`: metadata/helper text

Utamakan readability daripada dekorasi.

### Spacing

Gunakan spacing scale Tailwind. Hindari arbitrary values kecuali benar-benar diperlukan.

### Radius

Gunakan radius kecil sampai sedang. Hindari terlalu banyak bentuk pill.

### Elevation

Gunakan border sebagai default. Shadow hanya untuk elemen yang memang membutuhkan separation seperti modal atau floating panel.

## 4. Layout

### Student

- top navigation sederhana;
- learning container dengan lebar terbatas;
- progress indicator;
- content area;
- primary action yang jelas.

### Admin

- sidebar desktop;
- top bar;
- content container;
- table/card sesuai jenis data.

### Responsive

Mobile-first.

Breakpoint tidak boleh menentukan business logic. Responsive behavior hanya berada pada presentation layer.

## 5. Core Components

Minimal reusable components:

```text
Button
Input
Textarea
Select
Checkbox
RadioGroup
Card
Badge
Progress
Modal/Dialog
Dropdown
Table
Pagination
Tabs
Alert
Toast
Skeleton
EmptyState
ConfirmDialog
VideoPlayer
QuestionCard
ScoreCard
```

Jangan membuat komponen abstrak jika hanya digunakan satu kali dan abstraksinya tidak memberi manfaat.

## 6. States

Setiap data-driven UI minimal memiliki:

- loading;
- success;
- empty;
- error;
- disabled;
- validation error.

## 7. Student UX

Flow visual:

```text
Login
  ↓
Pre-Test
  ↓
Materi 1
  ↓
Video 1
  ↓
Quiz 1
  ↓
Materi 2
  ↓
Video 2
  ↓
Quiz 2
  ↓
Post-Test
  ↓
Hasil
  ↓
Selesai
```

Siswa tidak perlu melihat fitur administrasi.

## 8. Admin UX

```text
Dashboard
├── Materi
├── Video
├── Soal
├── Peserta
└── Hasil Penelitian
```

## 9. Accessibility Baseline

- semantic HTML;
- label pada form;
- keyboard-accessible controls;
- visible focus state;
- contrast yang memadai;
- error message yang jelas;
- video memiliki controls.

## 10. Rules

Do:

- reuse components;
- keep pages focused;
- use consistent spacing;
- provide feedback for asynchronous actions.

Do not:

- create decorative UI tanpa fungsi;
- duplicate component styling;
- put business logic inside presentational components;
- use excessive animation;
- introduce a UI library solely for convenience without project need.
