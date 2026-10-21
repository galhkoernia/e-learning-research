import Link from "next/link";
import { Button } from "@/features/admin/components/Button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { ParticipantsTable } from "@/features/admin/components/ParticipantsTable";
import { getParticipants } from "@/server/reporting";
import type { ParticipantSearch } from "@/features/reporting/validation";

export const metadata = { title: "Participants" };

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<ParticipantSearch>;
}) {
  const { participants, total, page, q } = await getParticipants(
    await searchParams,
  );
  const queryFor = (target: number) =>
    new URLSearchParams({ q, page: String(target) }).toString();
  return (
    <>
      <PageHeader
        title="Participants"
        description="Registered student profiles. Assessment activity and progress are currently unavailable."
      />
      <Panel>
        <form
          method="get"
          className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-4"
        >
          <label className="flex-1 text-sm">
            Search participants
            <input
              name="q"
              type="search"
              maxLength={100}
              defaultValue={q}
              placeholder="Search by name or email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <Button type="submit" variant="primary">
            Search
          </Button>
          <Link
            href="/admin/participants"
            className="py-2 text-sm text-blue-700"
          >
            Reset
          </Link>
          <a
            href={`/admin/participants/export?${queryFor(page)}`}
            className="py-2 text-sm text-blue-700 underline"
          >
            Export current page (CSV)
          </a>
        </form>
        <ParticipantsTable participants={participants} />
      </Panel>
      <nav
        aria-label="Participant pagination"
        className="mt-6 flex items-center gap-4 text-sm text-blue-700"
      >
        {page > 1 && (
          <Link href={`/admin/participants?${queryFor(page - 1)}`}>
            Previous
          </Link>
        )}
        <span className="text-slate-600">
          Page {page} / {Math.max(1, Math.ceil(total / 20))} - {total} students
        </span>
        {page * 20 < total && (
          <Link href={`/admin/participants?${queryFor(page + 1)}`}>Next</Link>
        )}
      </nav>
    </>
  );
}
