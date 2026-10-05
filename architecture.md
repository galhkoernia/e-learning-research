# Architecture — Learning Platform

## 1. Scope

Website pembelajaran berbasis Next.js untuk dua materi, video pembelajaran, assessment, progress, dan administrasi hasil peserta.

Stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL via Supabase
- Supabase Auth
- Supabase Storage untuk asset video bila diperlukan

## 2. Architectural Principle

Gunakan separation of concerns yang tegas:

```text
UI / Presentation
       ↓
Client Logic
       ↓
Server Action / Route Handler
       ↓
Authorization + Business Logic
       ↓
Prisma
       ↓
PostgreSQL
```

Client tidak boleh mengakses database secara langsung melalui Prisma.

## 3. Frontend Responsibilities

Frontend bertanggung jawab atas:

- rendering UI;
- local component state;
- form interaction;
- optimistic UI bila aman;
- loading/error state;
- client-side validation untuk UX;
- navigation;
- display progress dan result.

Frontend bukan sumber kebenaran untuk:

- role/permission;
- score final;
- correct answer;
- ownership data;
- akses admin;
- database mutation yang sensitif.

## 4. Backend Responsibilities

Backend bertanggung jawab atas:

- authentication verification;
- authorization;
- role enforcement;
- business rules;
- validation yang authoritative;
- score calculation;
- database access;
- transaction;
- storage authorization;
- sanitization;
- audit-relevant events.

## 5. Suggested Project Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   │   └── login/
│   ├── (student)/
│   │   ├── pre-test/
│   │   ├── learning/
│   │   ├── quiz/
│   │   ├── post-test/
│   │   └── result/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── materials/
│   │   ├── videos/
│   │   ├── questions/
│   │   ├── participants/
│   │   └── results/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── student/
│   └── admin/
│
├── features/
│   ├── auth/
│   ├── materials/
│   ├── videos/
│   ├── assessments/
│   ├── progress/
│   └── participants/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── storage/
│   ├── validation/
│   └── utils/
│
├── server/
│   ├── services/
│   └── repositories/
│
└── types/

prisma/
└── schema.prisma

public/
docs/
```

## 6. Module Rule

Feature-specific logic berada dekat dengan feature.

Contoh:

```text
features/assessments/
├── components/
├── schemas.ts
├── types.ts
└── helpers.ts
```

Service yang benar-benar server-only berada di `server/services`.

Database access berada di repository/service server-side.

## 7. Route Strategy

Gunakan App Router.

Student routes:

```text
/login
/pre-test
/learning/material-1
/learning/material-2
/quiz/material-1
/quiz/material-2
/post-test
/result
```

Admin routes:

```text
/admin
/admin/materials
/admin/videos
/admin/questions
/admin/participants
/admin/results
```

Route protection dilakukan server-side.

## 8. Authentication and Authorization

Supabase Auth menjadi identity provider.

Role aplikasi disimpan sebagai data domain, bukan dipercayakan pada client.

Minimal roles:

```text
ADMIN
STUDENT
```

Authorization harus diverifikasi pada server untuk setiap operasi sensitif.

Middleware dapat membantu route protection, tetapi bukan satu-satunya lapisan keamanan.

## 9. Database

Prisma digunakan sebagai ORM.

PostgreSQL berada di Supabase.

Minimal domain model:

```text
User
Material
Video
Question
AssessmentAttempt
Answer
Progress
```

Relasi utama:

```text
User 1 ─── N AssessmentAttempt
User 1 ─── N Progress
Material 1 ─── N Video
Material 1 ─── N Question
AssessmentAttempt 1 ─── N Answer
Question 1 ─── N Answer
```

Pre-test dan post-test dapat direpresentasikan sebagai tipe attempt, sehingga tidak perlu membuat tabel terpisah jika kebutuhan tidak berkembang.

## 10. Score Security

Correct answer tidak dikirim ke client sebelum diperlukan.

Score dihitung server-side.

Client mengirim jawaban peserta, server memvalidasi attempt, menghitung score, menyimpan hasil, kemudian mengembalikan result.

## 11. Video Storage

Video tidak disimpan di database sebagai binary.

Database hanya menyimpan metadata dan storage reference.

```text
Supabase Storage
      ↓
video file
      ↓
video reference
      ↓
PostgreSQL
```

Jika file bersifat private, gunakan controlled access/signed URL.

## 12. Data Flow

### Login

```text
User
 ↓
Login UI
 ↓
Supabase Auth
 ↓
Authenticated session
 ↓
Server verifies identity + role
 ↓
Dashboard
```

### Quiz

```text
Student
 ↓
Question UI
 ↓
Submit answers
 ↓
Server validation
 ↓
Calculate score
 ↓
Prisma transaction
 ↓
Result
```

### Admin CRUD

```text
Admin UI
 ↓
Server action / route handler
 ↓
Auth verification
 ↓
ADMIN authorization
 ↓
Validation
 ↓
Prisma
 ↓
Response
```

## 13. Security Rules

- Never expose database credentials to browser code.
- Never trust role supplied by client.
- Never trust score supplied by client.
- Never expose correct answers unnecessarily.
- Validate all mutation payloads server-side.
- Use environment variables for secrets.
- Do not log passwords, tokens, or sensitive user data.
- Use parameterized ORM queries; do not concatenate SQL manually.
- Protect admin routes server-side.
- Restrict storage access according to file visibility.
- Add rate limiting if public deployment or authentication abuse becomes a concern.

## 14. Error Handling

Expected errors should become structured application errors.

Frontend receives safe messages, not stack traces or database internals.

Server logs technical detail where appropriate; browser receives only actionable information.

## 15. Future Evolution

Expected growth:

```text
MVP
 ↓
More materials
 ↓
More assessment types
 ↓
Question bank
 ↓
Better analytics
 ↓
Export/reporting
 ↓
Potential multi-class / multi-study support
```

Architecture should support these directions without implementing them prematurely.

Do not build multi-tenant architecture, microservices, event buses, or complex caching until an actual requirement exists.
