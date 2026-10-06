import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}

// Not a client component: it has no state, so it can render inside both Server
// Components and the client-side participants filter.
export function DataTable<T>({ columns, rows, getRowKey, emptyMessage = "No data yet." }: DataTableProps<T>) {
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-blue-600" tabIndex={0} role="region" aria-label={`${columns[0]?.header ?? "Data"} table, scroll horizontally for more columns`}>
      <table className="w-full min-w-160 text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
          <tr>
            {columns.map((col) => (
              <th key={col.header} scope="col" className={`px-5 py-3 ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)} className="text-slate-700 hover:bg-slate-50/60">
                {columns.map((col) => (
                  <td key={col.header} className={`px-5 py-3 ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
