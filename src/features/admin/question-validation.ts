import { ContentError, identifier, text } from "./content-validation";

export const ASSESSMENTS = ["PRE_TEST", "QUIZ_1", "QUIZ_2", "POST_TEST"] as const;
export const ASSESSMENT_LABELS = {
  PRE_TEST: "Pre-Test", QUIZ_1: "Quiz 1", QUIZ_2: "Quiz 2", POST_TEST: "Post-Test",
} as const;
export const MAX_OPTIONS = 10;

export type QuestionOptionInput = { id?: string; label: string; isCorrect: boolean };
export type QuestionValue = {
  id: string; courseId: string; materialId: string | null; assessment: typeof ASSESSMENTS[number];
  position: number; text: string; type: "MULTIPLE_CHOICE" | "TRUE_FALSE"; status: "DRAFT" | "PUBLISHED";
  options: (QuestionOptionInput & { id: string; position: number })[];
};
export type QuestionSearch = { page?: string; assessment?: string; courseId?: string; materialId?: string };

function assessment(value: string) {
  const result = ASSESSMENTS.find(item => item === value);
  if (!result) throw new ContentError("Invalid assessment.");
  return result;
}

function optionalIdentifier(form: FormData, key: string) {
  return text(form, key, 36, false) ? identifier(form, key) : null;
}

export function questionFilters(search: QuestionSearch) {
  const form = new FormData();
  for (const key of ["page", "assessment", "courseId", "materialId"] as const) {
    const value = search[key] ?? "";
    if (typeof value !== "string") throw new ContentError(`Invalid ${key} filter.`);
    form.set(key, value);
  }
  const rawPage = text(form, "page", 6, false) || "1";
  const page = Number(rawPage);
  if (!/^\d+$/.test(rawPage) || page < 1 || page > 100000) throw new ContentError("Invalid page.");
  return {
    page,
    assessment: form.get("assessment") ? assessment(text(form, "assessment", 20)) : undefined,
    courseId: optionalIdentifier(form, "courseId") ?? undefined,
    materialId: optionalIdentifier(form, "materialId") ?? undefined,
  };
}

export function questionInput(form: FormData) {
  const positionText = text(form, "position", 10);
  const position = Number(positionText);
  if (!/^\d+$/.test(positionText) || position < 1 || position > 2147483647) throw new ContentError("Order must be a positive whole number.");
  const type = text(form, "type", 30);
  if (type !== "MULTIPLE_CHOICE" && type !== "TRUE_FALSE") throw new ContentError("Invalid question type.");
  const status = text(form, "status", 20);
  if (status !== "DRAFT" && status !== "PUBLISHED") throw new ContentError("Invalid status.");
  let rawOptions: unknown;
  try { rawOptions = JSON.parse(text(form, "options", 50000)); }
  catch { throw new ContentError("Invalid answer options."); }
  if (!Array.isArray(rawOptions) || rawOptions.length < 2 || rawOptions.length > MAX_OPTIONS) {
    throw new ContentError(`Provide between 2 and ${MAX_OPTIONS} options.`);
  }
  const options: QuestionOptionInput[] = rawOptions.map(raw => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw) || Object.keys(raw).some(key => !["id", "label", "isCorrect"].includes(key))) {
      throw new ContentError("Invalid answer option fields.");
    }
    const option = raw as Record<string, unknown>;
    if (typeof option.label !== "string" || !option.label.trim() || option.label.trim().length > 2000 || typeof option.isCorrect !== "boolean") {
      throw new ContentError("Each option needs text and a valid correct-answer selection.");
    }
    let id: string | undefined;
    if (option.id !== undefined) {
      const idForm = new FormData();
      if (typeof option.id !== "string") throw new ContentError("Invalid option identifier.");
      idForm.set("optionId", option.id);
      id = identifier(idForm, "optionId");
    }
    return { ...(id ? { id } : {}), label: option.label.trim(), isCorrect: option.isCorrect };
  });
  const ids = options.flatMap(option => option.id ? [option.id] : []);
  if (new Set(ids).size !== ids.length) throw new ContentError("Duplicate option identifiers.");
  if (new Set(options.map(option => option.label.toLowerCase())).size !== options.length) throw new ContentError("Option text must be distinct.");
  if (options.filter(option => option.isCorrect).length !== 1) throw new ContentError("Select exactly one correct answer.");
  if (type === "TRUE_FALSE" && (options.length !== 2 || options[0].label !== "True" || options[1].label !== "False")) {
    throw new ContentError("True/False questions require the True and False options, in that order.");
  }
  // Explicit fields prevent form data from overriding ownership or persistence metadata.
  return {
    courseId: identifier(form, "courseId"), materialId: optionalIdentifier(form, "materialId"),
    assessment: assessment(text(form, "assessment", 20)), position,
    text: text(form, "text", 20000), type, status, options,
  };
}
