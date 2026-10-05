import type { LearningData } from "./types";

export const learningData: LearningData = {
  course: {
    title: "Dasar Sistem Hidrolik",
    category: "Teknik Mesin",
    level: "Dasar",
    description:
      "Pelajari prinsip dasar, komponen, dan penerapan sistem hidrolik melalui materi terstruktur dan pembelajaran visual.",
  },

  benefits: [
    {
      title: "Materi Terstruktur",
      description:
        "Materi pembelajaran disusun secara sistematis agar konsep dapat dipelajari secara bertahap.",
    },
    {
      title: "Pembelajaran Visual",
      description:
        "Konsep teknis diperjelas melalui ilustrasi, diagram, dan video pembelajaran.",
    },
    {
      title: "Evaluasi Terarah",
      description:
        "Pre-test, quiz, dan post-test membantu mengukur perkembangan pemahaman peserta.",
    },
  ],

  materials: [
    {
      id: "material-01",
      number: "01",
      title: "Prinsip Kerja Sistem Hidrolik",
      description:
        "Memahami konsep dasar tekanan fluida, prinsip kerja, serta hubungan antar komponen dalam sistem hidrolik.",
    },
    {
      id: "material-02",
      number: "02",
      title: "Komponen Sistem Hidrolik",
      description:
        "Mengenal fungsi pompa, valve, aktuator, reservoir, dan komponen pendukung lainnya.",
    },
    {
      id: "material-03",
      number: "03",
      title: "Penerapan pada Mesin",
      description:
        "Mempelajari bagaimana sistem hidrolik diterapkan pada berbagai sistem dan mekanisme mesin.",
    },
  ],

  process: [
    {
      number: "01",
      title: "Pre-Test",
      description:
        "Mengukur pengetahuan awal sebelum memulai pembelajaran.",
    },
    {
      number: "02",
      title: "Material",
      description:
        "Mempelajari materi berdasarkan struktur pembelajaran yang telah disediakan.",
    },
    {
      number: "03",
      title: "Video",
      description:
        "Memperkuat pemahaman melalui demonstrasi dan visualisasi konsep.",
    },
    {
      number: "04",
      title: "Quiz",
      description:
        "Menguji pemahaman terhadap materi yang telah dipelajari.",
    },
    {
      number: "05",
      title: "Post-Test",
      description:
        "Mengukur perubahan tingkat pemahaman setelah proses pembelajaran.",
    },
  ],
};