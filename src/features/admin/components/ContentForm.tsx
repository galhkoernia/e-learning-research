"use client";

import { useActionState, useState, type ReactNode } from "react";
import { contentAction } from "../content-actions";
import { Button } from "./Button";

export function ContentForm({ kind, id, children }: { kind: "material" | "video"; id?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(contentAction.bind(null, kind, "save"), {});
  return <div>
    <Button size="sm" variant={id ? "secondary" : "primary"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : id ? "Edit" : kind === "material" ? "Tambah Materi" : "Add Video"}</Button>
    {open && <form action={action} className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      {id && <input type="hidden" name="id" value={id} />}
      <fieldset disabled={pending} className="space-y-3">
        {children}
        <Button type="submit" variant="primary">{pending ? "Saving…" : "Save"}</Button>
      </fieldset>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
    </form>}
  </div>;
}

export function DeleteContent({ kind, id }: { kind: "material" | "video"; id: string }) {
  const [state, action, pending] = useActionState(contentAction.bind(null, kind, "delete"), {});
  return <form action={action} onSubmit={event => {
    if (!window.confirm(kind === "material" ? "Delete this material? Materials with videos or questions cannot be deleted." : "Delete this video metadata? The storage file will remain unchanged.")) event.preventDefault();
  }}>
    <input type="hidden" name="id" value={id} />
    <Button type="submit" size="sm" variant="danger" disabled={pending}>{pending ? "Deleting…" : "Delete"}</Button>
    {state.error && <p role="alert" className="mt-2 text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="mt-2 text-sm text-emerald-700">{state.success}</p>}
  </form>;
}
