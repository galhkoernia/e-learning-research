import Link from "next/link";
import { notFound } from "next/navigation";
import { getParticipant } from "@/server/reporting";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { AssessmentAvailability } from "@/features/reporting/components/AssessmentAvailability";

export const metadata = { title: "Participant details" };

export default async function ParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  const participant = await getParticipant((await params).id);
  if (!participant) notFound();
  return <div className="space-y-6">
    <PageHeader title="Participant details" description="Student profile and available learning information." />
    <Panel title={participant.fullName || "Name not provided"}>
      <dl className="space-y-3 p-5 text-sm text-slate-700">
        <div><dt className="font-medium">Email</dt><dd>{participant.email}</dd></div>
        <div><dt className="font-medium">ID</dt><dd>{participant.id}</dd></div>
        <div><dt className="font-medium">Profile created (UTC)</dt><dd>{participant.createdAt.toISOString()}</dd></div>
      </dl>
    </Panel>
    <AssessmentAvailability />
    <Link href="/admin/participants" className="text-sm text-blue-700 underline">Back to participants</Link>
  </div>;
}
