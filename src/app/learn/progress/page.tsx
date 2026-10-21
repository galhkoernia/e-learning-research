import Link from "next/link";
import { getStudentReportingIdentity } from "@/server/reporting";
import { AssessmentAvailability } from "@/features/reporting/components/AssessmentAvailability";

export const metadata = { title: "Learning progress" };

export default async function StudentProgressPage() {
  await getStudentReportingIdentity();
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">Learning progress</h1>
      <AssessmentAvailability title="Progress unavailable" />
      <Link href="/learn" className="text-sm text-blue-700 underline">
        Back to learning materials
      </Link>
    </main>
  );
}
