import type { ReactNode } from 'react'

export type WriterIconName = 'file' | 'mail' | 'send' | 'report' | 'notice' | 'brief' | 'proposal' | 'meeting' | 'sparkles' | 'plus' | 'close' | 'paperclip' | 'folder' | 'link' | 'calendar' | 'user' | 'copy' | 'download' | 'save' | 'more' | 'bold' | 'italic' | 'underline' | 'align' | 'bullet' | 'numbered' | 'undo' | 'redo' | 'clear' | 'search' | 'arrow' | 'clock' | 'check' | 'external' | 'chevron' | 'star' | 'edit' | 'writing' | 'expand'

export default function WriterIcon({ name, size = 17 }: { name: WriterIconName; size?: number }) {
  const paths: Record<WriterIconName, ReactNode> = {
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7M8 15h8M8 18h6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    report: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h4M8 17v-3m4 3v-6m4 6v-4" /></>,
    notice: <><path d="M4 14V9l13-4v13L4 14Z" /><path d="M17 9h2a2 2 0 0 1 0 5h-2m-9 1 1 5h4l-2-4" /></>,
    brief: <><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /></>,
    proposal: <><path d="M4 5h16v14H4zM8 9h8M8 13h5" /><path d="m15 17 2 2 4-5" /></>,
    meeting: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    paperclip: <path d="m21 11.5-8.5 8.5a5 5 0 0 1-7.1-7.1l9.2-9.2a3.5 3.5 0 0 1 4.9 4.9l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />,
    folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    link: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 4l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M5 17v3h14v-3" /></>,
    save: <><path d="M5 3h12l4 4v14H3V3z" /><path d="M7 3v6h10V3M7 21v-7h10v7" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zm0 7h7a3.5 3.5 0 0 1 0 7H7z" />,
    italic: <><path d="M19 4h-9M14 20H5M15 4 9 20" /></>,
    underline: <><path d="M6 4v6a6 6 0 0 0 12 0V4M4 21h16" /></>,
    align: <><path d="M4 6h16M4 10h10M4 14h16M4 18h10" /></>,
    bullet: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r=".8" fill="currentColor" /><circle cx="4" cy="12" r=".8" fill="currentColor" /><circle cx="4" cy="18" r=".8" fill="currentColor" /></>,
    numbered: <><path d="M10 6h10M10 12h10M10 18h10M4 5h1v3m-1 0h2M4 11h2l-2 2h2m-2 4h2l-2 2h2" /></>,
    undo: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-2" /></>,
    redo: <><path d="m15 14 5-5-5-5" /><path d="M20 9H10a6 6 0 0 0 0 12h2" /></>,
    clear: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    external: <><path d="M14 4h6v6m0-6-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4.8 15.2 4 20Z" /></>,
    writing: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h4M8 13h8M8 17h6" /></>,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}