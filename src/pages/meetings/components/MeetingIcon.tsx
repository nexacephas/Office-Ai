import type { ReactNode } from 'react'

export type MeetingIconName = 'calendar' | 'clock' | 'location' | 'video' | 'users' | 'building' | 'check' | 'alert' | 'sparkles' | 'search' | 'filter' | 'sort' | 'chevron' | 'list' | 'grid' | 'arrow' | 'more' | 'close' | 'file' | 'task' | 'mail' | 'notes' | 'edit' | 'send' | 'copy' | 'download' | 'archive' | 'plus' | 'back' | 'refresh' | 'external' | 'minute' | 'question' | 'play' | 'x'

export default function MeetingIcon({ name, size = 18 }: { name: MeetingIconName; size?: number }) {
  const paths: Record<MeetingIconName, ReactNode> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m15-11a4 4 0 0 1 0 8m3 3v-2a4 4 0 0 0-3-3.87" /><circle cx="9.5" cy="7" r="4" /></>,
    building: <><path d="M4 21V5l8-3 8 3v16M2 21h20M9 9h1m4 0h1M9 13h1m4 0h1M10 21v-4h4v4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
    sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
    sort: <><path d="M8 6h12M8 12h9M8 18h6" /><path d="m4 7 2-2 2 2M6 5v14" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7M8 15h8" /></>,
    task: <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="m8 10 1.5 1.5L12 9m1 2h3m-8 5 1.5 1.5L12 15m1 2h3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    notes: <><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4.8 15.2 4 20Z" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M5 17v3h14v-3" /></>,
    archive: <><path d="M3 4h18v4H3zM5 8v12h14V8m-9 4h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    back: <><path d="M19 12H5m7 7-7-7 7-7" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9A7 7 0 0 1 18 6.5L20 12M4 12l2 5.5A7 7 0 0 0 18.4 15" /></>,
    external: <><path d="M14 4h6v6m0-6-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    minute: <><path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5" /></>,
    question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-.9 1-1.9 1.2-1.9 2.9m0 3h.01" /></>,
    play: <path d="m8 5 12 7-12 7V5Z" />,
    x: <><path d="m18 6-12 12M6 6l12 12" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}