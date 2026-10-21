import Link from "next/link";
import { Panel } from "@/features/admin/components/Panel";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { StatCard } from "@/features/admin/components/StatCard";
import { ParticipantsTable } from "@/features/admin/components/ParticipantsTable";
import { AssessmentAvailability } from "@/features/reporting/components/AssessmentAvailability";
import { getDashboardSummary } from "@/server/reporting";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor registered students and learning content."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Participants"
          value={String(summary.participants)}
          hint="Student profiles across the platform"
        />
        <StatCard label="Courses" value={String(summary.courses)} />
        <StatCard
          label="Materials"
          value={String(summary.materials)}
          hint={`${summary.publishedMaterials} published`}
        />
        <StatCard
          label="Questions"
          value={String(summary.questions)}
          hint={`${summary.publishedQuestions} published`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Video metadata"
          value={String(summary.videos)}
          hint={`${summary.publishedVideos} published; playback unavailable`}
        />
        <StatCard
          label="Completed Learning"
          value="Unavailable"
          hint="Completion tracking unavailable"
        />
        <StatCard
          label="Average Pre-Test Score"
          value="Unavailable"
          hint="Assessment results unavailable"
        />
        <StatCard
          label="Average Post-Test Score"
          value="Unavailable"
          hint="Assessment results unavailable"
        />
      </div>
      <Panel
        title="Recent student profiles"
        action={
          <Link href="/admin/participants" className="text-sm text-blue-700">
            All participants
          </Link>
        }
      >
        <ParticipantsTable participants={summary.recentParticipants} />
      </Panel>
      <AssessmentAvailability />
    </div>
  );
}
