import { PageHeader } from "@/features/admin/components/PageHeader";
import { ParticipantsTable } from "@/features/admin/components/ParticipantsTable";
import { participants } from "@/features/admin/data";

export const metadata = { title: "Participants" };

export default function ParticipantsPage() {
  return (
    <>
      <PageHeader title="Participants" description="Track each participant's scores and progress through the learning flow." />
      <ParticipantsTable participants={participants} />
    </>
  );
}