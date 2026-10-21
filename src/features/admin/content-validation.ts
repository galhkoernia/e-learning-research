export class ContentError extends Error {}

export function text(
  form: FormData,
  key: string,
  max: number,
  required = true,
) {
  const value = form.get(key);
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    (required && !value.trim())
  ) {
    throw new ContentError(`Invalid ${key}.`);
  }
  return value.trim();
}

export function identifier(form: FormData, key: string) {
  const value = text(form, key, 36);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  ) {
    throw new ContentError(`Invalid ${key}.`);
  }
  return value;
}

function integer(form: FormData, key: string, optional = false) {
  const value = text(form, key, 10, !optional);
  if (optional && !value) return null;
  const number = Number(value);
  if (
    !/^\d+$/.test(value) ||
    !Number.isInteger(number) ||
    number < 1 ||
    number > 2147483647
  ) {
    throw new ContentError(`Invalid ${key}: use a positive whole number.`);
  }
  return number;
}

function status(form: FormData): "DRAFT" | "PUBLISHED" {
  const value = text(form, "status", 20);
  if (value !== "DRAFT" && value !== "PUBLISHED")
    throw new ContentError("Invalid status.");
  return value;
}

export function materialInput(form: FormData) {
  return {
    courseId: identifier(form, "courseId"),
    number: integer(form, "number")!,
    title: text(form, "title", 200),
    description: text(form, "description", 20000, false) || null,
    status: status(form),
  };
}

export function videoInput(form: FormData) {
  const storagePath = text(form, "storagePath", 1024, false) || null;
  if (
    storagePath &&
    (storagePath.startsWith("/") ||
      storagePath.includes(":") ||
      storagePath.includes("\\") ||
      storagePath
        .split("/")
        .some((part) => !part || part === "." || part === "..") ||
      /[?#\x00-\x1f]/.test(storagePath))
  ) {
    throw new ContentError("Use a relative private storage path, not a URL.");
  }
  return {
    materialId: identifier(form, "materialId"),
    title: text(form, "title", 200),
    storagePath,
    durationSeconds: integer(form, "durationSeconds", true),
    status: status(form),
  };
}

export type ContentState = { error?: string; success?: string };
