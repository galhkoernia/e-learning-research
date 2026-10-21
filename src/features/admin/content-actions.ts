"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { contentError, mutateContent } from "@/server/content";
import type { ContentState } from "./content-validation";

export async function contentAction(
  kind: "material" | "video",
  operation: "save" | "delete",
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  // Bound arguments are still untrusted action input.
  if (
    (kind !== "material" && kind !== "video") ||
    (operation !== "save" && operation !== "delete")
  )
    return { error: "Invalid operation." };
  try {
    await mutateContent(kind, operation, form);
  } catch (error) {
    unstable_rethrow(error);
    return { error: contentError(error) };
  }
  revalidatePath("/admin/materials");
  revalidatePath("/admin/videos");
  revalidatePath("/learn");
  return {
    success:
      operation === "delete" ? "Deleted successfully." : "Saved successfully.",
  };
}
