import { Button } from "@/features/admin/components/Button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { StatCard } from "@/features/admin/components/StatCard";
import { AssessmentAvailability } from "@/features/reporting/components/AssessmentAvailability";
import { requireAdmin } from "@/server/auth/session";

export const metadata = { title: "Results" };

export default async function ResultsPage() {
  await requireAdmin();
  return <>
    <PageHeader title="Results" description="Assessment results and paired pre-test/post-test reporting."
      action={<Button variant="primary" disabled title="Assessment results are not available yet">Export results unavailable</Button>} />
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <StatCard label="Average Pre-Test" value="Unavailable" />
      <StatCard label="Average Post-Test" value="Unavailable" />
      <StatCard label="Completion Rate" value="Unavailable" />
    </div>
    <AssessmentAvailability />
    <p className="mt-3 text-xs text-slate-500">No assessment scores, submitted attempts, or paired comparisons are available for reporting. Participant profiles can be exported from Participants.</p>
  </>;
}
