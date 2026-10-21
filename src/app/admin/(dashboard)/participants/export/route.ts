import { unstable_rethrow } from "next/navigation";
import { getParticipants } from "@/server/reporting";
import { ContentError } from "@/features/admin/content-validation";
import { csvDocument } from "@/features/reporting/csv";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    // The service independently verifies ADMIN and uses the same bounded query as the table.
    const { participants } = await getParticipants({
      q: query.get("q") ?? undefined,
      page: query.get("page") ?? undefined,
    });
    const csv = csvDocument(
      ["Participant ID", "Name", "Email", "Profile created (UTC)"],
      participants.map((participant) => [
        participant.id,
        participant.fullName,
        participant.email,
        participant.createdAt.toISOString(),
      ]),
    );
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="participants-page.csv"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    unstable_rethrow(error);
    return Response.json(
      {
        error:
          error instanceof ContentError
            ? error.message
            : "Unable to export participants. Please try again.",
      },
      {
        status: error instanceof ContentError ? 400 : 500,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
