# PRD — Learning Platform

## 1. Product Summary

Website pembelajaran untuk mendukung skripsi mahasiswa.

Website menyediakan dua materi pembelajaran, video visual berbasis AI, assessment, progress peserta, serta dashboard admin untuk mengelola konten dan melihat data hasil.

## 2. Users

### Admin

Pemilik/pengelola sistem.

Needs:

- mengelola materi;
- mengelola video;
- mengelola soal;
- melihat peserta;
- melihat hasil;
- melihat progress;
- export data.

### Student

Peserta uji coba.

Needs:

- login;
- mengerjakan pre-test;
- membaca materi;
- menonton video;
- mengerjakan quiz;
- mengerjakan post-test;
- melihat hasil akhir.

## 3. Core Flow

```text
                    WEBSITE
                       │
             ┌─────────┴─────────┐
             │                   │
           ADMIN                SISWA
             │                   │
           LOGIN               LOGIN
             │                   │
         DASHBOARD           PRE-TEST
             │                   │
     ┌───────┼───────┐           │
     │       │       │           ▼
   Materi  Video    Soal      MATERI 1
                                 │
                                 ▼
                              VIDEO 1
                                 │
                                 ▼
                               QUIZ 1
                                 │
                                 ▼
                              MATERI 2
                                 │
                                 ▼
                              VIDEO 2
                                 │
                                 ▼
                               QUIZ 2
                                 │
                                 ▼
                             POST-TEST
                                 │
                                 ▼
                               HASIL
                                 │
                                 ▼
                              SELESAI

ADMIN → HASIL PENELITIAN
       ├── Peserta
       ├── Pre-test
       ├── Post-test
       ├── Score
       ├── Progress
       └── Export Data
```

## 4. Functional Requirements

### Authentication

- login student;
- login admin;
- logout;
- session persistence;
- role-based access.

### Materials

Admin dapat:

- create material;
- edit material;
- delete/archive material;
- reorder material;
- publish/unpublish material.

Student dapat:

- melihat materi yang tersedia;
- membaca materi;
- melanjutkan pembelajaran.

### Videos

Admin dapat:

- upload/register video;
- menghubungkan video dengan materi;
- edit metadata;
- replace video.

Student dapat:

- melihat video;
- memainkan video;
- melanjutkan setelah video.

### Questions

Admin dapat:

- create question;
- edit question;
- delete question;
- menentukan jawaban benar;
- menghubungkan soal dengan assessment/material.

Student dapat:

- menjawab soal;
- submit assessment;
- melihat hasil sesuai aturan aplikasi.

### Progress

Sistem menyimpan status minimal:

- pre-test completed;
- material completed;
- video viewed/completed sesuai aturan yang ditetapkan;
- quiz completed;
- post-test completed.

### Results

Admin dapat melihat:

- daftar peserta;
- pre-test score;
- post-test score;
- quiz score;
- completion status;
- progress.

Admin dapat melakukan export data.

## 5. Non-Functional Requirements

### Security

- server-side authorization;
- secure environment variables;
- no secrets in client bundle;
- server-side validation;
- protected admin routes;
- safe error responses.

### Performance

- avoid unnecessary client components;
- prefer Server Components where interaction is not required;
- optimize video delivery through storage/CDN rather than proxying large files through application server;
- paginate large admin tables.

### Maintainability

- TypeScript strict mode;
- modular feature structure;
- small functions;
- explicit naming;
- minimal duplication;
- minimal comments;
- no premature abstractions.

## 6. MVP Scope

Must have:

- authentication;
- role handling;
- admin dashboard;
- material management;
- video management;
- question management;
- student learning flow;
- pre-test;
- quiz;
- post-test;
- progress;
- result dashboard;
- export data.

Not required initially:

- chat;
- gamification;
- recommendation engine;
- AI inference inside website;
- realtime collaboration;
- multi-tenant architecture;
- mobile application;
- microservices.

## 7. Acceptance Criteria

A feature is complete when:

1. expected user can access it;
2. unauthorized role cannot access it;
3. invalid input is rejected;
4. loading and error states exist where applicable;
5. mutation is validated server-side;
6. database state is consistent;
7. UI works on desktop and mobile;
8. no secret is exposed to browser code.

## 8. Research Data Boundary

Website hanya menyediakan data operasional yang dibutuhkan oleh penelitian.

Website tidak menentukan kesimpulan penelitian.

Data seperti score, progress, dan completion disimpan agar dapat dianalisis oleh peneliti di luar sistem.

## 9. Future Roadmap

Phase 1 — MVP:

- two materials;
- videos;
- assessment;
- progress;
- admin results.

Phase 2:

- richer reporting;
- question bank;
- configurable learning paths;
- better export.

Phase 3 only if needed:

- multiple classes;
- teacher accounts;
- reusable courses;
- analytics dashboard.
