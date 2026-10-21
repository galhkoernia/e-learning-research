const fieldClass =
  "mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";

type MaterialValue = {
  courseId: string;
  number: number;
  title: string;
  description: string | null;
  status: string;
};
type VideoValue = {
  materialId: string;
  title: string;
  storagePath: string | null;
  durationSeconds: number | null;
  status: string;
};

function StatusField({ value = "DRAFT" }: { value?: string }) {
  return (
    <label className="block text-sm">
      Status
      <select name="status" defaultValue={value} className={fieldClass}>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>
    </label>
  );
}

export function MaterialFields({
  courses,
  value,
}: {
  courses: { id: string; title: string }[];
  value?: MaterialValue;
}) {
  return (
    <>
      <label className="block text-sm">
        Course
        <select
          name="courseId"
          required
          defaultValue={value?.courseId ?? ""}
          className={fieldClass}
        >
          <option value="" disabled>
            Select course
          </option>
          {courses
            .filter((course) => !value || course.id === value.courseId)
            .map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
        </select>
      </label>
      <label className="block text-sm">
        Order
        <input
          name="number"
          type="number"
          min="1"
          max="2147483647"
          required
          defaultValue={value?.number}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        Title
        <input
          name="title"
          maxLength={200}
          required
          defaultValue={value?.title}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        Description
        <textarea
          name="description"
          maxLength={20000}
          rows={5}
          defaultValue={value?.description ?? ""}
          className={fieldClass}
        />
      </label>
      <StatusField value={value?.status} />
    </>
  );
}

export function VideoFields({
  materials,
  value,
}: {
  materials: {
    id: string;
    title: string;
    number: number;
    course: { title: string };
    video: { id: string } | null;
  }[];
  value?: VideoValue;
}) {
  return (
    <>
      <label className="block text-sm">
        Material
        <select
          name="materialId"
          required
          defaultValue={value?.materialId ?? ""}
          className={fieldClass}
        >
          <option value="" disabled>
            Select material
          </option>
          {materials
            .filter(
              (material) =>
                !material.video || material.id === value?.materialId,
            )
            .map((material) => (
              <option key={material.id} value={material.id}>
                {material.course.title} / {material.number}. {material.title}
              </option>
            ))}
        </select>
      </label>
      <label className="block text-sm">
        Title
        <input
          name="title"
          maxLength={200}
          required
          defaultValue={value?.title}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        Duration (seconds)
        <input
          name="durationSeconds"
          type="number"
          min="1"
          max="2147483647"
          defaultValue={value?.durationSeconds ?? ""}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        Private storage reference (optional)
        <input
          name="storagePath"
          maxLength={1024}
          defaultValue={value?.storagePath ?? ""}
          className={fieldClass}
        />
      </label>
      <p className="text-xs text-slate-500">
        Metadata only. Upload and preview are unavailable until private Storage
        is integrated. Enter a relative path, not a public URL.
      </p>
      <StatusField value={value?.status} />
    </>
  );
}
