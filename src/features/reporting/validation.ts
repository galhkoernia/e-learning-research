import { ContentError } from "../admin/content-validation";

export type ParticipantSearch = { page?: string; q?: string };

export function participantFilters(search: ParticipantSearch) {
  const pageValue = search.page ?? "1";
  const term = search.q ?? "";
  if (typeof pageValue !== "string" || !/^\d{1,6}$/.test(pageValue) || Number(pageValue) < 1 || Number(pageValue) > 100000) {
    throw new ContentError("Invalid page.");
  }
  if (typeof term !== "string" || term.length > 100 || /[\x00-\x1f]/.test(term)) {
    throw new ContentError("Search must contain at most 100 characters.");
  }
  return { page: Number(pageValue), q: term.trim() };
}
