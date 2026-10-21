"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import {
  deleteQuestion,
  questionError,
  saveQuestion,
} from "@/server/questions";
import type { ContentState } from "./content-validation";

export async function questionAction(
  operation: "save" | "delete",
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  if (operation !== "save" && operation !== "delete")
    return { error: "Invalid operation." };
  try {
    if (operation === "save") await saveQuestion(form);
    else await deleteQuestion(form);
  } catch (error) {
    unstable_rethrow(error);
    return { error: questionError(error) };
  }
  revalidatePath("/admin/questions");
  revalidatePath("/admin/materials");
  return {
    success:
      operation === "delete"
        ? "Question and its options deleted."
        : "Question saved successfully.",
  };
}
