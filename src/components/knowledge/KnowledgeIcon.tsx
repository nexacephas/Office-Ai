import type { ReactNode } from 'react'

export type KnowledgeIconName = 'search' | 'book' | 'sparkles' | 'plus' | 'arrow' | 'file' | 'folder' | 'clock' | 'shield' | 'filter' | 'refresh' | 'close' | 'upload' | 'chevron' | 'external' | 'trash' | 'info' | 'check' | 'database' | 'building' | 'tag' | 'eye' | 'more' | 'message' | 'download' | 'chart' | 'lock'
const shapes: Record<KnowledgeIconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8m-8 4h6" /></>,
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L17 18l1.2-.8L19 15Z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h6" /></>,
  folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  shield: <><path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3" /></>,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  upload: <><path d="M12 16V4m-4 4 4-4 4 4" /><path d="M4 16v4h16v-4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  external: <><path d="M14 4h6v6m-11 4L20 4" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
  trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  building: <><path d="M4 21V4l8-2v19M12 8h8v13M2 21h20" /><path d="M7 7h2m-2 4h2m-2 4h2m7-3h2m-2 4h2" /></>,
  tag: <><path d="M20 13 13 20 3 10V4h6z" /><circle cx="7.5" cy="7.5" r="1" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  message: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.6a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 4H13a8.5 8.5 0 0 1 8 7.5Z" /></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M4 17v4h16v-4" /></>,
  chart: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
}

export default function KnowledgeIcon({ name, size = 18 }: { name: KnowledgeIconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>
}