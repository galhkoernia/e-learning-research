"use client";

import { useActionState, useId, useState } from "react";
import { questionAction } from "../question-actions";
import { ASSESSMENTS, ASSESSMENT_LABELS, MAX_MC_OPTIONS, MIN_MC_OPTIONS, TRUE_FALSE_LABELS, questionInput, type QuestionOptionInput, type QuestionValue } from "../question-validation";
import { Button } from "./Button";

const fieldClass = "mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";
export type QuestionChoices = {
  courses: { id: string; title: string }[];
  materials: { id: string; courseId: string; number: number; title: string }[];
};

function QuestionEditor({ courses, materials, value }: QuestionChoices & { value?: QuestionValue }) {
  const [state, action, pending] = useActionState(questionAction.bind(null, "save"), {});
  const [clientError, setClientError] = useState("");
  const [courseId, setCourseId] = useState(value?.courseId ?? courses[0]?.id ?? "");
  const [materialId, setMaterialId] = useState(value?.materialId ?? "");
  const [type, setType] = useState<QuestionValue["type"]>(value?.type ?? "MULTIPLE_CHOICE");
  const [options, setOptions] = useState<QuestionOptionInput[]>(() => {
    if (value?.type === "TRUE_FALSE") return TRUE_FALSE_LABELS.map((label, index) => ({
      ...(value.options[index]?.id ? { id: value.options[index].id } : {}), label, isCorrect: value.options[index]?.isCorrect ?? false,
    }));
    return value?.options.map(({ id, label, isCorrect }) => ({ id, label, isCorrect })) ?? Array.from({ length: MAX_MC_OPTIONS }, () => ({ label: "", isCorrect: false }));
  });
  const radioGroup = useId();
  return <form action={action} onSubmit={event => {
    setClientError("");
    try { questionInput(new FormData(event.currentTarget)); }
    catch (error) { event.preventDefault(); setClientError(error instanceof Error ? error.message : "Invalid question."); }
  }} className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-left">
    {value && <input type="hidden" name="id" value={value.id} />}
    <input type="hidden" name="options" value={JSON.stringify(options)} />
    <fieldset disabled={pending} className="space-y-3">
      <label className="block text-sm">Course<select name="courseId" required value={courseId} className={fieldClass} onChange={event => { setCourseId(event.target.value); setMaterialId(""); }}>
        <option value="" disabled>Select course</option>
        {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
      </select></label>
      <label className="block text-sm">Related material<select name="materialId" value={materialId} onChange={event => setMaterialId(event.target.value)} className={fieldClass}>
        <option value="">All materials in this course</option>
        {materials.filter(material => material.courseId === courseId).map(material => <option key={material.id} value={material.id}>{material.number}. {material.title}</option>)}
      </select></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">Assessment<select name="assessment" defaultValue={value?.assessment ?? "PRE_TEST"} className={fieldClass}>
          {ASSESSMENTS.map(assessment => <option key={assessment} value={assessment}>{ASSESSMENT_LABELS[assessment]}</option>)}
        </select></label>
        <label className="block text-sm">Order<input name="position" type="number" min={1} max={2147483647} required defaultValue={value?.position} className={fieldClass} /></label>
      </div>
      <label className="block text-sm">Question<textarea name="text" required maxLength={20000} rows={4} defaultValue={value?.text} className={fieldClass} /></label>
      <label className="block text-sm">Type<select name="type" value={type} className={fieldClass} onChange={event => {
        const next = event.target.value as QuestionValue["type"];
        if (next === "TRUE_FALSE") setOptions(TRUE_FALSE_LABELS.map((label, index) => ({ ...options[index], label })));
        else setOptions([...options, ...Array.from({ length: MAX_MC_OPTIONS - options.length }, () => ({ label: "", isCorrect: false }))]);
        setType(next);
      }}><option value="MULTIPLE_CHOICE">Multiple choice</option><option value="TRUE_FALSE">True/False</option></select></label>
      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium">Answer options</legend>
        <p className="text-xs text-slate-500">Select exactly one correct answer. Multiple choice: 3–4 options (A–C or A–D). True/False: Benar and Salah.</p>
        {options.map((option, index) => {
          const label = type === "TRUE_FALSE" ? TRUE_FALSE_LABELS[index] : String.fromCharCode(65 + index);
          return <div key={index} className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs"><input type="radio" name={radioGroup} required checked={option.isCorrect} onChange={() => setOptions(options.map((item, selected) => ({ ...item, isCorrect: selected === index })))} />Correct {label}</label>
            <label className="min-w-40 flex-1 text-sm">Option {label}<input required maxLength={2000} readOnly={type === "TRUE_FALSE"} value={option.label} className={fieldClass} onChange={event => setOptions(options.map((item, selected) => selected === index ? { ...item, label: event.target.value } : item))} /></label>
            {type === "MULTIPLE_CHOICE" && <Button size="sm" disabled={options.length <= MIN_MC_OPTIONS} onClick={() => setOptions(options.filter((_, selected) => selected !== index))}>Remove option {label}</Button>}
          </div>;
        })}
        {type === "MULTIPLE_CHOICE" && <Button size="sm" disabled={options.length >= MAX_MC_OPTIONS} onClick={() => setOptions([...options, { label: "", isCorrect: false }])}>Add option</Button>}
      </fieldset>
      <label className="block text-sm">Status<select name="status" defaultValue={value?.status ?? "DRAFT"} className={fieldClass}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
      <Button type="submit" variant="primary">{pending ? "Saving…" : "Save"}</Button>
    </fieldset>
    {(clientError || state.error) && <p role="alert" className="text-sm text-red-700">{clientError || state.error}</p>}
    {!clientError && !state.error && state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
  </form>;
}

export function QuestionForm(props: QuestionChoices & { value?: QuestionValue }) {
  const [open, setOpen] = useState(false);
  return <div>
    <Button size="sm" variant={props.value ? "secondary" : "primary"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : props.value ? "Edit" : "Add Question"}</Button>
    {open && <QuestionEditor {...props} />}
  </div>;
}

export function DeleteQuestion({ id }: { id: string }) {
  const [state, action, pending] = useActionState(questionAction.bind(null, "delete"), {});
  return <form action={action} onSubmit={event => {
    if (!window.confirm("Delete this question and all of its answer options?")) event.preventDefault();
  }}>
    <input type="hidden" name="id" value={id} />
    <Button type="submit" size="sm" variant="danger" disabled={pending}>{pending ? "Deleting…" : "Delete"}</Button>
    {state.error && <p role="alert" className="mt-2 text-sm text-red-700">{state.error}</p>}
  </form>;
}
