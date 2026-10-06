"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { BookOpen, ChartNoAxesCombined, ChevronDown, GraduationCap, LayoutDashboard, Menu, MessagesSquare, Users, Video, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/materials", label: "Materials", icon: BookOpen },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/questions", label: "Questions", icon: MessagesSquare },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/results", label: "Research results", icon: ChartNoAxesCombined },
];

export function AdminNavigation({ accountAction }: { accountAction: ReactNode }) {
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const isActive = (href: string) => href === "/admin"
    ? pathname === href || pathname === "/admin/dashboard"
    : pathname === href || pathname.startsWith(href + "/");
  const current = links.find(link => isActive(link.href))?.label ?? "Administration";

  function navigation(mobile = false) {
    return <nav aria-label={mobile ? "Mobile administration" : "Administration"} className="space-y-1">
      {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href}
        aria-current={isActive(href) ? "page" : undefined}
        onClick={() => drawer.current?.close()}
        className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${isActive(href) ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
        <Icon size={18} aria-hidden="true" className="shrink-0" />{label}
      </Link>)}
    </nav>;
  }

  return <>
    <header className="sticky top-0 z-30 flex h-18 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => drawer.current?.showModal()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 lg:hidden"><Menu size={22} /></button>
        <Link href="/admin" className="hidden items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600 lg:flex lg:w-54">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><GraduationCap size={22} aria-hidden="true" /></span>
          <span className="text-base font-semibold tracking-tight text-slate-900">E-Learning<span className="block text-xs font-normal tracking-normal text-slate-500">Research administration</span></span>
        </Link>
        <span className="truncate text-sm font-medium text-slate-700">{current}</span>
      </div>
      <details className="relative shrink-0">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg p-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-semibold text-blue-700" aria-hidden="true">AD</span>
          <span className="hidden text-left sm:block"><span className="block font-medium text-slate-900">Admin</span><span className="block text-xs text-slate-500">Administrator</span></span>
          <span className="sr-only sm:hidden">Admin account</span><ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <p className="mb-3 border-b border-slate-100 pb-3 text-xs text-slate-500">Administrator account</p>{accountAction}
        </div>
      </details>
    </header>
    <aside className="fixed bottom-0 left-0 top-18 hidden w-60 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 lg:flex">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
      {navigation()}
      <div className="mt-auto pt-8"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-700">Dasar Sistem Hidrolik</p><p className="mt-1 text-xs leading-5 text-slate-500">Learning content &amp; research</p></div></div>
    </aside>
    <dialog ref={drawer} aria-labelledby="admin-navigation-title"
      onClick={event => { if (event.target === event.currentTarget) drawer.current?.close(); }}
      onClose={() => { document.documentElement.style.overflow = ""; }}
      onToggle={event => { document.documentElement.style.overflow = event.newState === "open" ? "hidden" : ""; }}
      className="fixed inset-0 m-0 h-dvh max-h-dvh w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-slate-900/40 lg:hidden">
      <div className="flex h-full w-[min(18rem,85vw)] flex-col overflow-y-auto bg-white p-4">
        <div className="mb-6 flex items-center justify-between gap-3"><h2 id="admin-navigation-title" className="font-semibold text-slate-900">E-Learning Admin</h2><button type="button" autoFocus aria-label="Close navigation" onClick={() => drawer.current?.close()} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"><X size={22} /></button></div>
        {navigation(true)}
      </div>
    </dialog>
  </>;
}
