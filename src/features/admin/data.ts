import type {
  ActivityItem,
  AssessmentType,
  Material,
  Participant,
  Question,
  Video,
} from "./types";

// Dummy data only. Every export here is meant to be replaced by a server-side
// fetch (Server Component -> service layer -> Prisma) in the backend phase.

export const course = { title: "Dasar Sistem Hidrolik" };

export const participants: Participant[] = [
  { id: "P001", name: "Aulia Rahmawati", preTest: 55, postTest: 82, progress: 100, currentStep: "Finished", status: "Completed" },
  { id: "P002", name: "Bagas Prasetyo", preTest: 60, postTest: 85, progress: 100, currentStep: "Finished", status: "Completed" },
  { id: "P003", name: "Citra Lestari", preTest: 50, postTest: 78, progress: 100, currentStep: "Finished", status: "Completed" },
  { id: "P004", name: "Dimas Saputra", preTest: 65, postTest: null, progress: 60, currentStep: "Material 2", status: "In progress" },
  { id: "P005", name: "Eka Wulandari", preTest: null, postTest: null, progress: 0, currentStep: "Not started", status: "Not started" },
];

export const materials: Material[] = [
  {
    id: "m1",
    number: 1,
    title: "Prinsip Kerja dan Komponen Sistem Hidrolik",
    description: "Hukum Pascal, fluida kerja, serta fungsi pompa, katup, aktuator, dan reservoir.",
    hasVideo: true,
    quiz: "Quiz 1",
    status: "Published",
  },
  {
    id: "m2",
    number: 2,
    title: "Penerapan Sistem Hidrolik pada Mesin",
    description: "Penerapan hidrolik pada mesin press, dongkrak, dan alat berat beserta perawatannya.",
    hasVideo: true,
    quiz: "Quiz 2",
    status: "Draft",
  },
];

export const videos: Video[] = [
  { id: "v1", title: "Prinsip Kerja Sistem Hidrolik", materialNumber: 1, duration: "12:40", status: "Published", updatedAt: "2 Okt 2026", updatedBy: "Admin" },
  { id: "v2", title: "Penerapan Sistem Hidrolik pada Mesin", materialNumber: 2, duration: "14:15", status: "Draft", updatedAt: "4 Okt 2026", updatedBy: "Admin" },
];

export const ASSESSMENT_ORDER: AssessmentType[] = ["Pre-Test", "Quiz 1", "Quiz 2", "Post-Test"];

export const questions: Question[] = [
  { id: "q1", number: 1, text: "Apa fungsi utama fluida dalam sistem hidrolik?", type: "Multiple choice", assessment: "Pre-Test", relatedMaterial: "All materials", status: "Published" },
  { id: "q2", number: 2, text: "Hukum fisika yang menjadi dasar sistem hidrolik adalah hukum Pascal.", type: "True/False", assessment: "Pre-Test", relatedMaterial: "Material 1", status: "Published" },
  { id: "q3", number: 3, text: "Komponen yang mengubah energi mekanik menjadi energi hidrolik adalah...", type: "Multiple choice", assessment: "Pre-Test", relatedMaterial: "Material 1", status: "Published" },
  { id: "q4", number: 1, text: "Apa fungsi reservoir pada sistem hidrolik?", type: "Multiple choice", assessment: "Quiz 1", relatedMaterial: "Material 1", status: "Published" },
  { id: "q5", number: 2, text: "Silinder hidrolik termasuk jenis komponen...", type: "Multiple choice", assessment: "Quiz 1", relatedMaterial: "Material 1", status: "Published" },
  { id: "q6", number: 3, text: "Katup pengatur tekanan berfungsi membatasi tekanan maksimum sistem.", type: "True/False", assessment: "Quiz 1", relatedMaterial: "Material 1", status: "Draft" },
  { id: "q7", number: 1, text: "Contoh mesin yang memanfaatkan sistem hidrolik adalah...", type: "Multiple choice", assessment: "Quiz 2", relatedMaterial: "Material 2", status: "Draft" },
  { id: "q8", number: 2, text: "Keunggulan sistem hidrolik pada mesin press adalah...", type: "Multiple choice", assessment: "Quiz 2", relatedMaterial: "Material 2", status: "Draft" },
  { id: "q9", number: 3, text: "Kebocoran oli pada sambungan selang dapat menurunkan tekanan sistem.", type: "True/False", assessment: "Quiz 2", relatedMaterial: "Material 2", status: "Draft" },
  { id: "q10", number: 1, text: "Sebutkan urutan aliran fluida dari pompa hingga aktuator.", type: "Multiple choice", assessment: "Post-Test", relatedMaterial: "All materials", status: "Published" },
  { id: "q11", number: 2, text: "Tekanan pada fluida tertutup diteruskan sama besar ke segala arah.", type: "True/False", assessment: "Post-Test", relatedMaterial: "Material 1", status: "Published" },
  { id: "q12", number: 3, text: "Perawatan rutin apa yang paling berpengaruh pada umur komponen hidrolik?", type: "Multiple choice", assessment: "Post-Test", relatedMaterial: "Material 2", status: "Published" },
];

export const recentActivity: ActivityItem[] = [
  { id: "a1", participantId: "P003", action: "completed Post-Test", time: "10 minutes ago" },
  { id: "a2", participantId: "P004", action: "completed Material 2", time: "35 minutes ago" },
  { id: "a3", participantId: "P004", action: "submitted Quiz 1", time: "1 hour ago" },
  { id: "a4", participantId: "P002", action: "completed Post-Test", time: "3 hours ago" },
  { id: "a5", participantId: "P001", action: "completed Pre-Test", time: "Yesterday" },
];

export function getQuestionCount(assessment: AssessmentType): number {
  return questions.filter((q) => q.assessment === assessment).length;
}

export function getGain(p: Participant): number | null {
  return p.preTest !== null && p.postTest !== null ? p.postTest - p.preTest : null;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.round(mean * 10) / 10;
}

// Derived on the client only because the data is dummy. Research figures must
// be computed server-side from stored attempts, never from client state.
export function getResultSummary(list: Participant[] = participants) {
  const completed = list.filter((p) => p.status === "Completed").length;
  return {
    total: list.length,
    completed,
    completionRate: list.length ? Math.round((completed / list.length) * 100) : 0,
    avgPreTest: average(list.flatMap((p) => (p.preTest !== null ? [p.preTest] : []))),
    avgPostTest: average(list.flatMap((p) => (p.postTest !== null ? [p.postTest] : []))),
  };
}