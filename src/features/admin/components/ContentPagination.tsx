import Link from "next/link";

export function contentPage(value?: string) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 && page <= 100000 ? page : 1;
}

export function ContentPagination({
  page,
  total,
  path,
}: {
  page: number;
  total: number;
  path: string;
}) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center gap-4 text-sm text-blue-700"
    >
      {page > 1 && <Link href={`${path}?page=${page - 1}`}>Previous</Link>}
      <span className="text-slate-600">
        Page {page} · {total} records
      </span>
      {page * 20 < total && <Link href={`${path}?page=${page + 1}`}>Next</Link>}
    </nav>
  );
}
