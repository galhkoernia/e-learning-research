"use client";

import { useState } from "react";
import type { Participant, ParticipantStatus } from "../types";
import { Button } from "./Button";
import { DataTable, type Column } from "./DataTable";
import { ProgressBar } from "./ProgressCard";
import { StatusBadge } from "./StatusBadge";

type StatusFilter = "All" | ParticipantStatus;
const STATUS_OPTIONS: StatusFilter[] = ["All", "Not started", "In progress", "Completed"];

const score = (value: number | null) => (value === null ? "—" : String(value));

const columns: Column<Participant>[] = [
  { header: "Participant", cell: (p) => <span className="font-medium text-slate-900">{p.name}</span> },
  { header: "ID", cell: (p) => p.id },
  { header: "Pre-Test", cell: (p) => score(p.preTest) },
  {
    header: "Progress",
    cell: (p) => (
      <div className="flex min-w-36 items-center gap-3">
        <ProgressBar percent={p.progress} label={`${p.name} progress`} />
        <span className="w-9 text-xs text-slate-500">{p.progress}%</span>
      </div>
    ),
  },
  { header: "Post-Test", cell: (p) => score(p.postTest) },
  { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
  { header: "Action", cell: () => <Button size="sm">View</Button> },
];

// Participants arrive as a prop so the server page can later supply real data
// without this client component knowing where it came from.
export function ParticipantsTable({ participants }: { participants: Participant[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");

  const term = query.trim().toLowerCase();
  const rows = participants.filter(
    (p) =>
      (status === "All" || p.status === status) &&
      (term === "" || p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)),
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="participant-search" className="sr-only">Search participants</label>
          <input
            id="participant-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
        <div>
          <label htmlFor="participant-status" className="sr-only">Filter by status</label>
          <select
            id="participant-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:w-44"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All statuses" : option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DataTable columns={columns} rows={rows} getRowKey={(p) => p.id} emptyMessage="No participants match your search." />
    </div>
  );
}