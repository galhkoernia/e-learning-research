import Link from "next/link";
import { DataTable, type Column } from "./DataTable";

export type ParticipantRow = {
  id: string;
  fullName: string | null;
  email: string;
  createdAt: Date;
};

const columns: Column<ParticipantRow>[] = [
  {
    header: "Participant",
    cell: (participant) => (
      <div>
        <p className="font-medium text-slate-900">
          {participant.fullName || "Name not provided"}
        </p>
        <p className="text-xs text-slate-500">{participant.email}</p>
      </div>
    ),
  },
  { header: "ID", cell: (participant) => participant.id },
  {
    header: "Profile created (UTC)",
    cell: (participant) => (
      <time dateTime={participant.createdAt.toISOString()}>
        {participant.createdAt.toISOString().slice(0, 10)}
      </time>
    ),
  },
  {
    header: "Progress",
    cell: () => <span className="text-slate-500">Unavailable</span>,
  },
  {
    header: "Action",
    cell: (participant) => (
      <Link
        href={`/admin/participants/${participant.id}`}
        className="text-blue-700 underline"
      >
        View
      </Link>
    ),
  },
];

export function ParticipantsTable({
  participants,
}: {
  participants: ParticipantRow[];
}) {
  return (
    <DataTable
      columns={columns}
      rows={participants}
      getRowKey={(participant) => participant.id}
      emptyMessage="No student profiles match your search."
    />
  );
}
