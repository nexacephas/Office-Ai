import type { ReactNode } from 'react'

export type AssistantIconName = 'sparkles' | 'plus' | 'search' | 'more' | 'close' | 'archive' | 'trash' | 'edit' | 'send' | 'paperclip' | 'file' | 'task' | 'meeting' | 'mail' | 'arrow' | 'copy' | 'check' | 'external' | 'menu' | 'refresh' | 'book' | 'writing' | 'grid' | 'chevron'

export default function AssistantIcon({ name, size = 18 }: { name: AssistantIconName; size?: number }) {
  const shapes: Record<AssistantIconName, ReactNode> = {
    sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    archive: <><path d="M3 4h18v4H3zM5 8v12h14V8m-9 4h4" /></>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4.8 15.2 4 20Z" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    paperclip: <path d="m21 11.5-8.5 8.5a5 5 0 0 1-7.1-7.1l9.2-9.2a3.5 3.5 0 0 1 4.9 4.9l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7M8 15h8M8 18h6" /></>,
    task: <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="m8 10 1.5 1.5L12 9m1 2h3m-8 5 1.5 1.5L12 15m1 2h3" /></>,
    meeting: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    external: <><path d="M14 4h6v6m0-6-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9A7 7 0 0 1 18 6.5L20 12M4 12l2 5.5A7 7 0 0 0 18.4 15" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 0V22" /><path d="M8 7h8m-8 4h8" /></>,
    writing: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h4M8 13h8M8 17h6" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>
}